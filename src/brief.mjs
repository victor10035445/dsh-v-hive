/**
 * 会话概要条镜像 store（session-brief-bar 1.4/D4）：控制器镜像 tick（rebuild）发布、
 * React BriefBar 订阅的轻量版本号 store（worldVersionStore 同款 bump 模式）。
 *
 * 性能纪律（spec「性能与体验基线」）：set() 做整值比较，内容不变不 bump——镜像 tick
 * 高频，概要条 SHALL NOT 入每帧热路径（React 重渲染只在标题/末回合预览真实变化时发生）。
 * 缺失键以 null 槽位发布（呈现层 `-` 占位），会话缺失整条发布 null（呈现层隐藏）。
 */

export const sessionsBriefStore = {
  sig: 0,
  brief: null,
  listeners: new Set(),
  getSnapshot() {
    return this.sig;
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  set(brief) {
    if (JSON.stringify(this.brief ?? null) === JSON.stringify(brief ?? null)) return;
    this.brief = brief;
    this.sig += 1;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        /* 订阅者异常不阻断其余通知 */
      }
    }
  }
};
