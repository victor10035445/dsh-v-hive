/**
 * 选中蜂「整体外轮廓」描边（屏幕空间遮罩膨胀）：
 *  - 反壳（背面外扩壳）描边会给模型每个子结构（翅膀/腿/触角/胸腹缝）各描一圈，
 *    拿不到「整体外轮廓 = 单一闭合曲线」；本 pass 把选中蜂渲染成一张遮罩，
 *    再在屏幕空间环形采样膨胀出恒宽描边带 —— 遮罩边界只有一条 → 轮廓只有一条；
 *  - 遮挡判定（render-perf-optimization D7）：优先采样**主渲染深度**（bloom 路径下
 *    composer RT 的 depthTexture，一个全屏深度拷贝 quad 写入遮罩 RT 深度缓冲），
 *    取消全场景 overrideMaterial 重画；直出路径（低端机/reduced-motion，无 RT 深度
 *    可读）自建**半分辨率** depth RT 预填兜底（填充缩小 4 倍，遮挡边缘误差
 *    ≤ 1 深度纹理素，描边带宽 4px 下目检不可辨）。被前景（近侧墙/其它蜂）遮挡的
 *    蜂体不产生描边（与既有深度预填行为一致）。
 *    depthExemptOf 语义（六轮：内隔墙/特效墙不参与遮挡）在深度采样路径由
 *    「豁免物深度擦除」等价实现——把主渲染深度里豁免物的深度改写为最远，效果等同
 *    既有「预填时不渲染豁免物」；半分辨率预填路径沿用 visible 开关。
 *  - 像素恒宽：描边半径为固定屏幕像素（×dpr 到遮罩 RT），不随相机距离缩放。
 */
import * as THREE from "three";
import { PALETTE } from "./palette.mjs";

const OUTER_TAPS = 24;
const INNER_TAPS = 16;
const OUTLINE_RADIUS_PX = 4; // 描边半径（CSS 像素；遮罩 RT 为物理像素，×dpr 换算）

const QUAD_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const QUAD_FRAGMENT = /* glsl */ `
  uniform sampler2D uMask;
  uniform vec2 uTexel;
  uniform float uRadius;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float center = texture2D(uMask, vUv).a;
    float reach = 0.0;
    for (int i = 0; i < ${OUTER_TAPS}; i++) {
      float a = 6.2831853 * float(i) / ${OUTER_TAPS}.0;
      reach = max(reach, texture2D(uMask, vUv + vec2(cos(a), sin(a)) * uRadius * uTexel).a);
    }
    for (int i = 0; i < ${INNER_TAPS}; i++) {
      float a = 6.2831853 * (float(i) + 0.5) / ${INNER_TAPS}.0;
      reach = max(reach, texture2D(uMask, vUv + vec2(cos(a), sin(a)) * uRadius * 0.55 * uTexel).a);
    }
    float outline = clamp(reach - center, 0.0, 1.0);
    if (outline < 0.004) discard;
    gl_FragColor = vec4(uColor, outline * uOpacity);
    #include <colorspace_fragment>
  }
`;

/* GLSL3 原生写法（three 对 GLSL3 ShaderMaterial 不注入 gl_FragColor，须自带 out 变量）。
   GL 语义：depthTest 关闭会连深度写入一并抑制——深度写入 quad 须 depthTest:true +
   depthFunc:Always + depthWrite:true，使每个片元的 gl_FragDepth 无条件写入。 */
const DEPTH_COPY_VERTEX = /* glsl */ `
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const DEPTH_COPY_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uDepth;
  uniform vec2 uTexel;
  in vec2 vUv;
  layout(location = 0) out vec4 outColor;
  void main() {
    /* 邻域最大深度（覆盖该像素的深度足迹）：全分辨率来源 = 同纹素（无变化）；
       半分辨率来源补偿「纹素中心 ≠ 全分辨率采样位置」的斜率误差——遮挡边缘
       侵蚀 ≤ 1 深度纹理素（design.md D7 容差），遮罩内部 SHALL NOT 出现抖断。 */
    float d = texture(uDepth, vUv).x;
    d = max(d, texture(uDepth, vUv + vec2(1.0, 0.0) * uTexel).x);
    d = max(d, texture(uDepth, vUv + vec2(-1.0, 0.0) * uTexel).x);
    d = max(d, texture(uDepth, vUv + vec2(0.0, 1.0) * uTexel).x);
    d = max(d, texture(uDepth, vUv + vec2(0.0, -1.0) * uTexel).x);
    gl_FragDepth = d;
    outColor = vec4(0.0);
  }
`;

const DEPTH_FAR_FRAGMENT = /* glsl */ `
  precision highp float;
  layout(location = 0) out vec4 outColor;
  void main() {
    gl_FragDepth = 1.0;
    outColor = vec4(0.0);
  }
`;

export class OutlinePass {
  constructor() {
    this.logicalSize = { w: 1, h: 1 };
    this.pixelRatio = 1;
    this.rt = null;
    /* 主渲染深度来源（bloom 路径；null = 半分辨率预填兜底路径）。scene.loop 在
       composer.render() 后每帧下发 writeBuffer 的 depthTexture。 */
    this.depthSource = null;
    /* 直出/兜底路径的自建半分辨率 depth RT（懒建，随尺寸/像素比重建）。 */
    this.halfRT = null;
    this.halfDepth = null;
    /* 深度预填充材质（半分辨率预填路径专用）：只写深度不写颜色 */
    this.depthOnlyMaterial = new THREE.MeshBasicMaterial({ colorWrite: false });
    /* 深度拷贝 quad：深度纹理 → 遮罩 RT 深度缓冲（GLSL3 gl_FragDepth）。
       uTexel = 来源深度纹理的纹素尺寸（邻域最大采样步长）。 */
    this.depthCopyMaterial = new THREE.ShaderMaterial({
      uniforms: { uDepth: { value: null }, uTexel: { value: new THREE.Vector2(0, 0) } },
      vertexShader: DEPTH_COPY_VERTEX,
      fragmentShader: DEPTH_COPY_FRAGMENT,
      glslVersion: THREE.GLSL3,
      colorWrite: false,
      depthTest: true,
      depthFunc: THREE.AlwaysDepth,
      depthWrite: true
    });
    /* 豁免物深度擦除材质：主渲染深度含豁免物（内隔墙/特效墙）——改写为最远深度，
       等价于既有「预填时隐藏豁免物」（depthExemptOf 六轮语义保持） */
    this.depthFarMaterial = new THREE.ShaderMaterial({
      vertexShader: DEPTH_COPY_VERTEX,
      fragmentShader: DEPTH_FAR_FRAGMENT,
      glslVersion: THREE.GLSL3,
      colorWrite: false,
      depthTest: true,
      depthFunc: THREE.AlwaysDepth,
      depthWrite: true
    });
    this.quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    /* 深度拷贝与膨胀合成各自独立场景（同渲染互不串扰） */
    this.depthCopyScene = new THREE.Scene();
    this.copyQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.depthCopyMaterial);
    this.copyQuad.frustumCulled = false;
    this.depthCopyScene.add(this.copyQuad);
    this.quadScene = new THREE.Scene();
    this._prevColor = new THREE.Color(); // render() 每帧复用（零分配热路径）
    this.uniforms = {
      uMask: { value: null },
      uTexel: { value: new THREE.Vector2(1 / 512, 1 / 512) },
      uRadius: { value: OUTLINE_RADIUS_PX },
      uColor: { value: new THREE.Color(PALETTE.outline) }, // 合成色 白（五轮：所有外描边高亮统一白）
      uOpacity: { value: 0.95 }
    };
    this.quadMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: QUAD_VERTEX,
      fragmentShader: QUAD_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    this.compositeQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.quadMaterial);
    this.compositeQuad.frustumCulled = false;
    this.quadScene.add(this.compositeQuad);
  }

  /** 拷贝材质的源纹素尺寸（按来源深度纹理实际尺寸；重建后跟随刷新）。 */
  _setCopyTexel(texture) {
    const w = texture?.image?.width ?? 1;
    const h = texture?.image?.height ?? 1;
    this.depthCopyMaterial.uniforms.uTexel.value.set(1 / w, 1 / h);
  }

  /** bloom 路径每帧下发主渲染深度（composer.writeBuffer 的 depthTexture）；
      null 切回半分辨率预填兜底路径。 */
  setDepthTexture(texture) {
    this.depthSource = texture ?? null;
  }

  /** 跟随主画布尺寸（物理像素 = CSS × pixelRatio）。 */
  setSize(w, h, pixelRatio) {
    const pw = Math.max(1, Math.round(w * pixelRatio));
    const ph = Math.max(1, Math.round(h * pixelRatio));
    this.logicalSize = { w, h };
    this.pixelRatio = pixelRatio;
    if (this.rt && this.rt.width === pw && this.rt.height === ph) return;
    this.rt?.dispose();
    this.rt = new THREE.WebGLRenderTarget(pw, ph, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      samples: 4,
      resolveDepthBuffer: false // 遮罩 RT 深度不被采样——省一次逐帧深度 resolve blit
    });
    this.uniforms.uMask.value = this.rt.texture;
    this.uniforms.uTexel.value.set(1 / pw, 1 / ph);
  }

  /** 直出/兜底路径的半分辨率 depth RT（物理像素的一半，填充量缩小 4 倍）。
      注意：depthTexture 必须真实挂载（预填深度写入其中供拷贝采样）——
      SHALL NOT 设 resolveDepthBuffer:false（那会触发 three 的 __autoAllocateDepthBuffer，
      用自动深度 renderbuffer 顶替 depthTexture 附着，拷贝来源恒为空）。 */
  ensureHalfRT() {
    const pw = Math.max(1, Math.round(this.logicalSize.w * this.pixelRatio * 0.5));
    const ph = Math.max(1, Math.round(this.logicalSize.h * this.pixelRatio * 0.5));
    if (this.halfRT && this.halfRT.width === pw && this.halfRT.height === ph) return;
    this.halfRT?.dispose();
    this.halfDepth?.dispose();
    this.halfDepth = new THREE.DepthTexture(pw, ph);
    this.halfRT = new THREE.WebGLRenderTarget(pw, ph, {
      depthBuffer: true,
      depthTexture: this.halfDepth
    });
  }

  /** webglcontextrestored 后强制下次 render 重建 RT。 */
  invalidate() {
    this.rt?.dispose();
    this.rt = null;
    this.halfRT?.dispose();
    this.halfRT = null;
    this.halfDepth?.dispose();
    this.halfDepth = null;
    this.depthSource = null; // 深度纹理属丢失的上下文，待 loop 重新下发
  }

  /** 外观设置（设置页「外观」页签）：选中描边合成色实时生效。 */
  applyAppearance(a = {}) {
    if (a.outlineColor) this.uniforms.uColor.value.set(a.outlineColor);
  }

  /**
   * 主渲染之后调用（帧内最后一次绘制）。
   * @param state BeeLayer.outlineState：{ active, width, anchor, maskScene, depthExemptOf? }
   * @param mainScene 主场景（仅半分辨率预填路径使用）
   */
  render(renderer, camera, state, mainScene) {
    if (!state?.active || !this.rt) return;
    /* 像素恒宽：固定屏幕半径（CSS px × dpr → 遮罩 RT 物理像素） */
    this.uniforms.uRadius.value = OUTLINE_RADIUS_PX * this.pixelRatio;

    const prevColor = renderer.getClearColor(this._prevColor);
    const prevAlpha = renderer.getClearAlpha();
    const prevAutoClear = renderer.autoClear;
    const prevShadowAuto = renderer.shadowMap.autoUpdate;
    renderer.autoClear = false;
    /* 阴影图本帧主渲染已建，跳过重建 */
    renderer.shadowMap.autoUpdate = false;
    renderer.setRenderTarget(this.rt);
    renderer.setClearColor(0x000000, 0);
    renderer.clear(true, true, true);
    const exempt = state?.depthExemptOf?.() ?? [];
    if (this.depthSource) {
      /* 1a) 主渲染深度拷贝：一个全屏 quad 替代全场景 overrideMaterial 重画
         （每帧省一遍场景绘制；深度含 MSAA resolve，spike T1/T2 实测正确）。 */
      this.depthCopyMaterial.uniforms.uDepth.value = this.depthSource;
      this._setCopyTexel(this.depthSource);
      renderer.render(this.depthCopyScene, this.quadCam);
      /* 1b) 豁免物深度擦除：内隔墙/特效墙的深度改写为最远——巢选中描边 SHALL
         只是整个巢的外轮廓、不被内部隔墙咬断（六轮语义在深度采样路径的等价实现）。 */
      for (const o of exempt) {
        if (!o || Array.isArray(o.material)) continue;
        const prevMat = o.material;
        o.material = this.depthFarMaterial;
        renderer.render(o, camera);
        o.material = prevMat;
      }
    } else {
      /* 1a') 直出/兜底：半分辨率深度预填（overrideMaterial 重画目标缩小 4 倍填充）。
         depthExemptOf：预填时隐藏豁免物（既有机制沿用）。 */
      this.ensureHalfRT();
      const prevOverride = mainScene.overrideMaterial;
      const exemptVisible = exempt.map((o) => o.visible);
      for (const o of exempt) {
        if (o) o.visible = false;
      }
      mainScene.overrideMaterial = this.depthOnlyMaterial;
      renderer.setRenderTarget(this.halfRT);
      renderer.setClearColor(0x000000, 0);
      renderer.clear(true, true, true);
      renderer.render(mainScene, camera);
      mainScene.overrideMaterial = prevOverride;
      exempt.forEach((o, i) => {
        if (o) o.visible = exemptVisible[i];
      });
      /* 1b') 半分辨率深度上采样拷入遮罩 RT（遮挡判断边缘误差 ≤ 1 深度纹理素，D7） */
      renderer.setRenderTarget(this.rt);
      this.depthCopyMaterial.uniforms.uDepth.value = this.halfDepth;
      this._setCopyTexel(this.halfDepth);
      renderer.render(this.depthCopyScene, this.quadCam);
    }
    /* 2) 遮罩：仅选中蜂（实例矩阵由 BeeLayer 每帧写入；深度测试对拷入的场景深度） */
    renderer.setRenderTarget(this.rt);
    renderer.render(state.maskScene, camera);
    /* 3) 全屏膨胀合成到主画布（autoClear=false 只画不清） */
    renderer.setRenderTarget(null);
    renderer.setClearColor(prevColor, prevAlpha);
    renderer.setViewport(0, 0, this.logicalSize.w, this.logicalSize.h);
    renderer.render(this.quadScene, this.quadCam);
    renderer.autoClear = prevAutoClear;
    renderer.shadowMap.autoUpdate = prevShadowAuto;
  }

  dispose() {
    this.rt?.dispose();
    this.rt = null;
    this.halfRT?.dispose();
    this.halfRT = null;
    this.halfDepth?.dispose();
    this.halfDepth = null;
    this.depthSource = null;
    this.compositeQuad.geometry.dispose();
    this.copyQuad.geometry.dispose();
    this.quadMaterial.dispose();
    this.depthCopyMaterial.dispose();
    this.depthFarMaterial.dispose();
    this.depthOnlyMaterial.dispose();
  }
}
