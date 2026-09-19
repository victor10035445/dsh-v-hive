window.__ModuleLoader__.load({ id: "dsh-v-hive", factory: (require) => {
"use strict";
var module = { exports: {} };
var exports = module.exports;
var gh=Object.defineProperty;var lv=Object.getOwnPropertyDescriptor;var cv=Object.getOwnPropertyNames;var hv=Object.prototype.hasOwnProperty;var uv=(i,e)=>{for(var t in e)gh(i,t,{get:e[t],enumerable:!0})},dv=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of cv(e))!hv.call(i,s)&&s!==t&&gh(i,s,{get:()=>e[s],enumerable:!(n=lv(e,s))||n.enumerable});return i};var fv=i=>dv(gh({},"__esModule",{value:!0}),i);var rT={};uv(rT,{BeeSwarmModal:()=>Wg,HiveSettingsModal:()=>qg,HotbarBar:()=>Kg,HotbarsModal:()=>$g,LayoutSettingsBody:()=>Yg,StatusBar:()=>Zg,StatusCardsSection:()=>Qg,WorkerPanel:()=>Jg,appendViaBridge:()=>uh,apply:()=>sT,composerBridge:()=>tn,inject:()=>iT,seedSummonDraft:()=>Xd});module.exports=fv(rT);var de=require("react"),Ug=require("@deepseek-ai/dsh-client-ui-primitives");var $f=0,cu=1,Qf=2;var Ha=1,Il=2,Er=3,an=0,qt=1,St=2,Un=0,Ei=1,Ls=2,hu=3,uu=4,ep=5;var Ji=100,tp=101,np=102,ip=103,sp=104,rp=200,ap=201,op=202,lp=203,Zo=204,$o=205,cp=206,hp=207,up=208,dp=209,fp=210,pp=211,mp=212,gp=213,vp=214,Qo=0,Ms=1,el=2,ws=3,tl=4,nl=5,il=6,sl=7,Pl=0,xp=1,yp=2,Yn=0,Va=1,Ga=2,ja=3,Ds=4,Wa=5,qa=6,Xa=7,qh="attached",bp="detached",du=300,rs=301,Fs=302,Nl=303,Ll=304,Ya=306,qn=1e3,Fn=1001,or=1002,Ht=1003,Dl=1004;var ks=1005;var At=1006,Ar=1007;var Kn=1008;var bn=1009,fu=1010,pu=1011,Cr=1012,Fl=1013,Jn=1014,An=1015,Qt=1016,kl=1017,Ol=1018,Rr=1020,mu=35902,gu=35899,vu=1021,xu=1022,Cn=1023,si=1026,as=1027,Ul=1028,Bl=1029,os=1030,zl=1031;var Hl=1033,Ka=33776,Ja=33777,Za=33778,$a=33779,Vl=35840,Gl=35841,jl=35842,Wl=35843,ql=36196,Xl=37492,Yl=37496,Kl=37488,Jl=37489,Qa=37490,Zl=37491,$l=37808,Ql=37809,ec=37810,tc=37811,nc=37812,ic=37813,sc=37814,rc=37815,ac=37816,oc=37817,lc=37818,cc=37819,hc=37820,uc=37821,dc=36492,fc=36494,pc=36495,mc=36283,gc=36284,eo=36285,vc=36286;var Ts=2300,Es=2301,Jo=2302,Xh=2303,Yh=2400,Kh=2401,Jh=2402,_p=2500;var yu=0,to=1,Ir=2,Sp=3200;var no=0,Mp=1,Ni="",Tt="srgb",dn="srgb-linear",la="linear",it="srgb";var _s=7680;var Zh=519,wp=512,Tp=513,Ep=514,xc=515,Ap=516,Cp=517,yc=518,Rp=519,rl=35044,Os=35048;var Pr="300 es",Wn=2e3,lr=2001;function pv(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function mv(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function cr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ip(){let i=cr("canvas");return i.style.display="block",i}var of={},hr=null;function ca(...i){let e="THREE."+i.shift();hr?hr("log",e,...i):console.log(e,...i)}function Pp(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ie(...i){i=Pp(i);let e="THREE."+i.shift();if(hr)hr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ue(...i){i=Pp(i);let e="THREE."+i.shift();if(hr)hr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ss(...i){let e=i.join(" ");e in of||(of[e]=!0,Ie(...i))}function Np(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Lp={[Qo]:Ms,[el]:il,[tl]:sl,[ws]:nl,[Ms]:Qo,[il]:el,[sl]:tl,[nl]:ws},ri=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],lf=1234567,sa=Math.PI/180,As=180/Math.PI;function kn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(sn[i&255]+sn[i>>8&255]+sn[i>>16&255]+sn[i>>24&255]+"-"+sn[e&255]+sn[e>>8&255]+"-"+sn[e>>16&15|64]+sn[e>>24&255]+"-"+sn[t&63|128]+sn[t>>8&255]+"-"+sn[t>>16&255]+sn[t>>24&255]+sn[n&255]+sn[n>>8&255]+sn[n>>16&255]+sn[n>>24&255]).toLowerCase()}function Xe(i,e,t){return Math.max(e,Math.min(t,i))}function bu(i,e){return(i%e+e)%e}function gv(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function vv(i,e,t){return i!==e?(t-i)/(e-i):0}function ra(i,e,t){return(1-t)*i+t*e}function xv(i,e,t,n){return ra(i,e,1-Math.exp(-t*n))}function yv(i,e=1){return e-Math.abs(bu(i,e*2)-e)}function bv(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function _v(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Sv(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Mv(i,e){return i+Math.random()*(e-i)}function wv(i){return i*(.5-Math.random())}function Tv(i){i!==void 0&&(lf=i);let e=lf+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ev(i){return i*sa}function Av(i){return i*As}function Cv(i){return(i&i-1)===0&&i!==0}function Rv(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Iv(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Pv(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),d=r((e-n)/2),u=a((e-n)/2),f=r((n-e)/2),m=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*d,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*m,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*m,o*c);break;case"ZYZ":i.set(l*m,l*f,o*h,o*c);break;default:Ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function jn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function lt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var _u={DEG2RAD:sa,RAD2DEG:As,generateUUID:kn,clamp:Xe,euclideanModulo:bu,mapLinear:gv,inverseLerp:vv,lerp:ra,damp:xv,pingpong:yv,smoothstep:bv,smootherstep:_v,randInt:Sv,randFloat:Mv,randFloatSpread:wv,seededRandom:Tv,degToRad:Ev,radToDeg:Av,isPowerOfTwo:Cv,ceilPowerOfTwo:Rv,floorPowerOfTwo:Iv,setQuaternionFromProperEuler:Pv,normalize:lt,denormalize:jn},he=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Xe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ct=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],f=r[a+1],m=r[a+2],v=r[a+3];if(d!==v||l!==u||c!==f||h!==m){let g=l*u+c*f+h*m+d*v;g<0&&(u=-u,f=-f,m=-m,v=-v,g=-g);let p=1-o;if(g<.9995){let x=Math.acos(g),_=Math.sin(x);p=Math.sin(p*x)/_,o=Math.sin(o*x)/_,l=l*p+u*o,c=c*p+f*o,h=h*p+m*o,d=d*p+v*o}else{l=l*p+u*o,c=c*p+f*o,h=h*p+m*o,d=d*p+v*o;let x=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=x,c*=x,h*=x,d*=x}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+h*d+l*f-c*u,e[t+1]=l*m+h*u+c*d-o*f,e[t+2]=c*m+h*f+o*u-l*d,e[t+3]=h*m-o*d-l*u-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),f=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d-u*f*m;break;case"YXZ":this._x=u*h*d+c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d+u*f*m;break;case"ZXY":this._x=u*h*d-c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d-u*f*m;break;case"ZYX":this._x=u*h*d-c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d+u*f*m;break;case"YZX":this._x=u*h*d+c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d-u*f*m;break;case"XZY":this._x=u*h*d-c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d+u*f*m;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>d){let f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){let f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Xe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(cf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(cf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this.z=Xe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this.z=Xe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return vh.copy(this).projectOnVector(e),this.sub(vh)}reflect(e){return this.sub(vh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Xe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},vh=new L,cf=new Ct,Ve=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],m=n[8],v=s[0],g=s[3],p=s[6],x=s[1],_=s[4],y=s[7],E=s[2],A=s[5],R=s[8];return r[0]=a*v+o*x+l*E,r[3]=a*g+o*_+l*A,r[6]=a*p+o*y+l*R,r[1]=c*v+h*x+d*E,r[4]=c*g+h*_+d*A,r[7]=c*p+h*y+d*R,r[2]=u*v+f*x+m*E,r[5]=u*g+f*_+m*A,r[8]=u*p+f*y+m*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,m=t*d+n*u+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/m;return e[0]=d*v,e[1]=(s*c-h*n)*v,e[2]=(o*n-s*a)*v,e[3]=u*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Ss("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(xh.makeScale(e,t)),this}rotate(e){return Ss("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(xh.makeRotation(-e)),this}translate(e,t){return Ss("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(xh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},xh=new Ve,hf=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),uf=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Nv(){let i={enabled:!0,workingColorSpace:dn,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===it&&(s.r=Ti(s.r),s.g=Ti(s.g),s.b=Ti(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===it&&(s.r=rr(s.r),s.g=rr(s.g),s.b=rr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ni?la:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ss("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ss("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[dn]:{primaries:e,whitePoint:n,transfer:la,toXYZ:hf,fromXYZ:uf,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Tt},outputColorSpaceConfig:{drawingBufferColorSpace:Tt}},[Tt]:{primaries:e,whitePoint:n,transfer:it,toXYZ:hf,fromXYZ:uf,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Tt}}}),i}var je=Nv();function Ti(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function rr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ws,al=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ws===void 0&&(Ws=cr("canvas")),Ws.width=e.width,Ws.height=e.height;let s=Ws.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ws}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=cr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ti(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ti(t[n]/255)*255):t[n]=Ti(t[n]);return{data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Lv=0,ur=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Lv++}),this.uuid=kn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(yh(s[a].image)):r.push(yh(s[a]))}else r=yh(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function yh(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?al.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}var Dv=0,bh=new L,Yt=class i extends ri{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Fn,s=Fn,r=At,a=Kn,o=Cn,l=bn,c=i.DEFAULT_ANISOTROPY,h=Ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Dv++}),this.uuid=kn(),this.name="",this.source=new ur(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(bh).x}get height(){return this.source.getSize(bh).y}get depth(){return this.source.getSize(bh).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==du)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case qn:e.x=e.x-Math.floor(e.x);break;case Fn:e.x=e.x<0?0:1;break;case or:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case qn:e.y=e.y-Math.floor(e.y);break;case Fn:e.y=e.y<0?0:1;break;case or:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Yt.DEFAULT_IMAGE=null;Yt.DEFAULT_MAPPING=du;Yt.DEFAULT_ANISOTROPY=1;var ct=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let _=(c+1)/2,y=(f+1)/2,E=(p+1)/2,A=(h+u)/4,R=(d+v)/4,b=(m+g)/4;return _>y&&_>E?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=A/n,r=R/n):y>E?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=A/s,r=b/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=R/r,s=b/r),this.set(n,s,r,t),this}let x=Math.sqrt((g-m)*(g-m)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(d-v)/x,this.z=(u-h)/x,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this.z=Xe(this.z,e.z,t.z),this.w=Xe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this.z=Xe(this.z,e,t),this.w=Xe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Xe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ol=class extends ri{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:At,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ct(0,0,e,t),this.scissorTest=!1,this.viewport=new ct(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new Yt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:At,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ur(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Rt=class extends ol{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ha=class extends Yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=Fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ll=class extends Yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=Fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ae=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,r,a,o,l,c,h,d,u,f,m,v,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,d,u,f,m,v,g)}set(e,t,n,s,r,a,o,l,c,h,d,u,f,m,v,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/qs.setFromMatrixColumn(e,0).length(),r=1/qs.setFromMatrixColumn(e,1).length(),a=1/qs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let u=a*h,f=a*d,m=o*h,v=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=f+m*c,t[5]=u-v*c,t[9]=-o*l,t[2]=v-u*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){let u=l*h,f=l*d,m=c*h,v=c*d;t[0]=u+v*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=f*o-m,t[6]=v+u*o,t[10]=a*l}else if(e.order==="ZXY"){let u=l*h,f=l*d,m=c*h,v=c*d;t[0]=u-v*o,t[4]=-a*d,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*h,t[9]=v-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let u=a*h,f=a*d,m=o*h,v=o*d;t[0]=l*h,t[4]=m*c-f,t[8]=u*c+v,t[1]=l*d,t[5]=v*c+u,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let u=a*l,f=a*c,m=o*l,v=o*c;t[0]=l*h,t[4]=v-u*d,t[8]=m*d+f,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*d+m,t[10]=u-v*d}else if(e.order==="XZY"){let u=a*l,f=a*c,m=o*l,v=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+v,t[5]=a*h,t[9]=f*d-m,t[2]=m*d-f,t[6]=o*h,t[10]=v*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Fv,e,kv)}lookAt(e,t,n){let s=this.elements;return Mn.subVectors(e,t),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Gi.crossVectors(n,Mn),Gi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Gi.crossVectors(n,Mn)),Gi.normalize(),So.crossVectors(Mn,Gi),s[0]=Gi.x,s[4]=So.x,s[8]=Mn.x,s[1]=Gi.y,s[5]=So.y,s[9]=Mn.y,s[2]=Gi.z,s[6]=So.z,s[10]=Mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],m=n[2],v=n[6],g=n[10],p=n[14],x=n[3],_=n[7],y=n[11],E=n[15],A=s[0],R=s[4],b=s[8],w=s[12],I=s[1],N=s[5],F=s[9],k=s[13],U=s[2],z=s[6],q=s[10],Z=s[14],D=s[3],H=s[7],ee=s[11],ie=s[15];return r[0]=a*A+o*I+l*U+c*D,r[4]=a*R+o*N+l*z+c*H,r[8]=a*b+o*F+l*q+c*ee,r[12]=a*w+o*k+l*Z+c*ie,r[1]=h*A+d*I+u*U+f*D,r[5]=h*R+d*N+u*z+f*H,r[9]=h*b+d*F+u*q+f*ee,r[13]=h*w+d*k+u*Z+f*ie,r[2]=m*A+v*I+g*U+p*D,r[6]=m*R+v*N+g*z+p*H,r[10]=m*b+v*F+g*q+p*ee,r[14]=m*w+v*k+g*Z+p*ie,r[3]=x*A+_*I+y*U+E*D,r[7]=x*R+_*N+y*z+E*H,r[11]=x*b+_*F+y*q+E*ee,r[15]=x*w+_*k+y*Z+E*ie,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],f=e[14],m=e[3],v=e[7],g=e[11],p=e[15],x=l*f-c*u,_=o*f-c*d,y=o*u-l*d,E=a*f-c*h,A=a*u-l*h,R=a*d-o*h;return t*(v*x-g*_+p*y)-n*(m*x-g*E+p*A)+s*(m*_-v*E+p*R)-r*(m*y-v*A+g*R)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],f=e[11],m=e[12],v=e[13],g=e[14],p=e[15],x=t*o-n*a,_=t*l-s*a,y=t*c-r*a,E=n*l-s*o,A=n*c-r*o,R=s*c-r*l,b=h*v-d*m,w=h*g-u*m,I=h*p-f*m,N=d*g-u*v,F=d*p-f*v,k=u*p-f*g,U=x*k-_*F+y*N+E*I-A*w+R*b;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/U;return e[0]=(o*k-l*F+c*N)*z,e[1]=(s*F-n*k-r*N)*z,e[2]=(v*R-g*A+p*E)*z,e[3]=(u*A-d*R-f*E)*z,e[4]=(l*I-a*k-c*w)*z,e[5]=(t*k-s*I+r*w)*z,e[6]=(g*y-m*R-p*_)*z,e[7]=(h*R-u*y+f*_)*z,e[8]=(a*F-o*I+c*b)*z,e[9]=(n*I-t*F-r*b)*z,e[10]=(m*A-v*y+p*x)*z,e[11]=(d*y-h*A-f*x)*z,e[12]=(o*w-a*N-l*b)*z,e[13]=(t*N-n*w+s*b)*z,e[14]=(v*_-m*E-g*x)*z,e[15]=(h*E-d*_+u*x)*z,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,m=r*d,v=a*h,g=a*d,p=o*d,x=l*c,_=l*h,y=l*d,E=n.x,A=n.y,R=n.z;return s[0]=(1-(v+p))*E,s[1]=(f+y)*E,s[2]=(m-_)*E,s[3]=0,s[4]=(f-y)*A,s[5]=(1-(u+p))*A,s[6]=(g+x)*A,s[7]=0,s[8]=(m+_)*R,s[9]=(g-x)*R,s[10]=(1-(u+v))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=qs.set(s[0],s[1],s[2]).length(),o=qs.set(s[4],s[5],s[6]).length(),l=qs.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Hn.copy(this);let c=1/a,h=1/o,d=1/l;return Hn.elements[0]*=c,Hn.elements[1]*=c,Hn.elements[2]*=c,Hn.elements[4]*=h,Hn.elements[5]*=h,Hn.elements[6]*=h,Hn.elements[8]*=d,Hn.elements[9]*=d,Hn.elements[10]*=d,t.setFromRotationMatrix(Hn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=Wn,l=!1){let c=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),f=(n+s)/(n-s),m,v;if(l)m=r/(a-r),v=a*r/(a-r);else if(o===Wn)m=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===lr)m=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Wn,l=!1){let c=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),f=-(n+s)/(n-s),m,v;if(l)m=1/(a-r),v=a/(a-r);else if(o===Wn)m=-2/(a-r),v=-(a+r)/(a-r);else if(o===lr)m=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},qs=new L,Hn=new Ae,Fv=new L(0,0,0),kv=new L(1,1,1),Gi=new L,So=new L,Mn=new L,df=new Ae,ff=new Ct,on=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Xe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Xe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Xe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return df.makeRotationFromQuaternion(e),this.setFromRotationMatrix(df,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ff.setFromEuler(this),this.setFromQuaternion(ff,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};on.DEFAULT_ORDER="XYZ";var dr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Ov=0,pf=new L,Xs=new Ct,yi=new Ae,Mo=new L,Kr=new L,Uv=new L,Bv=new Ct,mf=new L(1,0,0),gf=new L(0,1,0),vf=new L(0,0,1),xf={type:"added"},zv={type:"removed"},Ys={type:"childadded",child:null},_h={type:"childremoved",child:null},It=class i extends ri{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ov++}),this.uuid=kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new L,t=new on,n=new Ct,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ae},normalMatrix:{value:new Ve}}),this.matrix=new Ae,this.matrixWorld=new Ae,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xs.setFromAxisAngle(e,t),this.quaternion.multiply(Xs),this}rotateOnWorldAxis(e,t){return Xs.setFromAxisAngle(e,t),this.quaternion.premultiply(Xs),this}rotateX(e){return this.rotateOnAxis(mf,e)}rotateY(e){return this.rotateOnAxis(gf,e)}rotateZ(e){return this.rotateOnAxis(vf,e)}translateOnAxis(e,t){return pf.copy(e).applyQuaternion(this.quaternion),this.position.add(pf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(mf,e)}translateY(e){return this.translateOnAxis(gf,e)}translateZ(e){return this.translateOnAxis(vf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Mo.copy(e):Mo.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Kr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yi.lookAt(Kr,Mo,this.up):yi.lookAt(Mo,Kr,this.up),this.quaternion.setFromRotationMatrix(yi),s&&(yi.extractRotation(s.matrixWorld),Xs.setFromRotationMatrix(yi),this.quaternion.premultiply(Xs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ue("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(xf),Ys.child=e,this.dispatchEvent(Ys),Ys.child=null):Ue("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(zv),_h.child=e,this.dispatchEvent(_h),_h.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yi.multiply(e.parent.matrixWorld)),e.applyMatrix4(yi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(xf),Ys.child=e,this.dispatchEvent(Ys),Ys.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Kr,e,Uv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Kr,Bv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};It.DEFAULT_UP=new L(0,1,0);It.DEFAULT_MATRIX_AUTO_UPDATE=!0;It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Et=class extends It{constructor(){super(),this.isGroup=!0,this.type="Group"}},Hv={type:"move"},fr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Et,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Et,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Et,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let v of e.hand.values()){let g=t.getJointPose(v,n),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,m=.005;c.inputState.pinching&&u>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hv)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Et;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Dp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ji={h:0,s:0,l:0},wo={h:0,s:0,l:0};function Sh(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var fe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Tt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=je.workingColorSpace){if(e=bu(e,1),t=Xe(t,0,1),n=Xe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Sh(a,r,e+1/3),this.g=Sh(a,r,e),this.b=Sh(a,r,e-1/3)}return je.colorSpaceToWorking(this,s),this}setStyle(e,t=Tt){function n(r){r!==void 0&&parseFloat(r)<1&&Ie("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ie("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Tt){let n=Dp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ti(e.r),this.g=Ti(e.g),this.b=Ti(e.b),this}copyLinearToSRGB(e){return this.r=rr(e.r),this.g=rr(e.g),this.b=rr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Tt){return je.workingToColorSpace(rn.copy(this),e),Math.round(Xe(rn.r*255,0,255))*65536+Math.round(Xe(rn.g*255,0,255))*256+Math.round(Xe(rn.b*255,0,255))}getHexString(e=Tt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.workingToColorSpace(rn.copy(this),t);let n=rn.r,s=rn.g,r=rn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=je.workingColorSpace){return je.workingToColorSpace(rn.copy(this),t),e.r=rn.r,e.g=rn.g,e.b=rn.b,e}getStyle(e=Tt){je.workingToColorSpace(rn.copy(this),e);let t=rn.r,n=rn.g,s=rn.b;return e!==Tt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ji),this.setHSL(ji.h+e,ji.s+t,ji.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ji),e.getHSL(wo);let n=ra(ji.h,wo.h,t),s=ra(ji.s,wo.s,t),r=ra(ji.l,wo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},rn=new fe;fe.NAMES=Dp;var gn=class extends It{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Vn=new L,bi=new L,Mh=new L,_i=new L,Ks=new L,Js=new L,yf=new L,wh=new L,Th=new L,Eh=new L,Ah=new ct,Ch=new ct,Rh=new ct,Ki=class i{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Vn.subVectors(e,t),s.cross(Vn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Vn.subVectors(s,t),bi.subVectors(n,t),Mh.subVectors(e,t);let a=Vn.dot(Vn),o=Vn.dot(bi),l=Vn.dot(Mh),c=bi.dot(bi),h=bi.dot(Mh),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-o*h)*u,m=(a*h-o*l)*u;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,_i)===null?!1:_i.x>=0&&_i.y>=0&&_i.x+_i.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,_i)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,_i.x),l.addScaledVector(a,_i.y),l.addScaledVector(o,_i.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Ah.setScalar(0),Ch.setScalar(0),Rh.setScalar(0),Ah.fromBufferAttribute(e,t),Ch.fromBufferAttribute(e,n),Rh.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ah,r.x),a.addScaledVector(Ch,r.y),a.addScaledVector(Rh,r.z),a}static isFrontFacing(e,t,n,s){return Vn.subVectors(n,t),bi.subVectors(e,t),Vn.cross(bi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vn.subVectors(this.c,this.b),bi.subVectors(this.a,this.b),Vn.cross(bi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Ks.subVectors(s,n),Js.subVectors(r,n),wh.subVectors(e,n);let l=Ks.dot(wh),c=Js.dot(wh);if(l<=0&&c<=0)return t.copy(n);Th.subVectors(e,s);let h=Ks.dot(Th),d=Js.dot(Th);if(h>=0&&d<=h)return t.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Ks,a);Eh.subVectors(e,r);let f=Ks.dot(Eh),m=Js.dot(Eh);if(m>=0&&f<=m)return t.copy(r);let v=f*c-l*m;if(v<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(Js,o);let g=h*m-f*d;if(g<=0&&d-h>=0&&f-m>=0)return yf.subVectors(r,s),o=(d-h)/(d-h+(f-m)),t.copy(s).addScaledVector(yf,o);let p=1/(g+v+u);return a=v*p,o=u*p,t.copy(n).addScaledVector(Ks,a).addScaledVector(Js,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},fn=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Gn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Gn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Gn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Gn):Gn.fromBufferAttribute(r,a),Gn.applyMatrix4(e.matrixWorld),this.expandByPoint(Gn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),To.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),To.copy(n.boundingBox)),To.applyMatrix4(e.matrixWorld),this.union(To)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Gn),Gn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Jr),Eo.subVectors(this.max,Jr),Zs.subVectors(e.a,Jr),$s.subVectors(e.b,Jr),Qs.subVectors(e.c,Jr),Wi.subVectors($s,Zs),qi.subVectors(Qs,$s),vs.subVectors(Zs,Qs);let t=[0,-Wi.z,Wi.y,0,-qi.z,qi.y,0,-vs.z,vs.y,Wi.z,0,-Wi.x,qi.z,0,-qi.x,vs.z,0,-vs.x,-Wi.y,Wi.x,0,-qi.y,qi.x,0,-vs.y,vs.x,0];return!Ih(t,Zs,$s,Qs,Eo)||(t=[1,0,0,0,1,0,0,0,1],!Ih(t,Zs,$s,Qs,Eo))?!1:(Ao.crossVectors(Wi,qi),t=[Ao.x,Ao.y,Ao.z],Ih(t,Zs,$s,Qs,Eo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Gn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Gn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Si),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Si=[new L,new L,new L,new L,new L,new L,new L,new L],Gn=new L,To=new fn,Zs=new L,$s=new L,Qs=new L,Wi=new L,qi=new L,vs=new L,Jr=new L,Eo=new L,Ao=new L,xs=new L;function Ih(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){xs.fromArray(i,r);let o=s.x*Math.abs(xs.x)+s.y*Math.abs(xs.y)+s.z*Math.abs(xs.z),l=e.dot(xs),c=t.dot(xs),h=n.dot(xs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Wt=new L,Co=new he,Vv=0,dt=class extends ri{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vv++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=rl,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Co.fromBufferAttribute(this,t),Co.applyMatrix3(e),this.setXY(t,Co.x,Co.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyMatrix3(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyMatrix4(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyNormalMatrix(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.transformDirection(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=jn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=jn(t,this.array)),t}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=jn(t,this.array)),t}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=jn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=jn(t,this.array)),t}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array),r=lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==rl&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}};var ua=class extends dt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var da=class extends dt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Je=class extends dt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Gv=new fn,Zr=new L,Ph=new L,vn=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Gv.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zr.subVectors(e,this.center);let t=Zr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Zr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ph.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zr.copy(e.center).add(Ph)),this.expandByPoint(Zr.copy(e.center).sub(Ph))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},jv=0,Ln=new Ae,Nh=new It,er=new L,wn=new fn,$r=new fn,Zt=new L,gt=class i extends ri{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jv++}),this.uuid=kn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(pv(e)?da:ua)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ln.makeRotationFromQuaternion(e),this.applyMatrix4(Ln),this}rotateX(e){return Ln.makeRotationX(e),this.applyMatrix4(Ln),this}rotateY(e){return Ln.makeRotationY(e),this.applyMatrix4(Ln),this}rotateZ(e){return Ln.makeRotationZ(e),this.applyMatrix4(Ln),this}translate(e,t,n){return Ln.makeTranslation(e,t,n),this.applyMatrix4(Ln),this}scale(e,t,n){return Ln.makeScale(e,t,n),this.applyMatrix4(Ln),this}lookAt(e){return Nh.lookAt(e),Nh.updateMatrix(),this.applyMatrix4(Nh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(er).negate(),this.translate(er.x,er.y,er.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Je(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];wn.setFromBufferAttribute(r),this.morphTargetsRelative?(Zt.addVectors(this.boundingBox.min,wn.min),this.boundingBox.expandByPoint(Zt),Zt.addVectors(this.boundingBox.max,wn.max),this.boundingBox.expandByPoint(Zt)):(this.boundingBox.expandByPoint(wn.min),this.boundingBox.expandByPoint(wn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ue('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(wn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];$r.setFromBufferAttribute(o),this.morphTargetsRelative?(Zt.addVectors(wn.min,$r.min),wn.expandByPoint(Zt),Zt.addVectors(wn.max,$r.max),wn.expandByPoint(Zt)):(wn.expandByPoint($r.min),wn.expandByPoint($r.max))}wn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Zt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Zt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Zt.fromBufferAttribute(o,c),l&&(er.fromBufferAttribute(e,c),Zt.add(er)),s=Math.max(s,n.distanceToSquared(Zt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ue('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ue("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new dt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let b=0;b<n.count;b++)o[b]=new L,l[b]=new L;let c=new L,h=new L,d=new L,u=new he,f=new he,m=new he,v=new L,g=new L;function p(b,w,I){c.fromBufferAttribute(n,b),h.fromBufferAttribute(n,w),d.fromBufferAttribute(n,I),u.fromBufferAttribute(r,b),f.fromBufferAttribute(r,w),m.fromBufferAttribute(r,I),h.sub(c),d.sub(c),f.sub(u),m.sub(u);let N=1/(f.x*m.y-m.x*f.y);isFinite(N)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(d,-f.y).multiplyScalar(N),g.copy(d).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(N),o[b].add(v),o[w].add(v),o[I].add(v),l[b].add(g),l[w].add(g),l[I].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let b=0,w=x.length;b<w;++b){let I=x[b],N=I.start,F=I.count;for(let k=N,U=N+F;k<U;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let _=new L,y=new L,E=new L,A=new L;function R(b){E.fromBufferAttribute(s,b),A.copy(E);let w=o[b];_.copy(w),_.sub(E.multiplyScalar(E.dot(w))).normalize(),y.crossVectors(A,w);let N=y.dot(l[b])<0?-1:1;a.setXYZW(b,_.x,_.y,_.z,N)}for(let b=0,w=x.length;b<w;++b){let I=x[b],N=I.start,F=I.count;for(let k=N,U=N+F;k<U;k+=3)R(e.getX(k+0)),R(e.getX(k+1)),R(e.getX(k+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new dt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,h=new L,d=new L;if(e)for(let u=0,f=e.count;u<f;u+=3){let m=e.getX(u+0),v=e.getX(u+1),g=e.getX(u+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,g),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,f=t.count;u<f;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Zt.fromBufferAttribute(e,t),Zt.normalize(),e.setXYZ(t,Zt.x,Zt.y,Zt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),f=0,m=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let p=0;p<h;p++)u[m++]=c[f++]}return new dt(u,h,d)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=e(u,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},pr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=rl,this.updateRanges=[],this.version=0,this.uuid=kn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},un=new L,mr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)un.fromBufferAttribute(this,t),un.applyMatrix4(e),this.setXYZ(t,un.x,un.y,un.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)un.fromBufferAttribute(this,t),un.applyNormalMatrix(e),this.setXYZ(t,un.x,un.y,un.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)un.fromBufferAttribute(this,t),un.transformDirection(e),this.setXYZ(t,un.x,un.y,un.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=jn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=jn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=jn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=jn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=jn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array),r=lt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){ca("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new dt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ca("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Wv=0,pn=class extends ri{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wv++}),this.uuid=kn(),this.name="",this.type="Material",this.blending=Ei,this.side=an,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Zo,this.blendDst=$o,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new fe(0,0,0),this.blendAlpha=0,this.depthFunc=ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_s,this.stencilZFail=_s,this.stencilZPass=_s,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ei&&(n.blending=this.blending),this.side!==an&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Zo&&(n.blendSrc=this.blendSrc),this.blendDst!==$o&&(n.blendDst=this.blendDst),this.blendEquation!==Ji&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ws&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_s&&(n.stencilFail=this.stencilFail),this.stencilZFail!==_s&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==_s&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new fe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new he().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new he().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Mi=new L,Lh=new L,Ro=new L,Xi=new L,Dh=new L,Io=new L,Fh=new L,Zi=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mi.copy(this.origin).addScaledVector(this.direction,t),Mi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Lh.copy(e).add(t).multiplyScalar(.5),Ro.copy(t).sub(e).normalize(),Xi.copy(this.origin).sub(Lh);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Ro),o=Xi.dot(this.direction),l=-Xi.dot(Ro),c=Xi.lengthSq(),h=Math.abs(1-a*a),d,u,f,m;if(h>0)if(d=a*l-o,u=a*o-l,m=r*h,d>=0)if(u>=-m)if(u<=m){let v=1/h;d*=v,u*=v,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-m?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=m?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Lh).addScaledVector(Ro,u),f}intersectSphere(e,t){Mi.subVectors(e.center,this.origin);let n=Mi.dot(this.direction),s=Mi.dot(Mi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Mi)!==null}intersectTriangle(e,t,n,s,r){Dh.subVectors(t,e),Io.subVectors(n,e),Fh.crossVectors(Dh,Io);let a=this.direction.dot(Fh),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Xi.subVectors(this.origin,e);let l=o*this.direction.dot(Io.crossVectors(Xi,Io));if(l<0)return null;let c=o*this.direction.dot(Dh.cross(Xi));if(c<0||l+c>a)return null;let h=-o*Xi.dot(Fh);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},bt=class extends pn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=Pl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},bf=new Ae,ys=new Zi,Po=new vn,_f=new L,No=new L,Lo=new L,Do=new L,kh=new L,Fo=new L,Sf=new L,ko=new L,Ze=class extends It{constructor(e=new gt,t=new bt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Fo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],d=r[l];h!==0&&(kh.fromBufferAttribute(d,e),a?Fo.addScaledVector(kh,h):Fo.addScaledVector(kh.sub(t),h))}t.add(Fo)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Po.copy(n.boundingSphere),Po.applyMatrix4(r),ys.copy(e.ray).recast(e.near),!(Po.containsPoint(ys.origin)===!1&&(ys.intersectSphere(Po,_f)===null||ys.origin.distanceToSquared(_f)>(e.far-e.near)**2))&&(bf.copy(r).invert(),ys.copy(e.ray).applyMatrix4(bf),!(n.boundingBox!==null&&ys.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ys)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,v=u.length;m<v;m++){let g=u[m],p=a[g.materialIndex],x=Math.max(g.start,f.start),_=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let y=x,E=_;y<E;y+=3){let A=o.getX(y),R=o.getX(y+1),b=o.getX(y+2);s=Oo(this,p,e,n,c,h,d,A,R,b),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let x=o.getX(g),_=o.getX(g+1),y=o.getX(g+2);s=Oo(this,a,e,n,c,h,d,x,_,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,v=u.length;m<v;m++){let g=u[m],p=a[g.materialIndex],x=Math.max(g.start,f.start),_=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let y=x,E=_;y<E;y+=3){let A=y,R=y+1,b=y+2;s=Oo(this,p,e,n,c,h,d,A,R,b),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let x=g,_=g+1,y=g+2;s=Oo(this,a,e,n,c,h,d,x,_,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function qv(i,e,t,n,s,r,a,o){let l;if(e.side===qt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===an,o),l===null)return null;ko.copy(o),ko.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ko);return c<t.near||c>t.far?null:{distance:c,point:ko.clone(),object:i}}function Oo(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,No),i.getVertexPosition(l,Lo),i.getVertexPosition(c,Do);let h=qv(i,e,t,n,No,Lo,Do,Sf);if(h){let d=new L;Ki.getBarycoord(Sf,No,Lo,Do,d),s&&(h.uv=Ki.getInterpolatedAttribute(s,o,l,c,d,new he)),r&&(h.uv1=Ki.getInterpolatedAttribute(r,o,l,c,d,new he)),a&&(h.normal=Ki.getInterpolatedAttribute(a,o,l,c,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new L,materialIndex:0};Ki.getNormal(No,Lo,Do,u.normal),h.face=u,h.barycoord=d}return h}var Qr=new ct,Mf=new ct,wf=new ct,Xv=new ct,Tf=new Ae,Uo=new L,Oh=new vn,Ef=new Ae,Uh=new Zi,fa=class extends Ze{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=qh,this.bindMatrix=new Ae,this.bindMatrixInverse=new Ae,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new fn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Uo),this.boundingBox.expandByPoint(Uo)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new vn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Uo),this.boundingSphere.expandByPoint(Uo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Oh.copy(this.boundingSphere),Oh.applyMatrix4(s),e.ray.intersectsSphere(Oh)!==!1&&(Ef.copy(s).invert(),Uh.copy(e.ray).applyMatrix4(Ef),!(this.boundingBox!==null&&Uh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Uh)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new ct,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===qh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===bp?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ie("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Mf.fromBufferAttribute(s.attributes.skinIndex,e),wf.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Qr.copy(t),t.set(0,0,0,0)):(Qr.set(...t,1),t.set(0,0,0)),Qr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let a=wf.getComponent(r);if(a!==0){let o=Mf.getComponent(r);Tf.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Xv.copy(Qr).applyMatrix4(Tf),a)}}return t.isVector4&&(t.w=Qr.w),t.applyMatrix4(this.bindMatrixInverse)}},gr=class extends It{constructor(){super(),this.isBone=!0,this.type="Bone"}},vr=class extends Yt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Ht,h=Ht,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Af=new Ae,Yv=new Ae,pa=class i{constructor(e=[],t=[]){this.uuid=kn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ie("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Ae)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Ae;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:Yv;Af.multiplyMatrices(o,t[r]),Af.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new vr(t,e,e,Cn,An);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],a=t[r];a===void 0&&(Ie("Skeleton: No bone found with UUID:",r),a=new gr),this.bones.push(a),this.boneInverses.push(new Ae().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let a=t[s];e.bones.push(a.uuid);let o=n[s];e.boneInverses.push(o.toArray())}return e}},ai=class extends dt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},tr=new Ae,Cf=new Ae,Bo=[],Rf=new fn,Kv=new Ae,ea=new Ze,ta=new vn,rt=class extends Ze{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ai(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Kv)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new fn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,tr),Rf.copy(e.boundingBox).applyMatrix4(tr),this.boundingBox.union(Rf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new vn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,tr),ta.copy(e.boundingSphere).applyMatrix4(tr),this.boundingSphere.union(ta)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(ea.geometry=this.geometry,ea.material=this.material,ea.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ta.copy(this.boundingSphere),ta.applyMatrix4(n),e.ray.intersectsSphere(ta)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,tr),Cf.multiplyMatrices(n,tr),ea.matrixWorld=Cf,ea.raycast(e,Bo);for(let a=0,o=Bo.length;a<o;a++){let l=Bo[a];l.instanceId=r,l.object=this,t.push(l)}Bo.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ai(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new vr(new Float32Array(s*this.count),s,this.count,Ul,An));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Bh=new L,Jv=new L,Zv=new Ve,Dn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Bh.subVectors(n,t).cross(Jv.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Bh),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Zv.getNormalMatrix(e),s=this.coplanarPoint(Bh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},bs=new vn,$v=new he(.5,.5),zo=new L,xr=class{constructor(e=new Dn,t=new Dn,n=new Dn,s=new Dn,r=new Dn,a=new Dn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Wn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],m=r[8],v=r[9],g=r[10],p=r[11],x=r[12],_=r[13],y=r[14],E=r[15];if(s[0].setComponents(c-a,f-h,p-m,E-x).normalize(),s[1].setComponents(c+a,f+h,p+m,E+x).normalize(),s[2].setComponents(c+o,f+d,p+v,E+_).normalize(),s[3].setComponents(c-o,f-d,p-v,E-_).normalize(),n)s[4].setComponents(l,u,g,y).normalize(),s[5].setComponents(c-l,f-u,p-g,E-y).normalize();else if(s[4].setComponents(c-l,f-u,p-g,E-y).normalize(),t===Wn)s[5].setComponents(c+l,f+u,p+g,E+y).normalize();else if(t===lr)s[5].setComponents(l,u,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),bs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),bs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(bs)}intersectsSprite(e){bs.center.set(0,0,0);let t=$v.distanceTo(e.center);return bs.radius=.7071067811865476+t,bs.applyMatrix4(e.matrixWorld),this.intersectsSphere(bs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(zo.x=s.normal.x>0?e.max.x:e.min.x,zo.y=s.normal.y>0?e.max.y:e.min.y,zo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(zo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var $i=class extends pn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},cl=new L,hl=new L,If=new Ae,na=new Zi,Ho=new vn,zh=new L,Pf=new L,Cs=class extends It{constructor(e=new gt,t=new $i){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)cl.fromBufferAttribute(t,s-1),hl.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=cl.distanceTo(hl);e.setAttribute("lineDistance",new Je(n,1))}else Ie("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ho.copy(n.boundingSphere),Ho.applyMatrix4(s),Ho.radius+=r,e.ray.intersectsSphere(Ho)===!1)return;If.copy(s).invert(),na.copy(e.ray).applyMatrix4(If);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let v=f,g=m-1;v<g;v+=c){let p=h.getX(v),x=h.getX(v+1),_=Vo(this,e,na,l,p,x,v);_&&t.push(_)}if(this.isLineLoop){let v=h.getX(m-1),g=h.getX(f),p=Vo(this,e,na,l,v,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let v=f,g=m-1;v<g;v+=c){let p=Vo(this,e,na,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){let v=Vo(this,e,na,l,m-1,f,m-1);v&&t.push(v)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Vo(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(cl.fromBufferAttribute(o,s),hl.fromBufferAttribute(o,r),t.distanceSqToSegment(cl,hl,zh,Pf)>n)return;zh.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(zh);if(!(c<e.near||c>e.far))return{distance:c,point:Pf.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var Nf=new L,Lf=new L,Rs=class extends Cs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Nf.fromBufferAttribute(t,s),Lf.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Nf.distanceTo(Lf);e.setAttribute("lineDistance",new Je(n,1))}else Ie("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},ma=class extends Cs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},yr=class extends pn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Df=new Ae,$h=new Zi,Go=new vn,jo=new L,ga=class extends It{constructor(e=new gt,t=new yr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Go.copy(n.boundingSphere),Go.applyMatrix4(s),Go.radius+=r,e.ray.intersectsSphere(Go)===!1)return;Df.copy(s).invert(),$h.copy(e.ray).applyMatrix4(Df);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=u,v=f;m<v;m++){let g=c.getX(m);jo.fromBufferAttribute(d,g),Ff(jo,g,l,s,e,t,this)}}else{let u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let m=u,v=f;m<v;m++)jo.fromBufferAttribute(d,m),Ff(jo,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Ff(i,e,t,n,s,r,a){let o=$h.distanceSqToPoint(i);if(o<t){let l=new L;$h.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var va=class extends Yt{constructor(e=[],t=rs,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Qi=class extends Yt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Tn=class extends Yt{constructor(e,t,n=Jn,s,r,a,o=Ht,l=Ht,c,h=si,d=1){if(h!==si&&h!==as)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ur(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ul=class extends Tn{constructor(e,t=Jn,n=rs,s,r,a=Ht,o=Ht,l,c=si){let h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},xa=class extends Yt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},es=class i extends gt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,f=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Je(c,3)),this.setAttribute("normal",new Je(h,3)),this.setAttribute("uv",new Je(d,2));function m(v,g,p,x,_,y,E,A,R,b,w){let I=y/R,N=E/b,F=y/2,k=E/2,U=A/2,z=R+1,q=b+1,Z=0,D=0,H=new L;for(let ee=0;ee<q;ee++){let ie=ee*N-k;for(let ce=0;ce<z;ce++){let Ne=ce*I-F;H[v]=Ne*x,H[g]=ie*_,H[p]=U,c.push(H.x,H.y,H.z),H[v]=0,H[g]=0,H[p]=A>0?1:-1,h.push(H.x,H.y,H.z),d.push(ce/R),d.push(1-ee/b),Z+=1}}for(let ee=0;ee<b;ee++)for(let ie=0;ie<R;ie++){let ce=u+ie+z*ee,Ne=u+ie+z*(ee+1),Be=u+(ie+1)+z*(ee+1),He=u+(ie+1)+z*ee;l.push(ce,Ne,He),l.push(Ne,Be,He),D+=6}o.addGroup(f,D,w),f+=D,u+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var ya=class i extends gt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],l=[],c=new L,h=new he;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){let f=n+d/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new Je(a,3)),this.setAttribute("normal",new Je(o,3)),this.setAttribute("uv",new Je(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},br=class i extends gt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],u=[],f=[],m=0,v=[],g=n/2,p=0;x(),a===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new Je(d,3)),this.setAttribute("normal",new Je(u,3)),this.setAttribute("uv",new Je(f,2));function x(){let y=new L,E=new L,A=0,R=(t-e)/n;for(let b=0;b<=r;b++){let w=[],I=b/r,N=I*(t-e)+e;for(let F=0;F<=s;F++){let k=F/s,U=k*l+o,z=Math.sin(U),q=Math.cos(U);E.x=N*z,E.y=-I*n+g,E.z=N*q,d.push(E.x,E.y,E.z),y.set(z,R,q).normalize(),u.push(y.x,y.y,y.z),f.push(k,1-I),w.push(m++)}v.push(w)}for(let b=0;b<s;b++)for(let w=0;w<r;w++){let I=v[w][b],N=v[w+1][b],F=v[w+1][b+1],k=v[w][b+1];(e>0||w!==0)&&(h.push(I,N,k),A+=3),(t>0||w!==r-1)&&(h.push(N,F,k),A+=3)}c.addGroup(p,A,0),p+=A}function _(y){let E=m,A=new he,R=new L,b=0,w=y===!0?e:t,I=y===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,g*I,0),u.push(0,I,0),f.push(.5,.5),m++;let N=m;for(let F=0;F<=s;F++){let U=F/s*l+o,z=Math.cos(U),q=Math.sin(U);R.x=w*q,R.y=g*I,R.z=w*z,d.push(R.x,R.y,R.z),u.push(0,I,0),A.x=z*.5+.5,A.y=q*.5*I+.5,f.push(A.x,A.y),m++}for(let F=0;F<s;F++){let k=E+F,U=N+F;y===!0?h.push(U,U+1,k):h.push(U+1,U,k),b+=3}c.addGroup(p,b,y===!0?1:2),p+=b}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ba=class i extends br{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},dl=class i extends gt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new Je(r,3)),this.setAttribute("normal",new Je(r.slice(),3)),this.setAttribute("uv",new Je(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){let _=new L,y=new L,E=new L;for(let A=0;A<t.length;A+=3)f(t[A+0],_),f(t[A+1],y),f(t[A+2],E),l(_,y,E,x)}function l(x,_,y,E){let A=E+1,R=[];for(let b=0;b<=A;b++){R[b]=[];let w=x.clone().lerp(y,b/A),I=_.clone().lerp(y,b/A),N=A-b;for(let F=0;F<=N;F++)F===0&&b===A?R[b][F]=w:R[b][F]=w.clone().lerp(I,F/N)}for(let b=0;b<A;b++)for(let w=0;w<2*(A-b)-1;w++){let I=Math.floor(w/2);w%2===0?(u(R[b][I+1]),u(R[b+1][I]),u(R[b][I])):(u(R[b][I+1]),u(R[b+1][I+1]),u(R[b+1][I]))}}function c(x){let _=new L;for(let y=0;y<r.length;y+=3)_.x=r[y+0],_.y=r[y+1],_.z=r[y+2],_.normalize().multiplyScalar(x),r[y+0]=_.x,r[y+1]=_.y,r[y+2]=_.z}function h(){let x=new L;for(let _=0;_<r.length;_+=3){x.x=r[_+0],x.y=r[_+1],x.z=r[_+2];let y=g(x)/2/Math.PI+.5,E=p(x)/Math.PI+.5;a.push(y,1-E)}m(),d()}function d(){for(let x=0;x<a.length;x+=6){let _=a[x+0],y=a[x+2],E=a[x+4],A=Math.max(_,y,E),R=Math.min(_,y,E);A>.9&&R<.1&&(_<.2&&(a[x+0]+=1),y<.2&&(a[x+2]+=1),E<.2&&(a[x+4]+=1))}}function u(x){r.push(x.x,x.y,x.z)}function f(x,_){let y=x*3;_.x=e[y+0],_.y=e[y+1],_.z=e[y+2]}function m(){let x=new L,_=new L,y=new L,E=new L,A=new he,R=new he,b=new he;for(let w=0,I=0;w<r.length;w+=9,I+=6){x.set(r[w+0],r[w+1],r[w+2]),_.set(r[w+3],r[w+4],r[w+5]),y.set(r[w+6],r[w+7],r[w+8]),A.set(a[I+0],a[I+1]),R.set(a[I+2],a[I+3]),b.set(a[I+4],a[I+5]),E.copy(x).add(_).add(y).divideScalar(3);let N=g(E);v(A,I+0,x,N),v(R,I+2,_,N),v(b,I+4,y,N)}}function v(x,_,y,E){E<0&&x.x===1&&(a[_]=x.x-1),y.x===0&&y.z===0&&(a[_]=E/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var En=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ie("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let h=n[s],u=n[s+1]-h,f=(a-h)/u;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new he:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new L,s=[],r=[],a=[],o=new L,l=new Ae;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Xe(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,m))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Xe(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},_r=class extends En{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new he){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},fl=class extends _r{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Su(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,s(a,o,u,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var kf=new L,Of=new L,Hh=new Su,Vh=new Su,Gh=new Su,pl=class extends En{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new L){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Of.subVectors(s[0],s[1]).add(s[0]),c=Of);let d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(kf.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=kf),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(d),f),v=Math.pow(d.distanceToSquared(u),f),g=Math.pow(u.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),Hh.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,m,v,g),Vh.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,m,v,g),Gh.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(Hh.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Vh.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Gh.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(Hh.calc(l),Vh.calc(l),Gh.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Uf(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Qv(i,e){let t=1-i;return t*t*e}function ex(i,e){return 2*(1-i)*i*e}function tx(i,e){return i*i*e}function aa(i,e,t,n){return Qv(i,e)+ex(i,t)+tx(i,n)}function nx(i,e){let t=1-i;return t*t*t*e}function ix(i,e){let t=1-i;return 3*t*t*i*e}function sx(i,e){return 3*(1-i)*i*i*e}function rx(i,e){return i*i*i*e}function oa(i,e,t,n,s){return nx(i,e)+ix(i,t)+sx(i,n)+rx(i,s)}var _a=class extends En{constructor(e=new he,t=new he,n=new he,s=new he){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new he){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(oa(e,s.x,r.x,a.x,o.x),oa(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ml=class extends En{constructor(e=new L,t=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(oa(e,s.x,r.x,a.x,o.x),oa(e,s.y,r.y,a.y,o.y),oa(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Sa=class extends En{constructor(e=new he,t=new he){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new he){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new he){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},gl=class extends En{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ma=class extends En{constructor(e=new he,t=new he,n=new he){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new he){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(aa(e,s.x,r.x,a.x),aa(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},vl=class extends En{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(aa(e,s.x,r.x,a.x),aa(e,s.y,r.y,a.y),aa(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},wa=class extends En{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new he){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Uf(o,l.x,c.x,h.x,d.x),Uf(o,l.y,c.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new he().fromArray(s))}return this}},Bf=Object.freeze({__proto__:null,ArcCurve:fl,CatmullRomCurve3:pl,CubicBezierCurve:_a,CubicBezierCurve3:ml,EllipseCurve:_r,LineCurve:Sa,LineCurve3:gl,QuadraticBezierCurve:Ma,QuadraticBezierCurve3:vl,SplineCurve:wa}),xl=class extends En{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Bf[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Bf[s.type]().fromJSON(s))}return this}},Is=class extends xl{constructor(e){super(),this.type="Path",this.currentPoint=new he,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Sa(this.currentPoint.clone(),new he(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Ma(this.currentPoint.clone(),new he(e,t),new he(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new _a(this.currentPoint.clone(),new he(e,t),new he(n,s),new he(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new wa(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new _r(e,t,n,s,r,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ts=class extends Is{constructor(e){super(e),this.uuid=kn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Is().fromJSON(s))}return this}};function ax(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Fp(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=ux(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let h=o,d=l;for(let u=t;u<s;u+=t){let f=i[u],m=i[u+1];f<o&&(o=f),m<l&&(l=m),f>h&&(h=f),m>d&&(d=m)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return Ta(r,a,t,o,l,c,0),a}function Fp(i,e,t,n,s){let r;if(s===Sx(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=zf(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=zf(a/n|0,i[a],i[a+1],r);return r&&Sr(r,r.next)&&(Aa(r),r=r.next),r}function Ps(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Sr(t,t.next)||Nt(t.prev,t,t.next)===0)){if(Aa(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Ta(i,e,t,n,s,r,a){if(!i)return;!a&&r&&gx(i,n,s,r);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?lx(i,n,s,r):ox(i)){e.push(l.i,i.i,c.i),Aa(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=cx(Ps(i),e),Ta(i,e,t,n,s,r,2)):a===2&&hx(i,e,t,n,s,r):Ta(Ps(i),e,t,n,s,r,1);break}}}function ox(i){let e=i.prev,t=i,n=i.next;if(Nt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),d=Math.min(o,l,c),u=Math.max(s,r,a),f=Math.max(o,l,c),m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=u&&m.y>=d&&m.y<=f&&ia(s,o,r,l,a,c,m.x,m.y)&&Nt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function lx(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Nt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,u=a.y,f=Math.min(o,l,c),m=Math.min(h,d,u),v=Math.max(o,l,c),g=Math.max(h,d,u),p=Qh(f,m,e,t,n),x=Qh(v,g,e,t,n),_=i.prevZ,y=i.nextZ;for(;_&&_.z>=p&&y&&y.z<=x;){if(_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&ia(o,h,l,d,c,u,_.x,_.y)&&Nt(_.prev,_,_.next)>=0||(_=_.prevZ,y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&ia(o,h,l,d,c,u,y.x,y.y)&&Nt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;_&&_.z>=p;){if(_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&ia(o,h,l,d,c,u,_.x,_.y)&&Nt(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;y&&y.z<=x;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&ia(o,h,l,d,c,u,y.x,y.y)&&Nt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function cx(i,e){let t=i;do{let n=t.prev,s=t.next.next;!Sr(n,s)&&Op(n,t,t.next,s)&&Ea(n,s)&&Ea(s,n)&&(e.push(n.i,t.i,s.i),Aa(t),Aa(t.next),t=i=s),t=t.next}while(t!==i);return Ps(t)}function hx(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&yx(a,o)){let l=Up(a,o);a=Ps(a,a.next),l=Ps(l,l.next),Ta(a,e,t,n,s,r,0),Ta(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function ux(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=Fp(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(xx(c))}s.sort(dx);for(let r=0;r<s.length;r++)t=fx(s[r],t);return t}function dx(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function fx(i,e){let t=px(i,e);if(!t)return e;let n=Up(t,i);return Ps(n,n.next),Ps(t,t.next)}function px(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(Sr(i,t))return t;do{if(Sr(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let d=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>r&&(r=d,a=t.x<t.next.x?t:t.next,d===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&kp(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let d=Math.abs(s-t.y)/(n-t.x);Ea(t,i)&&(d<h||d===h&&(t.x>a.x||t.x===a.x&&mx(a,t)))&&(a=t,h=d)}t=t.next}while(t!==o);return a}function mx(i,e){return Nt(i.prev,i,e.prev)<0&&Nt(e.next,i,i.next)<0}function gx(i,e,t,n){let s=i;do s.z===0&&(s.z=Qh(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,vx(s)}function vx(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Qh(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function xx(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function kp(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function ia(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&kp(i,e,t,n,s,r,a,o)}function yx(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!bx(i,e)&&(Ea(i,e)&&Ea(e,i)&&_x(i,e)&&(Nt(i.prev,i,e.prev)||Nt(i,e.prev,e))||Sr(i,e)&&Nt(i.prev,i,i.next)>0&&Nt(e.prev,e,e.next)>0)}function Nt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Sr(i,e){return i.x===e.x&&i.y===e.y}function Op(i,e,t,n){let s=qo(Nt(i,e,t)),r=qo(Nt(i,e,n)),a=qo(Nt(t,n,i)),o=qo(Nt(t,n,e));return!!(s!==r&&a!==o||s===0&&Wo(i,t,e)||r===0&&Wo(i,n,e)||a===0&&Wo(t,i,n)||o===0&&Wo(t,e,n))}function Wo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function qo(i){return i>0?1:i<0?-1:0}function bx(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Op(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ea(i,e){return Nt(i.prev,i,i.next)<0?Nt(i,e,i.next)>=0&&Nt(i,i.prev,e)>=0:Nt(i,e,i.prev)<0||Nt(i,i.next,e)<0}function _x(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Up(i,e){let t=eu(i.i,i.x,i.y),n=eu(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function zf(i,e,t,n){let s=eu(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Aa(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function eu(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Sx(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var tu=class{static triangulate(e,t,n=2){return ax(e,t,n)}},ar=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Hf(e),Vf(n,e);let a=e.length;t.forEach(Hf);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Vf(n,t[l]);let o=tu.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function Hf(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Vf(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Ca=class i extends dl{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var ln=class i extends gt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=e/o,u=t/l,f=[],m=[],v=[],g=[];for(let p=0;p<h;p++){let x=p*u-a;for(let _=0;_<c;_++){let y=_*d-r;m.push(y,-x,0),v.push(0,0,1),g.push(_/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<o;x++){let _=x+c*p,y=x+c*(p+1),E=x+1+c*(p+1),A=x+1+c*p;f.push(_,y,A),f.push(y,E,A)}this.setIndex(f),this.setAttribute("position",new Je(m,3)),this.setAttribute("normal",new Je(v,3)),this.setAttribute("uv",new Je(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Ns=class i extends gt{constructor(e=new ts([new he(0,.5),new he(-.5,-.5),new he(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Je(s,3)),this.setAttribute("normal",new Je(r,3)),this.setAttribute("uv",new Je(a,2));function c(h){let d=s.length/3,u=h.extractPoints(t),f=u.shape,m=u.holes;ar.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){let x=m[g];ar.isClockWise(x)===!0&&(m[g]=x.reverse())}let v=ar.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){let x=m[g];f=f.concat(x)}for(let g=0,p=f.length;g<p;g++){let x=f[g];s.push(x.x,x.y,0),r.push(0,0,1),a.push(x.x,x.y)}for(let g=0,p=v.length;g<p;g++){let x=v[g],_=x[0]+d,y=x[1]+d,E=x[2]+d;n.push(_,y,E),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Mx(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};function Mx(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var Xn=class i extends gt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new L,u=new L,f=[],m=[],v=[],g=[];for(let p=0;p<=n;p++){let x=[],_=p/n,y=a+_*o,E=e*Math.cos(y),A=Math.sqrt(e*e-E*E),R=0;p===0&&a===0?R=.5/t:p===n&&l===Math.PI&&(R=-.5/t);for(let b=0;b<=t;b++){let w=b/t,I=s+w*r;d.x=-A*Math.cos(I),d.y=E,d.z=A*Math.sin(I),m.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),g.push(w+R,1-_),x.push(c++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<t;x++){let _=h[p][x+1],y=h[p][x],E=h[p+1][x],A=h[p+1][x+1];(p!==0||a>0)&&f.push(_,y,A),(p!==n-1||l<Math.PI)&&f.push(y,E,A)}this.setIndex(f),this.setAttribute("position",new Je(m,3)),this.setAttribute("normal",new Je(v,3)),this.setAttribute("uv",new Je(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Ra=class i extends gt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],h=[],d=[],u=new L,f=new L,m=new L;for(let v=0;v<=n;v++){let g=a+v/n*o;for(let p=0;p<=s;p++){let x=p/s*r;f.x=(e+t*Math.cos(g))*Math.cos(x),f.y=(e+t*Math.cos(g))*Math.sin(x),f.z=t*Math.sin(g),c.push(f.x,f.y,f.z),u.x=e*Math.cos(x),u.y=e*Math.sin(x),m.subVectors(f,u).normalize(),h.push(m.x,m.y,m.z),d.push(p/s),d.push(v/n)}}for(let v=1;v<=n;v++)for(let g=1;g<=s;g++){let p=(s+1)*v+g-1,x=(s+1)*(v-1)+g-1,_=(s+1)*(v-1)+g,y=(s+1)*v+g;l.push(p,x,y),l.push(x,_,y)}this.setIndex(l),this.setAttribute("position",new Je(c,3)),this.setAttribute("normal",new Je(h,3)),this.setAttribute("uv",new Je(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};function Us(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Gf(s))s.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Gf(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function cn(i){let e={};for(let t=0;t<i.length;t++){let n=Us(i[t]);for(let s in n)e[s]=n[s]}return e}function Gf(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function wx(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Mu(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}var Li={clone:Us,merge:cn},Tx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ex=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,at=class extends pn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Tx,this.fragmentShader=Ex,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Us(e.uniforms),this.uniformsGroups=wx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new fe().setHex(s.value);break;case"v2":this.uniforms[n].value=new he().fromArray(s.value);break;case"v3":this.uniforms[n].value=new L().fromArray(s.value);break;case"v4":this.uniforms[n].value=new ct().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ve().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ae().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Mr=class extends at{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},$t=class extends pn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=no,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},xn=class extends $t{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new he(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Xe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new fe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new fe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new fe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var ns=class extends pn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=no,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=Pl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},yl=class extends pn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},bl=class extends pn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Xo(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Ax(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function jf(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=i[o+l]}return s}function Cx(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}var oi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},_l=class extends oi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Yh,endingEnd:Yh}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Kh:r=e,o=2*t-n;break;case Jh:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Kh:a=e,l=2*n-t;break;case Jh:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),v=m*m,g=v*m,p=-u*g+2*u*v-u*m,x=(1+u)*g+(-1.5-2*u)*v+(-.5+u)*m+1,_=(-1-f)*g+(1.5+f)*v+.5*m,y=f*g-f*v;for(let E=0;E!==o;++E)r[E]=p*a[h+E]+x*a[c+E]+_*a[l+E]+y*a[d+E];return r}},Sl=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}},Ml=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},wl=class extends oi{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let m=(n-t)/(s-t),v=1-m;for(let g=0;g!==o;++g)r[g]=a[c+g]*v+a[l+g]*m;return r}let u=o*2,f=e-1;for(let m=0;m!==o;++m){let v=a[c+m],g=a[l+m],p=f*u+m*2,x=d[p],_=d[p+1],y=e*u+m*2,E=h[y],A=h[y+1],R=(n-t)/(s-t),b,w,I,N,F;for(let k=0;k<8;k++){b=R*R,w=b*R,I=1-R,N=I*I,F=N*I;let z=F*t+3*N*R*x+3*I*b*E+w*s-n;if(Math.abs(z)<1e-10)break;let q=3*N*(x-t)+6*I*R*(E-x)+3*b*(s-E);if(Math.abs(q)<1e-10)break;R=R-z/q,R=Math.max(0,Math.min(1,R))}r[m]=F*v+3*N*R*_+3*I*b*A+w*g}return r}},yn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Xo(t,this.TimeBufferType),this.values=Xo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Xo(e.times,Array),values:Xo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ml(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Sl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new _l(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new wl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ts:t=this.InterpolantFactoryMethodDiscrete;break;case Es:t=this.InterpolantFactoryMethodLinear;break;case Jo:t=this.InterpolantFactoryMethodSmooth;break;case Xh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ie("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ts;case this.InterpolantFactoryMethodLinear:return Es;case this.InterpolantFactoryMethodSmooth:return Jo;case this.InterpolantFactoryMethodBezier:return Xh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ue("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ue("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Ue("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ue("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&mv(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Ue("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Jo,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let d=o*n,u=d-n,f=d+n;for(let m=0;m!==n;++m){let v=t[d+m];if(v!==t[u+m]||v!==t[f+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,u=a*n;for(let f=0;f!==n;++f)t[u+f]=t[d+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};yn.prototype.ValueTypeName="";yn.prototype.TimeBufferType=Float32Array;yn.prototype.ValueBufferType=Float32Array;yn.prototype.DefaultInterpolation=Es;var Ai=class extends yn{constructor(e,t,n){super(e,t,n)}};Ai.prototype.ValueTypeName="bool";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=Ts;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var Ia=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};Ia.prototype.ValueTypeName="color";var Ci=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};Ci.prototype.ValueTypeName="number";var Tl=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)Ct.slerpFlat(r,0,a,c-o,a,c,l);return r}},Ri=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Tl(this.times,this.values,this.getValueSize(),e)}};Ri.prototype.ValueTypeName="quaternion";Ri.prototype.InterpolantFactoryMethodSmooth=void 0;var Ii=class extends yn{constructor(e,t,n){super(e,t,n)}};Ii.prototype.ValueTypeName="string";Ii.prototype.ValueBufferType=Array;Ii.prototype.DefaultInterpolation=Ts;Ii.prototype.InterpolantFactoryMethodLinear=void 0;Ii.prototype.InterpolantFactoryMethodSmooth=void 0;var is=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};is.prototype.ValueTypeName="vector";var Pa=class{constructor(e="",t=-1,n=[],s=_p){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=kn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Ix(n[a]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(yn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);let h=Ax(l);l=jf(l,1,h),c=jf(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Ci(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],h=c.name.match(r);if(h&&h.length>1){let d=h[1],u=s[d];u||(s[d]=u=[]),u.push(c)}}let a=[];for(let o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Rx(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ci;case"vector":case"vector2":case"vector3":case"vector4":return is;case"color":return Ia;case"quaternion":return Ri;case"bool":case"boolean":return Ai;case"string":return Ii}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Ix(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Rx(i.type);if(i.times===void 0){let t=[],n=[];Cx(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}var ii={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(Wf(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!Wf(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Wf(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var El=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],m=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Bp=new El,li=class{constructor(e){this.manager=e!==void 0?e:Bp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};li.DEFAULT_MATERIAL_NAME="__DEFAULT";var wi={},nu=class extends Error{constructor(e,t){super(e),this.response=t}},wr=class extends li{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=ii.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(wi[e]!==void 0){wi[e].push({onLoad:t,onProgress:n,onError:s});return}wi[e]=[],wi[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ie("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=wi[e],d=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=u?parseInt(u):0,m=f!==0,v=0,g=new ReadableStream({start(p){x();function x(){d.read().then(({done:_,value:y})=>{if(_)p.close();else{v+=y.byteLength;let E=new ProgressEvent("progress",{lengthComputable:m,loaded:v,total:f});for(let A=0,R=h.length;A<R;A++){let b=h[A];b.onProgress&&b.onProgress(E)}p.enqueue(y),x()}},_=>{p.error(_)})}}});return new Response(g)}else throw new nu(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{ii.add(`file:${e}`,c);let h=wi[e];delete wi[e];for(let d=0,u=h.length;d<u;d++){let f=h[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=wi[e];if(h===void 0)throw this.manager.itemError(e),c;delete wi[e];for(let d=0,u=h.length;d<u;d++){let f=h[d];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var nr=new WeakMap,Al=class extends li{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=ii.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let d=nr.get(a);d===void 0&&(d=[],nr.set(a,d)),d.push({onLoad:t,onError:s})}return a}let o=cr("img");function l(){h(),t&&t(this);let d=nr.get(this)||[];for(let u=0;u<d.length;u++){let f=d[u];f.onLoad&&f.onLoad(this)}nr.delete(this),r.manager.itemEnd(e)}function c(d){h(),s&&s(d),ii.remove(`image:${e}`);let u=nr.get(this)||[];for(let f=0;f<u.length;f++){let m=u[f];m.onError&&m.onError(d)}nr.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ii.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}};var Na=class extends li{constructor(e){super(e)}load(e,t,n,s){let r=new Yt,a=new Al(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},ss=class extends It{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new fe(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},La=class extends ss{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.groundColor=new fe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},jh=new Ae,qf=new L,Xf=new L,Da=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.mapType=bn,this.map=null,this.mapPass=null,this.matrix=new Ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xr,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;qf.setFromMatrixPosition(e.matrixWorld),t.position.copy(qf),Xf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xf),t.updateMatrixWorld(),jh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jh,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===lr||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(jh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Yo=new L,Ko=new Ct,ni=new L,Fa=class extends It{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ae,this.projectionMatrix=new Ae,this.projectionMatrixInverse=new Ae,this.coordinateSystem=Wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Yo,Ko,ni),ni.x===1&&ni.y===1&&ni.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Yo,Ko,ni.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Yo,Ko,ni),ni.x===1&&ni.y===1&&ni.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Yo,Ko,ni.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Yi=new L,Yf=new he,Kf=new he,zt=class extends Fa{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=As*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(sa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return As*2*Math.atan(Math.tan(sa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Yi.x,Yi.y).multiplyScalar(-e/Yi.z),Yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Yi.x,Yi.y).multiplyScalar(-e/Yi.z)}getViewSize(e,t){return this.getViewBounds(e,Yf,Kf),t.subVectors(Kf,Yf)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(sa*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},iu=class extends Da{constructor(){super(new zt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=As*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},ka=class extends ss{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new iu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},su=class extends Da{constructor(){super(new zt(90,1,.5,500)),this.isPointLightShadow=!0}},Oa=class extends ss{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new su}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},On=class extends Fa{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ru=class extends Da{constructor(){super(new On(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ci=class extends ss{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.shadow=new ru}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Tr=class extends ss{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Pi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Wh=new WeakMap,Ua=class extends li{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ie("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ie("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=ii.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{Wh.has(a)===!0?(s&&s(Wh.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){ii.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e)}).catch(function(c){s&&s(c),Wh.set(l,c),ii.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ii.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var ir=-90,sr=1,Cl=class extends It{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new zt(ir,sr,e,t);s.layers=this.layers,this.add(s);let r=new zt(ir,sr,e,t);r.layers=this.layers,this.add(r);let a=new zt(ir,sr,e,t);a.layers=this.layers,this.add(a);let o=new zt(ir,sr,e,t);o.layers=this.layers,this.add(o);let l=new zt(ir,sr,e,t);l.layers=this.layers,this.add(l);let c=new zt(ir,sr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===lr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Rl=class extends zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ba=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Px.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Px(){this._document.hidden===!1&&this.reset()}var wu="\\[\\]\\.:\\/",Nx=new RegExp("["+wu+"]","g"),Tu="[^"+wu+"]",Lx="[^"+wu.replace("\\.","")+"]",Dx=/((?:WC+[\/:])*)/.source.replace("WC",Tu),Fx=/(WCOD+)?/.source.replace("WCOD",Lx),kx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Tu),Ox=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Tu),Ux=new RegExp("^"+Dx+Fx+kx+Ox+"$"),Bx=["material","materials","bones","map"],au=class{constructor(e,t,n){let s=n||mt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},mt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Nx,"")}static parseTrackName(e){let t=Ux.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Bx.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ie("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ue("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ue("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ue("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ue("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ue("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Ue("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};mt.Composite=au;mt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};mt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};mt.prototype.GetterByBindingType=[mt.prototype._getValue_direct,mt.prototype._getValue_array,mt.prototype._getValue_arrayElement,mt.prototype._getValue_toArray];mt.prototype.SetterByBindingTypeAndVersioning=[[mt.prototype._setValue_direct,mt.prototype._setValue_direct_setNeedsUpdate,mt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_array,mt.prototype._setValue_array_setNeedsUpdate,mt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_arrayElement,mt.prototype._setValue_arrayElement_setNeedsUpdate,mt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_fromArray,mt.prototype._setValue_fromArray_setNeedsUpdate,mt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var oT=new Float32Array(1);var Jf=new Ae,za=class{constructor(e,t,n=0,s=1/0){this.ray=new Zi(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new dr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ue("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Jf.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Jf),this}intersectObject(e,t=!0,n=[]){return ou(e,this,n,t),n.sort(Zf),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)ou(e[s],this,n,t);return n.sort(Zf),n}};function Zf(i,e){return i.distance-e.distance}function ou(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)ou(r[a],e,t,!0)}}var lu=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};function Eu(i,e,t,n){let s=zx(n);switch(t){case vu:return i*e;case Ul:return i*e/s.components*s.byteLength;case Bl:return i*e/s.components*s.byteLength;case os:return i*e*2/s.components*s.byteLength;case zl:return i*e*2/s.components*s.byteLength;case xu:return i*e*3/s.components*s.byteLength;case Cn:return i*e*4/s.components*s.byteLength;case Hl:return i*e*4/s.components*s.byteLength;case Ka:case Ja:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Za:case $a:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Gl:case Wl:return Math.max(i,16)*Math.max(e,8)/4;case Vl:case jl:return Math.max(i,8)*Math.max(e,8)/2;case ql:case Xl:case Kl:case Jl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Yl:case Qa:case Zl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case $l:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ql:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ec:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case tc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case nc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ic:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case sc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case rc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ac:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case oc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case lc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case cc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case hc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case uc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case dc:case fc:case pc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case mc:case gc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case eo:case vc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function zx(i){switch(i){case bn:case fu:return{byteLength:1,components:1};case Cr:case pu:case Qt:return{byteLength:2,components:1};case kl:case Ol:return{byteLength:2,components:4};case Jn:case Fl:case An:return{byteLength:4,components:1};case mu:case gu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"185"}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="185");function lm(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Vx(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,m)=>f.start-m.start);let u=0;for(let f=1;f<d.length;f++){let m=d[u],v=d[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++u,d[u]=v)}d.length=u+1;for(let f=0,m=d.length;f<m;f++){let v=d[f];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Gx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,jx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Wx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,qx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Kx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Jx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Zx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,$x=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ey=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ty=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ny=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,iy=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,sy=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ry=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ay=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,oy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ly=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,cy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,hy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,uy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,dy=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,fy=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,py=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,my=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,xy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yy="gl_FragColor = linearToOutputTexel( gl_FragColor );",by=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_y=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Sy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,My=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ty=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ey=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ay=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ry=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Iy=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Py=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ny=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ly=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Dy=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Fy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,ky=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Oy=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Uy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,By=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hy=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Vy=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Gy=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,jy=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wy=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,qy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ky=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$y=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Qy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,e0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,t0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,n0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,i0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,s0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,r0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,a0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,o0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,l0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,c0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,h0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,u0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,d0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,f0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,p0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,m0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,g0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,v0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,x0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,y0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,b0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,S0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,M0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,w0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,T0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,E0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,A0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,C0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,R0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,I0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,P0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,N0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,L0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,D0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,F0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,k0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,O0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,U0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,B0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,H0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,V0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,G0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,j0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,W0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,q0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Y0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,J0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Z0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Q0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,eb=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tb=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nb=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ib=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,sb=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rb=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ab=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ob=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,lb=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,hb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ub=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,db=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fb=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,pb=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mb=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gb=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yb=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bb=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_b=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,We={alphahash_fragment:Gx,alphahash_pars_fragment:jx,alphamap_fragment:Wx,alphamap_pars_fragment:qx,alphatest_fragment:Xx,alphatest_pars_fragment:Yx,aomap_fragment:Kx,aomap_pars_fragment:Jx,batching_pars_vertex:Zx,batching_vertex:$x,begin_vertex:Qx,beginnormal_vertex:ey,bsdfs:ty,iridescence_fragment:ny,bumpmap_pars_fragment:iy,clipping_planes_fragment:sy,clipping_planes_pars_fragment:ry,clipping_planes_pars_vertex:ay,clipping_planes_vertex:oy,color_fragment:ly,color_pars_fragment:cy,color_pars_vertex:hy,color_vertex:uy,common:dy,cube_uv_reflection_fragment:fy,defaultnormal_vertex:py,displacementmap_pars_vertex:my,displacementmap_vertex:gy,emissivemap_fragment:vy,emissivemap_pars_fragment:xy,colorspace_fragment:yy,colorspace_pars_fragment:by,envmap_fragment:_y,envmap_common_pars_fragment:Sy,envmap_pars_fragment:My,envmap_pars_vertex:wy,envmap_physical_pars_fragment:Fy,envmap_vertex:Ty,fog_vertex:Ey,fog_pars_vertex:Ay,fog_fragment:Cy,fog_pars_fragment:Ry,gradientmap_pars_fragment:Iy,lightmap_pars_fragment:Py,lights_lambert_fragment:Ny,lights_lambert_pars_fragment:Ly,lights_pars_begin:Dy,lights_toon_fragment:ky,lights_toon_pars_fragment:Oy,lights_phong_fragment:Uy,lights_phong_pars_fragment:By,lights_physical_fragment:zy,lights_physical_pars_fragment:Hy,lights_fragment_begin:Vy,lights_fragment_maps:Gy,lights_fragment_end:jy,lightprobes_pars_fragment:Wy,logdepthbuf_fragment:qy,logdepthbuf_pars_fragment:Xy,logdepthbuf_pars_vertex:Yy,logdepthbuf_vertex:Ky,map_fragment:Jy,map_pars_fragment:Zy,map_particle_fragment:$y,map_particle_pars_fragment:Qy,metalnessmap_fragment:e0,metalnessmap_pars_fragment:t0,morphinstance_vertex:n0,morphcolor_vertex:i0,morphnormal_vertex:s0,morphtarget_pars_vertex:r0,morphtarget_vertex:a0,normal_fragment_begin:o0,normal_fragment_maps:l0,normal_pars_fragment:c0,normal_pars_vertex:h0,normal_vertex:u0,normalmap_pars_fragment:d0,clearcoat_normal_fragment_begin:f0,clearcoat_normal_fragment_maps:p0,clearcoat_pars_fragment:m0,iridescence_pars_fragment:g0,opaque_fragment:v0,packing:x0,premultiplied_alpha_fragment:y0,project_vertex:b0,dithering_fragment:_0,dithering_pars_fragment:S0,roughnessmap_fragment:M0,roughnessmap_pars_fragment:w0,shadowmap_pars_fragment:T0,shadowmap_pars_vertex:E0,shadowmap_vertex:A0,shadowmask_pars_fragment:C0,skinbase_vertex:R0,skinning_pars_vertex:I0,skinning_vertex:P0,skinnormal_vertex:N0,specularmap_fragment:L0,specularmap_pars_fragment:D0,tonemapping_fragment:F0,tonemapping_pars_fragment:k0,transmission_fragment:O0,transmission_pars_fragment:U0,uv_pars_fragment:B0,uv_pars_vertex:z0,uv_vertex:H0,worldpos_vertex:V0,background_vert:G0,background_frag:j0,backgroundCube_vert:W0,backgroundCube_frag:q0,cube_vert:X0,cube_frag:Y0,depth_vert:K0,depth_frag:J0,distance_vert:Z0,distance_frag:$0,equirect_vert:Q0,equirect_frag:eb,linedashed_vert:tb,linedashed_frag:nb,meshbasic_vert:ib,meshbasic_frag:sb,meshlambert_vert:rb,meshlambert_frag:ab,meshmatcap_vert:ob,meshmatcap_frag:lb,meshnormal_vert:cb,meshnormal_frag:hb,meshphong_vert:ub,meshphong_frag:db,meshphysical_vert:fb,meshphysical_frag:pb,meshtoon_vert:mb,meshtoon_frag:gb,points_vert:vb,points_frag:xb,shadow_vert:yb,shadow_frag:bb,sprite_vert:_b,sprite_frag:Sb},be={common:{diffuse:{value:new fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new fe(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},ui={basic:{uniforms:cn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:cn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new fe(0)},envMapIntensity:{value:1}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:cn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new fe(0)},specular:{value:new fe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:cn([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:cn([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new fe(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:cn([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:cn([be.points,be.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:cn([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:cn([be.common,be.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:cn([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:cn([be.sprite,be.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distance:{uniforms:cn([be.common,be.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distance_vert,fragmentShader:We.distance_frag},shadow:{uniforms:cn([be.lights,be.fog,{color:{value:new fe(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};ui.physical={uniforms:cn([ui.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new fe(0)},specularColor:{value:new fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};var bc={r:0,b:0,g:0},Mb=new Ae,cm=new Ve;cm.set(-1,0,0,0,1,0,0,0,1);function wb(i,e,t,n,s,r){let a=new fe(0),o=s===!0?0:1,l,c,h=null,d=0,u=null;function f(x){let _=x.isScene===!0?x.background:null;if(_&&_.isTexture){let y=x.backgroundBlurriness>0;_=e.get(_,y)}return _}function m(x){let _=!1,y=f(x);y===null?g(a,o):y&&y.isColor&&(g(y,1),_=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||_)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(x,_){let y=f(_);y&&(y.isCubeTexture||y.mapping===Ya)?(c===void 0&&(c=new Ze(new es(1,1,1),new at({name:"BackgroundCubeMaterial",uniforms:Us(ui.backgroundCube.uniforms),vertexShader:ui.backgroundCube.vertexShader,fragmentShader:ui.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Mb.makeRotationFromEuler(_.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(cm),c.material.toneMapped=je.getTransfer(y.colorSpace)!==it,(h!==y||d!==y.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Ze(new ln(2,2),new at({name:"BackgroundMaterial",uniforms:Us(ui.background.uniforms),vertexShader:ui.background.vertexShader,fragmentShader:ui.background.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=je.getTransfer(y.colorSpace)!==it,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function g(x,_){x.getRGB(bc,Mu(i)),t.buffers.color.setClear(bc.r,bc.g,bc.b,_,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,_=1){a.set(x),o=_,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,g(a,o)},render:m,addToRenderList:v,dispose:p}}function Tb(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,a=!1;function o(N,F,k,U,z){let q=!1,Z=d(N,U,k,F);r!==Z&&(r=Z,c(r.object)),q=f(N,U,k,z),q&&m(N,U,k,z),z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,y(N,F,k,U),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function l(){return i.createVertexArray()}function c(N){return i.bindVertexArray(N)}function h(N){return i.deleteVertexArray(N)}function d(N,F,k,U){let z=U.wireframe===!0,q=n[F.id];q===void 0&&(q={},n[F.id]=q);let Z=N.isInstancedMesh===!0?N.id:0,D=q[Z];D===void 0&&(D={},q[Z]=D);let H=D[k.id];H===void 0&&(H={},D[k.id]=H);let ee=H[z];return ee===void 0&&(ee=u(l()),H[z]=ee),ee}function u(N){let F=[],k=[],U=[];for(let z=0;z<t;z++)F[z]=0,k[z]=0,U[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:k,attributeDivisors:U,object:N,attributes:{},index:null}}function f(N,F,k,U){let z=r.attributes,q=F.attributes,Z=0,D=k.getAttributes();for(let H in D)if(D[H].location>=0){let ie=z[H],ce=q[H];if(ce===void 0&&(H==="instanceMatrix"&&N.instanceMatrix&&(ce=N.instanceMatrix),H==="instanceColor"&&N.instanceColor&&(ce=N.instanceColor)),ie===void 0||ie.attribute!==ce||ce&&ie.data!==ce.data)return!0;Z++}return r.attributesNum!==Z||r.index!==U}function m(N,F,k,U){let z={},q=F.attributes,Z=0,D=k.getAttributes();for(let H in D)if(D[H].location>=0){let ie=q[H];ie===void 0&&(H==="instanceMatrix"&&N.instanceMatrix&&(ie=N.instanceMatrix),H==="instanceColor"&&N.instanceColor&&(ie=N.instanceColor));let ce={};ce.attribute=ie,ie&&ie.data&&(ce.data=ie.data),z[H]=ce,Z++}r.attributes=z,r.attributesNum=Z,r.index=U}function v(){let N=r.newAttributes;for(let F=0,k=N.length;F<k;F++)N[F]=0}function g(N){p(N,0)}function p(N,F){let k=r.newAttributes,U=r.enabledAttributes,z=r.attributeDivisors;k[N]=1,U[N]===0&&(i.enableVertexAttribArray(N),U[N]=1),z[N]!==F&&(i.vertexAttribDivisor(N,F),z[N]=F)}function x(){let N=r.newAttributes,F=r.enabledAttributes;for(let k=0,U=F.length;k<U;k++)F[k]!==N[k]&&(i.disableVertexAttribArray(k),F[k]=0)}function _(N,F,k,U,z,q,Z){Z===!0?i.vertexAttribIPointer(N,F,k,z,q):i.vertexAttribPointer(N,F,k,U,z,q)}function y(N,F,k,U){v();let z=U.attributes,q=k.getAttributes(),Z=F.defaultAttributeValues;for(let D in q){let H=q[D];if(H.location>=0){let ee=z[D];if(ee===void 0&&(D==="instanceMatrix"&&N.instanceMatrix&&(ee=N.instanceMatrix),D==="instanceColor"&&N.instanceColor&&(ee=N.instanceColor)),ee!==void 0){let ie=ee.normalized,ce=ee.itemSize,Ne=e.get(ee);if(Ne===void 0)continue;let Be=Ne.buffer,He=Ne.type,C=Ne.bytesPerElement,X=He===i.INT||He===i.UNSIGNED_INT||ee.gpuType===Fl;if(ee.isInterleavedBufferAttribute){let O=ee.data,Q=O.stride,ye=ee.offset;if(O.isInstancedInterleavedBuffer){for(let xe=0;xe<H.locationSize;xe++)p(H.location+xe,O.meshPerAttribute);N.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let xe=0;xe<H.locationSize;xe++)g(H.location+xe);i.bindBuffer(i.ARRAY_BUFFER,Be);for(let xe=0;xe<H.locationSize;xe++)_(H.location+xe,ce/H.locationSize,He,ie,Q*C,(ye+ce/H.locationSize*xe)*C,X)}else{if(ee.isInstancedBufferAttribute){for(let O=0;O<H.locationSize;O++)p(H.location+O,ee.meshPerAttribute);N.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let O=0;O<H.locationSize;O++)g(H.location+O);i.bindBuffer(i.ARRAY_BUFFER,Be);for(let O=0;O<H.locationSize;O++)_(H.location+O,ce/H.locationSize,He,ie,ce*C,ce/H.locationSize*O*C,X)}}else if(Z!==void 0){let ie=Z[D];if(ie!==void 0)switch(ie.length){case 2:i.vertexAttrib2fv(H.location,ie);break;case 3:i.vertexAttrib3fv(H.location,ie);break;case 4:i.vertexAttrib4fv(H.location,ie);break;default:i.vertexAttrib1fv(H.location,ie)}}}}x()}function E(){w();for(let N in n){let F=n[N];for(let k in F){let U=F[k];for(let z in U){let q=U[z];for(let Z in q)h(q[Z].object),delete q[Z];delete U[z]}}delete n[N]}}function A(N){if(n[N.id]===void 0)return;let F=n[N.id];for(let k in F){let U=F[k];for(let z in U){let q=U[z];for(let Z in q)h(q[Z].object),delete q[Z];delete U[z]}}delete n[N.id]}function R(N){for(let F in n){let k=n[F];for(let U in k){let z=k[U];if(z[N.id]===void 0)continue;let q=z[N.id];for(let Z in q)h(q[Z].object),delete q[Z];delete z[N.id]}}}function b(N){for(let F in n){let k=n[F],U=N.isInstancedMesh===!0?N.id:0,z=k[U];if(z!==void 0){for(let q in z){let Z=z[q];for(let D in Z)h(Z[D].object),delete Z[D];delete z[q]}delete k[U],Object.keys(k).length===0&&delete n[F]}}}function w(){I(),a=!0,r!==s&&(r=s,c(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:I,dispose:E,releaseStatesOfGeometry:A,releaseStatesOfObject:b,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:g,disableUnusedAttributes:x}}function Eb(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Ab(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==Cn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){let b=R===Qt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==bn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==An&&!b)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Ie("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ie("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=i.getParameter(i.MAX_SAMPLES),A=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:y,maxSamples:E,samples:A}}function Cb(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Dn,o=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){let m=d.clippingPlanes,v=d.clipIntersection,g=d.clipShadows,p=i.get(d);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{let x=r?0:n,_=x*4,y=p.clippingState||null;l.value=y,y=h(m,u,_,f);for(let E=0;E!==_;++E)y[E]=t[E];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,m){let v=d!==null?d.length:0,g=null;if(v!==0){if(g=l.value,m!==!0||g===null){let p=f+v*4,x=u.matrixWorldInverse;o.getNormalMatrix(x),(g===null||g.length<p)&&(g=new Float32Array(p));for(let _=0,y=f;_!==v;++_,y+=4)a.copy(d[_]).applyMatrix4(x,o),a.normal.toArray(g,y),g[y+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}var ls=4,zp=[.125,.215,.35,.446,.526,.582],Bs=20,Rb=256,io=new On,Hp=new fe,Au=null,Cu=0,Ru=0,Iu=!1,Ib=new L,zs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=Ib}=r;Au=this._renderer.getRenderTarget(),Cu=this._renderer.getActiveCubeFace(),Ru=this._renderer.getActiveMipmapLevel(),Iu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Au,Cu,Ru),this._renderer.xr.enabled=Iu,e.scissorTest=!1,Nr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===rs||e.mapping===Fs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Au=this._renderer.getRenderTarget(),Cu=this._renderer.getActiveCubeFace(),Ru=this._renderer.getActiveMipmapLevel(),Iu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:At,minFilter:At,generateMipmaps:!1,type:Qt,format:Cn,colorSpace:dn,depthBuffer:!1},s=Vp(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vp(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Pb(r)),this._blurMaterial=Lb(r,e,t),this._ggxMaterial=Nb(r,e,t)}return s}_compileMaterial(e){let t=new Ze(new gt,e);this._renderer.compile(t,io)}_sceneToCubeUV(e,t,n,s,r){let l=new zt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Hp),d.toneMapping=Yn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ze(new es,new bt({name:"PMREM.Background",side:qt,depthWrite:!1,depthTest:!1})));let v=this._backgroundBox,g=v.material,p=!1,x=e.background;x?x.isColor&&(g.color.copy(x),e.background=null,p=!0):(g.color.copy(Hp),p=!0);for(let _=0;_<6;_++){let y=_%3;y===0?(l.up.set(0,c[_],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[_],r.y,r.z)):y===1?(l.up.set(0,0,c[_]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[_],r.z)):(l.up.set(0,c[_],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[_]));let E=this._cubeSize;Nr(s,y*E,_>2?E:0,E,E),d.setRenderTarget(s),p&&d.render(v,l),d.render(e,l)}d.toneMapping=f,d.autoClear=u,e.background=x}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===rs||e.mapping===Fs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=jp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Gp());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Nr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,io)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=0+c*1.25,f=d*u,{_lodMax:m}=this,v=this._sizeLods[n],g=3*v*(n>m-ls?n-m+ls:0),p=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=m-t,Nr(r,g,p,3*v,2*v),s.setRenderTarget(r),s.render(o,io),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,Nr(e,g,p,3*v,2*v),s.setRenderTarget(e),s.render(o,io)}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ue("blur direction must be either latitudinal or longitudinal!");let h=3,d=this._lodMeshes[s];d.material=c;let u=c.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Bs-1),v=r/m,g=isFinite(r)?1+Math.floor(h*v):Bs;g>Bs&&Ie(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Bs}`);let p=[],x=0;for(let R=0;R<Bs;++R){let b=R/v,w=Math.exp(-b*b/2);p.push(w),R===0?x+=w:R<g&&(x+=2*w)}for(let R=0;R<p.length;R++)p[R]=p[R]/x;u.envMap.value=e.texture,u.samples.value=g,u.weights.value=p,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=m,u.mipInt.value=_-n;let y=this._sizeLods[s],E=3*y*(s>_-ls?s-_+ls:0),A=4*(this._cubeSize-y);Nr(t,E,A,3*y,2*y),l.setRenderTarget(t),l.render(d,io)}};function Pb(i){let e=[],t=[],n=[],s=i,r=i-ls+1+zp.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>i-ls?l=zp[a-i+ls-1]:a===0&&(l=0),t.push(l);let c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,m=6,v=3,g=2,p=1,x=new Float32Array(v*m*f),_=new Float32Array(g*m*f),y=new Float32Array(p*m*f);for(let A=0;A<f;A++){let R=A%3*2/3-1,b=A>2?0:-1,w=[R,b,0,R+2/3,b,0,R+2/3,b+1,0,R,b,0,R+2/3,b+1,0,R,b+1,0];x.set(w,v*m*A),_.set(u,g*m*A);let I=[A,A,A,A,A,A];y.set(I,p*m*A)}let E=new gt;E.setAttribute("position",new dt(x,v)),E.setAttribute("uv",new dt(_,g)),E.setAttribute("faceIndex",new dt(y,p)),n.push(new Ze(E,null)),s>ls&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Vp(i,e,t){let n=new Rt(i,e,t);return n.texture.mapping=Ya,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Nr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Nb(i,e,t){return new at({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Rb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Mc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Lb(i,e,t){let n=new Float32Array(Bs),s=new L(0,1,0);return new at({name:"SphericalGaussianBlur",defines:{n:Bs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Gp(){return new at({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function jp(){return new at({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Mc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Sc=class extends Rt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new va(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new es(5,5,5),r=new at({name:"CubemapFromEquirect",uniforms:Us(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qt,blending:Un});r.uniforms.tEquirect.value=t;let a=new Ze(s,r),o=t.minFilter;return t.minFilter===Kn&&(t.minFilter=At),new Cl(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function Db(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===Nl||f===Ll)if(e.has(u)){let m=e.get(u).texture;return o(m,u.mapping)}else{let m=u.image;if(m&&m.height>0){let v=new Sc(m.height);return v.fromEquirectangularTexture(i,u),e.set(u,v),u.addEventListener("dispose",c),o(v.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let f=u.mapping,m=f===Nl||f===Ll,v=f===rs||f===Fs;if(m||v){let g=t.get(u),p=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new zs(i)),g=m?n.fromEquirectangular(u,g):n.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,t.set(u,g),g.texture;if(g!==void 0)return g.texture;{let x=u.image;return m&&x&&x.height>0||v&&x&&l(x)?(n===null&&(n=new zs(i)),g=m?n.fromEquirectangular(u):n.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,t.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function o(u,f){return f===Nl?u.mapping=rs:f===Ll&&(u.mapping=Fs),u}function l(u){let f=0,m=6;for(let v=0;v<m;v++)u[v]!==void 0&&f++;return f===m}function c(u){let f=u.target;f.removeEventListener("dispose",c);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function Fb(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Ss("WebGLRenderer: "+n+" extension not supported."),s}}}function kb(i,e,t,n){let s={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let m in u.attributes)e.remove(u.attributes[m]);u.removeEventListener("dispose",a),delete s[u.id];let f=r.get(u);f&&(e.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function l(d){let u=d.attributes;for(let f in u)e.update(u[f],i.ARRAY_BUFFER)}function c(d){let u=[],f=d.index,m=d.attributes.position,v=0;if(m===void 0)return;if(f!==null){let x=f.array;v=f.version;for(let _=0,y=x.length;_<y;_+=3){let E=x[_+0],A=x[_+1],R=x[_+2];u.push(E,A,A,R,R,E)}}else{let x=m.array;v=m.version;for(let _=0,y=x.length/3-1;_<y;_+=3){let E=_+0,A=_+1,R=_+2;u.push(E,A,A,R,R,E)}}let g=new(m.count>=65535?da:ua)(u,1);g.version=v;let p=r.get(d);p&&e.remove(p),r.set(d,g)}function h(d){let u=r.get(d);if(u){let f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Ob(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),t.update(u,n,1)}function c(d,u,f){f!==0&&(i.drawElementsInstanced(n,u,r,d*a,f),t.update(u,n,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let v=0;for(let g=0;g<f;g++)v+=u[g];t.update(v,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Ub(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Ue("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Bb(i,e,t){let n=new WeakMap,s=new ct;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let w=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",w)};u!==void 0&&u.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],x=o.morphAttributes.color||[],_=0;f===!0&&(_=1),m===!0&&(_=2),v===!0&&(_=3);let y=o.attributes.position.count*_,E=1;y>e.maxTextureSize&&(E=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let A=new Float32Array(y*E*4*d),R=new ha(A,y,E,d);R.type=An,R.needsUpdate=!0;let b=_*4;for(let I=0;I<d;I++){let N=g[I],F=p[I],k=x[I],U=y*E*4*I;for(let z=0;z<N.count;z++){let q=z*b;f===!0&&(s.fromBufferAttribute(N,z),A[U+q+0]=s.x,A[U+q+1]=s.y,A[U+q+2]=s.z,A[U+q+3]=0),m===!0&&(s.fromBufferAttribute(F,z),A[U+q+4]=s.x,A[U+q+5]=s.y,A[U+q+6]=s.z,A[U+q+7]=0),v===!0&&(s.fromBufferAttribute(k,z),A[U+q+8]=s.x,A[U+q+9]=s.y,A[U+q+10]=s.z,A[U+q+11]=k.itemSize===4?s.w:1)}}u={count:d,texture:R,size:new he(y,E)},n.set(o,u),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function zb(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,d=c.geometry,u=e.get(c,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var Hb={[Va]:"LINEAR_TONE_MAPPING",[Ga]:"REINHARD_TONE_MAPPING",[ja]:"CINEON_TONE_MAPPING",[Ds]:"ACES_FILMIC_TONE_MAPPING",[qa]:"AGX_TONE_MAPPING",[Xa]:"NEUTRAL_TONE_MAPPING",[Wa]:"CUSTOM_TONE_MAPPING"};function Vb(i,e,t,n,s,r){let a=new Rt(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new Tn(e,t):void 0}),o=new Rt(e,t,{type:Qt,depthBuffer:!1,stencilBuffer:!1}),l=new gt;l.setAttribute("position",new Je([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Je([0,2,0,0,2,0],2));let c=new Mr({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Ze(l,c),d=new On(-1,1,1,-1,0,1),u=null,f=null,m=!1,v,g=null,p=[],x=!1;this.setSize=function(_,y){a.setSize(_,y),o.setSize(_,y);for(let E=0;E<p.length;E++){let A=p[E];A.setSize&&A.setSize(_,y)}},this.setEffects=function(_){p=_,x=p.length>0&&p[0].isRenderPass===!0;let y=a.width,E=a.height;for(let A=0;A<p.length;A++){let R=p[A];R.setSize&&R.setSize(y,E)}},this.begin=function(_,y){if(m||_.toneMapping===Yn&&p.length===0)return!1;if(g=y,y!==null){let E=y.width,A=y.height;(a.width!==E||a.height!==A)&&this.setSize(E,A)}return x===!1&&_.setRenderTarget(a),v=_.toneMapping,_.toneMapping=Yn,!0},this.hasRenderPass=function(){return x},this.end=function(_,y){_.toneMapping=v,m=!0;let E=a,A=o;for(let R=0;R<p.length;R++){let b=p[R];if(b.enabled!==!1&&(b.render(_,A,E,y),b.needsSwap!==!1)){let w=E;E=A,A=w}}if(u!==_.outputColorSpace||f!==_.toneMapping){u=_.outputColorSpace,f=_.toneMapping,c.defines={},je.getTransfer(u)===it&&(c.defines.SRGB_TRANSFER="");let R=Hb[f];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=E.texture,_.setRenderTarget(g),_.render(h,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}var hm=new Yt,Lu=new Tn(1,1),um=new ha,dm=new ll,fm=new va,Wp=[],qp=[],Xp=new Float32Array(16),Yp=new Float32Array(9),Kp=new Float32Array(4);function Dr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Wp[s];if(r===void 0&&(r=new Float32Array(s),Wp[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Kt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Jt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function wc(i,e){let t=qp[e];t===void 0&&(t=new Int32Array(e),qp[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Gb(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function jb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2fv(this.addr,e),Jt(t,e)}}function Wb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Kt(t,e))return;i.uniform3fv(this.addr,e),Jt(t,e)}}function qb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4fv(this.addr,e),Jt(t,e)}}function Xb(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Jt(t,e)}else{if(Kt(t,n))return;Kp.set(n),i.uniformMatrix2fv(this.addr,!1,Kp),Jt(t,n)}}function Yb(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Jt(t,e)}else{if(Kt(t,n))return;Yp.set(n),i.uniformMatrix3fv(this.addr,!1,Yp),Jt(t,n)}}function Kb(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Kt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Jt(t,e)}else{if(Kt(t,n))return;Xp.set(n),i.uniformMatrix4fv(this.addr,!1,Xp),Jt(t,n)}}function Jb(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Zb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2iv(this.addr,e),Jt(t,e)}}function $b(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Kt(t,e))return;i.uniform3iv(this.addr,e),Jt(t,e)}}function Qb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4iv(this.addr,e),Jt(t,e)}}function e_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function t_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Kt(t,e))return;i.uniform2uiv(this.addr,e),Jt(t,e)}}function n_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Kt(t,e))return;i.uniform3uiv(this.addr,e),Jt(t,e)}}function i_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Kt(t,e))return;i.uniform4uiv(this.addr,e),Jt(t,e)}}function s_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Lu.compareFunction=t.isReversedDepthBuffer()?yc:xc,r=Lu):r=hm,t.setTexture2D(e||r,s)}function r_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||dm,s)}function a_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||fm,s)}function o_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||um,s)}function l_(i){switch(i){case 5126:return Gb;case 35664:return jb;case 35665:return Wb;case 35666:return qb;case 35674:return Xb;case 35675:return Yb;case 35676:return Kb;case 5124:case 35670:return Jb;case 35667:case 35671:return Zb;case 35668:case 35672:return $b;case 35669:case 35673:return Qb;case 5125:return e_;case 36294:return t_;case 36295:return n_;case 36296:return i_;case 35678:case 36198:case 36298:case 36306:case 35682:return s_;case 35679:case 36299:case 36307:return r_;case 35680:case 36300:case 36308:case 36293:return a_;case 36289:case 36303:case 36311:case 36292:return o_}}function c_(i,e){i.uniform1fv(this.addr,e)}function h_(i,e){let t=Dr(e,this.size,2);i.uniform2fv(this.addr,t)}function u_(i,e){let t=Dr(e,this.size,3);i.uniform3fv(this.addr,t)}function d_(i,e){let t=Dr(e,this.size,4);i.uniform4fv(this.addr,t)}function f_(i,e){let t=Dr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function p_(i,e){let t=Dr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function m_(i,e){let t=Dr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function g_(i,e){i.uniform1iv(this.addr,e)}function v_(i,e){i.uniform2iv(this.addr,e)}function x_(i,e){i.uniform3iv(this.addr,e)}function y_(i,e){i.uniform4iv(this.addr,e)}function b_(i,e){i.uniform1uiv(this.addr,e)}function __(i,e){i.uniform2uiv(this.addr,e)}function S_(i,e){i.uniform3uiv(this.addr,e)}function M_(i,e){i.uniform4uiv(this.addr,e)}function w_(i,e,t){let n=this.cache,s=e.length,r=wc(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),Jt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Lu:a=hm;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function T_(i,e,t){let n=this.cache,s=e.length,r=wc(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),Jt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||dm,r[a])}function E_(i,e,t){let n=this.cache,s=e.length,r=wc(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),Jt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||fm,r[a])}function A_(i,e,t){let n=this.cache,s=e.length,r=wc(t,s);Kt(n,r)||(i.uniform1iv(this.addr,r),Jt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||um,r[a])}function C_(i){switch(i){case 5126:return c_;case 35664:return h_;case 35665:return u_;case 35666:return d_;case 35674:return f_;case 35675:return p_;case 35676:return m_;case 5124:case 35670:return g_;case 35667:case 35671:return v_;case 35668:case 35672:return x_;case 35669:case 35673:return y_;case 5125:return b_;case 36294:return __;case 36295:return S_;case 36296:return M_;case 35678:case 36198:case 36298:case 36306:case 35682:return w_;case 35679:case 36299:case 36307:return T_;case 35680:case 36300:case 36308:case 36293:return E_;case 36289:case 36303:case 36311:case 36292:return A_}}var Du=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=l_(t.type)}},Fu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=C_(t.type)}},ku=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Pu=/(\w+)(\])?(\[|\.)?/g;function Jp(i,e){i.seq.push(e),i.map[e.id]=e}function R_(i,e,t){let n=i.name,s=n.length;for(Pu.lastIndex=0;;){let r=Pu.exec(n),a=Pu.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Jp(t,c===void 0?new Du(o,i,e):new Fu(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new ku(o),Jp(t,d)),t=d}}}var Lr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);R_(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Zp(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var I_=37297,P_=0;function N_(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var $p=new Ve;function L_(i){je._getMatrix($p,je.workingColorSpace,i);let e=`mat3( ${$p.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(i)){case la:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Qp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+N_(i.getShaderSource(e),o)}else return r}function D_(i,e){let t=L_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var F_={[Va]:"Linear",[Ga]:"Reinhard",[ja]:"Cineon",[Ds]:"ACESFilmic",[qa]:"AgX",[Xa]:"Neutral",[Wa]:"Custom"};function k_(i,e){let t=F_[e];return t===void 0?(Ie("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var _c=new L;function O_(){je.getLuminanceCoefficients(_c);let i=_c.x.toFixed(4),e=_c.y.toFixed(4),t=_c.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function U_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ro).join(`
`)}function B_(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function z_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ro(i){return i!==""}function em(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function tm(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var H_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ou(i){return i.replace(H_,G_)}var V_=new Map;function G_(i,e){let t=We[e];if(t===void 0){let n=V_.get(e);if(n!==void 0)t=We[n],Ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Ou(t)}var j_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nm(i){return i.replace(j_,W_)}function W_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function im(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var q_={[Ha]:"SHADOWMAP_TYPE_PCF",[Er]:"SHADOWMAP_TYPE_VSM"};function X_(i){return q_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Y_={[rs]:"ENVMAP_TYPE_CUBE",[Fs]:"ENVMAP_TYPE_CUBE",[Ya]:"ENVMAP_TYPE_CUBE_UV"};function K_(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Y_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var J_={[Fs]:"ENVMAP_MODE_REFRACTION"};function Z_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":J_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var $_={[Pl]:"ENVMAP_BLENDING_MULTIPLY",[xp]:"ENVMAP_BLENDING_MIX",[yp]:"ENVMAP_BLENDING_ADD"};function Q_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":$_[i.combine]||"ENVMAP_BLENDING_NONE"}function eS(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function tS(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=X_(t),c=K_(t),h=Z_(t),d=Q_(t),u=eS(t),f=U_(t),m=B_(r),v=s.createProgram(),g,p,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(ro).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(ro).join(`
`),p.length>0&&(p+=`
`)):(g=[im(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ro).join(`
`),p=[im(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Yn?"#define TONE_MAPPING":"",t.toneMapping!==Yn?We.tonemapping_pars_fragment:"",t.toneMapping!==Yn?k_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,D_("linearToOutputTexel",t.outputColorSpace),O_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ro).join(`
`)),a=Ou(a),a=em(a,t),a=tm(a,t),o=Ou(o),o=em(o,t),o=tm(o,t),a=nm(a),o=nm(o),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Pr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Pr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let _=x+g+a,y=x+p+o,E=Zp(s,s.VERTEX_SHADER,_),A=Zp(s,s.FRAGMENT_SHADER,y);s.attachShader(v,E),s.attachShader(v,A),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function R(N){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(v)||"",k=s.getShaderInfoLog(E)||"",U=s.getShaderInfoLog(A)||"",z=F.trim(),q=k.trim(),Z=U.trim(),D=!0,H=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(D=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,E,A);else{let ee=Qp(s,E,"vertex"),ie=Qp(s,A,"fragment");Ue("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+z+`
`+ee+`
`+ie)}else z!==""?Ie("WebGLProgram: Program Info Log:",z):(q===""||Z==="")&&(H=!1);H&&(N.diagnostics={runnable:D,programLog:z,vertexShader:{log:q,prefix:g},fragmentShader:{log:Z,prefix:p}})}s.deleteShader(E),s.deleteShader(A),b=new Lr(s,v),w=z_(s,v)}let b;this.getUniforms=function(){return b===void 0&&R(this),b};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(v,I_)),I},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=P_++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=A,this}var nS=0,Uu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Bu(e),t.set(e,n)),n}},Bu=class{constructor(e){this.id=nS++,this.code=e,this.usedTimes=0}};function iS(i){return i===os||i===Qa||i===eo}function sS(i,e,t,n,s,r){let a=new dr,o=new Uu,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(b){return l.add(b),b===0?"uv":`uv${b}`}function v(b,w,I,N,F,k){let U=N.fog,z=F.geometry,q=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?N.environment:null,Z=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap,D=e.get(b.envMap||q,Z),H=D&&D.mapping===Ya?D.image.height:null,ee=f[b.type];b.precision!==null&&(u=n.getMaxPrecision(b.precision),u!==b.precision&&Ie("WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));let ie=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,ce=ie!==void 0?ie.length:0,Ne=0;z.morphAttributes.position!==void 0&&(Ne=1),z.morphAttributes.normal!==void 0&&(Ne=2),z.morphAttributes.color!==void 0&&(Ne=3);let Be,He,C,X;if(ee){let Ce=ui[ee];Be=Ce.vertexShader,He=Ce.fragmentShader}else{Be=b.vertexShader,He=b.fragmentShader;let Ce=o.getVertexShaderStage(b),Dt=o.getFragmentShaderStage(b);o.update(b,Ce,Dt),C=Ce.id,X=Dt.id}let O=i.getRenderTarget(),Q=i.state.buffers.depth.getReversed(),ye=F.isInstancedMesh===!0,xe=F.isBatchedMesh===!0,Ye=!!b.map,ze=!!b.matcap,et=!!D,$e=!!b.aoMap,Qe=!!b.lightMap,Lt=!!b.bumpMap&&b.wireframe===!1,_t=!!b.normalMap,Ot=!!b.displacementMap,jt=!!b.emissiveMap,vt=!!b.metalnessMap,ht=!!b.roughnessMap,V=b.anisotropy>0,en=b.clearcoat>0,nt=b.dispersion>0,P=b.iridescence>0,S=b.sheen>0,W=b.transmission>0,J=V&&!!b.anisotropyMap,te=en&&!!b.clearcoatMap,me=en&&!!b.clearcoatNormalMap,ge=en&&!!b.clearcoatRoughnessMap,ne=P&&!!b.iridescenceMap,re=P&&!!b.iridescenceThicknessMap,j=S&&!!b.sheenColorMap,oe=S&&!!b.sheenRoughnessMap,ae=!!b.specularMap,ue=!!b.specularColorMap,Ee=!!b.specularIntensityMap,Pe=W&&!!b.transmissionMap,Oe=W&&!!b.thicknessMap,B=!!b.gradientMap,pe=!!b.alphaMap,se=b.alphaTest>0,ve=!!b.alphaHash,Me=!!b.extensions,le=Yn;b.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(le=i.toneMapping);let Le={shaderID:ee,shaderType:b.type,shaderName:b.name,vertexShader:Be,fragmentShader:He,defines:b.defines,customVertexShaderID:C,customFragmentShaderID:X,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:xe,batchingColor:xe&&F._colorsTexture!==null,instancing:ye,instancingColor:ye&&F.instanceColor!==null,instancingMorph:ye&&F.morphTexture!==null,outputColorSpace:O===null?i.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:je.workingColorSpace,alphaToCoverage:!!b.alphaToCoverage,map:Ye,matcap:ze,envMap:et,envMapMode:et&&D.mapping,envMapCubeUVHeight:H,aoMap:$e,lightMap:Qe,bumpMap:Lt,normalMap:_t,displacementMap:Ot,emissiveMap:jt,normalMapObjectSpace:_t&&b.normalMapType===Mp,normalMapTangentSpace:_t&&b.normalMapType===no,packedNormalMap:_t&&b.normalMapType===no&&iS(b.normalMap.format),metalnessMap:vt,roughnessMap:ht,anisotropy:V,anisotropyMap:J,clearcoat:en,clearcoatMap:te,clearcoatNormalMap:me,clearcoatRoughnessMap:ge,dispersion:nt,iridescence:P,iridescenceMap:ne,iridescenceThicknessMap:re,sheen:S,sheenColorMap:j,sheenRoughnessMap:oe,specularMap:ae,specularColorMap:ue,specularIntensityMap:Ee,transmission:W,transmissionMap:Pe,thicknessMap:Oe,gradientMap:B,opaque:b.transparent===!1&&b.blending===Ei&&b.alphaToCoverage===!1,alphaMap:pe,alphaTest:se,alphaHash:ve,combine:b.combine,mapUv:Ye&&m(b.map.channel),aoMapUv:$e&&m(b.aoMap.channel),lightMapUv:Qe&&m(b.lightMap.channel),bumpMapUv:Lt&&m(b.bumpMap.channel),normalMapUv:_t&&m(b.normalMap.channel),displacementMapUv:Ot&&m(b.displacementMap.channel),emissiveMapUv:jt&&m(b.emissiveMap.channel),metalnessMapUv:vt&&m(b.metalnessMap.channel),roughnessMapUv:ht&&m(b.roughnessMap.channel),anisotropyMapUv:J&&m(b.anisotropyMap.channel),clearcoatMapUv:te&&m(b.clearcoatMap.channel),clearcoatNormalMapUv:me&&m(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ge&&m(b.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&m(b.iridescenceMap.channel),iridescenceThicknessMapUv:re&&m(b.iridescenceThicknessMap.channel),sheenColorMapUv:j&&m(b.sheenColorMap.channel),sheenRoughnessMapUv:oe&&m(b.sheenRoughnessMap.channel),specularMapUv:ae&&m(b.specularMap.channel),specularColorMapUv:ue&&m(b.specularColorMap.channel),specularIntensityMapUv:Ee&&m(b.specularIntensityMap.channel),transmissionMapUv:Pe&&m(b.transmissionMap.channel),thicknessMapUv:Oe&&m(b.thicknessMap.channel),alphaMapUv:pe&&m(b.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(_t||V),vertexNormals:!!z.attributes.normal,vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!z.attributes.uv&&(Ye||pe),fog:!!U,useFog:b.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:b.wireframe===!1&&(b.flatShading===!0||z.attributes.normal===void 0&&_t===!1&&(b.isMeshLambertMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isMeshPhysicalMaterial)),sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Q,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:z.attributes.position!==void 0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:Ne,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:le,decodeVideoTexture:Ye&&b.map.isVideoTexture===!0&&je.getTransfer(b.map.colorSpace)===it,decodeVideoTextureEmissive:jt&&b.emissiveMap.isVideoTexture===!0&&je.getTransfer(b.emissiveMap.colorSpace)===it,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===St,flipSided:b.side===qt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Me&&b.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Me&&b.extensions.multiDraw===!0||xe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Le.vertexUv1s=l.has(1),Le.vertexUv2s=l.has(2),Le.vertexUv3s=l.has(3),l.clear(),Le}function g(b){let w=[];if(b.shaderID?w.push(b.shaderID):(w.push(b.customVertexShaderID),w.push(b.customFragmentShaderID)),b.defines!==void 0)for(let I in b.defines)w.push(I),w.push(b.defines[I]);return b.isRawShaderMaterial===!1&&(p(w,b),x(w,b),w.push(i.outputColorSpace)),w.push(b.customProgramCacheKey),w.join()}function p(b,w){b.push(w.precision),b.push(w.outputColorSpace),b.push(w.envMapMode),b.push(w.envMapCubeUVHeight),b.push(w.mapUv),b.push(w.alphaMapUv),b.push(w.lightMapUv),b.push(w.aoMapUv),b.push(w.bumpMapUv),b.push(w.normalMapUv),b.push(w.displacementMapUv),b.push(w.emissiveMapUv),b.push(w.metalnessMapUv),b.push(w.roughnessMapUv),b.push(w.anisotropyMapUv),b.push(w.clearcoatMapUv),b.push(w.clearcoatNormalMapUv),b.push(w.clearcoatRoughnessMapUv),b.push(w.iridescenceMapUv),b.push(w.iridescenceThicknessMapUv),b.push(w.sheenColorMapUv),b.push(w.sheenRoughnessMapUv),b.push(w.specularMapUv),b.push(w.specularColorMapUv),b.push(w.specularIntensityMapUv),b.push(w.transmissionMapUv),b.push(w.thicknessMapUv),b.push(w.combine),b.push(w.fogExp2),b.push(w.sizeAttenuation),b.push(w.morphTargetsCount),b.push(w.morphAttributeCount),b.push(w.numDirLights),b.push(w.numPointLights),b.push(w.numSpotLights),b.push(w.numSpotLightMaps),b.push(w.numHemiLights),b.push(w.numRectAreaLights),b.push(w.numDirLightShadows),b.push(w.numPointLightShadows),b.push(w.numSpotLightShadows),b.push(w.numSpotLightShadowsWithMaps),b.push(w.numLightProbes),b.push(w.shadowMapType),b.push(w.toneMapping),b.push(w.numClippingPlanes),b.push(w.numClipIntersection),b.push(w.depthPacking)}function x(b,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),b.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),b.push(a.mask)}function _(b){let w=f[b.type],I;if(w){let N=ui[w];I=Li.clone(N.uniforms)}else I=b.uniforms;return I}function y(b,w){let I=h.get(w);return I!==void 0?++I.usedTimes:(I=new tS(i,w,b,s),c.push(I),h.set(w,I)),I}function E(b){if(--b.usedTimes===0){let w=c.indexOf(b);c[w]=c[c.length-1],c.pop(),h.delete(b.cacheKey),b.destroy()}}function A(b){o.remove(b)}function R(){o.dispose()}return{getParameters:v,getProgramCacheKey:g,getUniforms:_,acquireProgram:y,releaseProgram:E,releaseShaderCache:A,programs:c,dispose:R}}function rS(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function aS(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function sm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function rm(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,m,v,g,p){let x=i[e];return x===void 0?(x={id:u.id,object:u,geometry:f,material:m,materialVariant:a(u),groupOrder:v,renderOrder:u.renderOrder,z:g,group:p},i[e]=x):(x.id=u.id,x.object=u,x.geometry=f,x.material=m,x.materialVariant=a(u),x.groupOrder=v,x.renderOrder=u.renderOrder,x.z=g,x.group=p),e++,x}function l(u,f,m,v,g,p){let x=o(u,f,m,v,g,p);m.transmission>0?n.push(x):m.transparent===!0?s.push(x):t.push(x)}function c(u,f,m,v,g,p){let x=o(u,f,m,v,g,p);m.transmission>0?n.unshift(x):m.transparent===!0?s.unshift(x):t.unshift(x)}function h(u,f,m){t.length>1&&t.sort(u||aS),n.length>1&&n.sort(f||sm),s.length>1&&s.sort(f||sm),m&&(t.reverse(),n.reverse(),s.reverse())}function d(){for(let u=e,f=i.length;u<f;u++){let m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function oS(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new rm,i.set(n,[a])):s>=r.length?(a=new rm,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function lS(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new fe};break;case"SpotLight":t={position:new L,direction:new L,color:new fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new fe,groundColor:new fe};break;case"RectAreaLight":t={color:new fe,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function cS(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var hS=0;function uS(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function dS(i){let e=new lS,t=cS(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let s=new L,r=new Ae,a=new Ae;function o(c){let h=0,d=0,u=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,x=0,_=0,y=0,E=0,A=0,R=0;c.sort(uS);for(let w=0,I=c.length;w<I;w++){let N=c[w],F=N.color,k=N.intensity,U=N.distance,z=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===os?z=N.shadow.map.texture:z=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)h+=F.r*k,d+=F.g*k,u+=F.b*k;else if(N.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(N.sh.coefficients[q],k);R++}else if(N.isDirectionalLight){let q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let Z=N.shadow,D=t.get(N);D.shadowIntensity=Z.intensity,D.shadowBias=Z.bias,D.shadowNormalBias=Z.normalBias,D.shadowRadius=Z.radius,D.shadowMapSize=Z.mapSize,n.directionalShadow[f]=D,n.directionalShadowMap[f]=z,n.directionalShadowMatrix[f]=N.shadow.matrix,x++}n.directional[f]=q,f++}else if(N.isSpotLight){let q=e.get(N);q.position.setFromMatrixPosition(N.matrixWorld),q.color.copy(F).multiplyScalar(k),q.distance=U,q.coneCos=Math.cos(N.angle),q.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),q.decay=N.decay,n.spot[v]=q;let Z=N.shadow;if(N.map&&(n.spotLightMap[E]=N.map,E++,Z.updateMatrices(N),N.castShadow&&A++),n.spotLightMatrix[v]=Z.matrix,N.castShadow){let D=t.get(N);D.shadowIntensity=Z.intensity,D.shadowBias=Z.bias,D.shadowNormalBias=Z.normalBias,D.shadowRadius=Z.radius,D.shadowMapSize=Z.mapSize,n.spotShadow[v]=D,n.spotShadowMap[v]=z,y++}v++}else if(N.isRectAreaLight){let q=e.get(N);q.color.copy(F).multiplyScalar(k),q.halfWidth.set(N.width*.5,0,0),q.halfHeight.set(0,N.height*.5,0),n.rectArea[g]=q,g++}else if(N.isPointLight){let q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),q.distance=N.distance,q.decay=N.decay,N.castShadow){let Z=N.shadow,D=t.get(N);D.shadowIntensity=Z.intensity,D.shadowBias=Z.bias,D.shadowNormalBias=Z.normalBias,D.shadowRadius=Z.radius,D.shadowMapSize=Z.mapSize,D.shadowCameraNear=Z.camera.near,D.shadowCameraFar=Z.camera.far,n.pointShadow[m]=D,n.pointShadowMap[m]=z,n.pointShadowMatrix[m]=N.shadow.matrix,_++}n.point[m]=q,m++}else if(N.isHemisphereLight){let q=e.get(N);q.skyColor.copy(N.color).multiplyScalar(k),q.groundColor.copy(N.groundColor).multiplyScalar(k),n.hemi[p]=q,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=be.LTC_FLOAT_1,n.rectAreaLTC2=be.LTC_FLOAT_2):(n.rectAreaLTC1=be.LTC_HALF_1,n.rectAreaLTC2=be.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let b=n.hash;(b.directionalLength!==f||b.pointLength!==m||b.spotLength!==v||b.rectAreaLength!==g||b.hemiLength!==p||b.numDirectionalShadows!==x||b.numPointShadows!==_||b.numSpotShadows!==y||b.numSpotMaps!==E||b.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=y+E-A,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,b.directionalLength=f,b.pointLength=m,b.spotLength=v,b.rectAreaLength=g,b.hemiLength=p,b.numDirectionalShadows=x,b.numPointShadows=_,b.numSpotShadows=y,b.numSpotMaps=E,b.numLightProbes=R,n.version=hS++)}function l(c,h){let d=0,u=0,f=0,m=0,v=0,g=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){let _=c[p];if(_.isDirectionalLight){let y=n.directional[d];y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),d++}else if(_.isSpotLight){let y=n.spot[f];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(_.isRectAreaLight){let y=n.rectArea[m];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(g),a.identity(),r.copy(_.matrixWorld),r.premultiply(g),a.extractRotation(r),y.halfWidth.set(_.width*.5,0,0),y.halfHeight.set(0,_.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),m++}else if(_.isPointLight){let y=n.point[u];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(g),u++}else if(_.isHemisphereLight){let y=n.hemi[v];y.direction.setFromMatrixPosition(_.matrixWorld),y.direction.transformDirection(g),v++}}}return{setup:o,setupView:l,state:n}}function am(i){let e=new dS(i),t=[],n=[],s=[];function r(u){d.camera=u,t.length=0,n.length=0,s.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){e.setup(t)}function h(u){e.setupView(t,u)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function fS(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new am(i),e.set(s,[o])):r>=a.length?(o=new am(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var pS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,mS=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,gS=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],vS=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],om=new Ae,so=new L,Nu=new L;function xS(i,e,t){let n=new xr,s=new he,r=new he,a=new ct,o=new yl,l=new bl,c={},h=t.maxTextureSize,d={[an]:qt,[qt]:an,[St]:St},u=new at({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:pS,fragmentShader:mS}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let m=new gt;m.setAttribute("position",new dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Ze(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ha;let p=this.type;this.render=function(A,R,b){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;this.type===Il&&(Ie("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Ha);let w=i.getRenderTarget(),I=i.getActiveCubeFace(),N=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Un),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let k=p!==this.type;k&&R.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(z=>z.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,z=A.length;U<z;U++){let q=A[U],Z=q.shadow;if(Z===void 0){Ie("WebGLShadowMap:",q,"has no shadow.");continue}if(Z.autoUpdate===!1&&Z.needsUpdate===!1)continue;s.copy(Z.mapSize);let D=Z.getFrameExtents();s.multiply(D),r.copy(Z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/D.x),s.x=r.x*D.x,Z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/D.y),s.y=r.y*D.y,Z.mapSize.y=r.y));let H=i.state.buffers.depth.getReversed();if(Z.camera._reversedDepth=H,Z.map===null||k===!0){if(Z.map!==null&&(Z.map.depthTexture!==null&&(Z.map.depthTexture.dispose(),Z.map.depthTexture=null),Z.map.dispose()),this.type===Er){if(q.isPointLight){Ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Z.map=new Rt(s.x,s.y,{format:os,type:Qt,minFilter:At,magFilter:At,generateMipmaps:!1}),Z.map.texture.name=q.name+".shadowMap",Z.map.depthTexture=new Tn(s.x,s.y,An),Z.map.depthTexture.name=q.name+".shadowMapDepth",Z.map.depthTexture.format=si,Z.map.depthTexture.compareFunction=null,Z.map.depthTexture.minFilter=Ht,Z.map.depthTexture.magFilter=Ht}else q.isPointLight?(Z.map=new Sc(s.x),Z.map.depthTexture=new ul(s.x,Jn)):(Z.map=new Rt(s.x,s.y),Z.map.depthTexture=new Tn(s.x,s.y,Jn)),Z.map.depthTexture.name=q.name+".shadowMap",Z.map.depthTexture.format=si,this.type===Ha?(Z.map.depthTexture.compareFunction=H?yc:xc,Z.map.depthTexture.minFilter=At,Z.map.depthTexture.magFilter=At):(Z.map.depthTexture.compareFunction=null,Z.map.depthTexture.minFilter=Ht,Z.map.depthTexture.magFilter=Ht);Z.camera.updateProjectionMatrix()}let ee=Z.map.isWebGLCubeRenderTarget?6:1;for(let ie=0;ie<ee;ie++){if(Z.map.isWebGLCubeRenderTarget)i.setRenderTarget(Z.map,ie),i.clear();else{ie===0&&(i.setRenderTarget(Z.map),i.clear());let ce=Z.getViewport(ie);a.set(r.x*ce.x,r.y*ce.y,r.x*ce.z,r.y*ce.w),F.viewport(a)}if(q.isPointLight){let ce=Z.camera,Ne=Z.matrix,Be=q.distance||ce.far;Be!==ce.far&&(ce.far=Be,ce.updateProjectionMatrix()),so.setFromMatrixPosition(q.matrixWorld),ce.position.copy(so),Nu.copy(ce.position),Nu.add(gS[ie]),ce.up.copy(vS[ie]),ce.lookAt(Nu),ce.updateMatrixWorld(),Ne.makeTranslation(-so.x,-so.y,-so.z),om.multiplyMatrices(ce.projectionMatrix,ce.matrixWorldInverse),Z._frustum.setFromProjectionMatrix(om,ce.coordinateSystem,ce.reversedDepth)}else Z.updateMatrices(q);n=Z.getFrustum(),y(R,b,Z.camera,q,this.type)}Z.isPointLightShadow!==!0&&this.type===Er&&x(Z,b),Z.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(w,I,N)};function x(A,R){let b=e.update(v);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Rt(s.x,s.y,{format:os,type:Qt})),u.uniforms.shadow_pass.value=A.map.depthTexture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(R,null,b,u,v,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(R,null,b,f,v,null)}function _(A,R,b,w){let I=null,N=b.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(N!==void 0)I=N;else if(I=b.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let F=I.uuid,k=R.uuid,U=c[F];U===void 0&&(U={},c[F]=U);let z=U[k];z===void 0&&(z=I.clone(),U[k]=z,R.addEventListener("dispose",E)),I=z}if(I.visible=R.visible,I.wireframe=R.wireframe,w===Er?I.side=R.shadowSide!==null?R.shadowSide:R.side:I.side=R.shadowSide!==null?R.shadowSide:d[R.side],I.alphaMap=R.alphaMap,I.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,I.map=R.map,I.clipShadows=R.clipShadows,I.clippingPlanes=R.clippingPlanes,I.clipIntersection=R.clipIntersection,I.displacementMap=R.displacementMap,I.displacementScale=R.displacementScale,I.displacementBias=R.displacementBias,I.wireframeLinewidth=R.wireframeLinewidth,I.linewidth=R.linewidth,b.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let F=i.properties.get(I);F.light=b}return I}function y(A,R,b,w,I){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&I===Er)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,A.matrixWorld);let k=e.update(A),U=A.material;if(Array.isArray(U)){let z=k.groups;for(let q=0,Z=z.length;q<Z;q++){let D=z[q],H=U[D.materialIndex];if(H&&H.visible){let ee=_(A,H,w,I);A.onBeforeShadow(i,A,R,b,k,ee,D),i.renderBufferDirect(b,null,k,ee,A,D),A.onAfterShadow(i,A,R,b,k,ee,D)}}}else if(U.visible){let z=_(A,U,w,I);A.onBeforeShadow(i,A,R,b,k,z,null),i.renderBufferDirect(b,null,k,z,A,null),A.onAfterShadow(i,A,R,b,k,z,null)}}let F=A.children;for(let k=0,U=F.length;k<U;k++)y(F[k],R,b,w,I)}function E(A){A.target.removeEventListener("dispose",E);for(let b in c){let w=c[b],I=A.target.uuid;I in w&&(w[I].dispose(),delete w[I])}}}function yS(i,e){function t(){let B=!1,pe=new ct,se=null,ve=new ct(0,0,0,0);return{setMask:function(Me){se!==Me&&!B&&(i.colorMask(Me,Me,Me,Me),se=Me)},setLocked:function(Me){B=Me},setClear:function(Me,le,Le,Ce,Dt){Dt===!0&&(Me*=Ce,le*=Ce,Le*=Ce),pe.set(Me,le,Le,Ce),ve.equals(pe)===!1&&(i.clearColor(Me,le,Le,Ce),ve.copy(pe))},reset:function(){B=!1,se=null,ve.set(-1,0,0,0)}}}function n(){let B=!1,pe=!1,se=null,ve=null,Me=null;return{setReversed:function(le){if(pe!==le){let Le=e.get("EXT_clip_control");le?Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.ZERO_TO_ONE_EXT):Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.NEGATIVE_ONE_TO_ONE_EXT),pe=le;let Ce=Me;Me=null,this.setClear(Ce)}},getReversed:function(){return pe},setTest:function(le){le?O(i.DEPTH_TEST):Q(i.DEPTH_TEST)},setMask:function(le){se!==le&&!B&&(i.depthMask(le),se=le)},setFunc:function(le){if(pe&&(le=Lp[le]),ve!==le){switch(le){case Qo:i.depthFunc(i.NEVER);break;case Ms:i.depthFunc(i.ALWAYS);break;case el:i.depthFunc(i.LESS);break;case ws:i.depthFunc(i.LEQUAL);break;case tl:i.depthFunc(i.EQUAL);break;case nl:i.depthFunc(i.GEQUAL);break;case il:i.depthFunc(i.GREATER);break;case sl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ve=le}},setLocked:function(le){B=le},setClear:function(le){Me!==le&&(Me=le,pe&&(le=1-le),i.clearDepth(le))},reset:function(){B=!1,se=null,ve=null,Me=null,pe=!1}}}function s(){let B=!1,pe=null,se=null,ve=null,Me=null,le=null,Le=null,Ce=null,Dt=null;return{setTest:function(xt){B||(xt?O(i.STENCIL_TEST):Q(i.STENCIL_TEST))},setMask:function(xt){pe!==xt&&!B&&(i.stencilMask(xt),pe=xt)},setFunc:function(xt,Qn,ei){(se!==xt||ve!==Qn||Me!==ei)&&(i.stencilFunc(xt,Qn,ei),se=xt,ve=Qn,Me=ei)},setOp:function(xt,Qn,ei){(le!==xt||Le!==Qn||Ce!==ei)&&(i.stencilOp(xt,Qn,ei),le=xt,Le=Qn,Ce=ei)},setLocked:function(xt){B=xt},setClear:function(xt){Dt!==xt&&(i.clearStencil(xt),Dt=xt)},reset:function(){B=!1,pe=null,se=null,ve=null,Me=null,le=null,Le=null,Ce=null,Dt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},f=new WeakMap,m=[],v=null,g=!1,p=null,x=null,_=null,y=null,E=null,A=null,R=null,b=new fe(0,0,0),w=0,I=!1,N=null,F=null,k=null,U=null,z=null,q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Z=!1,D=0,H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(D=parseFloat(/^WebGL (\d)/.exec(H)[1]),Z=D>=1):H.indexOf("OpenGL ES")!==-1&&(D=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),Z=D>=2);let ee=null,ie={},ce=i.getParameter(i.SCISSOR_BOX),Ne=i.getParameter(i.VIEWPORT),Be=new ct().fromArray(ce),He=new ct().fromArray(Ne);function C(B,pe,se,ve){let Me=new Uint8Array(4),le=i.createTexture();i.bindTexture(B,le),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Le=0;Le<se;Le++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(pe,0,i.RGBA,1,1,ve,0,i.RGBA,i.UNSIGNED_BYTE,Me):i.texImage2D(pe+Le,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Me);return le}let X={};X[i.TEXTURE_2D]=C(i.TEXTURE_2D,i.TEXTURE_2D,1),X[i.TEXTURE_CUBE_MAP]=C(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),X[i.TEXTURE_2D_ARRAY]=C(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),X[i.TEXTURE_3D]=C(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),O(i.DEPTH_TEST),a.setFunc(ws),Lt(!1),_t(cu),O(i.CULL_FACE),$e(Un);function O(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function Q(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function ye(B,pe){return u[B]!==pe?(i.bindFramebuffer(B,pe),u[B]=pe,B===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=pe),B===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=pe),!0):!1}function xe(B,pe){let se=m,ve=!1;if(B){se=f.get(pe),se===void 0&&(se=[],f.set(pe,se));let Me=B.textures;if(se.length!==Me.length||se[0]!==i.COLOR_ATTACHMENT0){for(let le=0,Le=Me.length;le<Le;le++)se[le]=i.COLOR_ATTACHMENT0+le;se.length=Me.length,ve=!0}}else se[0]!==i.BACK&&(se[0]=i.BACK,ve=!0);ve&&i.drawBuffers(se)}function Ye(B){return v!==B?(i.useProgram(B),v=B,!0):!1}let ze={[Ji]:i.FUNC_ADD,[tp]:i.FUNC_SUBTRACT,[np]:i.FUNC_REVERSE_SUBTRACT};ze[ip]=i.MIN,ze[sp]=i.MAX;let et={[rp]:i.ZERO,[ap]:i.ONE,[op]:i.SRC_COLOR,[Zo]:i.SRC_ALPHA,[fp]:i.SRC_ALPHA_SATURATE,[up]:i.DST_COLOR,[cp]:i.DST_ALPHA,[lp]:i.ONE_MINUS_SRC_COLOR,[$o]:i.ONE_MINUS_SRC_ALPHA,[dp]:i.ONE_MINUS_DST_COLOR,[hp]:i.ONE_MINUS_DST_ALPHA,[pp]:i.CONSTANT_COLOR,[mp]:i.ONE_MINUS_CONSTANT_COLOR,[gp]:i.CONSTANT_ALPHA,[vp]:i.ONE_MINUS_CONSTANT_ALPHA};function $e(B,pe,se,ve,Me,le,Le,Ce,Dt,xt){if(B===Un){g===!0&&(Q(i.BLEND),g=!1);return}if(g===!1&&(O(i.BLEND),g=!0),B!==ep){if(B!==p||xt!==I){if((x!==Ji||E!==Ji)&&(i.blendEquation(i.FUNC_ADD),x=Ji,E=Ji),xt)switch(B){case Ei:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ls:i.blendFunc(i.ONE,i.ONE);break;case hu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case uu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ue("WebGLState: Invalid blending: ",B);break}else switch(B){case Ei:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ls:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case hu:Ue("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case uu:Ue("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ue("WebGLState: Invalid blending: ",B);break}_=null,y=null,A=null,R=null,b.set(0,0,0),w=0,p=B,I=xt}return}Me=Me||pe,le=le||se,Le=Le||ve,(pe!==x||Me!==E)&&(i.blendEquationSeparate(ze[pe],ze[Me]),x=pe,E=Me),(se!==_||ve!==y||le!==A||Le!==R)&&(i.blendFuncSeparate(et[se],et[ve],et[le],et[Le]),_=se,y=ve,A=le,R=Le),(Ce.equals(b)===!1||Dt!==w)&&(i.blendColor(Ce.r,Ce.g,Ce.b,Dt),b.copy(Ce),w=Dt),p=B,I=!1}function Qe(B,pe){B.side===St?Q(i.CULL_FACE):O(i.CULL_FACE);let se=B.side===qt;pe&&(se=!se),Lt(se),B.blending===Ei&&B.transparent===!1?$e(Un):$e(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),r.setMask(B.colorWrite);let ve=B.stencilWrite;o.setTest(ve),ve&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),jt(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?O(i.SAMPLE_ALPHA_TO_COVERAGE):Q(i.SAMPLE_ALPHA_TO_COVERAGE)}function Lt(B){N!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),N=B)}function _t(B){B!==$f?(O(i.CULL_FACE),B!==F&&(B===cu?i.cullFace(i.BACK):B===Qf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Q(i.CULL_FACE),F=B}function Ot(B){B!==k&&(Z&&i.lineWidth(B),k=B)}function jt(B,pe,se){B?(O(i.POLYGON_OFFSET_FILL),(U!==pe||z!==se)&&(U=pe,z=se,a.getReversed()&&(pe=-pe),i.polygonOffset(pe,se))):Q(i.POLYGON_OFFSET_FILL)}function vt(B){B?O(i.SCISSOR_TEST):Q(i.SCISSOR_TEST)}function ht(B){B===void 0&&(B=i.TEXTURE0+q-1),ee!==B&&(i.activeTexture(B),ee=B)}function V(B,pe,se){se===void 0&&(ee===null?se=i.TEXTURE0+q-1:se=ee);let ve=ie[se];ve===void 0&&(ve={type:void 0,texture:void 0},ie[se]=ve),(ve.type!==B||ve.texture!==pe)&&(ee!==se&&(i.activeTexture(se),ee=se),i.bindTexture(B,pe||X[B]),ve.type=B,ve.texture=pe)}function en(){let B=ie[ee];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function nt(){try{i.compressedTexImage2D(...arguments)}catch(B){Ue("WebGLState:",B)}}function P(){try{i.compressedTexImage3D(...arguments)}catch(B){Ue("WebGLState:",B)}}function S(){try{i.texSubImage2D(...arguments)}catch(B){Ue("WebGLState:",B)}}function W(){try{i.texSubImage3D(...arguments)}catch(B){Ue("WebGLState:",B)}}function J(){try{i.compressedTexSubImage2D(...arguments)}catch(B){Ue("WebGLState:",B)}}function te(){try{i.compressedTexSubImage3D(...arguments)}catch(B){Ue("WebGLState:",B)}}function me(){try{i.texStorage2D(...arguments)}catch(B){Ue("WebGLState:",B)}}function ge(){try{i.texStorage3D(...arguments)}catch(B){Ue("WebGLState:",B)}}function ne(){try{i.texImage2D(...arguments)}catch(B){Ue("WebGLState:",B)}}function re(){try{i.texImage3D(...arguments)}catch(B){Ue("WebGLState:",B)}}function j(B){return d[B]!==void 0?d[B]:i.getParameter(B)}function oe(B,pe){d[B]!==pe&&(i.pixelStorei(B,pe),d[B]=pe)}function ae(B){Be.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),Be.copy(B))}function ue(B){He.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),He.copy(B))}function Ee(B,pe){let se=c.get(pe);se===void 0&&(se=new WeakMap,c.set(pe,se));let ve=se.get(B);ve===void 0&&(ve=i.getUniformBlockIndex(pe,B.name),se.set(B,ve))}function Pe(B,pe){let ve=c.get(pe).get(B);l.get(pe)!==ve&&(i.uniformBlockBinding(pe,ve,B.__bindingPointIndex),l.set(pe,ve))}function Oe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},ee=null,ie={},u={},f=new WeakMap,m=[],v=null,g=!1,p=null,x=null,_=null,y=null,E=null,A=null,R=null,b=new fe(0,0,0),w=0,I=!1,N=null,F=null,k=null,U=null,z=null,Be.set(0,0,i.canvas.width,i.canvas.height),He.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:O,disable:Q,bindFramebuffer:ye,drawBuffers:xe,useProgram:Ye,setBlending:$e,setMaterial:Qe,setFlipSided:Lt,setCullFace:_t,setLineWidth:Ot,setPolygonOffset:jt,setScissorTest:vt,activeTexture:ht,bindTexture:V,unbindTexture:en,compressedTexImage2D:nt,compressedTexImage3D:P,texImage2D:ne,texImage3D:re,pixelStorei:oe,getParameter:j,updateUBOMapping:Ee,uniformBlockBinding:Pe,texStorage2D:me,texStorage3D:ge,texSubImage2D:S,texSubImage3D:W,compressedTexSubImage2D:J,compressedTexSubImage3D:te,scissor:ae,viewport:ue,reset:Oe}}function bS(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new he,h=new WeakMap,d=new Set,u,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(P,S){return m?new OffscreenCanvas(P,S):cr("canvas")}function g(P,S,W){let J=1,te=nt(P);if((te.width>W||te.height>W)&&(J=W/Math.max(te.width,te.height)),J<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let me=Math.floor(J*te.width),ge=Math.floor(J*te.height);u===void 0&&(u=v(me,ge));let ne=S?v(me,ge):u;return ne.width=me,ne.height=ge,ne.getContext("2d").drawImage(P,0,0,me,ge),Ie("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+me+"x"+ge+")."),ne}else return"data"in P&&Ie("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),P;return P}function p(P){return P.generateMipmaps}function x(P){i.generateMipmap(P)}function _(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(P,S,W,J,te,me=!1){if(P!==null){if(i[P]!==void 0)return i[P];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let ge;J&&(ge=e.get("EXT_texture_norm16"),ge||Ie("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ne=S;if(S===i.RED&&(W===i.FLOAT&&(ne=i.R32F),W===i.HALF_FLOAT&&(ne=i.R16F),W===i.UNSIGNED_BYTE&&(ne=i.R8),W===i.UNSIGNED_SHORT&&ge&&(ne=ge.R16_EXT),W===i.SHORT&&ge&&(ne=ge.R16_SNORM_EXT)),S===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(ne=i.R8UI),W===i.UNSIGNED_SHORT&&(ne=i.R16UI),W===i.UNSIGNED_INT&&(ne=i.R32UI),W===i.BYTE&&(ne=i.R8I),W===i.SHORT&&(ne=i.R16I),W===i.INT&&(ne=i.R32I)),S===i.RG&&(W===i.FLOAT&&(ne=i.RG32F),W===i.HALF_FLOAT&&(ne=i.RG16F),W===i.UNSIGNED_BYTE&&(ne=i.RG8),W===i.UNSIGNED_SHORT&&ge&&(ne=ge.RG16_EXT),W===i.SHORT&&ge&&(ne=ge.RG16_SNORM_EXT)),S===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(ne=i.RG8UI),W===i.UNSIGNED_SHORT&&(ne=i.RG16UI),W===i.UNSIGNED_INT&&(ne=i.RG32UI),W===i.BYTE&&(ne=i.RG8I),W===i.SHORT&&(ne=i.RG16I),W===i.INT&&(ne=i.RG32I)),S===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(ne=i.RGB8UI),W===i.UNSIGNED_SHORT&&(ne=i.RGB16UI),W===i.UNSIGNED_INT&&(ne=i.RGB32UI),W===i.BYTE&&(ne=i.RGB8I),W===i.SHORT&&(ne=i.RGB16I),W===i.INT&&(ne=i.RGB32I)),S===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(ne=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(ne=i.RGBA16UI),W===i.UNSIGNED_INT&&(ne=i.RGBA32UI),W===i.BYTE&&(ne=i.RGBA8I),W===i.SHORT&&(ne=i.RGBA16I),W===i.INT&&(ne=i.RGBA32I)),S===i.RGB&&(W===i.UNSIGNED_SHORT&&ge&&(ne=ge.RGB16_EXT),W===i.SHORT&&ge&&(ne=ge.RGB16_SNORM_EXT),W===i.UNSIGNED_INT_5_9_9_9_REV&&(ne=i.RGB9_E5),W===i.UNSIGNED_INT_10F_11F_11F_REV&&(ne=i.R11F_G11F_B10F)),S===i.RGBA){let re=me?la:je.getTransfer(te);W===i.FLOAT&&(ne=i.RGBA32F),W===i.HALF_FLOAT&&(ne=i.RGBA16F),W===i.UNSIGNED_BYTE&&(ne=re===it?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT&&ge&&(ne=ge.RGBA16_EXT),W===i.SHORT&&ge&&(ne=ge.RGBA16_SNORM_EXT),W===i.UNSIGNED_SHORT_4_4_4_4&&(ne=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(ne=i.RGB5_A1)}return(ne===i.R16F||ne===i.R32F||ne===i.RG16F||ne===i.RG32F||ne===i.RGBA16F||ne===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function E(P,S){let W;return P?S===null||S===Jn||S===Rr?W=i.DEPTH24_STENCIL8:S===An?W=i.DEPTH32F_STENCIL8:S===Cr&&(W=i.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Jn||S===Rr?W=i.DEPTH_COMPONENT24:S===An?W=i.DEPTH_COMPONENT32F:S===Cr&&(W=i.DEPTH_COMPONENT16),W}function A(P,S){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==Ht&&P.minFilter!==At?Math.log2(Math.max(S.width,S.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?S.mipmaps.length:1}function R(P){let S=P.target;S.removeEventListener("dispose",R),w(S),S.isVideoTexture&&h.delete(S),S.isHTMLTexture&&d.delete(S)}function b(P){let S=P.target;S.removeEventListener("dispose",b),N(S)}function w(P){let S=n.get(P);if(S.__webglInit===void 0)return;let W=P.source,J=f.get(W);if(J){let te=J[S.__cacheKey];te.usedTimes--,te.usedTimes===0&&I(P),Object.keys(J).length===0&&f.delete(W)}n.remove(P)}function I(P){let S=n.get(P);i.deleteTexture(S.__webglTexture);let W=P.source,J=f.get(W);delete J[S.__cacheKey],a.memory.textures--}function N(P){let S=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(S.__webglFramebuffer[J]))for(let te=0;te<S.__webglFramebuffer[J].length;te++)i.deleteFramebuffer(S.__webglFramebuffer[J][te]);else i.deleteFramebuffer(S.__webglFramebuffer[J]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[J])}else{if(Array.isArray(S.__webglFramebuffer))for(let J=0;J<S.__webglFramebuffer.length;J++)i.deleteFramebuffer(S.__webglFramebuffer[J]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let J=0;J<S.__webglColorRenderbuffer.length;J++)S.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[J]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let W=P.textures;for(let J=0,te=W.length;J<te;J++){let me=n.get(W[J]);me.__webglTexture&&(i.deleteTexture(me.__webglTexture),a.memory.textures--),n.remove(W[J])}n.remove(P)}let F=0;function k(){F=0}function U(){return F}function z(P){F=P}function q(){let P=F;return P>=s.maxTextures&&Ie("WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),F+=1,P}function Z(P){let S=[];return S.push(P.wrapS),S.push(P.wrapT),S.push(P.wrapR||0),S.push(P.magFilter),S.push(P.minFilter),S.push(P.anisotropy),S.push(P.internalFormat),S.push(P.format),S.push(P.type),S.push(P.generateMipmaps),S.push(P.premultiplyAlpha),S.push(P.flipY),S.push(P.unpackAlignment),S.push(P.colorSpace),S.join()}function D(P,S){let W=n.get(P);if(P.isVideoTexture&&V(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&W.__version!==P.version){let J=P.image;if(J===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else{Q(W,P,S);return}}else P.isExternalTexture&&(W.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+S)}function H(P,S){let W=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){Q(W,P,S);return}else P.isExternalTexture&&(W.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+S)}function ee(P,S){let W=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){Q(W,P,S);return}t.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+S)}function ie(P,S){let W=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&W.__version!==P.version){ye(W,P,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+S)}let ce={[qn]:i.REPEAT,[Fn]:i.CLAMP_TO_EDGE,[or]:i.MIRRORED_REPEAT},Ne={[Ht]:i.NEAREST,[Dl]:i.NEAREST_MIPMAP_NEAREST,[ks]:i.NEAREST_MIPMAP_LINEAR,[At]:i.LINEAR,[Ar]:i.LINEAR_MIPMAP_NEAREST,[Kn]:i.LINEAR_MIPMAP_LINEAR},Be={[wp]:i.NEVER,[Rp]:i.ALWAYS,[Tp]:i.LESS,[xc]:i.LEQUAL,[Ep]:i.EQUAL,[yc]:i.GEQUAL,[Ap]:i.GREATER,[Cp]:i.NOTEQUAL};function He(P,S){if(S.type===An&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===At||S.magFilter===Ar||S.magFilter===ks||S.magFilter===Kn||S.minFilter===At||S.minFilter===Ar||S.minFilter===ks||S.minFilter===Kn)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,ce[S.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,ce[S.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,ce[S.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,Ne[S.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,Ne[S.minFilter]),S.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,Be[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Ht||S.minFilter!==ks&&S.minFilter!==Kn||S.type===An&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let W=e.get("EXT_texture_filter_anisotropic");i.texParameterf(P,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function C(P,S){let W=!1;P.__webglInit===void 0&&(P.__webglInit=!0,S.addEventListener("dispose",R));let J=S.source,te=f.get(J);te===void 0&&(te={},f.set(J,te));let me=Z(S);if(me!==P.__cacheKey){te[me]===void 0&&(te[me]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,W=!0),te[me].usedTimes++;let ge=te[P.__cacheKey];ge!==void 0&&(te[P.__cacheKey].usedTimes--,ge.usedTimes===0&&I(S)),P.__cacheKey=me,P.__webglTexture=te[me].texture}return W}function X(P,S,W){return Math.floor(Math.floor(P/W)/S)}function O(P,S,W,J){let me=P.updateRanges;if(me.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,W,J,S.data);else{me.sort((oe,ae)=>oe.start-ae.start);let ge=0;for(let oe=1;oe<me.length;oe++){let ae=me[ge],ue=me[oe],Ee=ae.start+ae.count,Pe=X(ue.start,S.width,4),Oe=X(ae.start,S.width,4);ue.start<=Ee+1&&Pe===Oe&&X(ue.start+ue.count-1,S.width,4)===Pe?ae.count=Math.max(ae.count,ue.start+ue.count-ae.start):(++ge,me[ge]=ue)}me.length=ge+1;let ne=t.getParameter(i.UNPACK_ROW_LENGTH),re=t.getParameter(i.UNPACK_SKIP_PIXELS),j=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let oe=0,ae=me.length;oe<ae;oe++){let ue=me[oe],Ee=Math.floor(ue.start/4),Pe=Math.ceil(ue.count/4),Oe=Ee%S.width,B=Math.floor(Ee/S.width),pe=Pe,se=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Oe),t.pixelStorei(i.UNPACK_SKIP_ROWS,B),t.texSubImage2D(i.TEXTURE_2D,0,Oe,B,pe,se,W,J,S.data)}P.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ne),t.pixelStorei(i.UNPACK_SKIP_PIXELS,re),t.pixelStorei(i.UNPACK_SKIP_ROWS,j)}}function Q(P,S,W){let J=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(J=i.TEXTURE_3D);let te=C(P,S),me=S.source;t.bindTexture(J,P.__webglTexture,i.TEXTURE0+W);let ge=n.get(me);if(me.version!==ge.__version||te===!0){if(t.activeTexture(i.TEXTURE0+W),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){let se=je.getPrimaries(je.workingColorSpace),ve=S.colorSpace===Ni?null:je.getPrimaries(S.colorSpace),Me=S.colorSpace===Ni||se===ve?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me)}t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment);let re=g(S.image,!1,s.maxTextureSize);re=en(S,re);let j=r.convert(S.format,S.colorSpace),oe=r.convert(S.type),ae=y(S.internalFormat,j,oe,S.normalized,S.colorSpace,S.isVideoTexture);He(J,S);let ue,Ee=S.mipmaps,Pe=S.isVideoTexture!==!0,Oe=ge.__version===void 0||te===!0,B=me.dataReady,pe=A(S,re);if(S.isDepthTexture)ae=E(S.format===as,S.type),Oe&&(Pe?t.texStorage2D(i.TEXTURE_2D,1,ae,re.width,re.height):t.texImage2D(i.TEXTURE_2D,0,ae,re.width,re.height,0,j,oe,null));else if(S.isDataTexture)if(Ee.length>0){Pe&&Oe&&t.texStorage2D(i.TEXTURE_2D,pe,ae,Ee[0].width,Ee[0].height);for(let se=0,ve=Ee.length;se<ve;se++)ue=Ee[se],Pe?B&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ue.width,ue.height,j,oe,ue.data):t.texImage2D(i.TEXTURE_2D,se,ae,ue.width,ue.height,0,j,oe,ue.data);S.generateMipmaps=!1}else Pe?(Oe&&t.texStorage2D(i.TEXTURE_2D,pe,ae,re.width,re.height),B&&O(S,re,j,oe)):t.texImage2D(i.TEXTURE_2D,0,ae,re.width,re.height,0,j,oe,re.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Pe&&Oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,ae,Ee[0].width,Ee[0].height,re.depth);for(let se=0,ve=Ee.length;se<ve;se++)if(ue=Ee[se],S.format!==Cn)if(j!==null)if(Pe){if(B)if(S.layerUpdates.size>0){let Me=Eu(ue.width,ue.height,S.format,S.type);for(let le of S.layerUpdates){let Le=ue.data.subarray(le*Me/ue.data.BYTES_PER_ELEMENT,(le+1)*Me/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,le,ue.width,ue.height,1,j,Le)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,ue.width,ue.height,re.depth,j,ue.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,se,ae,ue.width,ue.height,re.depth,0,ue.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Pe?B&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,ue.width,ue.height,re.depth,j,oe,ue.data):t.texImage3D(i.TEXTURE_2D_ARRAY,se,ae,ue.width,ue.height,re.depth,0,j,oe,ue.data)}else{Pe&&Oe&&t.texStorage2D(i.TEXTURE_2D,pe,ae,Ee[0].width,Ee[0].height);for(let se=0,ve=Ee.length;se<ve;se++)ue=Ee[se],S.format!==Cn?j!==null?Pe?B&&t.compressedTexSubImage2D(i.TEXTURE_2D,se,0,0,ue.width,ue.height,j,ue.data):t.compressedTexImage2D(i.TEXTURE_2D,se,ae,ue.width,ue.height,0,ue.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pe?B&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ue.width,ue.height,j,oe,ue.data):t.texImage2D(i.TEXTURE_2D,se,ae,ue.width,ue.height,0,j,oe,ue.data)}else if(S.isDataArrayTexture)if(Pe){if(Oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,ae,re.width,re.height,re.depth),B)if(S.layerUpdates.size>0){let se=Eu(re.width,re.height,S.format,S.type);for(let ve of S.layerUpdates){let Me=re.data.subarray(ve*se/re.data.BYTES_PER_ELEMENT,(ve+1)*se/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ve,re.width,re.height,1,j,oe,Me)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,j,oe,re.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ae,re.width,re.height,re.depth,0,j,oe,re.data);else if(S.isData3DTexture)Pe?(Oe&&t.texStorage3D(i.TEXTURE_3D,pe,ae,re.width,re.height,re.depth),B&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,j,oe,re.data)):t.texImage3D(i.TEXTURE_3D,0,ae,re.width,re.height,re.depth,0,j,oe,re.data);else if(S.isFramebufferTexture){if(Oe)if(Pe)t.texStorage2D(i.TEXTURE_2D,pe,ae,re.width,re.height);else{let se=re.width,ve=re.height;for(let Me=0;Me<pe;Me++)t.texImage2D(i.TEXTURE_2D,Me,ae,se,ve,0,j,oe,null),se>>=1,ve>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in i){let se=i.canvas;if(se.hasAttribute("layoutsubtree")||se.setAttribute("layoutsubtree","true"),re.parentNode!==se){se.appendChild(re),d.add(S),se.onpaint=ve=>{let Me=ve.changedElements;for(let le of d)Me.includes(le.image)&&(le.needsUpdate=!0)},se.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,re);else{let Me=i.RGBA,le=i.RGBA,Le=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Me,le,Le,re)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ee.length>0){if(Pe&&Oe){let se=nt(Ee[0]);t.texStorage2D(i.TEXTURE_2D,pe,ae,se.width,se.height)}for(let se=0,ve=Ee.length;se<ve;se++)ue=Ee[se],Pe?B&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,j,oe,ue):t.texImage2D(i.TEXTURE_2D,se,ae,j,oe,ue);S.generateMipmaps=!1}else if(Pe){if(Oe){let se=nt(re);t.texStorage2D(i.TEXTURE_2D,pe,ae,se.width,se.height)}B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,j,oe,re)}else t.texImage2D(i.TEXTURE_2D,0,ae,j,oe,re);p(S)&&x(J),ge.__version=me.version,S.onUpdate&&S.onUpdate(S)}P.__version=S.version}function ye(P,S,W){if(S.image.length!==6)return;let J=C(P,S),te=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+W);let me=n.get(te);if(te.version!==me.__version||J===!0){t.activeTexture(i.TEXTURE0+W);let ge=je.getPrimaries(je.workingColorSpace),ne=S.colorSpace===Ni?null:je.getPrimaries(S.colorSpace),re=S.colorSpace===Ni||ge===ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,re);let j=S.isCompressedTexture||S.image[0].isCompressedTexture,oe=S.image[0]&&S.image[0].isDataTexture,ae=[];for(let le=0;le<6;le++)!j&&!oe?ae[le]=g(S.image[le],!0,s.maxCubemapSize):ae[le]=oe?S.image[le].image:S.image[le],ae[le]=en(S,ae[le]);let ue=ae[0],Ee=r.convert(S.format,S.colorSpace),Pe=r.convert(S.type),Oe=y(S.internalFormat,Ee,Pe,S.normalized,S.colorSpace),B=S.isVideoTexture!==!0,pe=me.__version===void 0||J===!0,se=te.dataReady,ve=A(S,ue);He(i.TEXTURE_CUBE_MAP,S);let Me;if(j){B&&pe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,Oe,ue.width,ue.height);for(let le=0;le<6;le++){Me=ae[le].mipmaps;for(let Le=0;Le<Me.length;Le++){let Ce=Me[Le];S.format!==Cn?Ee!==null?B?se&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Le,0,0,Ce.width,Ce.height,Ee,Ce.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Le,Oe,Ce.width,Ce.height,0,Ce.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Le,0,0,Ce.width,Ce.height,Ee,Pe,Ce.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Le,Oe,Ce.width,Ce.height,0,Ee,Pe,Ce.data)}}}else{if(Me=S.mipmaps,B&&pe){Me.length>0&&ve++;let le=nt(ae[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,Oe,le.width,le.height)}for(let le=0;le<6;le++)if(oe){B?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,ae[le].width,ae[le].height,Ee,Pe,ae[le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,Oe,ae[le].width,ae[le].height,0,Ee,Pe,ae[le].data);for(let Le=0;Le<Me.length;Le++){let Dt=Me[Le].image[le].image;B?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Le+1,0,0,Dt.width,Dt.height,Ee,Pe,Dt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Le+1,Oe,Dt.width,Dt.height,0,Ee,Pe,Dt.data)}}else{B?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,Ee,Pe,ae[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,Oe,Ee,Pe,ae[le]);for(let Le=0;Le<Me.length;Le++){let Ce=Me[Le];B?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Le+1,0,0,Ee,Pe,Ce.image[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Le+1,Oe,Ee,Pe,Ce.image[le])}}}p(S)&&x(i.TEXTURE_CUBE_MAP),me.__version=te.version,S.onUpdate&&S.onUpdate(S)}P.__version=S.version}function xe(P,S,W,J,te,me){let ge=r.convert(W.format,W.colorSpace),ne=r.convert(W.type),re=y(W.internalFormat,ge,ne,W.normalized,W.colorSpace),j=n.get(S),oe=n.get(W);if(oe.__renderTarget=S,!j.__hasExternalTextures){let ae=Math.max(1,S.width>>me),ue=Math.max(1,S.height>>me);te===i.TEXTURE_3D||te===i.TEXTURE_2D_ARRAY?t.texImage3D(te,me,re,ae,ue,S.depth,0,ge,ne,null):t.texImage2D(te,me,re,ae,ue,0,ge,ne,null)}t.bindFramebuffer(i.FRAMEBUFFER,P),ht(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,te,oe.__webglTexture,0,vt(S)):(te===i.TEXTURE_2D||te>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,te,oe.__webglTexture,me),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ye(P,S,W){if(i.bindRenderbuffer(i.RENDERBUFFER,P),S.depthBuffer){let J=S.depthTexture,te=J&&J.isDepthTexture?J.type:null,me=E(S.stencilBuffer,te),ge=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ht(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,vt(S),me,S.width,S.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,vt(S),me,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,me,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ge,i.RENDERBUFFER,P)}else{let J=S.textures;for(let te=0;te<J.length;te++){let me=J[te],ge=r.convert(me.format,me.colorSpace),ne=r.convert(me.type),re=y(me.internalFormat,ge,ne,me.normalized,me.colorSpace);ht(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,vt(S),re,S.width,S.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,vt(S),re,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,re,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ze(P,S,W){let J=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,P),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let te=n.get(S.depthTexture);if(te.__renderTarget=S,(!te.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),J){if(te.__webglInit===void 0&&(te.__webglInit=!0,S.depthTexture.addEventListener("dispose",R)),te.__webglTexture===void 0){te.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,te.__webglTexture),He(i.TEXTURE_CUBE_MAP,S.depthTexture);let j=r.convert(S.depthTexture.format),oe=r.convert(S.depthTexture.type),ae;S.depthTexture.format===si?ae=i.DEPTH_COMPONENT24:S.depthTexture.format===as&&(ae=i.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,ae,S.width,S.height,0,j,oe,null)}}else D(S.depthTexture,0);let me=te.__webglTexture,ge=vt(S),ne=J?i.TEXTURE_CUBE_MAP_POSITIVE_X+W:i.TEXTURE_2D,re=S.depthTexture.format===as?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(S.depthTexture.format===si)ht(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,re,ne,me,0,ge):i.framebufferTexture2D(i.FRAMEBUFFER,re,ne,me,0);else if(S.depthTexture.format===as)ht(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,re,ne,me,0,ge):i.framebufferTexture2D(i.FRAMEBUFFER,re,ne,me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function et(P){let S=n.get(P),W=P.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==P.depthTexture){let J=P.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),J){let te=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,J.removeEventListener("dispose",te)};J.addEventListener("dispose",te),S.__depthDisposeCallback=te}S.__boundDepthTexture=J}if(P.depthTexture&&!S.__autoAllocateDepthBuffer)if(W)for(let J=0;J<6;J++)ze(S.__webglFramebuffer[J],P,J);else{let J=P.texture.mipmaps;J&&J.length>0?ze(S.__webglFramebuffer[0],P,0):ze(S.__webglFramebuffer,P,0)}else if(W){S.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[J]),S.__webglDepthbuffer[J]===void 0)S.__webglDepthbuffer[J]=i.createRenderbuffer(),Ye(S.__webglDepthbuffer[J],P,!1);else{let te=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=S.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,me),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,me)}}else{let J=P.texture.mipmaps;if(J&&J.length>0?t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),Ye(S.__webglDepthbuffer,P,!1);else{let te=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,me),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,me)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function $e(P,S,W){let J=n.get(P);S!==void 0&&xe(J.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&et(P)}function Qe(P){let S=P.texture,W=n.get(P),J=n.get(S);P.addEventListener("dispose",b);let te=P.textures,me=P.isWebGLCubeRenderTarget===!0,ge=te.length>1;if(ge||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=S.version,a.memory.textures++),me){W.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(S.mipmaps&&S.mipmaps.length>0){W.__webglFramebuffer[ne]=[];for(let re=0;re<S.mipmaps.length;re++)W.__webglFramebuffer[ne][re]=i.createFramebuffer()}else W.__webglFramebuffer[ne]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){W.__webglFramebuffer=[];for(let ne=0;ne<S.mipmaps.length;ne++)W.__webglFramebuffer[ne]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(ge)for(let ne=0,re=te.length;ne<re;ne++){let j=n.get(te[ne]);j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture(),a.memory.textures++)}if(P.samples>0&&ht(P)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let ne=0;ne<te.length;ne++){let re=te[ne];W.__webglColorRenderbuffer[ne]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[ne]);let j=r.convert(re.format,re.colorSpace),oe=r.convert(re.type),ae=y(re.internalFormat,j,oe,re.normalized,re.colorSpace,P.isXRRenderTarget===!0),ue=vt(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,ue,ae,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ne,i.RENDERBUFFER,W.__webglColorRenderbuffer[ne])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),Ye(W.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(me){t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),He(i.TEXTURE_CUBE_MAP,S);for(let ne=0;ne<6;ne++)if(S.mipmaps&&S.mipmaps.length>0)for(let re=0;re<S.mipmaps.length;re++)xe(W.__webglFramebuffer[ne][re],P,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,re);else xe(W.__webglFramebuffer[ne],P,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);p(S)&&x(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ge){for(let ne=0,re=te.length;ne<re;ne++){let j=te[ne],oe=n.get(j),ae=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ae=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,oe.__webglTexture),He(ae,j),xe(W.__webglFramebuffer,P,j,i.COLOR_ATTACHMENT0+ne,ae,0),p(j)&&x(ae)}t.unbindTexture()}else{let ne=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ne=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ne,J.__webglTexture),He(ne,S),S.mipmaps&&S.mipmaps.length>0)for(let re=0;re<S.mipmaps.length;re++)xe(W.__webglFramebuffer[re],P,S,i.COLOR_ATTACHMENT0,ne,re);else xe(W.__webglFramebuffer,P,S,i.COLOR_ATTACHMENT0,ne,0);p(S)&&x(ne),t.unbindTexture()}P.depthBuffer&&et(P)}function Lt(P){let S=P.textures;for(let W=0,J=S.length;W<J;W++){let te=S[W];if(p(te)){let me=_(P),ge=n.get(te).__webglTexture;t.bindTexture(me,ge),x(me),t.unbindTexture()}}}let _t=[],Ot=[];function jt(P){if(P.samples>0){if(ht(P)===!1){let S=P.textures,W=P.width,J=P.height,te=i.COLOR_BUFFER_BIT,me=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ge=n.get(P),ne=S.length>1;if(ne)for(let j=0;j<S.length;j++)t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer);let re=P.texture.mipmaps;re&&re.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let j=0;j<S.length;j++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(te|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(te|=i.STENCIL_BUFFER_BIT)),ne){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ge.__webglColorRenderbuffer[j]);let oe=n.get(S[j]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,oe,0)}i.blitFramebuffer(0,0,W,J,0,0,W,J,te,i.NEAREST),l===!0&&(_t.length=0,Ot.length=0,_t.push(i.COLOR_ATTACHMENT0+j),P.depthBuffer&&P.resolveDepthBuffer===!1&&(_t.push(me),Ot.push(me),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ot)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,_t))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ne)for(let j=0;j<S.length;j++){t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,ge.__webglColorRenderbuffer[j]);let oe=n.get(S[j]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.TEXTURE_2D,oe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){let S=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function vt(P){return Math.min(s.maxSamples,P.samples)}function ht(P){let S=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function V(P){let S=a.render.frame;h.get(P)!==S&&(h.set(P,S),P.update())}function en(P,S){let W=P.colorSpace,J=P.format,te=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||W!==dn&&W!==Ni&&(je.getTransfer(W)===it?(J!==Cn||te!==bn)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ue("WebGLTextures: Unsupported texture color space:",W)),S}function nt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=k,this.getTextureUnits=U,this.setTextureUnits=z,this.setTexture2D=D,this.setTexture2DArray=H,this.setTexture3D=ee,this.setTextureCube=ie,this.rebindTextures=$e,this.setupRenderTarget=Qe,this.updateRenderTargetMipmap=Lt,this.updateMultisampleRenderTarget=jt,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=ht,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function _S(i,e){function t(n,s=Ni){let r,a=je.getTransfer(s);if(n===bn)return i.UNSIGNED_BYTE;if(n===kl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ol)return i.UNSIGNED_SHORT_5_5_5_1;if(n===mu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===gu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===fu)return i.BYTE;if(n===pu)return i.SHORT;if(n===Cr)return i.UNSIGNED_SHORT;if(n===Fl)return i.INT;if(n===Jn)return i.UNSIGNED_INT;if(n===An)return i.FLOAT;if(n===Qt)return i.HALF_FLOAT;if(n===vu)return i.ALPHA;if(n===xu)return i.RGB;if(n===Cn)return i.RGBA;if(n===si)return i.DEPTH_COMPONENT;if(n===as)return i.DEPTH_STENCIL;if(n===Ul)return i.RED;if(n===Bl)return i.RED_INTEGER;if(n===os)return i.RG;if(n===zl)return i.RG_INTEGER;if(n===Hl)return i.RGBA_INTEGER;if(n===Ka||n===Ja||n===Za||n===$a)if(a===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ka)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ka)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ja)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Za)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===$a)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Vl||n===Gl||n===jl||n===Wl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Vl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Gl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===jl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Wl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ql||n===Xl||n===Yl||n===Kl||n===Jl||n===Qa||n===Zl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ql||n===Xl)return a===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Yl)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Kl)return r.COMPRESSED_R11_EAC;if(n===Jl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Qa)return r.COMPRESSED_RG11_EAC;if(n===Zl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===$l||n===Ql||n===ec||n===tc||n===nc||n===ic||n===sc||n===rc||n===ac||n===oc||n===lc||n===cc||n===hc||n===uc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===$l)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ql)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ec)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===tc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===nc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ic)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===sc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===rc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ac)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===oc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===lc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===cc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===hc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===uc)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===dc||n===fc||n===pc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===dc)return a===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===fc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===pc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===mc||n===gc||n===eo||n===vc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===mc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===gc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===eo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===vc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Rr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var SS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,MS=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,zu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new xa(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new at({vertexShader:SS,fragmentShader:MS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ze(new ln(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Hu=class extends ri{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,m=null,v=typeof XRWebGLBinding<"u",g=new zu,p={},x=t.getContextAttributes(),_=null,y=null,E=[],A=[],R=new he,b=null,w=new zt;w.viewport=new ct;let I=new zt;I.viewport=new ct;let N=[w,I],F=new Rl,k=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(C){let X=E[C];return X===void 0&&(X=new fr,E[C]=X),X.getTargetRaySpace()},this.getControllerGrip=function(C){let X=E[C];return X===void 0&&(X=new fr,E[C]=X),X.getGripSpace()},this.getHand=function(C){let X=E[C];return X===void 0&&(X=new fr,E[C]=X),X.getHandSpace()};function z(C){let X=A.indexOf(C.inputSource);if(X===-1)return;let O=E[X];O!==void 0&&(O.update(C.inputSource,C.frame,c||a),O.dispatchEvent({type:C.type,data:C.inputSource}))}function q(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",Z);for(let C=0;C<E.length;C++){let X=A[C];X!==null&&(A[C]=null,E[C].disconnect(X))}k=null,U=null,g.reset();for(let C in p)delete p[C];e.setRenderTarget(_),f=null,u=null,d=null,s=null,y=null,He.stop(),n.isPresenting=!1,e.setPixelRatio(b),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(C){r=C,n.isPresenting===!0&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(C){o=C,n.isPresenting===!0&&Ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(C){c=C},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(C){if(s=C,s!==null){if(_=e.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",q),s.addEventListener("inputsourceschange",Z),x.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let O=null,Q=null,ye=null;x.depth&&(ye=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,O=x.stencil?as:si,Q=x.stencil?Rr:Jn);let xe={colorFormat:t.RGBA8,depthFormat:ye,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(xe),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new Rt(u.textureWidth,u.textureHeight,{format:Cn,type:bn,depthTexture:new Tn(u.textureWidth,u.textureHeight,Q,void 0,void 0,void 0,void 0,void 0,void 0,O),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{let O={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,O),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Rt(f.framebufferWidth,f.framebufferHeight,{format:Cn,type:bn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),He.setContext(s),He.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function Z(C){for(let X=0;X<C.removed.length;X++){let O=C.removed[X],Q=A.indexOf(O);Q>=0&&(A[Q]=null,E[Q].disconnect(O))}for(let X=0;X<C.added.length;X++){let O=C.added[X],Q=A.indexOf(O);if(Q===-1){for(let xe=0;xe<E.length;xe++)if(xe>=A.length){A.push(O),Q=xe;break}else if(A[xe]===null){A[xe]=O,Q=xe;break}if(Q===-1)break}let ye=E[Q];ye&&ye.connect(O)}}let D=new L,H=new L;function ee(C,X,O){D.setFromMatrixPosition(X.matrixWorld),H.setFromMatrixPosition(O.matrixWorld);let Q=D.distanceTo(H),ye=X.projectionMatrix.elements,xe=O.projectionMatrix.elements,Ye=ye[14]/(ye[10]-1),ze=ye[14]/(ye[10]+1),et=(ye[9]+1)/ye[5],$e=(ye[9]-1)/ye[5],Qe=(ye[8]-1)/ye[0],Lt=(xe[8]+1)/xe[0],_t=Ye*Qe,Ot=Ye*Lt,jt=Q/(-Qe+Lt),vt=jt*-Qe;if(X.matrixWorld.decompose(C.position,C.quaternion,C.scale),C.translateX(vt),C.translateZ(jt),C.matrixWorld.compose(C.position,C.quaternion,C.scale),C.matrixWorldInverse.copy(C.matrixWorld).invert(),ye[10]===-1)C.projectionMatrix.copy(X.projectionMatrix),C.projectionMatrixInverse.copy(X.projectionMatrixInverse);else{let ht=Ye+jt,V=ze+jt,en=_t-vt,nt=Ot+(Q-vt),P=et*ze/V*ht,S=$e*ze/V*ht;C.projectionMatrix.makePerspective(en,nt,P,S,ht,V),C.projectionMatrixInverse.copy(C.projectionMatrix).invert()}}function ie(C,X){X===null?C.matrixWorld.copy(C.matrix):C.matrixWorld.multiplyMatrices(X.matrixWorld,C.matrix),C.matrixWorldInverse.copy(C.matrixWorld).invert()}this.updateCamera=function(C){if(s===null)return;let X=C.near,O=C.far;g.texture!==null&&(g.depthNear>0&&(X=g.depthNear),g.depthFar>0&&(O=g.depthFar)),F.near=I.near=w.near=X,F.far=I.far=w.far=O,(k!==F.near||U!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),k=F.near,U=F.far),F.layers.mask=C.layers.mask|6,w.layers.mask=F.layers.mask&-5,I.layers.mask=F.layers.mask&-3;let Q=C.parent,ye=F.cameras;ie(F,Q);for(let xe=0;xe<ye.length;xe++)ie(ye[xe],Q);ye.length===2?ee(F,w,I):F.projectionMatrix.copy(w.projectionMatrix),ce(C,F,Q)};function ce(C,X,O){O===null?C.matrix.copy(X.matrixWorld):(C.matrix.copy(O.matrixWorld),C.matrix.invert(),C.matrix.multiply(X.matrixWorld)),C.matrix.decompose(C.position,C.quaternion,C.scale),C.updateMatrixWorld(!0),C.projectionMatrix.copy(X.projectionMatrix),C.projectionMatrixInverse.copy(X.projectionMatrixInverse),C.isPerspectiveCamera&&(C.fov=As*2*Math.atan(1/C.projectionMatrix.elements[5]),C.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(C){l=C,u!==null&&(u.fixedFoveation=C),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=C)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(F)},this.getCameraTexture=function(C){return p[C]};let Ne=null;function Be(C,X){if(h=X.getViewerPose(c||a),m=X,h!==null){let O=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let Q=!1;O.length!==F.cameras.length&&(F.cameras.length=0,Q=!0);for(let ze=0;ze<O.length;ze++){let et=O[ze],$e=null;if(f!==null)$e=f.getViewport(et);else{let Lt=d.getViewSubImage(u,et);$e=Lt.viewport,ze===0&&(e.setRenderTargetTextures(y,Lt.colorTexture,Lt.depthStencilTexture),e.setRenderTarget(y))}let Qe=N[ze];Qe===void 0&&(Qe=new zt,Qe.layers.enable(ze),Qe.viewport=new ct,N[ze]=Qe),Qe.matrix.fromArray(et.transform.matrix),Qe.matrix.decompose(Qe.position,Qe.quaternion,Qe.scale),Qe.projectionMatrix.fromArray(et.projectionMatrix),Qe.projectionMatrixInverse.copy(Qe.projectionMatrix).invert(),Qe.viewport.set($e.x,$e.y,$e.width,$e.height),ze===0&&(F.matrix.copy(Qe.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Q===!0&&F.cameras.push(Qe)}let ye=s.enabledFeatures;if(ye&&ye.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){d=n.getBinding();let ze=d.getDepthInformation(O[0]);ze&&ze.isValid&&ze.texture&&g.init(ze,s.renderState)}if(ye&&ye.includes("camera-access")&&v){e.state.unbindTexture(),d=n.getBinding();for(let ze=0;ze<O.length;ze++){let et=O[ze].camera;if(et){let $e=p[et];$e||($e=new xa,p[et]=$e);let Qe=d.getCameraImage(et);$e.sourceTexture=Qe}}}}for(let O=0;O<E.length;O++){let Q=A[O],ye=E[O];Q!==null&&ye!==void 0&&ye.update(Q,X,c||a)}Ne&&Ne(C,X),X.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:X}),m=null}let He=new lm;He.setAnimationLoop(Be),this.setAnimationLoop=function(C){Ne=C},this.dispose=function(){}}},wS=new Ae,pm=new Ve;pm.set(-1,0,0,0,1,0,0,0,1);function TS(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Mu(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,x,_,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),d(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),u(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,x,_):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===qt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===qt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let x=e.get(p),_=x.envMap,y=x.envMapRotation;_&&(g.envMap.value=_,g.envMapRotation.value.setFromMatrix4(wS.makeRotationFromEuler(y)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(pm),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,x,_){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*x,g.scale.value=_*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,x){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===qt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){let x=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ES(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,E){let A=E.program;n.uniformBlockBinding(y,A)}function c(y,E){let A=s[y.id];A===void 0&&(g(y),A=h(y),s[y.id]=A,y.addEventListener("dispose",x));let R=E.program;n.updateUBOMapping(y,R);let b=e.render.frame;r[y.id]!==b&&(u(y),r[y.id]=b)}function h(y){let E=d();y.__bindingPointIndex=E;let A=i.createBuffer(),R=y.__size,b=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,A),i.bufferData(i.UNIFORM_BUFFER,R,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,A),A}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Ue("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let E=s[y.id],A=y.uniforms,R=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let b=0,w=A.length;b<w;b++){let I=A[b];if(Array.isArray(I))for(let N=0,F=I.length;N<F;N++)f(I[N],b,N,R);else f(I,b,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,E,A,R){if(v(y,E,A,R)===!0){let b=y.__offset,w=y.value;if(Array.isArray(w)){let I=0;for(let N=0;N<w.length;N++){let F=w[N],k=p(F);m(F,y.__data,I),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(I+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(w,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,b,y.__data)}}function m(y,E,A){typeof y=="number"||typeof y=="boolean"?E[0]=y:y.isMatrix3?(E[0]=y.elements[0],E[1]=y.elements[1],E[2]=y.elements[2],E[3]=0,E[4]=y.elements[3],E[5]=y.elements[4],E[6]=y.elements[5],E[7]=0,E[8]=y.elements[6],E[9]=y.elements[7],E[10]=y.elements[8],E[11]=0):ArrayBuffer.isView(y)?E.set(new y.constructor(y.buffer,y.byteOffset,E.length)):y.toArray(E,A)}function v(y,E,A,R){let b=y.value,w=E+"_"+A;if(R[w]===void 0)return typeof b=="number"||typeof b=="boolean"?R[w]=b:ArrayBuffer.isView(b)?R[w]=b.slice():R[w]=b.clone(),!0;{let I=R[w];if(typeof b=="number"||typeof b=="boolean"){if(I!==b)return R[w]=b,!0}else{if(ArrayBuffer.isView(b))return!0;if(I.equals(b)===!1)return I.copy(b),!0}}return!1}function g(y){let E=y.uniforms,A=0,R=16;for(let w=0,I=E.length;w<I;w++){let N=Array.isArray(E[w])?E[w]:[E[w]];for(let F=0,k=N.length;F<k;F++){let U=N[F],z=Array.isArray(U.value)?U.value:[U.value];for(let q=0,Z=z.length;q<Z;q++){let D=z[q],H=p(D),ee=A%R,ie=ee%H.boundary,ce=ee+ie;A+=ie,ce!==0&&R-ce<H.storage&&(A+=R-ce),U.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=A,A+=H.storage}}}let b=A%R;return b>0&&(A+=R-b),y.__size=A,y.__cache={},this}function p(y){let E={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(E.boundary=4,E.storage=4):y.isVector2?(E.boundary=8,E.storage=8):y.isVector3||y.isColor?(E.boundary=16,E.storage=12):y.isVector4?(E.boundary=16,E.storage=16):y.isMatrix3?(E.boundary=48,E.storage=48):y.isMatrix4?(E.boundary=64,E.storage=64):y.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(E.boundary=16,E.storage=y.byteLength):Ie("WebGLRenderer: Unsupported uniform value type.",y),E}function x(y){let E=y.target;E.removeEventListener("dispose",x);let A=a.indexOf(E.__bindingPointIndex);a.splice(A,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function _(){for(let y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:_}}var AS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),hi=null;function CS(){return hi===null&&(hi=new vr(AS,16,16,os,Qt),hi.name="DFG_LUT",hi.minFilter=At,hi.magFilter=At,hi.wrapS=Fn,hi.wrapT=Fn,hi.generateMipmaps=!1,hi.needsUpdate=!0),hi}var ao=class{constructor(e={}){let{canvas:t=Ip(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=bn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let v=f,g=new Set([Hl,zl,Bl]),p=new Set([bn,Jn,Cr,Rr,kl,Ol]),x=new Uint32Array(4),_=new Int32Array(4),y=new L,E=null,A=null,R=[],b=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Yn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,N=!1,F=null,k=null,U=null,z=null;this._outputColorSpace=Tt;let q=0,Z=0,D=null,H=-1,ee=null,ie=new ct,ce=new ct,Ne=null,Be=new fe(0),He=0,C=t.width,X=t.height,O=1,Q=null,ye=null,xe=new ct(0,0,C,X),Ye=new ct(0,0,C,X),ze=!1,et=new xr,$e=!1,Qe=!1,Lt=new Ae,_t=new L,Ot=new ct,jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},vt=!1;function ht(){return D===null?O:1}let V=n;function en(T,G){return t.getContext(T,G)}try{let T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"185"}`),t.addEventListener("webglcontextlost",Dt,!1),t.addEventListener("webglcontextrestored",xt,!1),t.addEventListener("webglcontextcreationerror",Qn,!1),V===null){let G="webgl2";if(V=en(G,T),V===null)throw en(G)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(T){throw Ue("WebGLRenderer: "+T.message),T}let nt,P,S,W,J,te,me,ge,ne,re,j,oe,ae,ue,Ee,Pe,Oe,B,pe,se,ve,Me,le;function Le(){nt=new Fb(V),nt.init(),ve=new _S(V,nt),P=new Ab(V,nt,e,ve),S=new yS(V,nt),P.reversedDepthBuffer&&u&&S.buffers.depth.setReversed(!0),k=V.createFramebuffer(),U=V.createFramebuffer(),z=V.createFramebuffer(),W=new Ub(V),J=new rS,te=new bS(V,nt,S,J,P,ve,W),me=new Db(I),ge=new Vx(V),Me=new Tb(V,ge),ne=new kb(V,ge,W,Me),re=new zb(V,ne,ge,Me,W),B=new Bb(V,P,te),Ee=new Cb(J),j=new sS(I,me,nt,P,Me,Ee),oe=new TS(I,J),ae=new oS,ue=new fS(nt),Oe=new wb(I,me,S,re,m,l),Pe=new xS(I,re,P),le=new ES(V,W,P,S),pe=new Eb(V,nt,W),se=new Ob(V,nt,W),W.programs=j.programs,I.capabilities=P,I.extensions=nt,I.properties=J,I.renderLists=ae,I.shadowMap=Pe,I.state=S,I.info=W}Le(),v!==bn&&(w=new Vb(v,t.width,t.height,o,s,r));let Ce=new Hu(I,V);this.xr=Ce,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){let T=nt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=nt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(T){T!==void 0&&(O=T,this.setSize(C,X,!1))},this.getSize=function(T){return T.set(C,X)},this.setSize=function(T,G,$=!0){if(Ce.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}C=T,X=G,t.width=Math.floor(T*O),t.height=Math.floor(G*O),$===!0&&(t.style.width=T+"px",t.style.height=G+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,T,G)},this.getDrawingBufferSize=function(T){return T.set(C*O,X*O).floor()},this.setDrawingBufferSize=function(T,G,$){C=T,X=G,O=$,t.width=Math.floor(T*$),t.height=Math.floor(G*$),this.setViewport(0,0,T,G)},this.setEffects=function(T){if(v===bn){Ue("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let G=0;G<T.length;G++)if(T[G].isOutputPass===!0){Ie("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(ie)},this.getViewport=function(T){return T.copy(xe)},this.setViewport=function(T,G,$,Y){T.isVector4?xe.set(T.x,T.y,T.z,T.w):xe.set(T,G,$,Y),S.viewport(ie.copy(xe).multiplyScalar(O).round())},this.getScissor=function(T){return T.copy(Ye)},this.setScissor=function(T,G,$,Y){T.isVector4?Ye.set(T.x,T.y,T.z,T.w):Ye.set(T,G,$,Y),S.scissor(ce.copy(Ye).multiplyScalar(O).round())},this.getScissorTest=function(){return ze},this.setScissorTest=function(T){S.setScissorTest(ze=T)},this.setOpaqueSort=function(T){Q=T},this.setTransparentSort=function(T){ye=T},this.getClearColor=function(T){return T.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor(...arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha(...arguments)},this.clear=function(T=!0,G=!0,$=!0){let Y=0;if(T){let K=!1;if(D!==null){let Se=D.texture.format;K=g.has(Se)}if(K){let Se=D.texture.type,Te=p.has(Se),_e=Oe.getClearColor(),Re=Oe.getClearAlpha(),De=_e.r,Ge=_e.g,qe=_e.b;Te?(x[0]=De,x[1]=Ge,x[2]=qe,x[3]=Re,V.clearBufferuiv(V.COLOR,0,x)):(_[0]=De,_[1]=Ge,_[2]=qe,_[3]=Re,V.clearBufferiv(V.COLOR,0,_))}else Y|=V.COLOR_BUFFER_BIT}G&&(Y|=V.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(Y|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Y!==0&&V.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),F=T},this.dispose=function(){t.removeEventListener("webglcontextlost",Dt,!1),t.removeEventListener("webglcontextrestored",xt,!1),t.removeEventListener("webglcontextcreationerror",Qn,!1),Oe.dispose(),ae.dispose(),ue.dispose(),J.dispose(),me.dispose(),re.dispose(),Me.dispose(),le.dispose(),j.dispose(),Ce.dispose(),Ce.removeEventListener("sessionstart",$d),Ce.removeEventListener("sessionend",Qd),gs.stop()};function Dt(T){T.preventDefault(),ca("WebGLRenderer: Context Lost."),N=!0}function xt(){ca("WebGLRenderer: Context Restored."),N=!1;let T=W.autoReset,G=Pe.enabled,$=Pe.autoUpdate,Y=Pe.needsUpdate,K=Pe.type;Le(),W.autoReset=T,Pe.enabled=G,Pe.autoUpdate=$,Pe.needsUpdate=Y,Pe.type=K}function Qn(T){Ue("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ei(T){let G=T.target;G.removeEventListener("dispose",ei),tv(G)}function tv(T){nv(T),J.remove(T)}function nv(T){let G=J.get(T).programs;G!==void 0&&(G.forEach(function($){j.releaseProgram($)}),T.isShaderMaterial&&j.releaseShaderCache(T))}this.renderBufferDirect=function(T,G,$,Y,K,Se){G===null&&(G=jt);let Te=K.isMesh&&K.matrixWorld.determinantAffine()<0,_e=rv(T,G,$,Y,K);S.setMaterial(Y,Te);let Re=$.index,De=1;if(Y.wireframe===!0){if(Re=ne.getWireframeAttribute($),Re===void 0)return;De=2}let Ge=$.drawRange,qe=$.attributes.position,Fe=Ge.start*De,ut=(Ge.start+Ge.count)*De;Se!==null&&(Fe=Math.max(Fe,Se.start*De),ut=Math.min(ut,(Se.start+Se.count)*De)),Re!==null?(Fe=Math.max(Fe,0),ut=Math.min(ut,Re.count)):qe!=null&&(Fe=Math.max(Fe,0),ut=Math.min(ut,qe.count));let Ut=ut-Fe;if(Ut<0||Ut===1/0)return;Me.setup(K,Y,_e,$,Re);let Ft,ft=pe;if(Re!==null&&(Ft=ge.get(Re),ft=se,ft.setIndex(Ft)),K.isMesh)Y.wireframe===!0?(S.setLineWidth(Y.wireframeLinewidth*ht()),ft.setMode(V.LINES)):ft.setMode(V.TRIANGLES);else if(K.isLine){let nn=Y.linewidth;nn===void 0&&(nn=1),S.setLineWidth(nn*ht()),K.isLineSegments?ft.setMode(V.LINES):K.isLineLoop?ft.setMode(V.LINE_LOOP):ft.setMode(V.LINE_STRIP)}else K.isPoints?ft.setMode(V.POINTS):K.isSprite&&ft.setMode(V.TRIANGLES);if(K.isBatchedMesh)if(nt.get("WEBGL_multi_draw"))ft.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{let nn=K._multiDrawStarts,we=K._multiDrawCounts,Sn=K._multiDrawCount,tt=Re?ge.get(Re).bytesPerElement:1,Nn=J.get(Y).currentProgram.getUniforms();for(let ti=0;ti<Sn;ti++)Nn.setValue(V,"_gl_DrawID",ti),ft.render(nn[ti]/tt,we[ti])}else if(K.isInstancedMesh)ft.renderInstances(Fe,Ut,K.count);else if($.isInstancedBufferGeometry){let nn=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,we=Math.min($.instanceCount,nn);ft.renderInstances(Fe,Ut,we)}else ft.render(Fe,Ut)};function Zd(T,G,$){T.transparent===!0&&T.side===St&&T.forceSinglePass===!1?(T.side=qt,T.needsUpdate=!0,_o(T,G,$),T.side=an,T.needsUpdate=!0,_o(T,G,$),T.side=St):_o(T,G,$)}this.compile=function(T,G,$=null){$===null&&($=T),A=ue.get($),A.init(G),b.push(A),$.traverseVisible(function(K){K.isLight&&K.layers.test(G.layers)&&(A.pushLight(K),K.castShadow&&A.pushShadow(K))}),T!==$&&T.traverseVisible(function(K){K.isLight&&K.layers.test(G.layers)&&(A.pushLight(K),K.castShadow&&A.pushShadow(K))}),A.setupLights();let Y=new Set;return T.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;let Se=K.material;if(Se)if(Array.isArray(Se))for(let Te=0;Te<Se.length;Te++){let _e=Se[Te];Zd(_e,$,K),Y.add(_e)}else Zd(Se,$,K),Y.add(Se)}),A=b.pop(),Y},this.compileAsync=function(T,G,$=null){let Y=this.compile(T,G,$);return new Promise(K=>{function Se(){if(Y.forEach(function(Te){J.get(Te).currentProgram.isReady()&&Y.delete(Te)}),Y.size===0){K(T);return}setTimeout(Se,10)}nt.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let ph=null;function iv(T){ph&&ph(T)}function $d(){gs.stop()}function Qd(){gs.start()}let gs=new lm;gs.setAnimationLoop(iv),typeof self<"u"&&gs.setContext(self),this.setAnimationLoop=function(T){ph=T,Ce.setAnimationLoop(T),T===null?gs.stop():gs.start()},Ce.addEventListener("sessionstart",$d),Ce.addEventListener("sessionend",Qd),this.render=function(T,G){if(G!==void 0&&G.isCamera!==!0){Ue("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;F!==null&&F.renderStart(T,G);let $=Ce.enabled===!0&&Ce.isPresenting===!0,Y=w!==null&&(D===null||$)&&w.begin(I,D);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),Ce.enabled===!0&&Ce.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ce.cameraAutoUpdate===!0&&Ce.updateCamera(G),G=Ce.getCamera()),T.isScene===!0&&T.onBeforeRender(I,T,G,D),A=ue.get(T,b.length),A.init(G),A.state.textureUnits=te.getTextureUnits(),b.push(A),Lt.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),et.setFromProjectionMatrix(Lt,Wn,G.reversedDepth),Qe=this.localClippingEnabled,$e=Ee.init(this.clippingPlanes,Qe),E=ae.get(T,R.length),E.init(),R.push(E),Ce.enabled===!0&&Ce.isPresenting===!0){let Te=I.xr.getDepthSensingMesh();Te!==null&&mh(Te,G,-1/0,I.sortObjects)}mh(T,G,0,I.sortObjects),E.finish(),I.sortObjects===!0&&E.sort(Q,ye,G.reversedDepth),vt=Ce.enabled===!1||Ce.isPresenting===!1||Ce.hasDepthSensing()===!1,vt&&Oe.addToRenderList(E,T),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),$e===!0&&Ee.beginShadows();let K=A.state.shadowsArray;if(Pe.render(K,T,G),$e===!0&&Ee.endShadows(),(Y&&w.hasRenderPass())===!1){let Te=E.opaque,_e=E.transmissive;if(A.setupLights(),G.isArrayCamera){let Re=G.cameras;if(_e.length>0)for(let De=0,Ge=Re.length;De<Ge;De++){let qe=Re[De];tf(Te,_e,T,qe)}vt&&Oe.render(T);for(let De=0,Ge=Re.length;De<Ge;De++){let qe=Re[De];ef(E,T,qe,qe.viewport)}}else _e.length>0&&tf(Te,_e,T,G),vt&&Oe.render(T),ef(E,T,G)}D!==null&&Z===0&&(te.updateMultisampleRenderTarget(D),te.updateRenderTargetMipmap(D)),Y&&w.end(I),T.isScene===!0&&T.onAfterRender(I,T,G),Me.resetDefaultState(),H=-1,ee=null,b.pop(),b.length>0?(A=b[b.length-1],te.setTextureUnits(A.state.textureUnits),$e===!0&&Ee.setGlobalState(I.clippingPlanes,A.state.camera)):A=null,R.pop(),R.length>0?E=R[R.length-1]:E=null,F!==null&&F.renderEnd()};function mh(T,G,$,Y){if(T.visible===!1)return;if(T.layers.test(G.layers)){if(T.isGroup)$=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(G);else if(T.isLightProbeGrid)A.pushLightProbeGrid(T);else if(T.isLight)A.pushLight(T),T.castShadow&&A.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||et.intersectsSprite(T)){Y&&Ot.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Lt);let Te=re.update(T),_e=T.material;_e.visible&&E.push(T,Te,_e,$,Ot.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||et.intersectsObject(T))){let Te=re.update(T),_e=T.material;if(Y&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ot.copy(T.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),Ot.copy(Te.boundingSphere.center)),Ot.applyMatrix4(T.matrixWorld).applyMatrix4(Lt)),Array.isArray(_e)){let Re=Te.groups;for(let De=0,Ge=Re.length;De<Ge;De++){let qe=Re[De],Fe=_e[qe.materialIndex];Fe&&Fe.visible&&E.push(T,Te,Fe,$,Ot.z,qe)}}else _e.visible&&E.push(T,Te,_e,$,Ot.z,null)}}let Se=T.children;for(let Te=0,_e=Se.length;Te<_e;Te++)mh(Se[Te],G,$,Y)}function ef(T,G,$,Y){let{opaque:K,transmissive:Se,transparent:Te}=T;A.setupLightsView($),$e===!0&&Ee.setGlobalState(I.clippingPlanes,$),Y&&S.viewport(ie.copy(Y)),K.length>0&&bo(K,G,$),Se.length>0&&bo(Se,G,$),Te.length>0&&bo(Te,G,$),S.buffers.depth.setTest(!0),S.buffers.depth.setMask(!0),S.buffers.color.setMask(!0),S.setPolygonOffset(!1)}function tf(T,G,$,Y){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[Y.id]===void 0){let Fe=nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[Y.id]=new Rt(1,1,{generateMipmaps:!0,type:Fe?Qt:bn,minFilter:Kn,samples:Math.max(4,P.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace})}let Se=A.state.transmissionRenderTarget[Y.id],Te=Y.viewport||ie;Se.setSize(Te.z*I.transmissionResolutionScale,Te.w*I.transmissionResolutionScale);let _e=I.getRenderTarget(),Re=I.getActiveCubeFace(),De=I.getActiveMipmapLevel();I.setRenderTarget(Se),I.getClearColor(Be),He=I.getClearAlpha(),He<1&&I.setClearColor(16777215,.5),I.clear(),vt&&Oe.render($);let Ge=I.toneMapping;I.toneMapping=Yn;let qe=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),A.setupLightsView(Y),$e===!0&&Ee.setGlobalState(I.clippingPlanes,Y),bo(T,$,Y),te.updateMultisampleRenderTarget(Se),te.updateRenderTargetMipmap(Se),nt.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let ut=0,Ut=G.length;ut<Ut;ut++){let Ft=G[ut],{object:ft,geometry:nn,material:we,group:Sn}=Ft;if(we.side===St&&ft.layers.test(Y.layers)){let tt=we.side;we.side=qt,we.needsUpdate=!0,nf(ft,$,Y,nn,we,Sn),we.side=tt,we.needsUpdate=!0,Fe=!0}}Fe===!0&&(te.updateMultisampleRenderTarget(Se),te.updateRenderTargetMipmap(Se))}I.setRenderTarget(_e,Re,De),I.setClearColor(Be,He),qe!==void 0&&(Y.viewport=qe),I.toneMapping=Ge}function bo(T,G,$){let Y=G.isScene===!0?G.overrideMaterial:null;for(let K=0,Se=T.length;K<Se;K++){let Te=T[K],{object:_e,geometry:Re,group:De}=Te,Ge=Te.material;Ge.allowOverride===!0&&Y!==null&&(Ge=Y),_e.layers.test($.layers)&&nf(_e,G,$,Re,Ge,De)}}function nf(T,G,$,Y,K,Se){T.onBeforeRender(I,G,$,Y,K,Se),T.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),K.onBeforeRender(I,G,$,Y,T,Se),K.transparent===!0&&K.side===St&&K.forceSinglePass===!1?(K.side=qt,K.needsUpdate=!0,I.renderBufferDirect($,G,Y,K,T,Se),K.side=an,K.needsUpdate=!0,I.renderBufferDirect($,G,Y,K,T,Se),K.side=St):I.renderBufferDirect($,G,Y,K,T,Se),T.onAfterRender(I,G,$,Y,K,Se)}function _o(T,G,$){G.isScene!==!0&&(G=jt);let Y=J.get(T),K=A.state.lights,Se=A.state.shadowsArray,Te=K.state.version,_e=j.getParameters(T,K.state,Se,G,$,A.state.lightProbeGridArray),Re=j.getProgramCacheKey(_e),De=Y.programs;Y.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?G.environment:null,Y.fog=G.fog;let Ge=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;Y.envMap=me.get(T.envMap||Y.environment,Ge),Y.envMapRotation=Y.environment!==null&&T.envMap===null?G.environmentRotation:T.envMapRotation,De===void 0&&(T.addEventListener("dispose",ei),De=new Map,Y.programs=De);let qe=De.get(Re);if(qe!==void 0){if(Y.currentProgram===qe&&Y.lightsStateVersion===Te)return rf(T,_e),qe}else _e.uniforms=j.getUniforms(T),F!==null&&T.isNodeMaterial&&F.build(T,$,_e),T.onBeforeCompile(_e,I),qe=j.acquireProgram(_e,Re),De.set(Re,qe),Y.uniforms=_e.uniforms;let Fe=Y.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Fe.clippingPlanes=Ee.uniform),rf(T,_e),Y.needsLights=ov(T),Y.lightsStateVersion=Te,Y.needsLights&&(Fe.ambientLightColor.value=K.state.ambient,Fe.lightProbe.value=K.state.probe,Fe.directionalLights.value=K.state.directional,Fe.directionalLightShadows.value=K.state.directionalShadow,Fe.spotLights.value=K.state.spot,Fe.spotLightShadows.value=K.state.spotShadow,Fe.rectAreaLights.value=K.state.rectArea,Fe.ltc_1.value=K.state.rectAreaLTC1,Fe.ltc_2.value=K.state.rectAreaLTC2,Fe.pointLights.value=K.state.point,Fe.pointLightShadows.value=K.state.pointShadow,Fe.hemisphereLights.value=K.state.hemi,Fe.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Fe.spotLightMatrix.value=K.state.spotLightMatrix,Fe.spotLightMap.value=K.state.spotLightMap,Fe.pointShadowMatrix.value=K.state.pointShadowMatrix),Y.lightProbeGrid=A.state.lightProbeGridArray.length>0,Y.currentProgram=qe,Y.uniformsList=null,qe}function sf(T){if(T.uniformsList===null){let G=T.currentProgram.getUniforms();T.uniformsList=Lr.seqWithValue(G.seq,T.uniforms)}return T.uniformsList}function rf(T,G){let $=J.get(T);$.outputColorSpace=G.outputColorSpace,$.batching=G.batching,$.batchingColor=G.batchingColor,$.instancing=G.instancing,$.instancingColor=G.instancingColor,$.instancingMorph=G.instancingMorph,$.skinning=G.skinning,$.morphTargets=G.morphTargets,$.morphNormals=G.morphNormals,$.morphColors=G.morphColors,$.morphTargetsCount=G.morphTargetsCount,$.numClippingPlanes=G.numClippingPlanes,$.numIntersection=G.numClipIntersection,$.vertexAlphas=G.vertexAlphas,$.vertexTangents=G.vertexTangents,$.toneMapping=G.toneMapping}function sv(T,G){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;y.setFromMatrixPosition(G.matrixWorld);for(let $=0,Y=T.length;$<Y;$++){let K=T[$];if(K.texture!==null&&K.boundingBox.containsPoint(y))return K}return null}function rv(T,G,$,Y,K){G.isScene!==!0&&(G=jt),te.resetTextureUnits();let Se=G.fog,Te=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial?G.environment:null,_e=D===null?I.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:je.workingColorSpace,Re=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial&&!Y.envMap||Y.isMeshPhongMaterial&&!Y.envMap,De=me.get(Y.envMap||Te,Re),Ge=Y.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,qe=!!$.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Fe=!!$.morphAttributes.position,ut=!!$.morphAttributes.normal,Ut=!!$.morphAttributes.color,Ft=Yn;Y.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(Ft=I.toneMapping);let ft=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,nn=ft!==void 0?ft.length:0,we=J.get(Y),Sn=A.state.lights;if($e===!0&&(Qe===!0||T!==ee)){let yt=T===ee&&Y.id===H;Ee.setState(Y,T,yt)}let tt=!1;Y.version===we.__version?(we.needsLights&&we.lightsStateVersion!==Sn.state.version||we.outputColorSpace!==_e||K.isBatchedMesh&&we.batching===!1||!K.isBatchedMesh&&we.batching===!0||K.isBatchedMesh&&we.batchingColor===!0&&K.colorTexture===null||K.isBatchedMesh&&we.batchingColor===!1&&K.colorTexture!==null||K.isInstancedMesh&&we.instancing===!1||!K.isInstancedMesh&&we.instancing===!0||K.isSkinnedMesh&&we.skinning===!1||!K.isSkinnedMesh&&we.skinning===!0||K.isInstancedMesh&&we.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&we.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&we.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&we.instancingMorph===!1&&K.morphTexture!==null||we.envMap!==De||Y.fog===!0&&we.fog!==Se||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==Ee.numPlanes||we.numIntersection!==Ee.numIntersection)||we.vertexAlphas!==Ge||we.vertexTangents!==qe||we.morphTargets!==Fe||we.morphNormals!==ut||we.morphColors!==Ut||we.toneMapping!==Ft||we.morphTargetsCount!==nn||!!we.lightProbeGrid!=A.state.lightProbeGridArray.length>0)&&(tt=!0):(tt=!0,we.__version=Y.version);let Nn=we.currentProgram;tt===!0&&(Nn=_o(Y,G,K),F&&Y.isNodeMaterial&&F.onUpdateProgram(Y,Nn,we));let ti=!1,zi=!1,Gs=!1,pt=Nn.getUniforms(),Bt=we.uniforms;if(S.useProgram(Nn.program)&&(ti=!0,zi=!0,Gs=!0),Y.id!==H&&(H=Y.id,zi=!0),we.needsLights){let yt=sv(A.state.lightProbeGridArray,K);we.lightProbeGrid!==yt&&(we.lightProbeGrid=yt,zi=!0)}if(ti||ee!==T){S.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),pt.setValue(V,"projectionMatrix",T.projectionMatrix),pt.setValue(V,"viewMatrix",T.matrixWorldInverse);let Vi=pt.map.cameraPosition;Vi!==void 0&&Vi.setValue(V,_t.setFromMatrixPosition(T.matrixWorld)),P.logarithmicDepthBuffer&&pt.setValue(V,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&pt.setValue(V,"isOrthographic",T.isOrthographicCamera===!0),ee!==T&&(ee=T,zi=!0,Gs=!0)}if(we.needsLights&&(Sn.state.directionalShadowMap.length>0&&pt.setValue(V,"directionalShadowMap",Sn.state.directionalShadowMap,te),Sn.state.spotShadowMap.length>0&&pt.setValue(V,"spotShadowMap",Sn.state.spotShadowMap,te),Sn.state.pointShadowMap.length>0&&pt.setValue(V,"pointShadowMap",Sn.state.pointShadowMap,te)),K.isSkinnedMesh){pt.setOptional(V,K,"bindMatrix"),pt.setOptional(V,K,"bindMatrixInverse");let yt=K.skeleton;yt&&(yt.boneTexture===null&&yt.computeBoneTexture(),pt.setValue(V,"boneTexture",yt.boneTexture,te))}K.isBatchedMesh&&(pt.setOptional(V,K,"batchingTexture"),pt.setValue(V,"batchingTexture",K._matricesTexture,te),pt.setOptional(V,K,"batchingIdTexture"),pt.setValue(V,"batchingIdTexture",K._indirectTexture,te),pt.setOptional(V,K,"batchingColorTexture"),K._colorsTexture!==null&&pt.setValue(V,"batchingColorTexture",K._colorsTexture,te));let Hi=$.morphAttributes;if((Hi.position!==void 0||Hi.normal!==void 0||Hi.color!==void 0)&&B.update(K,$,Nn),(zi||we.receiveShadow!==K.receiveShadow)&&(we.receiveShadow=K.receiveShadow,pt.setValue(V,"receiveShadow",K.receiveShadow)),(Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial)&&Y.envMap===null&&G.environment!==null&&(Bt.envMapIntensity.value=G.environmentIntensity),Bt.dfgLUT!==void 0&&(Bt.dfgLUT.value=CS()),zi){if(pt.setValue(V,"toneMappingExposure",I.toneMappingExposure),we.needsLights&&av(Bt,Gs),Se&&Y.fog===!0&&oe.refreshFogUniforms(Bt,Se),oe.refreshMaterialUniforms(Bt,Y,O,X,A.state.transmissionRenderTarget[T.id]),we.needsLights&&we.lightProbeGrid){let yt=we.lightProbeGrid;Bt.probesSH.value=yt.texture,Bt.probesMin.value.copy(yt.boundingBox.min),Bt.probesMax.value.copy(yt.boundingBox.max),Bt.probesResolution.value.copy(yt.resolution)}Lr.upload(V,sf(we),Bt,te)}if(Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Lr.upload(V,sf(we),Bt,te),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&pt.setValue(V,"center",K.center),pt.setValue(V,"modelViewMatrix",K.modelViewMatrix),pt.setValue(V,"normalMatrix",K.normalMatrix),pt.setValue(V,"modelMatrix",K.matrixWorld),Y.uniformsGroups!==void 0){let yt=Y.uniformsGroups;for(let Vi=0,js=yt.length;Vi<js;Vi++){let af=yt[Vi];le.update(af,Nn),le.bind(af,Nn)}}return Nn}function av(T,G){T.ambientLightColor.needsUpdate=G,T.lightProbe.needsUpdate=G,T.directionalLights.needsUpdate=G,T.directionalLightShadows.needsUpdate=G,T.pointLights.needsUpdate=G,T.pointLightShadows.needsUpdate=G,T.spotLights.needsUpdate=G,T.spotLightShadows.needsUpdate=G,T.rectAreaLights.needsUpdate=G,T.hemisphereLights.needsUpdate=G}function ov(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return Z},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(T,G,$){let Y=J.get(T);Y.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),J.get(T.texture).__webglTexture=G,J.get(T.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:$,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,G){let $=J.get(T);$.__webglFramebuffer=G,$.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(T,G=0,$=0){D=T,q=G,Z=$;let Y=null,K=!1,Se=!1;if(T){let _e=J.get(T);if(_e.__useDefaultFramebuffer!==void 0){S.bindFramebuffer(V.FRAMEBUFFER,_e.__webglFramebuffer),ie.copy(T.viewport),ce.copy(T.scissor),Ne=T.scissorTest,S.viewport(ie),S.scissor(ce),S.setScissorTest(Ne),H=-1;return}else if(_e.__webglFramebuffer===void 0)te.setupRenderTarget(T);else if(_e.__hasExternalTextures)te.rebindTextures(T,J.get(T.texture).__webglTexture,J.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Ge=T.depthTexture;if(_e.__boundDepthTexture!==Ge){if(Ge!==null&&J.has(Ge)&&(T.width!==Ge.image.width||T.height!==Ge.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");te.setupDepthRenderbuffer(T)}}let Re=T.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(Se=!0);let De=J.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(De[G])?Y=De[G][$]:Y=De[G],K=!0):T.samples>0&&te.useMultisampledRTT(T)===!1?Y=J.get(T).__webglMultisampledFramebuffer:Array.isArray(De)?Y=De[$]:Y=De,ie.copy(T.viewport),ce.copy(T.scissor),Ne=T.scissorTest}else ie.copy(xe).multiplyScalar(O).floor(),ce.copy(Ye).multiplyScalar(O).floor(),Ne=ze;if($!==0&&(Y=k),S.bindFramebuffer(V.FRAMEBUFFER,Y)&&S.drawBuffers(T,Y),S.viewport(ie),S.scissor(ce),S.setScissorTest(Ne),K){let _e=J.get(T.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+G,_e.__webglTexture,$)}else if(Se){let _e=G;for(let Re=0;Re<T.textures.length;Re++){let De=J.get(T.textures[Re]);V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0+Re,De.__webglTexture,$,_e)}}else if(T!==null&&$!==0){let _e=J.get(T.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,_e.__webglTexture,$)}H=-1},this.readRenderTargetPixels=function(T,G,$,Y,K,Se,Te,_e=0){if(!(T&&T.isWebGLRenderTarget)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=J.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re){S.bindFramebuffer(V.FRAMEBUFFER,Re);try{let De=T.textures[_e],Ge=De.format,qe=De.type;if(T.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+_e),!P.textureFormatReadable(Ge)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!P.textureTypeReadable(qe)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=T.width-Y&&$>=0&&$<=T.height-K&&V.readPixels(G,$,Y,K,ve.convert(Ge),ve.convert(qe),Se)}finally{let De=D!==null?J.get(D).__webglFramebuffer:null;S.bindFramebuffer(V.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(T,G,$,Y,K,Se,Te,_e=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=J.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Te!==void 0&&(Re=Re[Te]),Re)if(G>=0&&G<=T.width-Y&&$>=0&&$<=T.height-K){S.bindFramebuffer(V.FRAMEBUFFER,Re);let De=T.textures[_e],Ge=De.format,qe=De.type;if(T.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+_e),!P.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!P.textureTypeReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Fe=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,Fe),V.bufferData(V.PIXEL_PACK_BUFFER,Se.byteLength,V.STREAM_READ),V.readPixels(G,$,Y,K,ve.convert(Ge),ve.convert(qe),0);let ut=D!==null?J.get(D).__webglFramebuffer:null;S.bindFramebuffer(V.FRAMEBUFFER,ut);let Ut=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await Np(V,Ut,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,Fe),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,Se),V.deleteBuffer(Fe),V.deleteSync(Ut),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,G=null,$=0){let Y=Math.pow(2,-$),K=Math.floor(T.image.width*Y),Se=Math.floor(T.image.height*Y),Te=G!==null?G.x:0,_e=G!==null?G.y:0;te.setTexture2D(T,0),V.copyTexSubImage2D(V.TEXTURE_2D,$,0,0,Te,_e,K,Se),S.unbindTexture()},this.copyTextureToTexture=function(T,G,$=null,Y=null,K=0,Se=0){let Te,_e,Re,De,Ge,qe,Fe,ut,Ut,Ft=T.isCompressedTexture?T.mipmaps[Se]:T.image;if($!==null)Te=$.max.x-$.min.x,_e=$.max.y-$.min.y,Re=$.isBox3?$.max.z-$.min.z:1,De=$.min.x,Ge=$.min.y,qe=$.isBox3?$.min.z:0;else{let Bt=Math.pow(2,-K);Te=Math.floor(Ft.width*Bt),_e=Math.floor(Ft.height*Bt),T.isDataArrayTexture?Re=Ft.depth:T.isData3DTexture?Re=Math.floor(Ft.depth*Bt):Re=1,De=0,Ge=0,qe=0}Y!==null?(Fe=Y.x,ut=Y.y,Ut=Y.z):(Fe=0,ut=0,Ut=0);let ft=ve.convert(G.format),nn=ve.convert(G.type),we;G.isData3DTexture?(te.setTexture3D(G,0),we=V.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(te.setTexture2DArray(G,0),we=V.TEXTURE_2D_ARRAY):(te.setTexture2D(G,0),we=V.TEXTURE_2D),S.activeTexture(V.TEXTURE0),S.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,G.flipY),S.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),S.pixelStorei(V.UNPACK_ALIGNMENT,G.unpackAlignment);let Sn=S.getParameter(V.UNPACK_ROW_LENGTH),tt=S.getParameter(V.UNPACK_IMAGE_HEIGHT),Nn=S.getParameter(V.UNPACK_SKIP_PIXELS),ti=S.getParameter(V.UNPACK_SKIP_ROWS),zi=S.getParameter(V.UNPACK_SKIP_IMAGES);S.pixelStorei(V.UNPACK_ROW_LENGTH,Ft.width),S.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Ft.height),S.pixelStorei(V.UNPACK_SKIP_PIXELS,De),S.pixelStorei(V.UNPACK_SKIP_ROWS,Ge),S.pixelStorei(V.UNPACK_SKIP_IMAGES,qe);let Gs=T.isDataArrayTexture||T.isData3DTexture,pt=G.isDataArrayTexture||G.isData3DTexture;if(T.isDepthTexture){let Bt=J.get(T),Hi=J.get(G),yt=J.get(Bt.__renderTarget),Vi=J.get(Hi.__renderTarget);S.bindFramebuffer(V.READ_FRAMEBUFFER,yt.__webglFramebuffer),S.bindFramebuffer(V.DRAW_FRAMEBUFFER,Vi.__webglFramebuffer);for(let js=0;js<Re;js++)Gs&&(V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,J.get(T).__webglTexture,K,qe+js),V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,J.get(G).__webglTexture,Se,Ut+js)),V.blitFramebuffer(De,Ge,Te,_e,Fe,ut,Te,_e,V.DEPTH_BUFFER_BIT,V.NEAREST);S.bindFramebuffer(V.READ_FRAMEBUFFER,null),S.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else if(K!==0||T.isRenderTargetTexture||J.has(T)){let Bt=J.get(T),Hi=J.get(G);S.bindFramebuffer(V.READ_FRAMEBUFFER,U),S.bindFramebuffer(V.DRAW_FRAMEBUFFER,z);for(let yt=0;yt<Re;yt++)Gs?V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Bt.__webglTexture,K,qe+yt):V.framebufferTexture2D(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,Bt.__webglTexture,K),pt?V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Hi.__webglTexture,Se,Ut+yt):V.framebufferTexture2D(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,Hi.__webglTexture,Se),K!==0?V.blitFramebuffer(De,Ge,Te,_e,Fe,ut,Te,_e,V.COLOR_BUFFER_BIT,V.NEAREST):pt?V.copyTexSubImage3D(we,Se,Fe,ut,Ut+yt,De,Ge,Te,_e):V.copyTexSubImage2D(we,Se,Fe,ut,De,Ge,Te,_e);S.bindFramebuffer(V.READ_FRAMEBUFFER,null),S.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else pt?T.isDataTexture||T.isData3DTexture?V.texSubImage3D(we,Se,Fe,ut,Ut,Te,_e,Re,ft,nn,Ft.data):G.isCompressedArrayTexture?V.compressedTexSubImage3D(we,Se,Fe,ut,Ut,Te,_e,Re,ft,Ft.data):V.texSubImage3D(we,Se,Fe,ut,Ut,Te,_e,Re,ft,nn,Ft):T.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,Se,Fe,ut,Te,_e,ft,nn,Ft.data):T.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,Se,Fe,ut,Ft.width,Ft.height,ft,Ft.data):V.texSubImage2D(V.TEXTURE_2D,Se,Fe,ut,Te,_e,ft,nn,Ft);S.pixelStorei(V.UNPACK_ROW_LENGTH,Sn),S.pixelStorei(V.UNPACK_IMAGE_HEIGHT,tt),S.pixelStorei(V.UNPACK_SKIP_PIXELS,Nn),S.pixelStorei(V.UNPACK_SKIP_ROWS,ti),S.pixelStorei(V.UNPACK_SKIP_IMAGES,zi),Se===0&&G.generateMipmaps&&V.generateMipmap(we),S.unbindTexture()},this.initRenderTarget=function(T){J.get(T).__webglFramebuffer===void 0&&te.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?te.setTextureCube(T,0):T.isData3DTexture?te.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?te.setTexture2DArray(T,0):te.setTexture2D(T,0),S.unbindTexture()},this.resetState=function(){q=0,Z=0,D=null,S.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}};var Vu=Object.freeze({z:1,c:-1}),mm=1.5;function gm({activeElement:i,modalGuard:e,floatOpen:t,dragInProgress:n,isComposing:s}={}){return s||t||n||e?!0:RS(i)}function RS(i){if(!i)return!1;let e=i.tagName;return e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||i.isContentEditable===!0}function vm(i){let e=0;for(let t of i??[])e+=Vu[t]??0;return e>0?1:e<0?-1:0}var Tc=Math.PI/180,xm=new L,ym=new L,Gu=20*Tc,ju=75*Tc,Ec=class{constructor(e){this.camera=e,this.target=new L(0,0,0),this.theta=-Math.PI/2,this.phi=45*Tc,this.dist=15,this.tween=null,this.spinKeys=new Set,this.apply()}apply(){let{theta:e,phi:t,dist:n,target:s}=this,r=Math.min(ju,Math.max(Gu,t)),a=Math.sin(r);this.camera.position.set(s.x+n*a*Math.sin(e),s.y+n*Math.cos(r),s.z+n*a*Math.cos(e)),this.camera.lookAt(s),this.phi=r,this.camera.updateMatrixWorld()}spin(e){this.tween=null,this.theta-=e*.005,this.apply()}setSpinKey(e,t){let n=String(e??"").toLowerCase();n in Vu&&(t?this.spinKeys.add(n):this.spinKeys.delete(n))}clearSpinKeys(){this.spinKeys.clear()}keySpin(e){let t=vm(this.spinKeys);return t===0?!1:(this.tween=null,this.theta+=t*mm*((e??0)/1e3),this.apply(),!0)}setPitchDeg(e){this.phi=Math.min(ju,Math.max(Gu,(90-e)*Tc)),this.apply()}pan(e,t){this.tween=null;let n=this.dist*.0016,s=this.camera;xm.setFromMatrixColumn(s.matrix,0),ym.setFromMatrixColumn(s.matrix,1),this.target.addScaledVector(xm,-e*n),this.target.addScaledVector(ym,t*n),this.target.y=0,this.apply()}zoom(e,t){this.tween=null;let n=Math.exp(e*.0012),s=Math.min(220,Math.max(4,this.dist*n));t&&this.target.add(t.multiplyScalar(1-s/this.dist)),this.dist=s,this.apply()}pose(){return{theta:this.theta,phi:this.phi,dist:this.dist,tx:this.target.x,tz:this.target.z}}loadPose(e){!e||typeof e!="object"||(Number.isFinite(e.theta)&&(this.theta=e.theta),Number.isFinite(e.dist)&&e.dist>0&&(this.dist=e.dist),Number.isFinite(e.tx)&&(this.target.x=e.tx),Number.isFinite(e.tz)&&(this.target.z=e.tz),this.tween=null,this.apply())}flyTo(e,t=700){let n={theta:e.theta??this.theta,phi:Math.min(ju,Math.max(Gu,e.phi??this.phi)),dist:Math.min(220,Math.max(4,e.dist??this.dist)),tx:e.tx??this.target.x,tz:e.tz??this.target.z},s=n.theta-this.theta;for(;s>Math.PI;)s-=Math.PI*2;for(;s<-Math.PI;)s+=Math.PI*2;this.tween={from:{theta:this.theta,phi:this.phi,dist:this.dist,tx:this.target.x,tz:this.target.z},to:{...n,theta:this.theta+s},start:performance.now(),ms:t}}update(){let e=this.tween;if(!e)return!1;let t=Math.min(1,(performance.now()-e.start)/e.ms),n=t*t*(3-2*t),s=(r,a)=>r+(a-r)*n;return this.theta=s(e.from.theta,e.to.theta),this.phi=s(e.from.phi,e.to.phi),this.dist=s(e.from.dist,e.to.dist),this.target.x=s(e.from.tx,e.to.tx),this.target.z=s(e.from.tz,e.to.tz),this.apply(),t>=1&&(this.tween=null),!0}};var Fr=Math.sqrt(3),Pt=.8,Ac=Object.freeze([Object.freeze({q:1,r:0}),Object.freeze({q:1,r:-1}),Object.freeze({q:0,r:-1}),Object.freeze({q:-1,r:0}),Object.freeze({q:-1,r:1}),Object.freeze({q:0,r:1})]);function Cc(i,e){return{q:i.q+e.q,r:i.r+e.r}}function Bn(i){return i.q+","+i.r}function bm(i,e){let t=i.q-e.q,n=i.r-e.r;return(Math.abs(t)+Math.abs(n)+Math.abs(t+n))/2}function Xt(i,e=1){return{x:1.5*e*i.q,z:Fr*e*(i.r+i.q/2)}}function Rc(i,e,t=1){let n=i/(1.5*t),s=e/(Fr*t)-n/2;return IS(n,s,-n-s)}function IS(i,e,t){let n=Math.round(i),s=Math.round(e),r=Math.round(t),a=Math.abs(n-i),o=Math.abs(s-e),l=Math.abs(r-t);return a>o&&a>l?n=-s-r:o>l&&(s=-n-r),{q:n,r:s}}function PS(i,e){let t=[];if(e<=0)return t;let n=i;for(let s=0;s<e;s++)n=Cc(n,Ac[4]);for(let s=0;s<6;s++)for(let r=0;r<e;r++)t.push(n),n=Cc(n,Ac[s]);return t}function Zn(i,e){let t=[i];for(let n=1;n<=e;n++)t.push(...PS(i,n));return t}function kr(i){return 3*i*i-3*i+1}function _m(i,e){return Zn(i,Math.max(0,e-1))}function Sm(i,e=3){let t=Math.max(1,e);for(;kr(t)<i;)t++;return t}function Wu(i){return Math.max(0,i-1)}function Ic(i,e,t,n,s=1){return bm(i,t)>Wu(e)+Wu(n)+s}function Mm(i,e,t=1){let n=Zn(i,Math.max(0,e-1)),s=new Set(n.map(Bn)),r=[];for(let a of n)for(let o of Ac){let l=Cc(a,o);if(s.has(Bn(l)))continue;let c=Xt(a,t),h=Xt(l,t),d=h.x-c.x,u=h.z-c.z,f=Math.hypot(d,u)||1;d/=f,u/=f;let m=Math.atan2(u,d),v=Fr/2*t;r.push({mx:c.x+Math.cos(m)*v,mz:c.z+Math.sin(m)*v,dx:d,dz:u})}return r}function wm(i,e,t=1){let n=Zn(i,Math.max(0,e-1)),s=new Set(n.map(Bn)),r=[],a=new Set;for(let o of n){let l=Bn(o);for(let c of Ac){let h=Cc(o,c),d=Bn(h);if(!s.has(d))continue;let u=l<d?l+"|"+d:d+"|"+l;if(a.has(u))continue;a.add(u);let f=Xt(o,t),m=Xt(h,t),v=m.x-f.x,g=m.z-f.z,p=Math.hypot(v,g)||1;v/=p,g/=p;let x=Math.atan2(g,v),_=Fr/2*t;r.push({mx:f.x+Math.cos(x)*_,mz:f.z+Math.sin(x)*_,dx:v,dz:g})}}return r}function Di(i){return"#"+Number(i).toString(16).padStart(6,"0")}var ke=Object.freeze({voidTop:1445934,horizonGlow:2282478,voidGround:854814,groundDeep:328973,keyLight:16769720,rimPurple:11898111,hemiSky:14206106,hemiGround:1708083,ambient:15129800,amberAccent:15246908,amberEmber:8015120,floorBase:1184274,floorLine:3092277,padBase:9662508,padInner:11570739,floorUnder:2366220,wallGold:9071140,wallGoldEmissive:15246908,wallTrim:15906116,outline:16777215,moteCyan:8186101,hexFxWhite:16777215,hexFxGray:9147296,hexFxGreen:5890158,hexFxYellow:16766029,watermarkPlate:3421246,watermarkText:13817567,linkBeeDrone:15246908,linkSummon:11898111,vignetteInner:"rgba(18, 16, 42, 0)",vignetteOuter:"rgba(8, 7, 20, 0.62)"}),Or=3,Hs=Object.freeze({outerWallAlpha:.7,innerWallAlpha:.4,innerTrimAlpha:.45,trimGlow:1.9,wallGold:"#8a6a24",trimColor:"#f2b544",floorBase:"#121212",floorLine:"#2f2f35",padBase:"#93702c",padInner:"#b08e33",outlineColor:"#ffffff",amberColor:"#e8a63c",moteColor:"#7ce8f5",skyTop:"#16102e",horizonGlow:"#22d3ee"});function Tm(i,e,t,n,s){i.beginPath();for(let r=0;r<6;r++){let a=r*Math.PI/3,o=(e+Math.cos(a)*n)*s,l=(t+Math.sin(a)*n)*s;r===0?i.moveTo(o,l):i.lineTo(o,l)}i.closePath()}function NS(i,e,t,n,{base:s,line:r,speckle:a}){i.fillStyle=s,i.fillRect(0,0,e,t);let o=[];for(let l=-1;l<=3;l++)for(let c=-2;c<=3;c++)o.push([1.5*l,Math.sqrt(3)*(c+l/2)]);for(let[l,c]of o)i.fillStyle=r,Tm(i,l,c,1,n),i.fill(),i.fillStyle=s,Tm(i,l,c,.9,n),i.fill();if(a)for(let l=0;l<900;l++)i.fillStyle=a,i.fillRect(Math.random()*e,Math.random()*t,2,2)}function LS(){let e=Math.sqrt(3),t=128,n=Math.round(3*t),s=Math.round(e*t),r=document.createElement("canvas");r.width=n,r.height=s;let a=r.getContext("2d"),o="rgba(255, 255, 255, 0.02)",l=(h,d)=>NS(a,n,s,n/3,{base:h,line:d,speckle:o});l(Di(ke.floorBase),Di(ke.floorLine));let c=new Qi(r);return c.wrapS=qn,c.wrapT=qn,c.colorSpace=Tt,c.anisotropy=8,{albedo:c,pitchX:3,pitchZ:e,redraw:(h,d)=>{l(h,d),c.needsUpdate=!0}}}function Em(i,e){i.onBeforeCompile=t=>{t.uniforms.uJyvCenter=e.uJyvCenter,t.uniforms.uJyvRadius=e.uJyvRadius,t.uniforms.uJyvFade=e.uJyvFade,t.vertexShader=`varying vec3 vJyvWorld;
`+t.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
 vJyvWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`),t.fragmentShader=`uniform vec2 uJyvCenter;
uniform float uJyvRadius;
uniform vec3 uJyvFade;
varying vec3 vJyvWorld;
`+t.fragmentShader.replace("#include <tonemapping_fragment>",`float jyvR = length(vJyvWorld.xz - uJyvCenter) / max(uJyvRadius, 1.0);
gl_FragColor.rgb = mix(gl_FragColor.rgb, uJyvFade, smoothstep(0.58, 0.92, jyvR));
#include <tonemapping_fragment>`)}}function DS(){let e=document.createElement("canvas");e.width=256,e.height=256;let t=e.getContext("2d"),n=a=>{t.beginPath();for(let o=0;o<6;o++){let l=o*Math.PI/3,c=256/2+Math.cos(l)*a,h=256/2+Math.sin(l)*a;o===0?t.moveTo(c,h):t.lineTo(c,h)}t.closePath()},s=(a,o)=>{t.fillStyle=a,t.fillRect(0,0,256,256),t.fillStyle=o,n(256*.39),t.fill()};s(Di(ke.padBase),Di(ke.padInner));let r=new Qi(e);return r.colorSpace=Tt,r.anisotropy=4,r.repeat.set(.5,.5),r.offset.set(.5,.5),{texture:r,redraw:(a,o)=>{s(a,o),r.needsUpdate=!0}}}function Lc(i=0){let e=new ts,t=[];for(let s=0;s<6;s++){let r=s*Math.PI/3;t.push([Math.cos(r),Math.sin(r)])}e.moveTo(t[0][0],t[0][1]);for(let s=1;s<6;s++)e.lineTo(t[s][0],t[s][1]);if(e.closePath(),i>0){let s=new Is,r=[],a=Math.max(.05,1-i);for(let o=0;o<6;o++)r.push([t[o][0]*a,t[o][1]*a]);s.moveTo(r[0][0],r[0][1]);for(let o=1;o<6;o++)s.lineTo(r[o][0],r[o][1]);s.closePath(),e.holes.push(s)}let n=new Ns(e);return n.rotateX(-Math.PI/2),n}var Pc=class{constructor(e,t={}){let{albedo:n,pitchX:s,pitchZ:r,redraw:a}=LS();this.redrawFloor=a,this.pitchX=s,this.pitchZ=r;let o=Math.round(300)*s,l=Math.round(520)*r;n.repeat.set(o/s,l/r),this.fadeUniforms={uJyvCenter:{value:new he(0,0)},uJyvRadius:{value:o/2},uJyvFade:{value:new fe(ke.groundDeep)}},this.material=new $t({map:n,color:16777215,roughness:.82,metalness:.08,side:an}),this.underMaterial=new $t({map:n,color:16777215,roughness:.9,metalness:.05,side:qt,transparent:!0,opacity:.45,depthWrite:!1}),Em(this.material,this.fadeUniforms),Em(this.underMaterial,this.fadeUniforms),this.mesh=new Ze(new ln(o,l),this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.y=0,this.mesh.receiveShadow=!0,this.underMesh=new Ze(this.mesh.geometry,this.underMaterial),this.underMesh.rotation.x=-Math.PI/2,this.underMesh.position.y=0,this.underMesh.renderOrder=2,e.add(this.mesh),e.add(this.underMesh),this.scene=e,this.lastSnap=""}update(e){let t=Math.round(e.x/this.pitchX)*this.pitchX,n=Math.round(e.z/this.pitchZ)*this.pitchZ,s=t+","+n;s!==this.lastSnap&&(this.lastSnap=s,this.mesh.position.x=t,this.mesh.position.z=n,this.underMesh.position.x=t,this.underMesh.position.z=n,this.fadeUniforms.uJyvCenter.value.set(t,n))}frame(){}applyAppearance(e={}){(e.floorBase||e.floorLine)&&this.redrawFloor(e.floorBase??Di(ke.floorBase),e.floorLine??Di(ke.floorLine))}dispose(){this.scene.remove(this.mesh),this.scene.remove(this.underMesh),this.mesh.geometry.dispose(),this.material.map?.dispose(),this.material.dispose(),this.underMaterial.dispose()}},Nc=class{constructor(e,t={}){this.scale=t.scale??1,this.floorGeo=Lc(0);let{texture:n,redraw:s}=DS();this.floorTexture=n,this.redrawPad=s,this.matFloor=new $t({map:this.floorTexture,color:t.floorTop??16777215,roughness:.6,metalness:.08,side:an,transparent:!0,opacity:.97}),this.matFloorUnder=new $t({color:t.floorBottom??ke.floorUnder,roughness:.9,metalness:.05,side:qt,transparent:!0,opacity:.35,depthWrite:!1}),this.floor=null,this.floorUnder=null,this.pickIndex=[],this.group=new Et,e.add(this.group),this.matrix=new Ae}setStudios(e){this.floor&&(this.group.remove(this.floor),this.floor.dispose(),this.floor=null),this.floorUnder&&(this.group.remove(this.floorUnder),this.floorUnder.dispose(),this.floorUnder=null);let t=[];this.pickIndex=[];for(let s of e){let r=Zn(s.center,Math.max(0,s.layer-1));for(let a of r)this.pickIndex.push(s.workspaceId),t.push(a)}let n=Math.max(1,t.length);this.floor=new rt(this.floorGeo,this.matFloor,n),this.floorUnder=new rt(this.floorGeo,this.matFloorUnder,n);for(let s of[this.floor,this.floorUnder])s.count=t.length,s.frustumCulled=!1,s.renderOrder=2;this.floor.receiveShadow=!0;for(let s=0;s<t.length;s++){let r=Xt(t[s],this.scale);this.matrix.makeTranslation(r.x,.012,r.z),this.floor.setMatrixAt(s,this.matrix),this.floorUnder.setMatrixAt(s,this.matrix)}this.group.add(this.floor),this.group.add(this.floorUnder)}studioAt(e){return this.pickIndex[e]??null}frame(){}applyAppearance(e={}){(e.padBase||e.padInner)&&this.redrawPad(e.padBase??Di(ke.padBase),e.padInner??Di(ke.padInner))}dispose(){this.floor&&(this.group.remove(this.floor),this.floor.dispose()),this.floorUnder&&(this.group.remove(this.floorUnder),this.floorUnder.dispose()),this.floorGeo.dispose(),this.floorTexture.dispose(),this.matFloor.dispose(),this.matFloorUnder.dispose()}};var Ur=.9,FS=.07,kS=.055,Am=.03,OS=.3;function US(i,e,t){i.onBeforeCompile=n=>{n.uniforms.uJyvCam=e,n.uniforms.uJyvAlpha=t,n.vertexShader=`varying vec3 vJyvWorld;
varying vec3 vJyvNormalW;
`+n.vertexShader.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
 vJyvNormalW = normalize(mat3(instanceMatrix) * objectNormal);`).replace("#include <begin_vertex>",`#include <begin_vertex>
 vec4 jyvWp4 = vec4(transformed, 1.0);
 jyvWp4 = instanceMatrix * jyvWp4;
 vJyvWorld = (modelMatrix * jyvWp4).xyz;`),n.fragmentShader=`uniform vec3 uJyvCam;
uniform vec2 uJyvAlpha;
varying vec3 vJyvWorld;
varying vec3 vJyvNormalW;
`+n.fragmentShader.replace("#include <dithering_fragment>",`#include <dithering_fragment>
 float jyvFacing = dot(normalize(vJyvNormalW), normalize(uJyvCam - vJyvWorld));
 float jyvAbove = normalize(uJyvCam - vJyvWorld).y;
 float jyvFade = smoothstep(0.0, 0.30, jyvFacing) * smoothstep(0.22, 0.52, jyvAbove);
 gl_FragColor.a *= mix(uJyvAlpha.x, uJyvAlpha.y, jyvFade);`)}}function BS(i,e,t){let n=new $t({color:ke.wallGold,emissive:ke.wallGoldEmissive,emissiveIntensity:t,roughness:.42,metalness:.16,transparent:!0,depthWrite:!1,side:St});return US(n,i,e),n}var Dc=class{constructor(e,t={}){this.geometry=new ln(1,1),this.geometry.translate(0,.5,0),this.fadeUniform={value:new L},this.outerAlphaUniform={value:new he(.7,.2)},this.material=BS(this.fadeUniform,this.outerAlphaUniform,.6),this.innerMaterial=new $t({color:ke.wallGold,emissive:ke.wallGoldEmissive,emissiveIntensity:.25,transparent:!0,opacity:.4,depthWrite:!1,side:St}),this.innerTrimMaterial=new $t({color:1708550,emissive:ke.wallTrim,emissiveIntensity:1.2,transparent:!0,opacity:.45,depthWrite:!1,roughness:.4,metalness:.1}),this.mesh=null,this.innerMesh=null,this.innerTrim=null,this.trimGeometry=new es(1,FS,kS),this.trimMaterial=new $t({color:1708550,emissive:ke.wallTrim,emissiveIntensity:1.9,roughness:.4,metalness:.1}),this.trimDimMaterial=new $t({color:1708550,emissive:ke.wallTrim,emissiveIntensity:OS,roughness:.4,metalness:.1}),this.trim=null,this.trimDim=null,this.highlighted=null,this.trimPanels=[],this.pickIndex=[],this.scene=e,this.matrix=new Ae,this.pos=new L,this.quat=new Ct,this.euler=new on,this.scaleV=new L}setStudios(e){for(let r of["mesh","innerMesh","trim","trimDim","innerTrim"])this[r]&&(this.scene.remove(this[r]),this[r].dispose(),this[r]=null);let t=[],n=[];for(let r of e){for(let a of r.edges??[])t.push({...a,workspaceId:r.workspaceId});for(let a of r.interiorEdges??[])n.push({...a,workspaceId:r.workspaceId})}this.pickIndex=t.map(r=>r.workspaceId),this.trimPanels=t,this.mesh=new rt(this.geometry,this.material,Math.max(1,t.length)),this.mesh.count=t.length,this.mesh.frustumCulled=!1,this.mesh.renderOrder=20,this.mesh.castShadow=!0,this.innerMesh=new rt(this.geometry,this.innerMaterial,Math.max(1,n.length)),this.innerMesh.count=n.length,this.innerMesh.frustumCulled=!1,this.innerMesh.renderOrder=19,this.innerTrim=new rt(this.trimGeometry,this.innerTrimMaterial,Math.max(1,n.length)),this.innerTrim.count=n.length,this.innerTrim.frustumCulled=!1,this.innerTrim.renderOrder=21;let s=[];for(let r=0;r<t.length;r++){let a=t[r];this.pos.set(a.mx,0,a.mz),this.euler.set(0,Math.atan2(a.dx,a.dz),0),this.quat.setFromEuler(this.euler),this.scaleV.set(1,Ur,1),this.matrix.compose(this.pos,this.quat,this.scaleV),this.mesh.setMatrixAt(r,this.matrix);let o=Math.hypot(a.dx,a.dz)||1;this.pos.set(a.mx+a.dx/o*Am,Ur,a.mz+a.dz/o*Am),this.scaleV.set(1,1,1),this.matrix.compose(this.pos,this.quat,this.scaleV),s.push({workspaceId:a.workspaceId,matrix:this.matrix.clone()})}this.trimXforms=s;for(let r=0;r<n.length;r++){let a=n[r];this.pos.set(a.mx,0,a.mz),this.euler.set(0,Math.atan2(a.dx,a.dz),0),this.quat.setFromEuler(this.euler),this.scaleV.set(1,Ur,1),this.matrix.compose(this.pos,this.quat,this.scaleV),this.innerMesh.setMatrixAt(r,this.matrix),this.pos.set(a.mx,Ur,a.mz),this.scaleV.set(1,1,1),this.matrix.compose(this.pos,this.quat,this.scaleV),this.innerTrim.setMatrixAt(r,this.matrix)}this.mesh.instanceMatrix.needsUpdate=!0,this.innerMesh.instanceMatrix.needsUpdate=!0,this.innerTrim.instanceMatrix.needsUpdate=!0,this.rebuildTrim(),this.scene.add(this.mesh),this.scene.add(this.innerMesh),this.scene.add(this.innerTrim)}setHighlighted(e){this.highlighted!==e&&(this.highlighted=e,this.rebuildTrim())}rebuildTrim(){for(let n of["trim","trimDim"])this[n]&&(this.scene.remove(this[n]),this[n].dispose(),this[n]=null);let e=[],t=[];for(let n of this.trimXforms??[])(n.workspaceId===this.highlighted?e:t).push(n);this.trim=new rt(this.trimGeometry,this.trimMaterial,Math.max(1,e.length)),this.trim.count=e.length,this.trim.frustumCulled=!1,this.trimDim=new rt(this.trimGeometry,this.trimDimMaterial,Math.max(1,t.length)),this.trimDim.count=t.length,this.trimDim.frustumCulled=!1,e.forEach((n,s)=>this.trim.setMatrixAt(s,n.matrix)),t.forEach((n,s)=>this.trimDim.setMatrixAt(s,n.matrix)),this.trim.instanceMatrix.needsUpdate=!0,this.trimDim.instanceMatrix.needsUpdate=!0,e.length&&this.scene.add(this.trim),t.length&&this.scene.add(this.trimDim)}studioAt(e){return this.pickIndex[e]??null}applyAppearance(e={}){if(e.wallGold&&(this.material.color.set(e.wallGold),this.innerMaterial.color.set(e.wallGold)),e.trimColor&&(this.trimMaterial.emissive.set(e.trimColor),this.trimDimMaterial.emissive.set(e.trimColor),this.innerTrimMaterial.emissive.set(e.trimColor)),Number.isFinite(e.trimGlow)&&(this.trimMaterial.emissiveIntensity=Math.max(0,e.trimGlow)),Number.isFinite(e.outerWallAlpha)){let t=Math.min(1,Math.max(.05,e.outerWallAlpha));this.outerAlphaUniform.value.set(t,t*.25)}Number.isFinite(e.innerWallAlpha)&&(this.innerMaterial.opacity=Math.min(1,Math.max(.02,e.innerWallAlpha))),Number.isFinite(e.innerTrimAlpha)&&(this.innerTrimMaterial.opacity=Math.min(1,Math.max(0,e.innerTrimAlpha)))}frame(e){this.fadeUniform.value.copy(e.position)}dispose(){for(let e of["mesh","innerMesh","trim","trimDim","innerTrim"])this[e]&&(this.scene.remove(this[e]),this[e].dispose());this.geometry.dispose(),this.material.dispose(),this.innerMaterial.dispose(),this.trimGeometry.dispose(),this.trimMaterial.dispose(),this.trimDimMaterial.dispose(),this.innerTrimMaterial.dispose()}};function qu(i,e){if(e===yu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Ir||e===to){let t=i.getIndex();if(t===null){let a=[],o=i.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);i.setIndex(a),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===Ir)for(let a=1;a<=n;a++)s.push(t.getX(0)),s.push(t.getX(a)),s.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(s.push(t.getX(a)),s.push(t.getX(a+1)),s.push(t.getX(a+2))):(s.push(t.getX(a+2)),s.push(t.getX(a+1)),s.push(t.getX(a)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function Cm(i){let e=new Map,t=new Map,n=i.clone();return Rm(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Rm(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)Rm(i.children[n],e.children[n],t)}var Fc=class extends li{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Qu(t)}),this.register(function(t){return new ed(t)}),this.register(function(t){return new cd(t)}),this.register(function(t){return new hd(t)}),this.register(function(t){return new ud(t)}),this.register(function(t){return new nd(t)}),this.register(function(t){return new id(t)}),this.register(function(t){return new sd(t)}),this.register(function(t){return new rd(t)}),this.register(function(t){return new $u(t)}),this.register(function(t){return new ad(t)}),this.register(function(t){return new td(t)}),this.register(function(t){return new ld(t)}),this.register(function(t){return new od(t)}),this.register(function(t){return new Ju(t)}),this.register(function(t){return new kc(t,Ke.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new kc(t,Ke.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new dd(t)})}load(e,t,n,s){let r=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=Pi.extractUrlBase(e);a=Pi.resolveURL(c,this.path)}else a=Pi.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new wr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Dm){try{a[Ke.KHR_BINARY_GLTF]=new fd(e)}catch(d){s&&s(d);return}r=JSON.parse(a[Ke.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new bd(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let d=this.pluginCallbacks[h](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[d.name]=d,a[d.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let d=r.extensionsUsed[h],u=r.extensionsRequired||[];switch(d){case Ke.KHR_MATERIALS_UNLIT:a[d]=new Zu;break;case Ke.KHR_DRACO_MESH_COMPRESSION:a[d]=new pd(r,this.dracoLoader);break;case Ke.KHR_TEXTURE_TRANSFORM:a[d]=new md;break;case Ke.KHR_MESH_QUANTIZATION:a[d]=new gd;break;default:u.indexOf(d)>=0&&o[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};function zS(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Vt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var Ke={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Ju=class{constructor(e){this.parser=e,this.name=Ke.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new fe(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],dn);let d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new ci(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Oa(h),c.distance=d;break;case"spot":c=new ka(h),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),di(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},Zu=class{constructor(){this.name=Ke.KHR_MATERIALS_UNLIT}getMaterialType(){return bt}extendParams(e,t,n){let s=[];e.color=new fe(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],dn),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Tt))}return Promise.all(s)}},$u=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Qu=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new he(r,r)}return Promise.all(s)}},ed=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},td=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},nd=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SHEEN}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new fe(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],dn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Tt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},id=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},sd=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_VOLUME}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new fe().setRGB(r[0],r[1],r[2],dn),Promise.all(s)}},rd=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IOR}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},ad=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new fe().setRGB(r[0],r[1],r[2],dn),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Tt)),Promise.all(s)}},od=class{constructor(e){this.parser=e,this.name=Ke.EXT_MATERIALS_BUMP}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},ld=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?xn:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},cd=class{constructor(e){this.parser=e,this.name=Ke.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}},hd=class{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},ud=class{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},kc=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){let l=s.byteOffset||0,c=s.byteLength||0,h=s.count,d=s.byteStride,u=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,d,u,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){let f=new ArrayBuffer(h*d);return a.decodeGltfBuffer(new Uint8Array(f),h,d,u,s.mode,s.filter),f})})}else return null}},dd=class{constructor(e){this.name=Ke.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==zn.TRIANGLES&&c.mode!==zn.TRIANGLE_STRIP&&c.mode!==zn.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let h=c.pop(),d=h.isGroup?h.children:[h],u=c[0].count,f=[];for(let m of d){let v=new Ae,g=new L,p=new Ct,x=new L(1,1,1),_=new rt(m.geometry,m.material,u);for(let y=0;y<u;y++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,y),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,y),l.SCALE&&x.fromBufferAttribute(l.SCALE,y),_.setMatrixAt(y,v.compose(g,p,x));for(let y in l)if(y==="_COLOR_0"){let E=l[y];_.instanceColor=new ai(E.array,E.itemSize,E.normalized)}else y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"&&m.geometry.setAttribute(y,l[y]);It.prototype.copy.call(_,m),this.parser.assignFinalMaterial(_),f.push(_)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},Dm="glTF",oo=12,Im={JSON:1313821514,BIN:5130562},fd=class{constructor(e){this.name=Ke.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,oo),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Dm)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-oo,r=new DataView(e,oo),a=0;for(;a<s;){let o=r.getUint32(a,!0);a+=4;let l=r.getUint32(a,!0);if(a+=4,l===Im.JSON){let c=new Uint8Array(e,oo+a,o);this.content=n.decode(c)}else if(l===Im.BIN){let c=oo+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},pd=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ke.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let h in a){let d=xd[h]||h.toLowerCase();o[d]=a[h]}for(let h in e.attributes){let d=xd[h]||h.toLowerCase();if(a[h]!==void 0){let u=n.accessors[e.attributes[h]],f=Br[u.componentType];c[d]=f.name,l[d]=u.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(d,u){s.decodeDracoFile(h,function(f){for(let m in f.attributes){let v=f.attributes[m],g=l[m];g!==void 0&&(v.normalized=g)}d(f)},o,c,dn,u)})})}},md=class{constructor(){this.name=Ke.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},gd=class{constructor(){this.name=Ke.KHR_MESH_QUANTIZATION}},Oc=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=s-t,d=(n-t)/h,u=d*d,f=u*d,m=e*c,v=m-c,g=-2*f+3*u,p=f-u,x=1-g,_=p-u+d;for(let y=0;y!==o;y++){let E=a[v+y+o],A=a[v+y+l]*h,R=a[m+y+o],b=a[m+y]*h;r[y]=x*E+_*A+g*R+p*b}return r}},HS=new Ct,vd=class extends Oc{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return HS.fromArray(r).normalize().toArray(r),r}},zn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Br={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Pm={9728:Ht,9729:At,9984:Dl,9985:Ar,9986:ks,9987:Kn},Nm={33071:Fn,33648:or,10497:qn},Xu={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},xd={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},cs={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},VS={CUBICSPLINE:void 0,LINEAR:Es,STEP:Ts},Yu={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function GS(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new $t({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:an})),i.DefaultMaterial}function Vs(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function di(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function jS(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){let d=e[c];if(n){let u=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;a.push(u)}if(s){let u=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;o.push(u)}if(r){let u=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;l.push(u)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let h=c[0],d=c[1],u=c[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=u),i.morphTargetsRelative=!0,i})}function WS(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function qS(i){let e,t=i.extensions&&i.extensions[Ke.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Ku(t.attributes):e=i.indices+":"+Ku(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Ku(i.targets[n]);return e}function Ku(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function yd(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function XS(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var YS=new Ae,bd=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new zS,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?this.textureLoader=new Na(this.options.manager):this.textureLoader=new Ua(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new wr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return Vs(r,o,s),di(o,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,h]of a.children.entries())r(h,o.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ke.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,a){n.load(Pi.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let a=Xu[s.type],o=Br[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new dt(c,a,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){let o=a[0],l=Xu[s.type],c=Br[s.componentType],h=c.BYTES_PER_ELEMENT,d=h*l,u=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0,v,g;if(f&&f!==d){let p=Math.floor(u/f),x="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count,_=t.cache.get(x);_||(v=new c(o,p*f,s.count*f/h),_=new pr(v,f/h),t.cache.add(x,_)),g=new mr(_,l,u%f/h,m)}else o===null?v=new c(s.count*l):v=new c(o,u,s.count*l),g=new dt(v,l,m);if(s.sparse!==void 0){let p=Xu.SCALAR,x=Br[s.sparse.indices.componentType],_=s.sparse.indices.byteOffset||0,y=s.sparse.values.byteOffset||0,E=new x(a[1],_,s.sparse.count*p),A=new c(a[2],y,s.sparse.count*l);o!==null&&(g=new dt(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let R=0,b=E.length;R<b;R++){let w=E[R];if(g.setX(w,A[R*l]),l>=2&&g.setY(w,A[R*l+1]),l>=3&&g.setZ(w,A[R*l+2]),l>=4&&g.setW(w,A[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){let s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);let u=(r.samplers||{})[a.sampler]||{};return h.magFilter=Pm[u.magFilter]||At,h.minFilter=Pm[u.minFilter]||Kn,h.wrapS=Nm[u.wrapS]||qn,h.wrapT=Nm[u.wrapT]||qn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Ht&&h.minFilter!==At,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let a=s.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(d){c=!0;let u=new Blob([d],{type:a.mimeType});return l=o.createObjectURL(u),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(d){return new Promise(function(u,f){let m=u;t.isImageBitmapLoader===!0&&(m=function(v){let g=new Yt(v);g.needsUpdate=!0,u(g)}),t.load(Pi.resolveURL(d,r.path),m,void 0,f)})}).then(function(d){return c===!0&&o.revokeObjectURL(l),di(d,a),d.userData.mimeType=a.mimeType||XS(a.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=h,h}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[Ke.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[Ke.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=r.associations.get(a);a=r.extensions[Ke.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new yr,pn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new $i,pn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return $t}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],a,o={},l=r.extensions||{},c=[];if(l[Ke.KHR_MATERIALS_UNLIT]){let d=s[Ke.KHR_MATERIALS_UNLIT];a=d.getMaterialType(),c.push(d.extendParams(o,r,t))}else{let d=r.pbrMetallicRoughness||{};if(o.color=new fe(1,1,1),o.opacity=1,Array.isArray(d.baseColorFactor)){let u=d.baseColorFactor;o.color.setRGB(u[0],u[1],u[2],dn),o.opacity=u[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",d.baseColorTexture,Tt)),o.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,o.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",d.metallicRoughnessTexture))),a=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=St);let h=r.alphaMode||Yu.OPAQUE;if(h===Yu.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Yu.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==bt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new he(1,1),r.normalTexture.scale!==void 0)){let d=r.normalTexture.scale;o.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&a!==bt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==bt){let d=r.emissiveFactor;o.emissive=new fe().setRGB(d[0],d[1],d[2],dn)}return r.emissiveTexture!==void 0&&a!==bt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Tt)),Promise.all(c).then(function(){let d=new a(o);return r.name&&(d.name=r.name),di(d,r),t.associations.set(d,{materials:e}),r.extensions&&Vs(s,d,r),d})}createUniqueName(e){let t=mt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[Ke.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Lm(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],h=qS(c),d=s[h];if(d)a.push(d.promise);else{let u;c.extensions&&c.extensions[Ke.KHR_DRACO_MESH_COMPRESSION]?u=r(c):u=Lm(new gt,c,t),s[h]={primitive:c,promise:u},a.push(u)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let h=a[l].material===void 0?GS(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],d=[];for(let f=0,m=h.length;f<m;f++){let v=h[f],g=a[f],p,x=c[f];if(g.mode===zn.TRIANGLES||g.mode===zn.TRIANGLE_STRIP||g.mode===zn.TRIANGLE_FAN||g.mode===void 0)p=r.isSkinnedMesh===!0?new fa(v,x):new Ze(v,x),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),g.mode===zn.TRIANGLE_STRIP?p.geometry=qu(p.geometry,to):g.mode===zn.TRIANGLE_FAN&&(p.geometry=qu(p.geometry,Ir));else if(g.mode===zn.LINES)p=new Rs(v,x);else if(g.mode===zn.LINE_STRIP)p=new Cs(v,x);else if(g.mode===zn.LINE_LOOP)p=new ma(v,x);else if(g.mode===zn.POINTS)p=new ga(v,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&WS(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),di(p,r),g.extensions&&Vs(s,p,g),t.assignFinalMaterial(p),d.push(p)}for(let f=0,m=d.length;f<m;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return r.extensions&&Vs(s,d[0],r),d[0];let u=new Et;r.extensions&&Vs(s,u,r),t.associations.set(u,{meshes:e});for(let f=0,m=d.length;f<m;f++)u.add(d[f]);return u})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new zt(_u.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new On(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),di(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),a=s,o=[],l=[];for(let c=0,h=a.length;c<h;c++){let d=a[c];if(d){o.push(d);let u=new Ae;r!==null&&u.fromArray(r.array,c*16),l.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new pa(o,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let d=0,u=s.channels.length;d<u;d++){let f=s.channels[d],m=s.samplers[f.sampler],v=f.target,g=v.node,p=s.parameters!==void 0?s.parameters[m.input]:m.input,x=s.parameters!==void 0?s.parameters[m.output]:m.output;v.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",x)),c.push(m),h.push(v))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(d){let u=d[0],f=d[1],m=d[2],v=d[3],g=d[4],p=[];for(let _=0,y=u.length;_<y;_++){let E=u[_],A=f[_],R=m[_],b=v[_],w=g[_];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();let I=n._createAnimationTracks(E,A,R,b,w);if(I)for(let N=0;N<I.length;N++)p.push(I[N])}let x=new Pa(r,void 0,p);return di(x,s),x})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){let h=c[0],d=c[1],u=c[2];u!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(u,YS)});for(let f=0,m=d.length;f<m;f++)h.add(d[f]);if(h.userData.pivot!==void 0&&d.length>0){let f=h.userData.pivot,m=d[0];h.pivot=new L().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],m.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new gr:c.length>1?h=new Et:c.length===1?h=c[0]:h=new It,h!==c[0])for(let d=0,u=c.length;d<u;d++)h.add(c[d]);if(r.name&&(h.userData.name=r.name,h.name=a),di(h,r),r.extensions&&Vs(n,h,r),r.matrix!==void 0){let d=new Ae;d.fromArray(r.matrix),h.applyMatrix4(d)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let d=s.associations.get(h);s.associations.set(h,{...d})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new Et;n.name&&(r.name=s.createUniqueName(n.name)),di(r,n),n.extensions&&Vs(t,r,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,d=l.length;h<d;h++){let u=l[h];u.parent!==null?r.add(Cm(u)):r.add(u)}let c=h=>{let d=new Map;for(let[u,f]of s.associations)(u instanceof pn||u instanceof Yt)&&d.set(u,f);return h.traverse(u=>{let f=s.associations.get(u);f!=null&&d.set(u,f)}),d};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let a=[],o=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}cs[r.path]===cs.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(cs[r.path]){case cs.weights:h=Ci;break;case cs.rotation:h=Ri;break;case cs.translation:case cs.scale:h=is;break;default:switch(n.itemSize){case 1:h=Ci;break;case 2:case 3:default:h=is;break}break}let d=s.interpolation!==void 0?VS[s.interpolation]:Es,u=this._getArrayFromAccessor(n);for(let f=0,m=l.length;f<m;f++){let v=new h(l[f]+"."+cs[r.path],t.array,u,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(v),a.push(v)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=yd(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof Ri?vd:Oc;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function KS(i,e,t){let n=e.attributes,s=new fn;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new L(l[0],l[1],l[2]),new L(c[0],c[1],c[2])),o.normalized){let h=yd(Br[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let o=new L,l=new L;for(let c=0,h=r.length;c<h;c++){let d=r[c];if(d.POSITION!==void 0){let u=t.json.accessors[d.POSITION],f=u.min,m=u.max;if(f!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),u.normalized){let v=yd(Br[u.componentType]);l.multiplyScalar(v)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;let a=new vn;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function Lm(i,e,t){let n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(let a in n){let o=xd[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){let a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return je.workingColorSpace!==dn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${je.workingColorSpace}" not supported.`),di(i,e),KS(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?jS(i,e.targets,t):i})}var _d="default";var fi=Object.freeze(["worker","purple_worker","pink_worker","blue_worker"]),Fi="worker",lo=/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/,Md=/^[A-Za-z_][A-Za-z0-9_]{0,31}$/,JS=/^[^.\s]{1,64}$/;function Uc(i){let e=[],t=[],n=typeof i=="string"?i:"",s=0;for(;s<n.length;){let r=n[s];if(r==="{"){if(n[s+1]==="{"){s+=2;continue}let a=n.indexOf("}",s+1);if(a===-1)return{ok:!1,vars:e,badVars:t};let o=n.slice(s+1,a);if(!Md.test(o))return t.push(o),{ok:!1,vars:e,badVars:t};e.includes(o)||e.push(o),s=a+1;continue}if(r==="}"){if(n[s+1]==="}"){s+=2;continue}return{ok:!1,vars:e,badVars:t}}s+=1}return{ok:!0,vars:e,badVars:t}}var kt=i=>typeof i=="string"?i.trim():"";function Fm(i){if(typeof i!="string")return null;let e=i.trim().split(".");if(e.length<1||e.length>8)return null;for(let t of e)if(!JS.test(t))return null;return e.join(".")}function ZS(i){if(!i||typeof i!="object")return;let e=kt(i.provider),t=kt(i.model),n=kt(i.reasoningEffort);if(!(!e||!t))return n?{provider:e,model:t,reasoningEffort:n}:{provider:e,model:t}}function Sd(i){let e=kt(i);if(!e||e.startsWith("/")||e.startsWith("\\")||/^[A-Za-z]:/.test(e))return;let t=e.split(/[\\/]/);if(!t.some(n=>n===".."))return t.join("/")}function $S(i){let e=i&&typeof i=="object"?i:{},t={};if(e.capture&&typeof e.capture=="object")for(let[n,s]of Object.entries(e.capture)){if(t.length>=8)break;if(!Md.test(n))continue;let r=Fm(s);!r||Object.values(t).includes(r)||(t[n]=r)}return{capture:t,...Sd(e.filePredicate)?{filePredicate:Sd(e.filePredicate)}:{}}}function QS(i){let e=i&&typeof i=="object"?i:{},t=typeof e.type=="string"?e.type:"";if(!["send","spawn","notify","conductor"].includes(t))return null;let n=typeof e.promptTemplate=="string"?e.promptTemplate:"",s=kt(e.targetBeeTypeId);return{type:t,...n?{promptTemplate:n}:{},...s?{targetBeeTypeId:s}:{}}}function eM(i){if(!i||typeof i!="object")return null;let e=kt(i.id),t=kt(i.name),n=QS(i.action);return!e||!lo.test(e)||!t||!n?null:{id:e,name:t,trigger:$S(i.trigger),action:n,once:i.once!==!1}}function wd(i){if(!Array.isArray(i))return[];let e=[],t=new Set;for(let n of i){if(!n||typeof n!="object"||e.length>=16)continue;let s=kt(n.id),r=kt(n.name);if(!s||!lo.test(s)||s===_d||!r||t.has(s))continue;let a=ZS(n.model),o=n.queuePolicy==="serialized"?"serialized":"free",l=fi.includes(n.beeModel)?n.beeModel:void 0,c=kt(n.presetPrompt),h=[],d=new Set;for(let u of Array.isArray(n.capabilities)?n.capabilities:[]){if(h.length>=16)break;let f=eM(u);!f||d.has(f.id)||(d.add(f.id),h.push(f))}t.add(s),e.push({id:s,name:r,...kt(n.description)?{description:kt(n.description)}:{},...a?{model:a}:{},...c&&c.length<=4e3?{presetPrompt:c}:{},queuePolicy:o,...l&&l!==Fi?{beeModel:l}:{},capabilities:h})}return e}var hn=(i,e)=>`beeTypes[${i}]${e?"."+e:""}`;function km(i){if(!Array.isArray(i))return{field:"beeTypes",code:"invalidShape"};if(i.length>16)return{field:"beeTypes",code:"tooManyBeeTypes"};let e=new Set;for(let t=0;t<i.length;t++){let n=i[t];if(!n||typeof n!="object")return{field:hn(t),code:"invalidShape"};let s=kt(n.id);if(!s)return{field:hn(t,"id"),code:"missingId"};if(s===_d)return{field:hn(t,"id"),code:"reservedId"};if(!lo.test(s))return{field:hn(t,"id"),code:"invalidId"};if(e.has(s))return{field:hn(t,"id"),code:"duplicateId"};if(e.add(s),!kt(n.name))return{field:hn(t,"name"),code:"missingName"};if(n.model!==void 0&&n.model!==null){if(typeof n.model!="object")return{field:hn(t,"model"),code:"invalidModel"};if(!kt(n.model.provider)||!kt(n.model.model))return{field:hn(t,"model"),code:"invalidModel"};if(n.model.reasoningEffort!==void 0&&!kt(n.model.reasoningEffort))return{field:hn(t,"model.reasoningEffort"),code:"invalidModel"}}if(n.queuePolicy!==void 0&&n.queuePolicy!=="free"&&n.queuePolicy!=="serialized")return{field:hn(t,"queuePolicy"),code:"invalidQueuePolicy"};if(n.beeModel!==void 0&&n.beeModel!==null&&!fi.includes(n.beeModel))return{field:hn(t,"beeModel"),code:"invalidBeeModel"};if(n.presetPrompt!==void 0&&n.presetPrompt!==null){if(typeof n.presetPrompt!="string"||!kt(n.presetPrompt))return{field:hn(t,"presetPrompt"),code:"invalidPresetPrompt"};if(n.presetPrompt.trim().length>4e3)return{field:hn(t,"presetPrompt"),code:"presetPromptTooLong"}}let r=n.capabilities??[];if(!Array.isArray(r))return{field:hn(t,"capabilities"),code:"invalidShape"};if(r.length>16)return{field:hn(t,"capabilities"),code:"tooManyCapabilities"};let a=new Set;for(let o=0;o<r.length;o++){let l=r[o],c=`${hn(t,"capabilities")}[${o}]`;if(!l||typeof l!="object")return{field:c,code:"invalidShape"};let h=kt(l.id);if(!h)return{field:`${c}.id`,code:"missingId"};if(!lo.test(h))return{field:`${c}.id`,code:"invalidId"};if(a.has(h))return{field:`${c}.id`,code:"duplicateId"};if(a.add(h),!kt(l.name))return{field:`${c}.name`,code:"missingName"};let d=l.trigger;if(d!==void 0&&(d===null||typeof d!="object"))return{field:`${c}.trigger`,code:"invalidShape"};let u=d?.capture;if(u!==void 0&&(u===null||typeof u!="object"||Array.isArray(u)))return{field:`${c}.trigger.capture`,code:"invalidCapture"};if(u&&Object.keys(u).length>8)return{field:`${c}.trigger.capture`,code:"tooManyCaptureVars"};for(let[g,p]of Object.entries(u??{})){if(!Md.test(g))return{field:`${c}.trigger.capture.${g}`,code:"invalidCaptureVar"};if(typeof p!="string"||!Fm(p))return{field:`${c}.trigger.capture.${g}`,code:"invalidCapturePath"}}let f=d?.filePredicate;if(f!=null){if(typeof f!="string"||!kt(f)||!Sd(f))return{field:`${c}.trigger.filePredicate`,code:"invalidPredicate"};if(!Uc(f).ok)return{field:`${c}.trigger.filePredicate`,code:"invalidTemplate"}}let m=l.action;if(!m||typeof m!="object")return{field:`${c}.action`,code:"invalidShape"};let v=m.type;if(!["send","spawn","notify","conductor"].includes(v))return{field:`${c}.action.type`,code:"invalidActionType"};if(v==="send"||v==="spawn"){if(typeof m.promptTemplate!="string"||!m.promptTemplate.trim())return{field:`${c}.action.promptTemplate`,code:"missingTemplate"};if(!Uc(m.promptTemplate).ok)return{field:`${c}.action.promptTemplate`,code:"invalidTemplate"}}if(v==="spawn"){let g=kt(m.targetBeeTypeId);if(!g)return{field:`${c}.action.targetBeeTypeId`,code:"missingTarget"};if(g===_d||!lo.test(g))return{field:`${c}.action.targetBeeTypeId`,code:"invalidTarget"}}if(l.once!==void 0&&typeof l.once!="boolean")return{field:`${c}.once`,code:"invalidOnce"}}}return null}var _n=Object.freeze({idle:new fe(14209992),busy:new fe(4165590),help:new fe(15245628),done:new fe(5747306)}),tM=new fe(4864038),nM=new fe(3023639),Td=new fe(1906450),iM=new fe(14674162),Om=420,Um=900,sM=Math.PI/2,Bm=.08*Pt,oA=Fr/2-Pt,Gt=0,mn=1,Mt=2,Ed=30*Pt,Bc=75*Pt,Ad=2*Pt;function zm(i,e){let t=i.tier;return t===Gt?e<=Ed+Ad?Gt:e>Bc+Ad?Mt:mn:t===mn?e<=Ed?Gt:e>Bc+Ad?Mt:mn:t===Mt?e<=Bc?mn:Mt:e<=Ed?Gt:e<=Bc?mn:Mt}function Hm(){return{tierParts:[[],[],[]],counts:[0,0,0],records:[[],[],[]],slots:new Map,free:[],next:0,states:new Map,matrixDirty:!1,colorDirty:!1}}function rM(){let i=[],e=(o,l,c)=>{c&&o.applyMatrix4(c);let h=o.attributes.position.count,d=new Float32Array(h*3);for(let u=0;u<h;u++)d[u*3]=l.r,d[u*3+1]=l.g,d[u*3+2]=l.b;o.setAttribute("color",new dt(d,3)),i.push(o)},t=(o,l,c,h,d,u)=>new Ae().compose(new L(o,l,c),new Ct,new L(h,d,u));e(new Xn(.105,12,10),tM,t(0,0,0,1,.92,.92)),e(new Xn(.07,10,8),nM,t(.135,.015,0,1,1,1));let n=new Ra(.118,.014,6,18);e(n.clone().applyMatrix4(t(-.11,-.01,0)),Td,null),e(n.applyMatrix4(t(-.155,-.012,0)),Td,null),e(new ba(.022,.08,6),Td,t(-.29,-.02,0,1,1,1).multiply(new Ae().makeRotationZ(Math.PI/2)));let s=aM(i),r=new Xn(.125,12,10);r.scale(1.45,.95,.95),r.translate(-.2,-.012,0);let a=new ya(.15,14);return a.rotateX(-Math.PI/2),a.scale(.62,1,1.35),a.translate(0,0,.16),{body:s,abdomen:r,wing:a}}function aM(i){let e=0,t=0;for(let h of i)e+=h.attributes.position.count,t+=h.index?h.index.count:h.attributes.position.count;let n=new Float32Array(e*3),s=new Float32Array(e*3),r=new Float32Array(e*3),a=new Uint16Array(t),o=0,l=0;for(let h of i){if(n.set(h.attributes.position.array,o*3),s.set(h.attributes.normal.array,o*3),r.set(h.attributes.color.array,o*3),h.index){for(let d=0;d<h.index.count;d++)a[l+d]=h.index.getX(d)+o;l+=h.index.count}else{for(let d=0;d<h.attributes.position.count;d++)a[l+d]=d+o;l+=h.index.count}o+=h.attributes.position.count}let c=new gt;return c.setAttribute("position",new dt(n,3)),c.setAttribute("normal",new dt(s,3)),c.setAttribute("color",new dt(r,3)),c.setIndex(new dt(a,1)),c}var oM=`
  attribute float aPhase;
  uniform float uTime;
  uniform float uFlap;
  varying vec3 vNormalW;
  void main() {
    float flap = sin(uTime * uFlap + aPhase) * 0.75;
    float c = cos(flap);
    float s = sin(flap);
    vec3 p = vec3(position.x, position.y * c - position.z * s, position.y * s + position.z * c);
    vec3 n = vec3(normal.x, normal.y * c - normal.z * s, normal.y * s + normal.z * c);
    vec4 world = instanceMatrix * vec4(p, 1.0);
    vNormalW = normalize(mat3(instanceMatrix) * n);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,lM=`
  uniform vec3 uColor;
  varying vec3 vNormalW;
  void main() {
    float light = 0.72 + 0.28 * max(dot(normalize(vNormalW), normalize(vec3(0.4, 1.0, 0.3))), 0.0);
    gl_FragColor = vec4(uColor * light, 0.55);
  }
`,zc=class{constructor(e,t={}){let n=rM();this.geos=n,this.bodyMat=new ns({vertexColors:!0}),this.abdomenMat=new ns({color:16777215}),this.wingMat=new at({uniforms:{uTime:{value:0},uFlap:{value:42},uColor:{value:iM.clone()}},vertexShader:oM,fragmentShader:lM,transparent:!0,depthWrite:!1,side:St}),this.maxBees=64,this.color=new fe,this.tint=new fe,this.white=new fe(16777215),this.matrix=new Ae,this.partMatrix=new Ae,this.quat=new Ct,this.euler=new on,this.pos=new L,this.scaleV=new L,this.wingOffset=new L,this.zeroScale=new Ae().makeScale(0,0,0),this.group=new Et,e.add(this.group),this.buckets=Hm(),this._buildPrimitiveMeshes(this.maxBees),this.beeMap=new Map,this.reduced=t.reduced??!1,this.time=0,this.anchorIds=new Set,this.defaultModelId=Fi,this.variants=new Map,this.modelReady=!1,this.selectedId=null,this.maskScene=t.maskScene??new gn,this.maskMaterial=t.maskMaterial??new bt({color:16777215,side:St}),this.maskBody=new rt(n.body,this.maskMaterial,1),this.maskAbd=new rt(n.abdomen,this.maskMaterial,1);for(let s of[this.maskBody,this.maskAbd])s.count=0,s.frustumCulled=!1,this.maskScene.add(s);this._maskCapacity=1,this._primitiveMaskCount=0,this.outlineState={active:!1,maskScene:this.maskScene},this._outlinedThisFrame=!1,this.outlineBeeId=null,this.outlineBeeIds=null,this.loadModel(this.defaultModelId)}_buildPrimitiveMeshes(e){let t=this.buckets;for(let n of[Gt,mn,Mt]){let s=new rt(this.geos.body,this.bodyMat,e),r=new rt(this.geos.abdomen,this.abdomenMat,e);for(let[a,o]of[[s,!1],[r,!0]]){if(a.instanceMatrix.setUsage(Os),a.frustumCulled=!1,a.renderOrder=10,a.castShadow=n===Gt,a.count=0,o)for(let l=0;l<e;l++)a.setColorAt(l,this.white);a.userData.pick={buckets:t,tier:n},this.group.add(a),t.tierParts[n].push({mesh:a,tinted:o})}}this.wings=new rt(this.geos.wing,this.wingMat,e*2),this.wings.instanceMatrix.setUsage(Os),this.wings.frustumCulled=!1,this.wings.renderOrder=10,this.wings.castShadow=!0,this.wings.count=0,this.wings.geometry.setAttribute("aPhase",new ai(new Float32Array(e*2),1)),this.group.add(this.wings)}ensureVariant(e){if(!e||e===this.defaultModelId||!fi.includes(e))return;let t=this.variants.get(e);t?.ready||t?.loading||this.loadModel(e)}loadModel(e){if(typeof document>"u"||this.variants.get(e)?.ready||this.variants.get(e)?.loading)return;this.variants.set(e,{ready:!1,loading:!0,masks:[],buckets:null}),new Fc().load("/api/dsh-hive/assets/"+e+".glb",n=>{try{this.attachModel(n.scene,e)}catch(s){console.warn("[dsh-v-hive] bee model attach failed, keep primitives:",s),this.variants.delete(e)}},void 0,n=>{console.warn("[dsh-v-hive] bee model load failed, keep primitives:",String(n).slice(0,200)),this.variants.delete(e)})}attachModel(e,t=this.defaultModelId){let n=[],s=new fn,r=!1;if(e.updateMatrixWorld(!0),e.traverse(u=>{if(!u.isMesh||!u.geometry)return;let f=u.geometry.clone();f.applyMatrix4(u.matrixWorld),f.computeBoundingBox(),r?s.union(f.boundingBox):(s.copy(f.boundingBox),r=!0),n.push({geometry:f,material:u.material})}),n.length===0||!r)throw new Error("model has no meshes");let a=s.getCenter(new L),l=s.getSize(new L).length()/2||1,c=Pt/l,h=new Ae().makeRotationY(sM).multiply(new Ae().makeScale(c,c,c)).multiply(new Ae().makeTranslation(-a.x,-a.y,-a.z)),d={ready:!0,loading:!1,masks:[],maskCapacity:1,buckets:Hm()};for(let u of n)for(let f of[Gt,mn,Mt]){let m=new rt(u.geometry,u.material,this.maxBees);m.instanceMatrix.setUsage(Os),m.frustumCulled=!1,m.renderOrder=10,m.castShadow=f===Gt,m.count=0;for(let v=0;v<this.maxBees;v++)m.setColorAt(v,this.white);m.userData.pick={buckets:d.buckets,tier:f},this.group.add(m),d.buckets.tierParts[f].push({mesh:m,normalization:h,tinted:!0})}for(let u of n){let f=new rt(u.geometry,this.maskMaterial,1);f.count=0,f.frustumCulled=!1,this.maskScene.add(f),d.masks.push(f)}if(this.variants.set(t,d),t===this.defaultModelId){this.modelReady=!0;for(let u of this.buckets.tierParts)for(let f of u)f.mesh.count=0;this.wings.count=0,this.maskBody.count=0,this.maskAbd.count=0}}setSelected(e){this.selectedId=e??null}setOutlineBeeId(e){this.outlineBeeId=e??null,this.setOutlineBeeIds(e!=null?new Set([e]):null)}setOutlineBeeIds(e){this.outlineBeeIds=e&&typeof e.has=="function"&&e.size>0?e:null}_isOutlined(e){return this.outlineBeeIds!=null?this.outlineBeeIds.has(e.id):e.id===this.outlineBeeId}_ensurePrimitiveMaskCapacity(e){if(e<=this._maskCapacity)return;let t=Math.max(e,8);this.maskBody=this._rebuildMaskMesh(this.maskBody,this.geos.body,t),this.maskAbd=this._rebuildMaskMesh(this.maskAbd,this.geos.abdomen,t),this._maskCapacity=t}_ensureVariantMaskCapacity(e,t){if(t<=(e.maskCapacity??1))return;let n=Math.max(t,8);e.masks=e.masks.map(s=>this._rebuildMaskMesh(s,s.geometry,n)),e.maskCapacity=n}_rebuildMaskMesh(e,t,n){let s=new rt(t,this.maskMaterial,n);return s.count=0,s.frustumCulled=!1,this.maskScene.remove(e),e.dispose(),this.maskScene.add(s),s}setBees(e,t=new Map){!this.modelReady&&e.length>this.maxBees&&this.grow(e.length);let n=new Set(e.map(r=>r.id)),s=[];for(let r of e){let a=this.beeMap.get(r.id),o="none",l=this.time;a&&(a.anim==="out"||a.anim==="toHoney"?o="in":(o="none",l=a.animStart));let c={...r,anim:o,animStart:l,animTo:null,baseY:r.y,world:{x:r.x,y:r.y,z:r.z},tier:a?.tier};this.beeMap.set(r.id,c),s.push(c)}for(let[r,a]of this.beeMap){if(n.has(r))continue;let o=t.get(r),l=o?"toHoney":"out";a.anim!==l&&(a.anim=l,a.animStart=this.time,a.animTo=o??null);let c=a.anim==="toHoney"?Um:Om;this.time-a.animStart<c&&s.push(a)}this.renderList=s;for(let r of s)r.modelId=fi.includes(r.beeModel)?r.beeModel:this.defaultModelId,this.ensureVariant(r.modelId);this._releaseDepartedT2(s)}_releaseDepartedT2(e){let t=new Set(e.map(n=>n.id));if(this.buckets.slots.size>0)for(let n of[...this.buckets.slots.keys()])t.has(n)||this._freeT2Slot(this.buckets,n);for(let n of this.variants.values())if(!(!n.ready||n.buckets.slots.size===0))for(let s of[...n.buckets.slots.keys()])t.has(s)||this._freeT2Slot(n.buckets,s)}_allocT2Slot(e,t,n,s){let r;e.free.length>0?r=e.free.pop():r=e.next++,e.slots.set(t.id,r),e.states.set(t.id,t.state),e.records[Mt][r]=t;for(let a of e.tierParts[Mt])a.mesh.setMatrixAt(r,n),a.tinted&&a.mesh.setColorAt(r,s);return e.matrixDirty=!0,e.colorDirty=!0,r}_freeT2Slot(e,t){let n=e.slots.get(t);if(n!==void 0){e.slots.delete(t),e.states.delete(t),e.records[Mt][n]=null,e.free.push(n);for(let s of e.tierParts[Mt])s.mesh.setMatrixAt(n,this.zeroScale),s.mesh.instanceMatrix.needsUpdate=!0}}grow(e){let t=Math.max(e,this.maxBees*2),s=this.buckets.tierParts[Mt].map(a=>({matrix:a.mesh.instanceMatrix.array.slice(0,this.buckets.next*16),color:a.mesh.instanceColor?a.mesh.instanceColor.array.slice(0,this.buckets.next*3):null}));for(let a of this.buckets.tierParts){for(let o of a)this.group.remove(o.mesh),o.mesh.dispose();a.length=0}this.group.remove(this.wings),this.wings.dispose(),this.maxBees=t,this._buildPrimitiveMeshes(t),this.buckets.tierParts[Mt].forEach((a,o)=>{let l=s[o];a.mesh.instanceMatrix.array.set(l.matrix),l.color&&a.mesh.instanceColor&&a.mesh.instanceColor.array.set(l.color)}),this.buckets.matrixDirty=!0,this.buckets.colorDirty=!0}poseOf(e,t,n){let s=!!e.droneOf,r=e.scale??(s?.55:1),a=e.world.x,o=e.baseY,l=e.world.z,c=e.heading??0,h=0,d=r,u=e.phase??0;if(e.anim==="in"){let f=Math.min(1,(t-e.animStart)/420),m=1-Math.pow(1-f,3);o=e.baseY+(1-m)*2.75*Pt,d=r*(.2+.8*m),f>=1&&(e.anim="none")}else if(e.anim==="out"||e.anim==="toHoney"){let f=e.anim==="toHoney"?Um:Om,m=Math.min(1,(t-e.animStart)/f),v=m*m;e.anim==="toHoney"&&e.animTo?(a=e.world.x+(e.animTo.x-e.world.x)*v,o=e.baseY+(e.animTo.y-e.baseY)*v,l=e.world.z+(e.animTo.z-e.world.z)*v):o=e.baseY+v*3*Pt,d=r*(1-v)}else if(s){let f=e.droneOf,m=Math.max(1,e.droneCount??1),v=e.droneIndex??0,g=e.collapsed?.5*Pt:(1.75+.11*(v%3))*Pt,p=this.reduced?v/m*Math.PI*2:t*.0012+v/m*Math.PI*2;a=f.x+Math.cos(p)*g,l=f.z+Math.sin(p)*g,o=f.y+(e.collapsed?.125:.35+(this.reduced?0:.1*Math.sin(t*.002+v)))*Pt,c=p+Math.PI/2}else{let f=e.state;if(f==="help")o=e.baseY+.6*Pt+(this.reduced?0:.075*Pt*Math.sin(t*.004+u)),h=this.reduced?.5:.35+.3*Math.sin(t*.006+u);else if(f==="busy"&&!this.reduced){let m=t*9e-4+u;a+=Math.cos(m)*Bm,l+=Math.sin(m)*Bm,o=e.baseY+(.2+.06*Math.sin(t*.003+u))*Pt,c=m+Math.PI/2}else if(f==="done")o=e.baseY-.075*Pt,h=.18;else if(!this.reduced){let m=.06*Pt;a+=Math.sin(t*.0011+u)*m,l+=Math.cos(t*9e-4+u*1.3)*m,o=e.baseY+m*Math.sin(t*.0016+u)}}return{x:a,y:o,z:l,facing:c,glowPulse:h,scale:d}}_composeBee(e){return this.euler.set(0,-e.facing,0),this.quat.setFromEuler(this.euler),this.pos.set(e.x,e.y,e.z),this.scaleV.setScalar(Math.max(.001,e.scale)),this.matrix.compose(this.pos,this.quat,this.scaleV)}_isForcedNear(e){return e.anim!=="none"||this._isOutlined(e)||this.anchorIds.has(e.id)}frame(e,t){this.time+=e;let n=this.time,s=this.reduced?0:1;if(this.wingMat.uniforms.uTime.value=n,this.wingMat.uniforms.uFlap.value=42,this.modelReady){this.frameModel(n,t);return}let r=this.buckets;r.counts[Gt]=0,r.counts[mn]=0,r.records[Gt].length=0,r.records[mn].length=0,r.matrixDirty=!1,r.colorDirty=!1,this._outlinedThisFrame=!1,this._primitiveMaskCount=0;let a=t!=null&&Number.isFinite(t.x),o=a?t.x:0,l=a?t.y:0,c=a?t.z:0,h=0;for(let u of this.renderList??[]){let f=!a||this._isForcedNear(u),m;if(f)m=Gt;else{let p=u.world.x-o,x=u.world.y-l,_=u.world.z-c;m=zm(u,Math.sqrt(p*p+x*x+_*_)),u.tier=m}if(m!==Mt&&r.slots.has(u.id)&&this._freeT2Slot(r,u.id),m===Mt){let p=r.slots.get(u.id);if(p===void 0){let x=this.poseOf(u,n,s);u.pose=x,this._composeBee(x),this.color.copy(_n[u.state]??_n.idle).multiplyScalar(1+x.glowPulse),this._allocT2Slot(r,u,this.matrix,this.color)}else if(r.records[Mt][p]=u,r.states.get(u.id)!==u.state){r.states.set(u.id,u.state),this.color.copy(_n[u.state]??_n.idle);for(let x of r.tierParts[Mt])x.tinted&&x.mesh.setColorAt(p,this.color);r.colorDirty=!0}continue}let v=this.poseOf(u,n,s);u.pose=v,this._composeBee(v);let g=r.counts[m]++;r.records[m].push(u);for(let p of r.tierParts[m])p.mesh.setMatrixAt(g,this.matrix),p.tinted&&(this.color.copy(_n[u.state]??_n.idle).multiplyScalar(1+v.glowPulse),p.mesh.setColorAt(g,this.color));if(m===Gt){let p=this.wings.geometry.getAttribute("aPhase");for(let x=0;x<2;x++){let _=x===1;this.euler.set(0,_?Math.PI:0,0),this.quat.setFromEuler(this.euler),this.wingOffset.set(.01,.075,0).applyQuaternion(this.quat),this.pos.set(v.x+this.wingOffset.x,v.y+this.wingOffset.y,v.z+this.wingOffset.z),this.scaleV.setScalar(Math.max(.001,v.scale)),this.partMatrix.compose(this.pos,this.quat,this.scaleV),this.wings.setMatrixAt(h+x,this.partMatrix),p&&p.setX(h+x,(u.phase??0)+(s?0:Math.PI*.35))}if(h+=2,this._isOutlined(u)){this._ensurePrimitiveMaskCapacity(this._primitiveMaskCount+1),this._outlinedThisFrame=!0;for(let x of[this.maskBody,this.maskAbd])x.setMatrixAt(this._primitiveMaskCount,this.matrix);this._primitiveMaskCount+=1}}}for(let u of[Gt,mn])for(let f of r.tierParts[u])f.mesh.count=r.counts[u],f.mesh.instanceMatrix.needsUpdate=!0,f.tinted&&f.mesh.instanceColor&&(f.mesh.instanceColor.needsUpdate=!0);for(let u of r.tierParts[Mt])u.mesh.count=r.next,r.matrixDirty&&(u.mesh.instanceMatrix.needsUpdate=!0),r.colorDirty&&u.tinted&&u.mesh.instanceColor&&(u.mesh.instanceColor.needsUpdate=!0);this.wings.count=h,this.wings.instanceMatrix.needsUpdate=!0;let d=this.wings.geometry.getAttribute("aPhase");d&&(d.needsUpdate=!0);for(let u of[this.maskBody,this.maskAbd])u.count=this._primitiveMaskCount,this._primitiveMaskCount>0&&(u.instanceMatrix.needsUpdate=!0);this.outlineState.active=this._outlinedThisFrame}frameModel(e,t){let n=t!=null&&Number.isFinite(t.x),s=n?t.x:0,r=n?t.y:0,a=n?t.z:0;for(let o of this.variants.values()){if(!o.ready)continue;let l=o.buckets;l.counts[Gt]=0,l.counts[mn]=0,l.records[Gt].length=0,l.records[mn].length=0,l.matrixDirty=!1,l.colorDirty=!1,o.maskCount=0}this._outlinedThisFrame=!1;for(let o of this.renderList??[]){let l=this.poseOf(o,e,this.reduced?0:1);if(o.pose=l,l.scale<=.01)continue;let c=this.variants.get(o.modelId),h=c?.ready?c:this.variants.get(this.defaultModelId);if(!h?.ready)continue;let d=!n||this._isForcedNear(o),u;if(d)u=Gt;else{let v=o.world.x-s,g=o.world.y-r,p=o.world.z-a;u=zm(o,Math.sqrt(v*v+g*g+p*p)),o.tier=u}let f=h.buckets;if(u!==Mt&&f.slots.has(o.id)&&this._freeT2Slot(f,o.id),this.euler.set(0,-l.facing,0),this.quat.setFromEuler(this.euler),this.pos.set(l.x,l.y,l.z),this.scaleV.setScalar(l.scale),this.matrix.compose(this.pos,this.quat,this.scaleV),this.tint.copy(this.white).lerp(_n[o.state]??_n.idle,o.state==="idle"?0:.45),l.glowPulse>0&&this.tint.multiplyScalar(1+l.glowPulse),u===Mt){let v=f.slots.get(o.id);if(v===void 0)this._allocT2Slot(f,o,this.matrix,this.tint);else if(f.records[Mt][v]=o,f.states.get(o.id)!==o.state){f.states.set(o.id,o.state);let g=this.tint.copy(this.white).lerp(_n[o.state]??_n.idle,o.state==="idle"?0:.45);for(let p of f.tierParts[Mt])p.tinted&&p.mesh.setColorAt(v,g);f.colorDirty=!0}continue}let m=f.counts[u]++;f.records[u].push(o);for(let v of f.tierParts[u])this.partMatrix.copy(this.matrix).multiply(v.normalization),v.mesh.setMatrixAt(m,this.partMatrix),v.tinted&&v.mesh.setColorAt(m,this.tint);if(this._isOutlined(o)){this._ensureVariantMaskCapacity(h,h.maskCount+1),this._outlinedThisFrame=!0;for(let v of h.masks)v.setMatrixAt(h.maskCount,this.partMatrix);h.maskCount+=1}}for(let o of this.variants.values()){if(!o.ready)continue;let l=o.buckets;for(let h of[Gt,mn])for(let d of l.tierParts[h])d.mesh.count=l.counts[h],d.mesh.instanceMatrix.needsUpdate=!0,d.tinted&&d.mesh.instanceColor&&(d.mesh.instanceColor.needsUpdate=!0);for(let h of l.tierParts[Mt])h.mesh.count=l.next,l.matrixDirty&&(h.mesh.instanceMatrix.needsUpdate=!0),l.colorDirty&&h.tinted&&h.mesh.instanceColor&&(h.mesh.instanceColor.needsUpdate=!0);let c=o.maskCount??0;for(let h of o.masks)h.count=c,c>0&&(h.instanceMatrix.needsUpdate=!0)}this.outlineState.active=this._outlinedThisFrame}beeAt(e,t){let n=e?.userData?.pick;return n?n.buckets.records[n.tier][t]??null:null}pickMeshes(){if(this.modelReady){let t=[];for(let n of this.variants.values())if(n.ready)for(let s of n.buckets.tierParts)for(let r of s)t.push(r.mesh);if(t.length)return t}let e=[];for(let t of this.buckets.tierParts)for(let n of t)e.push(n.mesh);return e}tierStats(){if(!this.modelReady)return{path:"primitive",near:this.buckets.counts[Gt],mid:this.buckets.counts[mn],far:this.buckets.slots.size,total:this.renderList?.length??0};let e=0,t=0,n=0;for(let s of this.variants.values())s.ready&&(e+=s.buckets.counts[Gt],t+=s.buckets.counts[mn],n+=s.buckets.slots.size);return{path:"model",near:e,mid:t,far:n,total:this.renderList?.length??0}}get pickIndex(){return this.renderList}dispose(){for(let e of this.buckets.tierParts)for(let t of e)this.group.remove(t.mesh),t.mesh.dispose();this.group.remove(this.wings),this.wings.dispose();for(let e of[this.maskBody,this.maskAbd])this.maskScene.remove(e),e.dispose();for(let e of this.variants.values()){for(let t of e.masks)this.maskScene.remove(t),t.dispose();if(e.ready)for(let t of e.buckets.tierParts)for(let n of t)n.mesh.dispose()}this.bodyMat.dispose(),this.abdomenMat.dispose(),this.wingMat.dispose()}};var cM=new fe(ke.amberAccent),Hc=class{constructor(e,t={}){this.cupColor=cM.clone(),this.geometry=new Xn(.22,14,10),this.geometry.scale(1,.62,1),this.geometry.translate(0,-.1,0),this.material=new ns({color:16777215,transparent:!0,opacity:.82,emissive:ke.amberEmber,emissiveIntensity:1.4}),this.mesh=null,this.pickIndex=[],this.phases=[],this.scene=e,this.matrix=new Ae,this.pos=new L,this.quat=new Ct,this.scaleV=new L(1,1,1),this.color=new fe,this.group=new Et,e.add(this.group),this.glow=t.reduced?0:1}setCups(e){this.mesh&&(this.group.remove(this.mesh),this.mesh.dispose()),this.pickIndex=e.map(t=>({workspaceId:t.workspaceId,sessionId:t.sessionId})),this.phases=e.map((t,n)=>(t.phase??n*.7)%(Math.PI*2)),this.mesh=new rt(this.geometry,this.material,Math.max(1,e.length)),this.mesh.count=e.length,this.mesh.frustumCulled=!1,this.mesh.renderOrder=5,this.mesh.castShadow=!0;for(let t=0;t<e.length;t++){let n=e[t],s=Math.floor(t/19);this.pos.set(n.worldCenter.x,-(1.35+s*1.15),n.worldCenter.z),this.matrix.compose(this.pos,this.quat.identity(),this.scaleV),this.mesh.setMatrixAt(t,this.matrix)}this.mesh.instanceMatrix.needsUpdate=!0,this.group.add(this.mesh)}cupAt(e){return this.pickIndex[e]??null}hasSession(e){return this.pickIndex.some(t=>t.sessionId===e)}matrixOf(e){if(!this.mesh)return null;let t=this.pickIndex.findIndex(s=>s.sessionId===e);if(t<0||t>=this.mesh.count)return null;let n=new Ae;return this.mesh.getMatrixAt(t,n),n}frame(e){if(!(!this.mesh||this.mesh.count===0)){for(let t=0;t<this.mesh.count;t++){let n=this.glow>0?.82+.18*Math.sin(e*.0016+this.phases[t]):1;this.color.copy(this.cupColor).multiplyScalar(n),this.mesh.setColorAt(t,this.color)}this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}}applyAppearance(e={}){e.amberColor&&this.cupColor.set(e.amberColor)}dispose(){this.mesh&&(this.group.remove(this.mesh),this.mesh.dispose()),this.geometry.dispose(),this.material.dispose()}};var hM=3.6,uM=1.3,dM=.018,fM=3,Vm=.35,pM=1.12,mM=6*(Math.PI/180),gM=2,vM=120,xM=180,yM=Math.cos(Math.PI/6),bM=.999,_M=512,SM=192,zr=8,MM=26,wM=.78,TM=26,EM=120,AM='600 {SIZE}px "Segoe UI", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';function Gm(i){return AM.replace("{SIZE}",String(i))}function jm(i,e){let t=Number(i)&16777215;return"rgba("+(t>>16&255)+", "+(t>>8&255)+", "+(t&255)+", "+e+")"}function Wm(i,e,t){return Math.min(t,Math.max(e,i))}function CM(i,e){let t=Math.abs(i-e)%(2*Math.PI);return t>Math.PI&&(t=2*Math.PI-t),t}function RM(i,e,t,n,s,r){let a=Math.min(r,n/2,s/2);i.beginPath(),i.moveTo(e+a,t),i.lineTo(e+n-a,t),i.arc(e+n-a,t+a,a,-Math.PI/2,0),i.lineTo(e+n,t+s-a),i.arc(e+n-a,t+s-a,a,0,Math.PI/2),i.lineTo(e+a,t+s),i.arc(e+a,t+s-a,a,Math.PI/2,Math.PI),i.lineTo(e,t+a),i.arc(e+a,t+a,a,Math.PI,3*Math.PI/2),i.closePath()}function IM(i,e,t){if(typeof i=="string"&&i.length>0){let n=i.split(/[\\/]+/).filter(Boolean);if(n.length>0)return n[n.length-1]}return typeof e=="string"&&e.trim().length>0?e.trim():String(t??"")}function PM(i,e,t,n,s){if(!Array.isArray(i)||i.length===0)return[];let r=e-n,a=t-s,o=Math.hypot(r,a);o<1e-6?(r=1,a=0):(r/=o,a/=o);let l=[];for(let h of i){if(!h||!Number.isFinite(h.mx)||!Number.isFinite(h.mz)||!Number.isFinite(h.dx)||!Number.isFinite(h.dz))continue;let d=null;for(let f of l)if(f.nx*h.dx+f.nz*h.dz>yM){d=f;break}d||(d={nx:h.dx,nz:h.dz,best:null,members:[]},l.push(d));let u=h.dx*r+h.dz*a;d.members.push({mx:h.mx,mz:h.mz,proj:h.mx*d.nx+h.mz*d.nz}),(!d.best||u>d.best.score)&&(d.best={score:u,nx:h.dx,nz:h.dz})}let c=[];for(let h of l){if(!h.best||h.members.length===0)continue;let d=-1/0;for(let v of h.members)v.proj>d&&(d=v.proj);let u=0,f=0,m=0;for(let v of h.members)v.proj<d-1e-6||(u+=v.mx,f+=v.mz,m+=1);c.push({centroid:{x:u/m,z:f/m},normal:{x:h.best.nx,z:h.best.nz},score:h.best.score})}return c}function NM(i,e,t=pM){return e?i?e.score>i.score*t:!0:!1}function Cd(i){return IM(i.path,i.title,i.workspaceId)}var Vc=class{constructor(e){this.scene=e,this.group=new Et,this.group.name="watermark",e.add(this.group),this.plateGeo=new ln(hM,uM),this.plateGeo.rotateX(-Math.PI/2),this.items=new Map,this.visibleOn=!0,this.sig=null,this.studioSig=null,this.currentFace=new Map,this.lastTheta=null,this.lastCamX=null,this.lastCamZ=null,this.lastFrameSig=null,this.lastTime=null,this.recomputes=0}setStudios(e){let t=Array.isArray(e)?e:[],n=t.map(o=>o.workspaceId+":"+o.layer+":"+o.center.q+","+o.center.r).join("|"),s=t.map(o=>o.workspaceId+"="+Cd(o)).join("|"),r=n+"\u241F"+s;if(r===this.sig)return;let a=n!==this.studioSig;if(this.sig=r,this.studioSig=n,a)this.rebuild(t);else for(let o of t){let l=this.items.get(o.workspaceId);if(!l)continue;l.studio=o;let c=Cd(o);l.text!==c&&(l.text=c,this.drawPlate(l))}this.currentFace.clear(),this.lastFrameSig=null}rebuild(e){this.clearItems();for(let t of e){if(!t||!t.center||!Array.isArray(t.edges)||t.edges.length===0)continue;let n=document.createElement("canvas");n.width=_M,n.height=SM;let s=new Qi(n);s.colorSpace=Tt,s.anisotropy=8;let r=new bt({map:s,transparent:!0,depthWrite:!1,side:an}),a=new Ze(this.plateGeo,r);a.renderOrder=fM,a.visible=!1,this.group.add(a);let o={studio:t,mesh:a,material:r,texture:s,canvas:n,ctx:n.getContext("2d"),text:Cd(t),fade:{stage:"idle",t:0,pending:null}};this.drawPlate(o),this.items.set(t.workspaceId,o)}}clearItems(){for(let e of this.items.values())this.group.remove(e.mesh),e.material.map?.dispose?.(),e.material.dispose(),e.texture.dispose();this.items.clear()}drawPlate(e){let t=e.ctx;if(!t)return;let n=e.canvas.width,s=e.canvas.height;t.clearRect(0,0,n,s),t.fillStyle=jm(ke.watermarkPlate,wM),RM(t,zr,zr,n-zr*2,s-zr*2,MM),t.fill();let r=e.text??"",a=zr+TM,o=n-a*2,l=s-(zr+18)*2,c=EM;if(r.length>0&&o>0){t.font=Gm(c);let h=t.measureText(r).width;h>0&&(c=Wm(c*o/h,6,l))}t.font=Gm(c),t.textAlign="center",t.textBaseline="middle",t.fillStyle=jm(ke.watermarkText,1),t.fillText(r,n/2,s/2+2),e.texture.needsUpdate=!0}placeItem(e,t){let n=t.centroid.x+t.normal.x*Vm,s=t.centroid.z+t.normal.z*Vm;e.mesh.position.set(n,dM,s),e.mesh.rotation.y=Math.atan2(t.normal.x,t.normal.z),e.mesh.visible=!0}frame(e,t){if(this.group.visible=this.visibleOn&&this.items.size>0,!this.group.visible)return;let n=performance.now(),s=16;this.lastTime!=null&&(s=Wm(n-this.lastTime,0,64)),this.lastTime=n;for(let d of this.items.values())d.fade.stage!=="idle"&&(t?this.settleFade(d):this.advanceFade(d,s));let r=e.position.x,a=e.position.z,o=Math.atan2(a,r),l=this.sig!==this.lastFrameSig,c=this.lastTheta!=null&&CM(o,this.lastTheta)>mM,h=this.lastCamX!=null&&Math.hypot(r-this.lastCamX,a-this.lastCamZ)>gM;if(!(!l&&!c&&!h)){this.lastTheta=o,this.lastCamX=r,this.lastCamZ=a,this.lastFrameSig=this.sig,this.recomputes+=1;for(let[d,u]of this.items){let f=u.studio,m=PM(f.edges,r,a,f.worldCenter.x,f.worldCenter.z);if(m.length===0)continue;let v=this.currentFace.get(d)??null,g=null,p=null;for(let _ of m)(!g||_.score>g.score)&&(g=_),v&&_.normal.x*v.normal.x+_.normal.z*v.normal.z>bM&&(p=_);NM(v?p??{score:-1}:null,g)&&(this.currentFace.set(d,g),t||!v||u.fade.stage!=="idle"?(this.settleFade(u),this.placeItem(u,g)):u.fade={stage:"out",t:0,pending:g})}}}settleFade(e){let t=e.fade;t.stage==="out"&&t.pending&&this.placeItem(e,t.pending),t.stage="idle",t.t=0,t.pending=null,e.material.opacity=1}advanceFade(e,t){let n=e.fade;if(n.t+=t,n.stage==="out"){let s=Math.min(1,n.t/vM);e.material.opacity=1-s,s>=1&&(this.placeItem(e,n.pending),n.stage="in",n.t=0)}else{let s=Math.min(1,n.t/xM);e.material.opacity=s,s>=1&&(n.stage="idle",n.t=0,n.pending=null)}}setVisible(e){this.visibleOn=!!e}dispose(){this.clearItems(),this.plateGeo.dispose(),this.scene.remove(this.group),this.items=new Map}};var LM=5;function qm(i,e){return{x0:Math.min(i.x,e.x),y0:Math.min(i.y,e.y),x1:Math.max(i.x,e.x),y1:Math.max(i.y,e.y)}}var Gc=class{constructor({canvas:e,scene:t,camera:n,rig:s,tileField:r,territory:a,walls:o,bees:l,cups:c,studioLayersOf:h,occupancyOf:d,editModeOf:u,spinModeOf:f,selectionOf:m,callbacks:v}){this.canvas=e,this.scene=t,this.camera=n,this.rig=s,this.tileField=r,this.territory=a,this.walls=o,this.bees=l,this.cups=c,this.studioLayersOf=h,this.occupancyOf=d,this.editModeOf=u??(()=>!1),this.spinModeOf=f??(()=>!1),this.selectionOf=m??(()=>null),this.callbacks=v,this.raycaster=new za,this.ndc=new he,this.mode=null,this.downButton=0,this.downPoint=null,this.lastPoint=null,this.downHit=null,this.moved=!1,this.ghost=null,this.dragBee=null,this.hover=null,this.attached=this.attach()}pointOf(e){let t=this.canvas.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top,rect:t}}setNdc(e,t){this.ndc.set(e.x/e.rect.width*2-1,-(e.y/e.rect.height)*2+1),this.raycaster.setFromCamera(this.ndc,t??this.camera)}pick(e){this.setNdc(e);let t=null;for(let s of this.bees.pickMeshes()){let r=this.raycaster.intersectObject(s,!1);r.length>0&&(!t||r[0].distance<t.distance)&&(t=r[0])}if(t){let s=this.bees.beeAt(t.object,t.instanceId);if(s)return s.origin==="subagent"?{kind:"drone",id:s.id,face:s,point:t.point}:{kind:"bee",id:s.id,face:s,point:t.point}}if(this.cups.mesh){let s=this.raycaster.intersectObject(this.cups.mesh,!1);if(s.length>0){let r=this.cups.cupAt(s[0].instanceId);if(r)return{kind:"cup",id:r.sessionId,face:r,point:s[0].point,workspaceId:r.workspaceId}}}if(this.walls.mesh){let s=this.raycaster.intersectObject(this.walls.mesh,!1);if(s.length>0){let r=this.walls.studioAt(s[0].instanceId);if(r)return{kind:"studio",id:r,point:s[0].point}}}if(this.territory.floor){let s=this.raycaster.intersectObject(this.territory.floor,!1);if(s.length>0){let r=this.territory.studioAt(s[0].instanceId);if(r)return{kind:"studio",id:r,point:s[0].point}}}let n=this.groundPoint(e);return n?{kind:"ground",id:null,point:n}:{kind:"void",id:null,point:null}}groundPoint(e){this.setNdc(e);let t=new Dn(new L(0,1,0),0),n=new L;return this.raycaster.ray.intersectPlane(t,n)?n:null}ensureGhost(){if(this.ghost)return this.ghost;let e=new ts;for(let n=0;n<6;n++){let s=n*Math.PI/3+Math.PI/6,r=Math.cos(s),a=Math.sin(s);n===0?e.moveTo(r,a):e.lineTo(r,a)}e.closePath();let t=new Ns(e);return t.rotateX(-Math.PI/2),this.ghost=new Ze(t,new bt({color:3523178,transparent:!0,opacity:.38,side:St,depthWrite:!1})),this.ghost.visible=!1,this.ghost.renderOrder=30,this.scene.add(this.ghost),this.ghost}setGhost(e,t,n){let s=this.ensureGhost(),r=Xt(e);s.position.set(r.x,.05,r.z);let a=Math.max(1.2,n??2.2);s.scale.setScalar(a),s.material.color.set(t?3523178:14042437),s.visible=!0}hideGhost(){this.ghost&&(this.ghost.visible=!1)}cellValid(e,t,n){for(let s of this.studioLayersOf())if(s.workspaceId!==t&&!Ic(e,n,s.center,s.layer,1))return!1;return!0}attach(){let e=this.canvas,t=u=>{if(u.button!==0&&u.button!==1&&u.button!==2)return;let f=this.pointOf(u),m=this.pick(f);this.downPoint=f,this.lastPoint=f,this.downButton=u.button,this.moved=!1,this.downHit=m,this.mode=null,e.setPointerCapture(u.pointerId),e.style.cursor="grabbing"},n=u=>{let f=this.pointOf(u);if(!this.downPoint){let x=this.pick(f),_=x.kind,y=x.id??null,E=_!==this.hover?.kind||y!==this.hover?.id;this.hover={kind:_,id:y,screen:f,face:x.face??null,workspaceId:x.workspaceId??null},E?this.callbacks.onHover?.(this.hover):this.hover&&(this.hover.screen=f);let A="default";if(_==="bee"||_==="drone")A="pointer";else if(_==="studio"){let R=this.selectionOf();A=this.editModeOf()&&R?.kind==="studio"&&R.id===y?"move":"context-menu"}this.canvas.style.cursor=A;return}let m=f.x-this.lastPoint.x,v=f.y-this.lastPoint.y,g=f.x-this.downPoint.x,p=f.y-this.downPoint.y;if(!(!this.moved&&Math.hypot(g,p)<LM)){if(this.moved=!0,!this.mode){let x=this.downHit,_=this.downButton;if(_===0&&x.kind==="bee")this.mode="bee",this.dragBee={sessionId:x.id,from:x.face},this.callbacks.onBeeDragStart?.(x.id);else if(_===0&&x.kind==="studio"){let y=this.selectionOf();if(this.editModeOf()&&y?.kind==="studio"&&y.id===x.id){this.mode="studio",this.dragStudio={workspaceId:x.id};let A=this.studioLayersOf().find(R=>R.workspaceId===x.id);this.dragStudio.layer=A?.layer??3}else this.mode="marquee",this.canvas.style.cursor="crosshair"}else _===0&&x.kind==="ground"?(this.mode="marquee",this.canvas.style.cursor="crosshair"):_===1?this.mode="pan":_===2&&(this.mode=this.spinModeOf()?"spin":"pan")}if(this.mode==="spin")this.rig.spin(m);else if(this.mode==="pan")this.rig.pan(m,v);else if(this.mode==="studio"){let x=this.groundPoint(f);if(x){let _=Rc(x.x,x.z);this.dragStudio.cell=_,this.dragStudio.valid=this.cellValid(_,this.dragStudio.workspaceId,this.dragStudio.layer),this.setGhost(_,this.dragStudio.valid,Math.sqrt(3)*(this.dragStudio.layer-1+.5)),this.callbacks.onDragCell?.(_)}}else if(this.mode==="bee"){let x=this.groundPoint(f);if(x){let _=Rc(x.x,x.z);this.dragBee.cell=_;let E=this.occupancyOf?.()?.get(Bn(_));this.dragBee.targetWorkspaceId=E??null,this.setGhost(_,!0,1.6),this.callbacks.onDragCell?.(_)}}else this.mode==="marquee"&&this.callbacks.onMarqueeMove?.(qm(this.downPoint,f));this.lastPoint=f}},s=(u,f)=>{if(!this.downPoint)return;try{this.canvas.releasePointerCapture(u.pointerId)}catch{}let m=this.pointOf(u),v=this.downPoint,g=this.mode,p=this.downHit,x=this.moved;if(this.downPoint=null,this.mode=null,this.canvas.style.cursor="default",this.hideGhost(),this.callbacks.onDragEnd?.(),f){g==="marquee"&&this.callbacks.onMarqueeCancel?.(),this.callbacks.onDragCancel?.();return}if(g==="marquee"){this.downHit=null,this.callbacks.onMarqueeEnd?.(qm(v,m));return}if(g==="studio"&&this.dragStudio?.cell){let{workspaceId:_,cell:y,valid:E}=this.dragStudio;this.dragStudio=null,E?this.callbacks.onStudioMoved?.(_,y):this.callbacks.onInvalidDrop?.("studio");return}if(g==="bee"&&this.dragBee){let{sessionId:_,targetWorkspaceId:y,cell:E}=this.dragBee;this.dragBee=null,y?this.callbacks.onBeeDropped?.(_,y,E):this.callbacks.onDragCancel?.();return}if(!x){let _=this.pick(m);if(u.button===0){if(_.kind==="bee")_.face?.droneStandIn||this.callbacks.onSelectBee?.(_.id,_.face);else if(_.kind!=="drone")if(_.kind==="cup")this.callbacks.onSelectCup?.(_.id,_.workspaceId,_.face);else if(_.kind==="studio")this.callbacks.onSelectStudio?.(_.id);else if(_.kind==="ground"){let y=Rc(_.point.x,_.point.z);this.callbacks.onSelectTile?.(y)}else _.kind==="void"&&this.callbacks.onClearSelection?.()}else u.button===2&&(_.kind==="studio"?this.callbacks.onStudioMenu?.(_.id,m):_.kind==="bee"&&this.callbacks.onBeeMenu?.(_.id,m))}this.downHit=null},r=u=>s(u,!1),a=u=>s(u,!0),o=()=>{this.hover=null,this.downPoint=null;let u=this.mode==="marquee";this.mode=null,this.canvas.style.cursor="default",u&&this.callbacks.onMarqueeCancel?.(),this.callbacks.onHover?.(null)},l=u=>u.preventDefault(),c=u=>{u.preventDefault();let f=this.pointOf(u),m=this.groundPoint(f),v=m?new L(m.x-this.rig.target.x,0,m.z-this.rig.target.z).multiplyScalar(.18):null;this.rig.zoom(u.deltaY,v)},h=u=>{let f=this.pointOf(u),m=this.pick(f);m.kind==="bee"||m.kind==="drone"?this.callbacks.onFocusBee?.(m.id):m.kind==="studio"&&this.callbacks.onFocusStudio?.(m.id)},d=u=>{if(u.key==="Escape"&&(this.mode==="studio"||this.mode==="bee"||this.mode==="marquee")){let f=this.mode==="marquee";this.downPoint=null,this.mode=null,this.hideGhost(),this.canvas.style.cursor="default",this.callbacks.onDragEnd?.(),f?this.callbacks.onMarqueeCancel?.():this.callbacks.onDragCancel?.()}};return e.addEventListener("pointerdown",t),e.addEventListener("pointermove",n),e.addEventListener("pointerup",r),e.addEventListener("pointercancel",a),e.addEventListener("pointerleave",o),e.addEventListener("contextmenu",l),e.addEventListener("wheel",c,{passive:!1}),e.addEventListener("dblclick",h),window.addEventListener("keydown",d),()=>{e.removeEventListener("pointerdown",t),e.removeEventListener("pointermove",n),e.removeEventListener("pointerup",r),e.removeEventListener("pointercancel",a),e.removeEventListener("pointerleave",o),e.removeEventListener("contextmenu",l),e.removeEventListener("wheel",c),e.removeEventListener("dblclick",h),window.removeEventListener("keydown",d)}}dispose(){this.attached?.(),this.ghost&&(this.scene.remove(this.ghost),this.ghost.geometry.dispose(),this.ghost.material.dispose())}};function Xm(i){let e=i?.droneCount??0;return e<=0?"":"\u{1F41D}"+Math.min(i?.activeDroneCount??e,e)+"/"+e}function DM(i){return(i?.droneCount??0)>0&&(i?.activeDroneCount??0)>0}var jc=class{constructor(e,t,n){this.container=e,this.t=t,this.callbacks=n,this.root=document.createElement("div"),this.root.className="jyv-cards",e.appendChild(this.root),this.cards=new Map,this.expandedKey=null,this.lastFrame=null,this.lastLaneByWorkspace={},this.onDocPointerDown=s=>{(!(s.target instanceof Element)||!s.target.closest(".jyv-card"))&&this.setExpanded(null)},document.addEventListener("pointerdown",this.onDocPointerDown,!0)}setExpanded(e){this.expandedKey!==e&&(this.expandedKey=e,this.lastFrame&&this.update(this.lastFrame))}lanePositionOf(e){let t=e?.workspaceId?this.lastLaneByWorkspace?.[e.workspaceId]:null;return t?t.holder===e.key?-2:t.waiting?.findIndex(n=>n.sessionId===e.key)??-1:-1}setLaneSnapshot(e){this.lastLaneByWorkspace=e??{},this.lastFrame&&this.update(this.lastFrame)}update(e){this.lastFrame=e;let t=new Map(e.map(n=>[n.key,n]));for(let[n,s]of this.cards)t.has(n)||(s.el.remove(),this.cards.delete(n),this.expandedKey===n&&(this.expandedKey=null));for(let n of e){let s=this.cards.get(n.key);s||(s={el:this.buildCard(n)},this.cards.set(n.key,s),this.root.appendChild(s.el));let r=n.full||this.expandedKey===n.key?"full":"mini",a=n.face??{},o=n.overlay??null,l=this.lanePositionOf(n),c=[r,n.kind,a.displayTitle,a.updatedAt,a.todos?.done,a.todos?.total,n.state??"",n.droneCount??0,n.activeDroneCount??0,o?.beeTypeName??"",Object.keys(o?.vars??{}).length,l,o?.hatchables?.length??0,o?.waits?.length??0,o?.notices?.length??0,JSON.stringify(o?.vars??{})].join("|");if(s.el.dataset.sig!==c&&(this.renderCard(s.el,n,r),s.el.dataset.sig=c),n.screen.x===null||n.screen.x===void 0){s.el.style.display="none";continue}s.el.style.display="";let h=n.kind==="cup"?"":" translate(-50%,-100%)";s.el.style.transform="translate("+Math.round(n.screen.x)+"px,"+Math.round(n.screen.y)+"px)"+h}}buildCard(e){let t=document.createElement("div");return t.className="jyv-card",t}renderCard(e,t,n){let s=this.t,r=t.face??{},a=n==="mini",o=t.overlay??null,l=this.lanePositionOf(t);if(e.className="jyv-card"+(a?" jyv-cardMini":"")+(t.kind==="cup"?" jyv-cardCup":""),e.dataset.mode=n,a){let E=r.todos?'<span class="jyv-bubbleTodo">'+r.todos.done+"/"+r.todos.total+"</span>":"",A=Xm(t)?'<span class="jyv-bubbleTodo">'+Xm(t)+"</span>":"",R=o?.beeTypeName?'<span class="jyv-bubbleBee">\u27E1'+pi(o.beeTypeName)+"</span>":"",b=l>=0?'<span class="jyv-bubbleLane">\u23F8'+l+"</span>":l===-2?'<span class="jyv-bubbleLane">\u23F8</span>':"";e.title=(r.displayTitle??"")+(t.state?" \xB7 "+Wc(s,t.state):"")+(o?.beeTypeName?" \xB7 "+o.beeTypeName:""),e.innerHTML='<span class="jyv-cardDot jyv-state-'+(t.state??"idle")+'"></span>'+E+A+R+b,e.onclick=w=>{w.stopPropagation(),this.setExpanded(t.key)};return}let c=t.kind==="cup",h=o?.vars??{},d=Object.keys(h),u=o?.notices??[],f=o?.beeTypeName?'<div class="jyv-cardBeeRow"><span class="jyv-cardBee">\u27E1'+pi(o.beeTypeName)+"</span>"+(o.queuePolicy==="serialized"?'<span class="jyv-cardQueue">'+s("hive.bee.serialized")+"</span>":"")+(l>=0?'<span class="jyv-bubbleLane">\u23F8 '+s("hive.lane.ahead").replace("{n}",String(l))+"</span>":"")+(l===-2?'<span class="jyv-bubbleLane">\u23F8 '+s("hive.lane.holding")+"</span>":"")+"</div>":"",m=d.length?'<div class="jyv-cardVars">'+d.map(E=>'<span class="jyv-cardVar">'+pi(E)+"="+pi(h[E])+"</span>").join("")+(d.length?'<button type="button" class="jyv-cardBtn jyv-cardVarReset" data-act="latchReset">'+s("hive.latch.reset")+"</button>":"")+"</div>":"",v=(o?.waits??[]).length?'<div class="jyv-cardWaits">'+o.waits.map(E=>'<span class="jyv-cardWait">'+pi(E.name??E.capabilityId??"")+" \xB7 "+FM(s,E.gate)+"</span>").join("")+"</div>":"",g=u.length?'<div class="jyv-cardNotices">'+u.slice(-2).map(E=>'<span class="jyv-cardNotice">'+pi(E.text??"")+"</span>").join("")+"</div>":"",p=(o?.hatchables??[]).length?'<div class="jyv-cardHatch">'+o.hatchables.map(E=>'<button type="button" class="jyv-cardBtn jyv-cardHatchBtn" data-act="hatch" data-cap="'+pi(E.capabilityId)+'">'+s("hive.hatch").replace("{name}",pi(E.name))+"</button>").join("")+(l>=0&&t.workspaceId?'<button type="button" class="jyv-cardBtn" data-act="laneCancel">'+s("hive.lane.cancel")+"</button>":"")+"</div>":l>=0&&t.workspaceId?'<div class="jyv-cardHatch"><button type="button" class="jyv-cardBtn" data-act="laneCancel">'+s("hive.lane.cancel")+"</button></div>":"",x=c?'<div class="jyv-cardArchived">'+s("hive.archivedTag")+"</div>":'<div class="jyv-cardActions">'+(DM(t)?'<button type="button" class="jyv-cardBtn" data-act="collapse">'+s("hive.collapse")+"</button>":"")+'<button type="button" class="jyv-cardBtn" data-act="open">'+s("hive.openSession")+'</button><button type="button" class="jyv-cardBtn" data-act="archive">'+s("hive.archive")+"</button></div>",_=r.todos?'<div class="jyv-cardTodos"><span class="jyv-cardTodosBar"><span style="width:'+Math.round(r.todos.done/Math.max(1,r.todos.total)*100)+'%"></span></span><span>'+s("hive.todos").replace("{done}",String(r.todos.done)).replace("{total}",String(r.todos.total))+"</span></div>":"",y=t.droneCount>0?'<div class="jyv-cardDrones">\u{1F41D} \xD7'+t.droneCount+" \xB7 "+s("hive.activeCount").replace("{n}",String(t.activeDroneCount??0))+(t.runningDescendants>0?" \xB7 "+s("hive.runningCount").replace("{n}",String(t.runningDescendants)):"")+"</div>":"";e.innerHTML='<div class="jyv-cardHead"><span class="jyv-cardDot jyv-state-'+(t.state??"idle")+'"></span><span class="jyv-cardTitle" title="'+pi(r.displayTitle??"")+'">'+pi(r.displayTitle??"")+'</span><button type="button" class="jyv-cardPin" data-act="shrink" title="'+s("hive.shrink")+'">\u2014</button></div><div class="jyv-cardMeta">'+Wc(s,t.state)+" \xB7 "+kM(s,r.updatedAt)+"</div>"+f+m+v+g+p+_+y+x;for(let E of e.querySelectorAll("[data-act]"))E.addEventListener("click",A=>{A.stopPropagation();let R=E.dataset.act;R==="shrink"?this.setExpanded(null):R==="open"?this.callbacks.onOpen?.(t.key):R==="archive"?this.callbacks.onArchive?.(t.key):R==="collapse"?this.callbacks.onToggleCollapse?.(t.key):R==="hatch"?this.callbacks.onHatch?.(t.key,E.dataset.cap):R==="laneCancel"?this.callbacks.onLaneCancel?.(t.workspaceId,t.key):R==="latchReset"&&this.callbacks.onLatchReset?.(t.key)})}clear(){for(let[,e]of this.cards)e.el.remove();this.cards.clear(),this.expandedKey=null}dispose(){document.removeEventListener("pointerdown",this.onDocPointerDown,!0),this.clear(),this.root.remove()}};function Wc(i,e){switch(e){case"busy":return i("hive.state.busy");case"help":return i("hive.state.help");case"done":return i("hive.state.done");default:return i("hive.state.idle")}}function FM(i,e){switch(e){case"format":return i("hive.wait.marker");case"predicate":return i("hive.wait.predicate");case"latch":return i("hive.wait.latch");case"watermark":return i("hive.wait.watermark");default:return e??""}}function kM(i,e){if(!e)return"";let t=Date.now()-e;return t<6e4?i("hive.time.now"):t<36e5?i("hive.time.min").replace("{n}",String(Math.floor(t/6e4))):t<864e5?i("hive.time.hour").replace("{n}",String(Math.floor(t/36e5))):i("hive.time.day").replace("{n}",String(Math.floor(t/864e5)))}function pi(i){return String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var Ym=24,Km=16,Jm=4,OM=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,UM=`
  uniform sampler2D uMask;
  uniform vec2 uTexel;
  uniform float uRadius;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float center = texture2D(uMask, vUv).a;
    float reach = 0.0;
    for (int i = 0; i < ${Ym}; i++) {
      float a = 6.2831853 * float(i) / ${Ym}.0;
      reach = max(reach, texture2D(uMask, vUv + vec2(cos(a), sin(a)) * uRadius * uTexel).a);
    }
    for (int i = 0; i < ${Km}; i++) {
      float a = 6.2831853 * (float(i) + 0.5) / ${Km}.0;
      reach = max(reach, texture2D(uMask, vUv + vec2(cos(a), sin(a)) * uRadius * 0.55 * uTexel).a);
    }
    float outline = clamp(reach - center, 0.0, 1.0);
    if (outline < 0.004) discard;
    gl_FragColor = vec4(uColor, outline * uOpacity);
    #include <colorspace_fragment>
  }
`,Zm=`
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,BM=`
  precision highp float;
  uniform sampler2D uDepth;
  uniform vec2 uTexel;
  in vec2 vUv;
  layout(location = 0) out vec4 outColor;
  void main() {
    /* \u90BB\u57DF\u6700\u5927\u6DF1\u5EA6\uFF08\u8986\u76D6\u8BE5\u50CF\u7D20\u7684\u6DF1\u5EA6\u8DB3\u8FF9\uFF09\uFF1A\u5168\u5206\u8FA8\u7387\u6765\u6E90 = \u540C\u7EB9\u7D20\uFF08\u65E0\u53D8\u5316\uFF09\uFF1B
       \u534A\u5206\u8FA8\u7387\u6765\u6E90\u8865\u507F\u300C\u7EB9\u7D20\u4E2D\u5FC3 \u2260 \u5168\u5206\u8FA8\u7387\u91C7\u6837\u4F4D\u7F6E\u300D\u7684\u659C\u7387\u8BEF\u5DEE\u2014\u2014\u906E\u6321\u8FB9\u7F18
       \u4FB5\u8680 \u2264 1 \u6DF1\u5EA6\u7EB9\u7406\u7D20\uFF08design.md D7 \u5BB9\u5DEE\uFF09\uFF0C\u906E\u7F69\u5185\u90E8 SHALL NOT \u51FA\u73B0\u6296\u65AD\u3002 */
    float d = texture(uDepth, vUv).x;
    d = max(d, texture(uDepth, vUv + vec2(1.0, 0.0) * uTexel).x);
    d = max(d, texture(uDepth, vUv + vec2(-1.0, 0.0) * uTexel).x);
    d = max(d, texture(uDepth, vUv + vec2(0.0, 1.0) * uTexel).x);
    d = max(d, texture(uDepth, vUv + vec2(0.0, -1.0) * uTexel).x);
    gl_FragDepth = d;
    outColor = vec4(0.0);
  }
`,zM=`
  precision highp float;
  layout(location = 0) out vec4 outColor;
  void main() {
    gl_FragDepth = 1.0;
    outColor = vec4(0.0);
  }
`,qc=class{constructor(){this.logicalSize={w:1,h:1},this.pixelRatio=1,this.rt=null,this.depthSource=null,this.halfRT=null,this.halfDepth=null,this.depthOnlyMaterial=new bt({colorWrite:!1}),this.depthCopyMaterial=new at({uniforms:{uDepth:{value:null},uTexel:{value:new he(0,0)}},vertexShader:Zm,fragmentShader:BM,glslVersion:Pr,colorWrite:!1,depthTest:!0,depthFunc:Ms,depthWrite:!0}),this.depthFarMaterial=new at({vertexShader:Zm,fragmentShader:zM,glslVersion:Pr,colorWrite:!1,depthTest:!0,depthFunc:Ms,depthWrite:!0}),this.quadCam=new On(-1,1,1,-1,0,1),this.depthCopyScene=new gn,this.copyQuad=new Ze(new ln(2,2),this.depthCopyMaterial),this.copyQuad.frustumCulled=!1,this.depthCopyScene.add(this.copyQuad),this.quadScene=new gn,this._prevColor=new fe,this.uniforms={uMask:{value:null},uTexel:{value:new he(1/512,1/512)},uRadius:{value:Jm},uColor:{value:new fe(ke.outline)},uOpacity:{value:.95}},this.quadMaterial=new at({uniforms:this.uniforms,vertexShader:OM,fragmentShader:UM,transparent:!0,depthTest:!1,depthWrite:!1}),this.compositeQuad=new Ze(new ln(2,2),this.quadMaterial),this.compositeQuad.frustumCulled=!1,this.quadScene.add(this.compositeQuad)}_setCopyTexel(e){let t=e?.image?.width??1,n=e?.image?.height??1;this.depthCopyMaterial.uniforms.uTexel.value.set(1/t,1/n)}setDepthTexture(e){this.depthSource=e??null}setSize(e,t,n){let s=Math.max(1,Math.round(e*n)),r=Math.max(1,Math.round(t*n));this.logicalSize={w:e,h:t},this.pixelRatio=n,!(this.rt&&this.rt.width===s&&this.rt.height===r)&&(this.rt?.dispose(),this.rt=new Rt(s,r,{minFilter:At,magFilter:At,depthBuffer:!0,samples:4,resolveDepthBuffer:!1}),this.uniforms.uMask.value=this.rt.texture,this.uniforms.uTexel.value.set(1/s,1/r))}ensureHalfRT(){let e=Math.max(1,Math.round(this.logicalSize.w*this.pixelRatio*.5)),t=Math.max(1,Math.round(this.logicalSize.h*this.pixelRatio*.5));this.halfRT&&this.halfRT.width===e&&this.halfRT.height===t||(this.halfRT?.dispose(),this.halfDepth?.dispose(),this.halfDepth=new Tn(e,t),this.halfRT=new Rt(e,t,{depthBuffer:!0,depthTexture:this.halfDepth}))}invalidate(){this.rt?.dispose(),this.rt=null,this.halfRT?.dispose(),this.halfRT=null,this.halfDepth?.dispose(),this.halfDepth=null,this.depthSource=null}applyAppearance(e={}){e.outlineColor&&this.uniforms.uColor.value.set(e.outlineColor)}render(e,t,n,s){if(!n?.active||!this.rt)return;this.uniforms.uRadius.value=Jm*this.pixelRatio;let r=e.getClearColor(this._prevColor),a=e.getClearAlpha(),o=e.autoClear,l=e.shadowMap.autoUpdate;e.autoClear=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(this.rt),e.setClearColor(0,0),e.clear(!0,!0,!0);let c=n?.depthExemptOf?.()??[];if(this.depthSource){this.depthCopyMaterial.uniforms.uDepth.value=this.depthSource,this._setCopyTexel(this.depthSource),e.render(this.depthCopyScene,this.quadCam);for(let h of c){if(!h||Array.isArray(h.material))continue;let d=h.material;h.material=this.depthFarMaterial,e.render(h,t),h.material=d}}else{this.ensureHalfRT();let h=s.overrideMaterial,d=c.map(u=>u.visible);for(let u of c)u&&(u.visible=!1);s.overrideMaterial=this.depthOnlyMaterial,e.setRenderTarget(this.halfRT),e.setClearColor(0,0),e.clear(!0,!0,!0),e.render(s,t),s.overrideMaterial=h,c.forEach((u,f)=>{u&&(u.visible=d[f])}),e.setRenderTarget(this.rt),this.depthCopyMaterial.uniforms.uDepth.value=this.halfDepth,this._setCopyTexel(this.halfDepth),e.render(this.depthCopyScene,this.quadCam)}e.setRenderTarget(this.rt),e.render(n.maskScene,t),e.setRenderTarget(null),e.setClearColor(r,a),e.setViewport(0,0,this.logicalSize.w,this.logicalSize.h),e.render(this.quadScene,this.quadCam),e.autoClear=o,e.shadowMap.autoUpdate=l}dispose(){this.rt?.dispose(),this.rt=null,this.halfRT?.dispose(),this.halfRT=null,this.halfDepth?.dispose(),this.halfDepth=null,this.depthSource=null,this.compositeQuad.geometry.dispose(),this.copyQuad.geometry.dispose(),this.quadMaterial.dispose(),this.depthCopyMaterial.dispose(),this.depthFarMaterial.dispose(),this.depthOnlyMaterial.dispose()}};var $m=16,Qm=20,Xc="-";function Rd(i){return String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var Id=i=>typeof i=="number"&&Number.isFinite(i);function HM({face:i,overlay:e,studioTitle:t,t:n}){let s=!!(i?.droneOf||i?.droneStandIn),r=!s&&e?.beeTypeName?String(e.beeTypeName):"",a=s?n("hive.tips.drone"):r||n("hive.tips.defaultBee"),o=Wc(n,i?.state),l=t?String(t):Xc,c=i?.tipFace??null,h=!s&&Id(c?.sessions)?String(c.sessions):Xc,d=!s&&Id(c?.tokens)?String(c.tokens):Xc,u=!s&&Id(c?.dps)?`${Math.round(c.dps)} t/s \xB7 ${n("hive.tips.avg")}`:Xc;return{type:a,state:o,workspace:l,sessions:h,tokens:d,dps:u}}var Yc=class{constructor(e,t){this.t=t,this.root=document.createElement("div"),this.root.className="jyv-tips",e.appendChild(this.root),this.el=document.createElement("div"),this.el.className="jyv-tip",this.el.style.display="none",this.root.appendChild(this.el),this.sig=null}frame(e,t={}){let n=e&&(e.kind==="bee"||e.kind==="drone")?e.face:null,s=e?.screen;if(!n||!s||s.x==null||s.y==null){this.hide();return}let r=HM({face:n,overlay:t.overlayOf?.(e.id)??null,studioTitle:n.workspaceId?t.studioTitleOf?.(n.workspaceId)??"":"",t:this.t}),a=`${e.kind}|${e.id}|${r.type}|${r.state}|${r.workspace}|${r.sessions}|${r.tokens}|${r.dps}`;a!==this.sig&&(this.sig=a,this.render(r));let o=this.root.parentElement,l=o?.clientWidth??0,c=o?.clientHeight??0,h=s.x+$m,d=s.y+Qm;l>0&&h+this.el.offsetWidth>l&&(h=Math.max(0,s.x-$m-this.el.offsetWidth)),c>0&&d+this.el.offsetHeight>c&&(d=Math.max(0,s.y-Qm-this.el.offsetHeight)),this.el.style.display="",this.el.style.transform=`translate(${Math.round(h)}px,${Math.round(d)}px)`}render(e){let t=this.t,n=(s,r)=>'<div class="jyv-tipRow"><span class="jyv-tipKey">'+Rd(s)+'</span><span class="jyv-tipVal">'+Rd(r)+"</span></div>";this.el.innerHTML='<div class="jyv-tipType">'+Rd(e.type)+"</div>"+n(t("hive.tips.status"),e.state)+n(t("hive.tips.workspace"),e.workspace)+n(t("hive.tips.sessions"),e.sessions)+n(t("hive.tips.tokens"),e.tokens)+n(t("hive.tips.dps"),e.dps)}hide(){this.sig!==null&&(this.sig=null,this.el.style.display="none")}dispose(){this.el.remove(),this.root.remove(),this.sig=null}};var eg=256;function VM({hoverId:i,hoverKind:e,selectedId:t,rendered:n}){let s=n??[],r=[];if(e==="bee"&&i&&r.push(i),t&&t!==i&&r.push(t),r.length===0)return[];if(i){let o=s.find(l=>l.id===i);if(o&&(o.droneOf||o.droneStandIn))return[]}let a=[];for(let o of s)o.droneOf&&r.includes(o.parentOf)&&a.push([o.parentOf,o.id]);return a}function GM({hoverId:i,hoverKind:e,selectedId:t,rendered:n}){let s=new Set;if(i&&(e==="bee"||e==="drone")&&s.add(i),t&&s.add(t),s.size===0)return[];let r=n??[],a=new Set(r.map(h=>h.id)),o=[],l=new Set,c=(h,d)=>{if(h===d||!a.has(h)||!a.has(d))return;let u=h+"\u2192"+d;l.has(u)||(l.add(u),o.push([h,d]))};for(let h of r){h.summonedBy&&(s.has(h.id)||s.has(h.summonedBy))&&c(h.summonedBy,h.id);let d=h.summonedTo;if(Array.isArray(d))for(let u of d)(s.has(h.id)||s.has(u))&&c(h.id,u)}return o}var Kc=class{constructor(e){this.group=new Et,e?.add?.(this.group),this.beeDrone=this._makeSet(ke.linkBeeDrone),this.summon=this._makeSet(ke.linkSummon)}_makeSet(e){let t=new gt,n=new dt(new Float32Array(eg*6),3);n.setUsage(Os),t.setAttribute("position",n),t.setDrawRange(0,0);let s=new $i({color:e,transparent:!0,opacity:.4,depthWrite:!1}),r=new Rs(t,s);return r.frustumCulled=!1,r.renderOrder=20,r.visible=!1,this.group.add(r),{lines:r,geometry:t,material:s,pairs:0}}frame({hover:e,selectedId:t,bees:n}={}){let s=e&&(e.kind==="bee"||e.kind==="drone")?e.id:null,r=e?.kind??null;if(!s&&!t){this._clear(this.beeDrone),this._clear(this.summon);return}let a=n?.renderList??[],o=n?.beeMap??new Map;this._write(this.beeDrone,VM({hoverId:s,hoverKind:r,selectedId:t,rendered:a}),o),this._write(this.summon,GM({hoverId:s,hoverKind:r,selectedId:t,rendered:a}),o)}_write(e,t,n){if(t.length===0){this._clear(e);return}let s=e.geometry.attributes.position,r=s.array,a=0;for(let[o,l]of t){if(a>=eg)break;let c=n.get(o),h=n.get(l);if(!c||!h)continue;let d=c.pose??c.world,u=h.pose??h.world;!d||!u||(r[a*6]=d.x,r[a*6+1]=d.y,r[a*6+2]=d.z,r[a*6+3]=u.x,r[a*6+4]=u.y,r[a*6+5]=u.z,a++)}if(e.pairs=a,a===0){this._clear(e);return}e.geometry.setDrawRange(0,a*2),s.needsUpdate=!0,e.lines.visible=!0}_clear(e){e.pairs===0&&!e.lines.visible||(e.pairs=0,e.geometry.setDrawRange(0,0),e.lines.visible=!1)}dispose(){this.group.parent?.remove(this.group);for(let e of[this.beeDrone,this.summon])e.geometry.dispose(),e.material.dispose()}};var jM=`
varying vec3 vDir;
void main() {
  vDir = normalize(position); // \u7A79\u9876\u8DDF\u968F\u76F8\u673A \u2192 \u65B9\u5411\u5373\u672C\u5BF9\u8C61\u7A7A\u95F4\u5355\u4F4D\u5411\u91CF
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,WM=`
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uGround;     // \u6DF1\u975B\uFF08\u5730\u5E73\u7EBF\u53CA\u4EE5\u4E0B\u7684\u8D77\u70B9\uFF1B\u65E0\u96FE\u73AF\u5883\uFF0C\u6E05\u5C4F\u8272\u540C\u6E90\uFF09
uniform vec3 uGroundDeep; // \u5730\u9762\u534A\u533A\u6E10\u53D8\u7EC8\u70B9\u8FD1\u9ED1
uniform float uTime;
uniform float uStar;      // \u661F\u70B9\u5F3A\u5EA6\uFF08\u9ED8\u8BA4\u5FAE\u5F31\uFF09
uniform float uGrid;      // \u516D\u8FB9\u5F62\u7F51\u683C\u56DE\u58F0\u5F3A\u5EA6\uFF08\u9ED8\u8BA4\u5FAE\u5F31\uFF09
varying vec3 vDir;

float hash31(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

/* \u4F4E\u5F3A\u5EA6\u6570\u636E\u661F\u70B9\uFF1A\u7A00\u758F\u683C\u5B50 + \u54C8\u5E0C\u95EA\u70C1\uFF08\u4E0A\u534A\u7403\u6E10\u5165\uFF0C\u5730\u5E73\u7EBF\u4E0B\u65E0\u661F\uFF09\u3002 */
float starField(vec3 d, float t) {
  vec3 p = d * 60.0;
  vec3 id = floor(p);
  vec3 f = fract(p) - 0.5;
  float h = hash31(id);
  float on = step(0.93, h);
  float tw = 0.55 + 0.45 * sin(t * (0.5 + h * 1.9) + h * 6.2831);
  float falloff = exp(-dot(f, f) * 22.0);
  return on * tw * falloff;
}

/* \u5E73\u9876\u516D\u8FB9\u5F62\u7F51\u683C\u8DDD\u79BB\u573A\uFF1A\u8FD4\u56DE\u5230\u5355\u5143\u4E2D\u5FC3\u7684\u516D\u8FB9\u5F62\u5EA6\u91CF\u8DDD\u79BB\uFF080.5 = \u5355\u5143\u8FB9\u7F18\uFF09\u3002 */
float hexEdge(vec2 p) {
  vec2 r = vec2(1.0, 1.7320508);
  vec2 h = r * 0.5;
  vec2 a = mod(p, r) - h;
  vec2 b = mod(p - h, r) - h;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  return max(dot(abs(gv), normalize(vec2(1.0, 1.7320508))), abs(gv).x);
}

void main() {
  vec3 d = normalize(vDir);
  float h = d.y;

  /* \u8F89\u5149\u5E26\uFF1A\u9AD8\u65AF\uFF0C\u4E2D\u5FC3\u4EF0\u89D2 ~0.09 rad\uFF0C\u5730\u5E73\u7EBF\u4EE5\u4E0B\u5F52\u96F6\uFF08\u8854\u63A5\u4E0D\u53D8\u5F0F\uFF09\u3002 */
  float band = exp(-pow((h - 0.09) * 5.5, 2.0)) * step(0.0, h);
  vec3 sky = mix(uTop, uHorizon, clamp(band * 0.9 + exp(-max(h, 0.0) * 3.0) * 0.15, 0.0, 1.0));

  /* \u5730\u5E73\u7EBF\u53CA\u4EE5\u4E0B\u81EA\u6DF1\u975B\u8D77 \u2192 \u5730\u9762\u534A\u533A\u6E10\u53D8\u81F3\u8FD1\u9ED1\uFF08\u4E0E\u5730\u677F\u5F84\u5411\u538B\u6697\u540C\u8272\u7CFB\uFF09\u3002 */
  vec3 col = mix(uGround, sky, smoothstep(0.0, 0.14, h));
  col = mix(col, uGroundDeep, smoothstep(0.04, 0.6, -h));

  /* \u516D\u8FB9\u5F62\u7F51\u683C\u56DE\u58F0\uFF1A\u8D34\u5730\u5E73\u7EBF\u4E0A\u65B9\u4F4E\u4EF0\u89D2\u5E26\uFF0C\u6781\u4F4E\u5F3A\u5EA6\u3002 */
  vec2 gp = vec2(atan(d.z, d.x) * 5.0, h * 30.0);
  float grid = (1.0 - smoothstep(0.42, 0.5, hexEdge(gp))) * exp(-max(h, 0.0) * 13.0);
  col += uHorizon * grid * uGrid * smoothstep(0.0, 0.06, h);

  /* \u6570\u636E\u661F\u70B9\uFF08\u4E0A\u534A\u7403\uFF09\u3002 */
  col += vec3(0.62, 0.82, 1.0) * starField(d, uTime) * uStar * smoothstep(0.02, 0.3, h);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`,Hr=class{constructor(e={}){this.uniforms={uTop:{value:new fe(ke.voidTop)},uHorizon:{value:new fe(ke.horizonGlow)},uGround:{value:new fe(ke.voidGround)},uGroundDeep:{value:new fe(ke.groundDeep)},uTime:{value:0},uStar:{value:e.star??.42},uGrid:{value:e.grid??.09}},this.material=new at({uniforms:this.uniforms,vertexShader:jM,fragmentShader:WM,side:qt,depthWrite:!1,fog:!1}),this.mesh=new Ze(new Xn(e.radius??200,32,20),this.material),this.mesh.renderOrder=-10,this.mesh.frustumCulled=!1}update(e,t){this.mesh.position.copy(e.position),this.uniforms.uTime.value=(t??0)*.001}applyAppearance(e={}){e.skyTop&&this.uniforms.uTop.value.set(e.skyTop),e.horizonGlow&&this.uniforms.uHorizon.value.set(e.horizonGlow)}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}};var qM=256,Jc=52,Pd=.25,co=6.2;function XM(i){let e=i|0;return()=>(e=e*1664525+1013904223|0,(e>>>8&16777215)/16777216)}function tg(i,e){return(i%e+e*1.5)%e-e/2}var Zc=class{constructor(e,t={}){this.count=t.count??qM;let n=XM(2654435769);this.particles=[];for(let s=0;s<this.count;s++)this.particles.push({bx:(n()-.5)*Jc,bz:(n()-.5)*Jc,y0:Pd+n()*co,rise:.1+n()*.28,risePhase:n()*co,swayAmp:.25+n()*.5,phase:n()*Math.PI*2,scale:.5+n()*.95});this.geometry=new Ca(.042,0),this.material=new bt({color:ke.moteCyan,transparent:!0,opacity:.5,blending:Ls,depthWrite:!1,fog:!1}),this.mesh=new rt(this.geometry,this.material,this.count),this.mesh.frustumCulled=!1,this.mesh.renderOrder=15,e.add(this.mesh),this.scene=e,this.matrix=new Ae,this.pos=new L,this.quat=new Ct,this.scaleV=new L}frame(e,t,n){let s=n?0:e*.001;for(let r=0;r<this.count;r++){let a=this.particles[r],o=Pd+((a.y0-Pd+s*a.rise)%co+co)%co,l=n?0:Math.sin(s*.42+a.phase)*a.swayAmp*.35,c=n?0:Math.cos(s*.35+a.phase*1.7)*a.swayAmp*.35;this.pos.set(t.x+tg(a.bx+l-t.x,Jc),o,t.z+tg(a.bz+c-t.z,Jc));let h=1+(n?0:.12*Math.sin(s*1.3+a.phase*2.3));this.scaleV.setScalar(a.scale*h),this.matrix.compose(this.pos,this.quat.identity(),this.scaleV),this.mesh.setMatrixAt(r,this.matrix)}this.mesh.instanceMatrix.needsUpdate=!0}dispose(){this.scene.remove(this.mesh),this.mesh.dispose(),this.geometry.dispose(),this.material.dispose()}applyAppearance(e={}){e.moteColor&&this.material.color.set(e.moteColor)}};var YM=.35,KM=350,JM=150,ZM=300,$M=450,QM=8,ng=.02,Nd=Object.freeze({white:ke.hexFxWhite,gray:ke.hexFxGray,green:ke.hexFxGreen,yellow:ke.hexFxYellow}),ew=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,tw=`
  uniform float uProgress;   // \u5347\u8D77\u8FDB\u5EA6 0\u21921\uFF08\u94B3\u5236\uFF09
  uniform vec3 uColor;       // \u9884\u8BBE\u8272\uFF08\u77AC\u5207\uFF09
  uniform float uIntensity;  // \u6574\u4F53\u5F3A\u5EA6\uFF08\u76EE\u68C0\u8C03\uFF09
  uniform float uFalloff;    // \u5E95\u6D53\u9876\u6DE1\u5E42\u6307\u6570\uFF08\u76EE\u68C0\u8C03\uFF09
  uniform float uRevealEdge; // \u63ED\u793A\u524D\u7F18\u8F6F\u8FB9\u5BBD\u5EA6
  uniform float uFade;       // transient \u6DE1\u51FA\u4E58\u5B50 1\u21920\uFF08hold \u6052 1\uFF09
  varying vec2 vUv;
  void main() {
    /* vUv.y\uFF1A0=\u5E95\u7F18\uFF0C1=\u9876\u7F18\uFF08CylinderGeometry \u4FA7\u58C1 UV \u5DF2\u6838\u5BF9\uFF09\u3002
       \u9AD8\u5EA6\u63ED\u793A\uFF1A\u81EA\u5E95\u5411\u4E0A\u751F\u957F\uFF0C\u524D\u7F18\u8F6F\u8FB9\u2014\u2014SHALL NOT \u6574\u5899\u900F\u660E\u5EA6\u4E58\u6CD5\u3002 */
    float reveal = 1.0 - smoothstep(uProgress - uRevealEdge, uProgress, vUv.y);
    float alpha = pow(1.0 - vUv.y, uFalloff) * uIntensity; // \u5E95\u6D53\u9876\u6DE1
    gl_FragColor = vec4(uColor, alpha * reveal * uFade);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;function ig(i,e){let t=[],n=[],s=new Map,r=new Set,a=!i||!i.states;for(let o of e)s.set(o.id,o.state),r.add(o.id),!a&&(i.sessions.has(o.id)?o.state==="done"&&i.states.get(o.id)!=="done"&&t.push(o.id):n.push(o.id));return{doneIds:t,enterIds:n,states:s,sessions:r}}var $c=class{constructor(e,t={}){this.scene=e,this.poolSize=t.poolSize??QM,this.height=t.height??YM,this.geometry=new br(1,1,this.height,6,1,!0,Math.PI/2),this.geometry.translate(0,this.height/2,0),this.protoMaterial=this.createMaterial(),this.materials=[],this.slots=[],this.seq=0,this.followIndex=-1;for(let n=0;n<this.poolSize;n++){let s=this.protoMaterial.clone(),r=new Ze(this.geometry,s);r.visible=!1,r.renderOrder=15,r.frustumCulled=!1,e.add(r),this.materials.push(s),this.slots.push({mesh:r,material:s,active:!1,mode:"transient",channel:"select",stage:"rise",progress:0,elapsed:0,seq:0})}}createMaterial(){return new at({uniforms:{uProgress:{value:0},uColor:{value:new fe(Nd.white)},uIntensity:{value:.55},uFalloff:{value:2},uRevealEdge:{value:.18},uFade:{value:1}},vertexShader:ew,fragmentShader:tw,transparent:!0,blending:Ei,depthWrite:!1,depthTest:!0,side:St,fog:!1})}acquire(e){for(let s=0;s<this.slots.length;s++)if(!this.slots[s].active)return s;if(e==="hold")return-1;let t=-1,n=1/0;for(let s=0;s<this.slots.length;s++){let r=this.slots[s];r.active&&r.mode==="transient"&&r.seq<n&&(n=r.seq,t=s)}return t}activate(e,t,n,s,r){if(!(n in Nd))throw new Error("hex-fx: unknown preset "+n);e.active=!0,e.mode=s,e.channel=r,e.stage="rise",e.progress=0,e.elapsed=0,e.seq=++this.seq,e.mesh.visible=!0,e.mesh.position.set(t.x,ng,t.z),e.material.uniforms.uColor.value.set(Nd[n]),e.material.uniforms.uProgress.value=0,e.material.uniforms.uFade.value=1}release(e){e.active=!1,e.mesh.visible=!1,this.followIndex>=0&&this.slots[this.followIndex]===e&&(this.followIndex=-1)}activeCount(){return this.slots.reduce((e,t)=>e+(t.active?1:0),0)}trigger(e,t,n="transient"){if(n==="hold")for(let a of this.slots)a.active&&a.mode==="hold"&&a.channel==="select"&&this.release(a);let s=this.acquire(n);if(s<0)return null;let r=this.slots[s];return this.activate(r,e,t,n,"select"),r}hidePersistent(){for(let e of this.slots)e.active&&e.mode==="hold"&&e.channel!=="follow"&&this.release(e)}frame(e,t){for(let n of this.slots)if(n.active){if(n.stage==="rise")t?n.progress=1:n.progress=Math.min(1,n.progress+e/KM),n.progress>=1&&(n.stage="hold",n.elapsed=0);else if(n.stage==="hold"&&n.mode==="transient")if(t){if(n.elapsed+=e,n.elapsed>=$M){this.release(n);continue}}else n.elapsed+=e,n.elapsed>=JM&&(n.stage="fade",n.elapsed=0);else if(n.stage==="fade"){n.elapsed+=e;let s=Math.max(0,1-n.elapsed/ZM);if(n.material.uniforms.uFade.value=s,s<=0){this.release(n);continue}}n.material.uniforms.uProgress.value=n.progress}}followStart(e){if(this.followIndex>=0&&this.slots[this.followIndex].active){this.followMove(e);return}let t=this.acquire("hold");t<0||(this.followIndex=t,this.activate(this.slots[t],e,"gray","hold","follow"))}followMove(e){if(this.followIndex<0)return;let t=this.slots[this.followIndex];t.active&&t.mesh.position.set(e.x,ng,e.z)}followEnd(){if(this.followIndex<0)return;let e=this.slots[this.followIndex];e.active&&this.release(e),this.followIndex=-1}dispose(){for(let e of this.slots)this.scene.remove(e.mesh),e.material.dispose();this.materials.length=0,this.slots.length=0,this.protoMaterial.dispose(),this.geometry.dispose(),this.followIndex=-1}};var Vr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var In=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},nw=new On(-1,1,1,-1,0,1),Ld=class extends gt{constructor(){super(),this.setAttribute("position",new Je([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Je([0,2,0,0,2,0],2))}},iw=new Ld,hs=class{constructor(e){this._mesh=new Ze(iw,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,nw)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Qc=class extends In{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof at?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Li.clone(e.uniforms),this.material=new at({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new hs(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var ho=class extends In{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},eh=class extends In{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var th=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new he);this._width=n.width,this._height=n.height,t=new Rt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Qt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Qc(Vr),this.copyPass.material.blending=Un,this.timer=new Ba}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}ho!==void 0&&(a instanceof ho?n=!0:a instanceof eh&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new he);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var nh=class extends In{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new fe}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}};var sg={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new fe(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var Gr=class i extends In{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new he(e.x,e.y):new he(256,256),this.clearColor=new fe(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Rt(r,a,{type:Qt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let d=new Rt(r,a,{type:Qt});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let u=new Rt(r,a,{type:Qt});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),a=Math.round(a/2)}let o=sg;this.highPassUniforms=Li.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new at({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new he(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Li.clone(Vr.uniforms),this.blendMaterial=new at({uniforms:this.copyUniforms,vertexShader:Vr.vertexShader,fragmentShader:Vr.fragmentShader,premultipliedAlpha:!0,blending:Ls,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new fe,this._oldClearAlpha=1,this._basic=new bt,this._fsQuad=new hs(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new he(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new at({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new he(.5,.5)},direction:{value:new he(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new at({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Gr.BlurDirectionX=new he(1,0);Gr.BlurDirectionY=new he(0,1);var uo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var ih=class extends In{constructor(){super(),this.isOutputPass=!0,this.uniforms=Li.clone(uo.uniforms),this.material=new Mr({name:uo.name,uniforms:this.uniforms,vertexShader:uo.vertexShader,fragmentShader:uo.fragmentShader}),this._fsQuad=new hs(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},je.getTransfer(this._outputColorSpace)===it&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Va?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ga?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ja?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ds?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===qa?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Xa?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Wa&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var sw=(.6+.05)*Pt,rw=Object.keys(_n),rg=new L(12,26,8);function Fd(i,e){return(e??"active-only")==="all"?!0:i!=="done"}function ag(i,e){return!(i?.droneStandIn&&!Fd(i?.state,e))}function og(i){return!!i&&i.origin!=="subagent"&&!i.droneStandIn}function aw(i,e){return i!==Mt?!0:!!e}function ow(i,{droneMode:e="active-only",collapsedParents:t=null}={}){let n=[],s=[];for(let r of i.studios)for(let a of r.bees){let o={id:a.sessionId,x:a.pos.x,z:a.pos.z,y:a.y,state:a.state,droneOf:null,phase:Dd(a.sessionId),origin:a.origin,droneStandIn:a.droneStandIn,workspaceId:a.workspaceId,tipFace:a.tipFace,summonedBy:a.summonedBy,summonedTo:a.summonedTo};n.push(o),ag(a,e)&&s.push(o)}for(let r of i.studios)for(let a of r.bees){let o=a.drones.filter(l=>Fd(l.state,e));o.forEach((l,c)=>{let h={id:l.sessionId,x:a.pos.x,z:a.pos.z,y:a.y,state:l.state,scale:.55,droneOf:{x:a.pos.x,y:a.y,z:a.pos.z},droneIndex:c,droneCount:o.length,collapsed:t?.has(a.sessionId)??!1,phase:Dd(l.sessionId),origin:"subagent",parentOf:a.sessionId,workspaceId:l.workspaceId,tipFace:l.tipFace,summonedBy:l.summonedBy,summonedTo:l.summonedTo};n.push(h),s.push(h)});for(let l of a.drones)Fd(l.state,e)||n.push({id:l.sessionId,x:a.pos.x,z:a.pos.z,y:a.y,state:l.state,scale:.55,droneOf:{x:a.pos.x,y:a.y,z:a.pos.z},collapsed:t?.has(a.sessionId)??!1,phase:Dd(l.sessionId),origin:"subagent",parentOf:a.sessionId,workspaceId:l.workspaceId,tipFace:l.tipFace})}return{allRecords:n,renderRecords:s}}function lw(i,e,t,n,s){let r=[];if(!e||!t||!(n>0)||!(s>0))return r;let a=new L,o=[];for(let l of i){if(!l?.world||!og(l)||(a.set(l.world.x,l.pose?.y??l.world.y,l.world.z).project(t),a.z>1))continue;let c=(a.x+1)/2*n,h=(-a.y+1)/2*s;c<e.x0||c>e.x1||h<e.y0||h>e.y1||o.push({id:l.id,px:c,py:h})}o.sort((l,c)=>l.py-c.py||l.px-c.px);for(let l of o)r.push(l.id);return r}function cw(i,e){let t=[];if(!Array.isArray(i))return t;let n=e?.studios??[];for(let s of i){let r=!1;for(let a of n)if(a.bees.some(o=>o.sessionId===s)){r=!0;break}r&&t.push(s)}return t}var sh=class{constructor(e,t,n){this.host=e,this.t=t,this.callbacks=n??{},this.disposed=!1,this.running=!1,this.reducedMotion=!1,this.canvas=document.createElement("canvas"),this.canvas.className="jyv-canvas",e.appendChild(this.canvas),this.vignette=document.createElement("div"),this.vignette.className="jyv-vignette",e.appendChild(this.vignette),this.cardRoot=document.createElement("div"),this.cardRoot.className="jyv-cardsRoot",e.appendChild(this.cardRoot),this.tips=new Yc(e,t),this.renderer=new ao({canvas:this.canvas,antialias:!0,powerPreference:"high-performance",alpha:!1}),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1)),this.renderer.setClearColor(new fe(ke.voidGround)),this.renderer.autoClear=!1,this.renderer.toneMapping=Ds,this.renderer.toneMappingExposure=1.05,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Il,this.scene=new gn,this.camera=new zt(46,1,.1,400),this.rig=new Ec(this.camera),this.sky=new Hr,this.scene.add(this.sky.mesh);let s=new zs(this.renderer),r=new gn,a=new Hr({radius:50,star:.2,grid:.08});r.add(a.mesh),this.scene.environment=s.fromScene(r,.04).texture,this.scene.environmentIntensity=.45,s.dispose(),a.dispose(),this.scene.add(new Tr(ke.ambient,.5)),this.sun=new ci(ke.keyLight,2),this.sun.position.set(12,26,8),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.left=-45,this.sun.shadow.camera.right=45,this.sun.shadow.camera.top=45,this.sun.shadow.camera.bottom=-45,this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=90,this.sun.shadow.bias=-4e-4,this.scene.add(this.sun),this.scene.add(this.sun.target),this.renderer.shadowMap.autoUpdate=!1,this._shadowBasisR=new L,this._shadowBasisU=new L;{let o=new Ae().lookAt(rg,new L(0,0,0),new L(0,1,0)),l=new L;o.extractBasis(this._shadowBasisR,this._shadowBasisU,l)}this._shadowSnapX=NaN,this._shadowSnapY=NaN,this._frameNo=0,this.rim=new ci(ke.rimPurple,1.1),this.rim.position.set(-14,7,-11),this.scene.add(this.rim),this.scene.add(this.rim.target),this.scene.add(new La(ke.hemiSky,ke.hemiGround,.8)),this.maskScene=new gn,this.maskMaterial=new bt({color:16777215,side:St}),this.studioMaskMaterial=new bt({color:16777215,side:St,depthTest:!1,depthWrite:!1}),this.outlineState={active:!1,maskScene:this.maskScene,depthExemptOf:()=>[this.walls.innerMesh,this.walls.innerTrim,...this.hexFx?this.hexFx.slots.map(o=>o.mesh):[]].filter(Boolean)},this.tileField=new Pc(this.scene),this.territory=new Nc(this.scene),this.watermark=new Vc(this.scene),this.walls=new Dc(this.scene),this.cups=new Hc(this.scene),this.bees=new zc(this.scene,{maskScene:this.maskScene,maskMaterial:this.maskMaterial}),this.links=new Kc(this.scene),this.beePreviews=new Map,this._preview=null,this._previewTint=new fe,this.outlinePass=new qc,this.lowEndDevice=(typeof navigator<"u"?navigator.hardwareConcurrency:8)<=4,this.composer=this.buildComposer(),this.motes=new Zc(this.scene),this.hexFx=new $c(this.scene),this.cards=new jc(this.cardRoot,t,{onOpen:o=>{this.callbacks.onOpenSession?this.callbacks.onOpenSession(o):this.callbacks.onSelectBee?.(o)},onArchive:o=>this.callbacks.onArchiveBee?.(o),onToggleCollapse:o=>this.toggleDroneCollapse(o),onCardEnter:o=>this.hoverKey=o,onCardLeave:o=>{this.hoverKey===o&&(this.hoverKey=null)},onHatch:(o,l)=>this.callbacks.onHatch?.(o,l),onLaneCancel:(o,l)=>this.callbacks.onLaneCancel?.(o,l),onLatchReset:o=>this.callbacks.onLatchReset?.(o)}),this.gestures=new Gc({canvas:this.canvas,scene:this.scene,camera:this.camera,rig:this.rig,tileField:this.tileField,territory:this.territory,walls:this.walls,bees:this.bees,cups:this.cups,studioLayersOf:()=>this.studioLayers??[],occupancyOf:()=>this.occupancy??new Map,editModeOf:()=>this.editMode,spinModeOf:()=>!!this.rightDragSpin,selectionOf:()=>this.selection,callbacks:{onSelectBee:o=>{this.clearMarquee(),this.clearSelection(),this.callbacks.onSelectBee?.(o)},onSelectDrone:o=>{this.clearMarquee(),this.clearSelection(),this.callbacks.onSelectDrone?.(o)},onSelectCup:o=>{this.clearMarquee(),this.select("cup",o)},onSelectStudio:o=>{this.clearMarquee(),this.select("studio",o)},onSelectTile:o=>{this.clearMarquee(),this.onSelectTile(o)},onClearSelection:()=>{this.clearMarquee(),this.clearSelection()},onMarqueeMove:o=>this._onMarqueeMove(o),onMarqueeEnd:o=>this._onMarqueeEnd(o),onMarqueeCancel:()=>this._onMarqueeCancel(),onStudioMenu:(o,l)=>this.callbacks.onStudioMenu?.(o,l.x,l.y),onBeeMenu:(o,l)=>this.callbacks.onBeeMenu?.(o,l.x,l.y),onStudioMoved:(o,l)=>this.callbacks.onStudioMoved?.(o,l),onBeeDropped:(o,l)=>this.callbacks.onBeeDropped?.(o,l),onInvalidDrop:()=>this.callbacks.onInvalidDrop?.(),onDragCancel:()=>this.callbacks.onDragCancel?.(),onDragCell:o=>{let l=Xt(o);this.dragFollowing?this.hexFx.followMove(l):(this.dragFollowing=!0,this.hexFx.followStart(l))},onDragEnd:()=>{this.dragFollowing&&(this.dragFollowing=!1,this.hexFx.followEnd())},onHover:o=>{this.hover=o},onFocusBee:o=>this.focusBee(o),onFocusStudio:o=>this.focusStudio(o)}}),this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(e),this.resize(),this.lastTime=performance.now(),this.raf=0,this.onVisibility=()=>{!document.hidden&&this.running&&this.loop()},document.addEventListener("visibilitychange",this.onVisibility),this.canvas.addEventListener("webglcontextlost",o=>{o.preventDefault(),this.contextLost=!0,this.callbacks.onContextLost?.()}),this.canvas.addEventListener("webglcontextrestored",()=>{this.contextLost=!1,this.callbacks.onContextRestored?.(),this.outlinePass.invalidate(),this.rebuildComposer(),this.rebuildAll()}),this.world=null,this.studioLayers=[],this.occupancy=new Map,this.hover=null,this.hoverKey=null,this.selectedSessionId=null,this.collapsedParents=new Set,this.settings={animation:"full",followCurrent:!1,drones:"active-only"},this.rightDragSpin=!1,this.selection=null,this.selectionTileFx=null,this.dragFollowing=!1,this.fxPrevStates=null,this.fxPrevSessions=null,this.onSelectionChange=null,this.editMode=!1,this.selectionMask={studio:null,cup:null,tile:null},this.studioMaskSig=null,this.studioMaskFor=null,this.marqueeSet=new Set,this._marqueePreview=null,this._marqueeRect=null,this._marqueeDirty=!1,this._outlineIds=new Set;try{window.__JYV_HIVE_DEBUG=this}catch{}this.start()}toggleDroneCollapse(e){this.collapsedParents.has(e)?this.collapsedParents.delete(e):this.collapsedParents.add(e),this.rebuildAll()}setWorld(e){this.world=e,this.rebuildAll()}rebuildAll(){let e=this.world;if(!e)return;let t=e.studios.map(u=>u.workspaceId+":"+u.layer+":"+u.center.q+","+u.center.r).join("|");t!==this.studioSig&&(this.studioSig=t,this.studioLayers=e.studios.map(u=>{let f=Xt(u.center);return{workspaceId:u.workspaceId,center:u.center,layer:u.layer,worldCenter:f,path:u.path,title:u.title,edges:Mm(u.center,u.layer),interiorEdges:wm(u.center,u.layer)}}),this.territory.setStudios(this.studioLayers),this.walls.setStudios(this.studioLayers),this.occupancy=e.occupancy??new Map);let n=new Map(e.studios.map(u=>[u.workspaceId,u]));for(let u of this.studioLayers){let f=n.get(u.workspaceId);f&&(u.path=f.path,u.title=f.title)}this.watermark.setStudios(this.studioLayers);let s=[];for(let u of e.studios){let f=Xt(u.center);u.cups.forEach((m,v)=>{s.push({workspaceId:u.workspaceId,sessionId:m.sessionId,worldCenter:f,index:v,phase:v*.9})})}let r=s.map(u=>u.sessionId+"@"+u.worldCenter.x.toFixed(3)+","+u.worldCenter.z.toFixed(3)).join("|");r!==this.cupSig&&(this.cupSig=r,this.cups.setCups(s));let a=new Map,o=new Map(s.map(u=>[u.sessionId,u])),{allRecords:l,renderRecords:c}=ow(e,{droneMode:this.settings?.drones??"active-only",collapsedParents:this.collapsedParents});for(let u of l)u.beeModel=this.beeOverlayIndex?.get(u.id)?.beeModel??Fi;for(let[u,f]of o)a.set(u,{x:f.worldCenter.x,y:-1.35,z:f.worldCenter.z});this.bees.setBees(c,a);let h=this.fxPrevStates!=null,d=ig(h?{states:this.fxPrevStates,sessions:this.fxPrevSessions}:null,l);if(this.fxPrevStates=d.states,this.fxPrevSessions=d.sessions,h){for(let u of d.doneIds){let f=this.bees.beeMap.get(u);f&&this.hexFx.trigger({x:f.world.x,z:f.world.z},"green","transient")}for(let u of d.enterIds){let f=this.bees.beeMap.get(u);f&&this.hexFx.trigger({x:f.world.x,z:f.world.z},"yellow","transient")}}this.callbacks.onWorldUpdated?.(e),this._convergeMarquee()}setLayout(e){let t=e?.camera;t&&(t.dist===34||t.dist===28)&&(t={...t,dist:15}),t&&this.rig.loadPose(t)}setBeeOverlay(e){let t=new Map,n={};if(e){let s=new Map((e.beeTypes??[]).map(r=>[r.id,r]));for(let[r,a]of Object.entries(e.assignments??{})){let o=s.get(a)??null,l=e.engineState?.[r]??{},c=l.vars??{},h=[];if(o)for(let d of o.capabilities??[]){if(d.action?.type!=="spawn")continue;let u=Uc(d.action.promptTemplate??""),f=u.ok?u.vars.filter(m=>typeof c[m]!="string"):[];u.ok&&f.length===0&&h.push({capabilityId:d.id,name:d.name})}t.set(r,{beeTypeName:o?.name??"",queuePolicy:o?.queuePolicy??"",beeModel:typeof o?.beeModel=="string"?o.beeModel:Fi,vars:c,latches:l.latches??{},hatchables:h,waits:e.sessions?.[r]?.waits??[],notices:e.sessions?.[r]?.notices??[]})}for(let[r,a]of Object.entries(e.sessions??{}))t.has(r)||t.set(r,{beeTypeName:"",queuePolicy:"",beeModel:Fi,vars:{},latches:{},hatchables:[],waits:a.waits??[],notices:a.notices??[]});n=e.lane??{}}this.beeOverlayIndex=t,this.beeLaneByWorkspace=n,this.cards&&(this.cards.lastLaneByWorkspace=n),this.rebuildAll?.()}setSettings(e){let t=this.settings?.drones??"active-only";this.settings={...this.settings,...e},this.rig.setPitchDeg(this.settings.cameraPitchDeg??45),this.rightDragSpin=!!(this.settings.rightDragSpin??!1),this.watermark?.setVisible((this.settings.watermark??"show")!=="hide"),e.appearance&&this.applyAppearance(e.appearance),this.setReducedMotion(this.reducedMotion||this.settings.animation==="reduced"),(this.settings.drones??"active-only")!==t&&this.rebuildAll()}applyAppearance(e={}){let t={...Hs,...e};this.walls.applyAppearance?.(t),this.tileField.applyAppearance?.(t),this.territory.applyAppearance?.(t),this.cups.applyAppearance?.(t),this.outlinePass.applyAppearance?.(t),this.motes.applyAppearance?.(t),this.sky.applyAppearance?.(t)}setReducedMotion(e){this.reducedMotion=e,this.bees.reduced=e,this.cups.glow=e?0:1}setSelected(e){this.selectedSessionId=e??null,this.bees.setSelected(e??null)}select(e,t){this.selection&&this.selection.kind===e&&this.selection.id===t||(this.selection={kind:e,id:t},this.syncSelectionMask(),this.onSelectionChange?.())}clearSelection(){this.selection&&(this.selection=null,this.syncSelectionMask(),this.onSelectionChange?.())}setMarqueeIds(e){this.marqueeSet=e&&typeof e.has=="function"?new Set(e):new Set}clearMarquee(){this._marqueePreview==null&&this.marqueeSet.size===0||(this._marqueePreview=null,this._marqueeRect=null,this._marqueeDirty=!1,this.marqueeSet.clear(),this.callbacks.onMarqueeCommit?.([]))}_onMarqueeMove(e){this._marqueeRect=e,this._marqueeDirty=!0,this.callbacks.onMarqueeRect?.(e)}_computeMarqueePreview(){this._marqueeDirty=!1,this._marqueePreview=new Set(this.beesInRect(this._marqueeRect))}_onMarqueeEnd(e){let t=this.beesInRect(e);this._marqueeRect=null,this._marqueeDirty=!1,this._marqueePreview=null,t.length>0&&this.clearSelection(),this.marqueeSet=new Set(t),this.callbacks.onMarqueeRect?.(null),this.callbacks.onMarqueeCommit?.(t)}_onMarqueeCancel(){this._marqueeRect=null,this._marqueeDirty=!1,this._marqueePreview=null,this.callbacks.onMarqueeRect?.(null),this.callbacks.onMarqueeCancel?.()}beesInRect(e){return lw(this.bees.beeMap.values(),e,this.camera,this.canvas.clientWidth||0,this.canvas.clientHeight||0)}_convergeMarquee(){if(this.marqueeSet.size===0||!this.world)return;let e=cw([...this.marqueeSet],this.world);e.length!==this.marqueeSet.size&&(this.marqueeSet=new Set(e),this.callbacks.onMarqueeCommit?.(e))}setEditMode(e){this.editMode=!!e}get dragInProgress(){let e=this.gestures?.mode;return e==="studio"||e==="bee"||e==="marquee"}setSpinKey(e,t){this.rig?.setSpinKey?.(e,t)}clearSpinKeys(){this.rig?.clearSpinKeys?.()}_ensureBeePreviews(){for(let e of fi){let t=this.bees.variants.get(e);if(t?.ready)for(let n of rw){let s=e+":"+n;if(this.beePreviews.has(s))continue;let r=this._renderBeePreview(t,n);r&&(this.beePreviews.set(s,r),this.callbacks.onBeePreview?.(s,r))}}}_renderBeePreview(e,t="idle"){try{if(!this._preview){let o=document.createElement("canvas");o.width=128,o.height=128;let l=new ao({canvas:o,alpha:!0,antialias:!0,preserveDrawingBuffer:!0});l.setPixelRatio(1),l.setSize(128,128,!1),l.toneMapping=this.renderer.toneMapping,l.toneMappingExposure=this.renderer.toneMappingExposure;let c=new gn,h=new zs(l),d=new gn,u=new Hr({radius:50,star:.2,grid:.08});d.add(u.mesh),c.environment=h.fromScene(d,.04).texture,c.environmentIntensity=.45,h.dispose(),u.dispose(),c.add(new Tr(ke.ambient,.75));let f=new ci(ke.keyLight,2.4);f.position.set(2.2,3,2),c.add(f);let m=new ci(ke.rimPurple,1);m.position.set(-2.4,1.6,-2.2),c.add(m);let v=new Et;c.add(v);let g=new zt(35,1,.1,20);g.position.set(1.7,1.4,2),g.lookAt(0,0,0),this._preview={renderer:l,scene:c,camera:g,group:v,canvas:o}}let n=this._preview;n.group.clear();let s=new Set;for(let o of e.buckets.tierParts[Gt]){let l=o.mesh?.material,c=new Ze(o.mesh?.geometry,l);c.matrix.copy(o.normalization),c.matrixAutoUpdate=!1,n.group.add(c),l?.color&&s.add(l)}let r=this._previewTint.set(16777215).lerp(_n[t]??_n.idle,t==="idle"?0:.45),a=[];for(let o of s)a.push([o,o.color.r,o.color.g,o.color.b]);for(let[o,l,c,h]of a)o.color.setRGB(l*r.r,c*r.g,h*r.b);n.renderer.render(n.scene,n.camera);for(let[o,l,c,h]of a)o.color.setRGB(l,c,h);return n.group.clear(),n.canvas.toDataURL("image/png")}catch(n){return console.warn("[dsh-v-hive] bee preview render failed:",n),null}}getEditMode(){return this.editMode}getSelection(){return this.selection}onSelectTile(e){let t=Bn(e);this.occupancy?.has(t)||this.select("tile",t)}updateSelection(){let e=this.selection,t=this._outlineIds;t.clear();let n=this._marqueePreview??this.marqueeSet;if(n.size>0){for(let r of n)t.add(r);!e&&this.selectedSessionId&&t.add(this.selectedSessionId)}else!e&&this.selectedSessionId&&t.add(this.selectedSessionId);this.bees.setOutlineBeeIds(t.size>0?t:null),e&&(e.kind==="studio"?this.studioLayers.some(r=>r.workspaceId===e.id)||(this.selection=null):e.kind==="cup"?this.cups.hasSession(e.id)||(this.selection=null):e.kind==="tile"&&this.occupancy?.has(e.id)&&(this.selection=null)),this.hexFx.hidePersistent(),this.syncSelectionMask();let s=!1;for(let r of t)if(this.bees.beeMap?.has(r)){s=!0;break}this.outlineState.active=this.selection?.kind==="studio"||this.selection?.kind==="cup"||this.selection?.kind==="tile"||s,this.walls.setHighlighted(e?.kind==="studio"?e.id:null)}syncSelectionMask(){let e=this.selection;if(this.selectionMask.studio&&(this.selectionMask.studio.visible=!1),this.selectionMask.cup&&(this.selectionMask.cup.visible=!1),this.selectionMask.tile&&(this.selectionMask.tile.visible=!1),!!e){if(e.kind==="studio")this.ensureStudioMask(e.id).visible=!0;else if(e.kind==="cup")this.ensureCupMask(e.id).visible=!0;else if(e.kind==="tile"){let t=this.ensureTileMask(),n=this.cellOfKey(e.id);if(n){let s=Xt(n);t.position.set(s.x,.02,s.z)}t.visible=!0}}}cellOfKey(e){let t=e.split(",");if(t.length!==2)return null;let n=Number(t[0]),s=Number(t[1]);return!Number.isFinite(n)||!Number.isFinite(s)?null:{q:n,r:s}}ensureStudioMask(e){let t=this.studioLayers.find(n=>n.workspaceId===e);return t?((!this.selectionMask.studio||this.studioMaskFor!==e||this.studioMaskSig!==this.studioSig)&&(this.selectionMask.studio&&this.disposeObject(this.selectionMask.studio),this.selectionMask.studio=this.buildStudioMask(t),this.studioMaskSig=this.studioSig,this.studioMaskFor=e),this.selectionMask.studio):this.selectionMask.studio??null}buildStudioMask(e){let t=Zn(e.center,Math.max(0,e.layer-1)),n=e.edges??[],s=new Et,r=new Ae,a=new L,o=new on,l=new Ct,c=new L,h=Lc(0),d=new rt(h,this.studioMaskMaterial,Math.max(1,t.length));d.count=t.length,d.frustumCulled=!1;let u=0;for(let v of t){let g=Xt(v);a.set(g.x,.024,g.z),l.identity(),c.set(1,1,1),r.compose(a,l,c),d.setMatrixAt(u++,r)}d.instanceMatrix.needsUpdate=!0,s.add(d);let f=new ln(1,1);f.translate(0,.5,0);let m=new rt(f,this.studioMaskMaterial,Math.max(1,n.length));m.count=n.length,m.frustumCulled=!1,u=0;for(let v of n)a.set(v.mx,0,v.mz),o.set(0,Math.atan2(v.dx,v.dz),0),l.setFromEuler(o),c.set(1,Ur,1),r.compose(a,l,c),m.setMatrixAt(u++,r);return m.instanceMatrix.needsUpdate=!0,s.add(m),s.visible=!1,this.maskScene.add(s),s}disposeObject(e){e&&(this.maskScene.remove(e),e.traverse?.(t=>{(t.isMesh||t.isInstancedMesh)&&(t.geometry?.dispose?.(),t.dispose?.())}),(e.isMesh||e.isInstancedMesh)&&e.dispose?.())}ensureCupMask(e){if(!this.selectionMask.cup){let n=new rt(this.cups.geometry,this.maskMaterial,1);n.count=1,n.frustumCulled=!1,n.visible=!1,this.maskScene.add(n),this.selectionMask.cup=n}let t=this.cups.matrixOf(e);return t&&(this.selectionMask.cup.setMatrixAt(0,t),this.selectionMask.cup.instanceMatrix.needsUpdate=!0),this.selectionMask.cup}ensureTileMask(){if(!this.selectionMask.tile){let e=new Ze(Lc(0),this.maskMaterial);e.frustumCulled=!1,e.visible=!1,this.maskScene.add(e),this.selectionMask.tile=e}return this.selectionMask.tile}highlightSearch(e){this.searchHighlight=new Set(e??[])}focusBee(e){let t=this.bees.beeMap.get(e);t&&this.rig.flyTo({tx:t.world.x,tz:t.world.z,dist:Math.min(this.rig.dist,14)})}followBee(e){if(!this.running||this.disposed)return;let t=this.bees.beeMap.get(e);og(t)&&this.rig.flyTo({tx:t.world.x,tz:t.world.z})}focusStudio(e){let t=this.studioLayers.find(n=>n.workspaceId===e);t&&this.rig.flyTo({tx:t.worldCenter.x,tz:t.worldCenter.z,dist:Math.min(this.rig.dist,18)})}studioOfSession(e){let t=this.world?.studios.find(n=>n.bees.some(s=>s.sessionId===e)||n.cups.some(s=>s.sessionId===e));return t?this.studioLayers.find(n=>n.workspaceId===t.workspaceId):void 0}buildComposer(){let e=this.renderer.getDrawingBufferSize(new he),t=new Rt(Math.max(1,e.x),Math.max(1,e.y),{type:Qt,samples:4,depthTexture:new Tn(Math.max(1,e.x),Math.max(1,e.y))}),n=new th(this.renderer,t);return n.addPass(new nh(this.scene,this.camera)),this.bloomPass=new Gr(new he(Math.max(1,e.x),Math.max(1,e.y)),.6,.4,.85),n.addPass(this.bloomPass),n.addPass(new ih),n}rebuildComposer(){this.composer&&(this.bloomPass?.dispose?.(),this.composer.dispose(),this.composer=this.buildComposer())}bloomActive(){return!this.composer||this.lowEndDevice||this.reducedMotion?!1:(this.settings?.animation??"full")!=="reduced"}start(){this.running||this.disposed||(this.running=!0,this.lastTime=performance.now(),this.loop())}stop(){this.running=!1,this.raf&&cancelAnimationFrame(this.raf),this.raf=0}loop=()=>{if(!this.running||this.disposed||this.contextLost)return;if(document.hidden){this.running=!1;return}this.raf=requestAnimationFrame(this.loop);let e=performance.now(),t=Math.min(64,e-this.lastTime);this.lastTime=e,this.rig.keySpin(t),this.rig.update(),this.tileField.update(this.rig.target);let n=this.sun.shadow.camera,s=(n.right-n.left)/this.sun.shadow.mapSize.x,r=this.rig.target.x*this._shadowBasisR.x+this.rig.target.z*this._shadowBasisR.z,a=this.rig.target.x*this._shadowBasisU.x+this.rig.target.z*this._shadowBasisU.z,o=Math.round(r/s)*s,l=Math.round(a/s)*s,c=o!==this._shadowSnapX||l!==this._shadowSnapY;this._shadowSnapX=o,this._shadowSnapY=l;let h=this._shadowBasisR,d=this._shadowBasisU;this.sun.target.position.set(h.x*o+d.x*l,h.y*o+d.y*l,h.z*o+d.z*l),this.sun.position.copy(this.sun.target.position).add(rg),this.sun.target.updateMatrixWorld(),this.renderer.shadowMap.needsUpdate=c||(this._frameNo&1)===0,this._frameNo+=1,this.rim.position.set(this.rig.target.x-14,7,this.rig.target.z-11),this.rim.target.position.set(this.rig.target.x,0,this.rig.target.z),this.rim.target.updateMatrixWorld(),this.sky.update(this.camera,e),this.motes.frame(e,this.rig.target,this.reducedMotion),this.tileField.frame(this.camera),this.territory.frame(this.camera),this.walls.frame(this.camera),this.watermark.frame(this.camera,this.reducedMotion),this._marqueeDirty&&this._computeMarqueePreview(),this.updateSelection(),this.hexFx.frame(t,this.reducedMotion);let u=this.bees.anchorIds;u.clear(),this.hover&&(this.hover.kind==="bee"||this.hover.kind==="drone")&&u.add(this.hover.id),this.selectedSessionId&&u.add(this.selectedSessionId),this.cards?.expandedKey&&u.add(this.cards.expandedKey),this.bees.frame(t,this.camera.position),this.links.frame({hover:this.hover,selectedId:this.selectedSessionId,bees:this.bees}),this._ensureBeePreviews(),this.cups.frame(e),this.updateCards(),this.tips.frame(this.hover,{overlayOf:f=>this.beeOverlayIndex?.get(f)??null,studioTitleOf:f=>(this.world?.studios??[]).find(v=>v.workspaceId===f)?.title??""}),this.bloomActive()?(this.composer.render(),this.outlinePass.setDepthTexture(this.composer.writeBuffer?.depthTexture??null),this.renderer.clear(!1,!0,!0)):(this.outlinePass.setDepthTexture(null),this.renderer.clear(!0,!0,!0),this.renderer.render(this.scene,this.camera)),this.outlinePass.render(this.renderer,this.camera,this.outlineState,this.scene)};updateCards(){let e=[],t=this.world;if(t){let n=this.cardRoot.getBoundingClientRect(),s=this.settings?.drones??"active-only";for(let r of t.studios)for(let a of r.bees){if(!ag(a,s))continue;let o=a.sessionId===this.selectedSessionId||!!(this.hover&&(this.hover.kind==="bee"||this.hover.kind==="drone")&&this.hover.id===a.sessionId)||a.sessionId===this.cards?.expandedKey,l=this.bees.beeMap.get(a.sessionId);if(!aw(l?.tier,o))continue;let c=this.projectToScreen(a.sessionId,0,!1,n);c.x!==null&&e.push({key:a.sessionId,kind:"bee",screen:c,face:{sessionId:a.sessionId,displayTitle:a.displayTitle,updatedAt:a.updatedAt,todos:a.todos},state:a.state,droneCount:a.drones.length,activeDroneCount:a.activeDroneCount??0,runningDescendants:a.runningDescendants??0,workspaceId:r.workspaceId,overlay:this.beeOverlayIndex?.get(a.sessionId)??null})}if(this.hover?.kind==="cup"&&this.hover.id)for(let r of t.studios){let a=r.cups.find(o=>o.sessionId===this.hover.id);if(a){let o=this.projectToScreen(a.sessionId,-1.2,!0,n);o.x!==null&&e.push({key:"cup:"+a.sessionId,kind:"cup",screen:o,full:!0,face:{sessionId:a.sessionId,displayTitle:a.displayTitle,updatedAt:a.updatedAt},state:null,droneCount:0,runningDescendants:0})}}}this.cards.update(e)}_projectScratch=new L;projectToScreen(e,t=0,n=!1,s=null){let r=this.bees.beeMap.get(e);if(!r&&!n)return{x:null,y:null};let a,o,l;if(n){let d=this.cupAnchorOf(e);if(!d)return{x:null,y:null};a=d.x,o=d.z,l=-1.35}else a=r.world.x,o=r.world.z,l=(r.pose?.y??r.baseY??r.world.y)+sw+t;let c=this._projectScratch.set(a,l,o).project(this.camera);if(c.z>1)return{x:null,y:null};let h=s??this.cardRoot.getBoundingClientRect();return{x:(c.x+1)/2*h.width,y:(-c.y+1)/2*h.height}}cupAnchorOf(e){for(let t of this.world?.studios??[])if(t.cups.some(n=>n.sessionId===e))return Xt(t.center);return null}resize(){if(this.disposed)return;let e=this.host.clientWidth||1,t=this.host.clientHeight||1;this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.outlinePass.setSize(e,t,this.renderer.getPixelRatio()),this.composer&&(this.composer.setPixelRatio(this.renderer.getPixelRatio()),this.composer.setSize(e,t))}reattach(e){!e||this.disposed||e===this.host||(this.host=e,e.appendChild(this.canvas),e.appendChild(this.vignette),e.appendChild(this.cardRoot),e.appendChild(this.tips.root),this.ro.disconnect(),this.ro.observe(e),this.resize())}cameraPose(){return this.rig.pose()}dispose(){this.disposed=!0,this.stop(),this.ro.disconnect(),document.removeEventListener("visibilitychange",this.onVisibility),this.gestures.dispose(),this.cards.dispose(),this.tips.dispose(),this.links?.dispose(),this._preview?.renderer.dispose(),this._preview?.renderer.forceContextLoss?.(),this._preview=null,this.bees.dispose(),this.sky.dispose(),this.motes?.dispose(),this.hexFx?.dispose(),this.bloomPass?.dispose?.(),this.composer?.dispose();for(let e of Object.keys(this.selectionMask))this.disposeObject(this.selectionMask[e]),this.selectionMask[e]=null;this.maskMaterial.dispose(),this.studioMaskMaterial.dispose(),this.outlinePass.dispose(),this.cups.dispose(),this.walls.dispose(),this.watermark?.dispose(),this.territory.dispose(),this.tileField.dispose(),this.renderer.dispose(),this.canvas.remove(),this.vignette.remove(),this.cardRoot.remove()}};function Dd(i){let e=0,t=String(i);for(let n=0;n<t.length;n++)e=e*31+t.charCodeAt(n)|0;return e%6283/1e3}var kd=1;function lg(i,e={}){let t=new Map,n=[],s=[],r=(a,o)=>{for(let l of s)if(!Ic(o,a.layer,l.cell,l.layer,kd))return!1;return!0};for(let a of i){let o=Math.max(0,a.layer-1),l=e[a.workspaceId];if(l&&Number.isInteger(l.q)&&Number.isInteger(l.r)&&r(a,l)){t.set(a.workspaceId,l),s.push({id:a.workspaceId,layer:a.layer,cell:l});continue}let c=Zn({q:0,r:0},64),h=null;for(let d of c)if(r(a,d)){h=d;break}h||(h={q:t.size*(2*o+2+kd),r:0}),l&&n.push(a.workspaceId),t.set(a.workspaceId,h),s.push({id:a.workspaceId,layer:a.layer,cell:h})}return{placements:t,displaced:n}}function cg(i,e,t,n=3){let s=Sm(e,n);if(s>i)return{layer:s,strikes:0,expanded:!0};if(s<i&&e<=kr(i-2)){let r=t+1;return r>=2?{layer:i-1,strikes:0,shrunk:!0}:{layer:i,strikes:r}}return{layer:i,strikes:0}}function hg(i,e,t){let n=kr(t),s=new Map,r=new Set,a=new Set(e);if(i)for(let[l,c]of i)a.has(l)&&c<n&&!r.has(c)&&(s.set(l,c),r.add(c));let o=0;for(let l of e)if(!s.has(l)){for(;r.has(o);)o++;s.set(l,o),r.add(o)}return s}function ug(i,e){let t=new Map;for(let[n,s]of i){let r=e.get(n)??3;for(let a of Zn(s,Math.max(0,r-1)))t.set(Bn(a),n)}return t}var wt=Object.freeze({idle:"idle",busy:"busy",help:"help",done:"done"}),dg=1*Pt;function hw(i){if(i<=2)return 1.5*Pt;let e=.6*Pt/Math.sin(Math.PI/i);return Math.max(1.5*Pt,e)}function uw(i){let e=2166136261,t=String(i);for(let n=0;n<t.length;n++)e^=t.charCodeAt(n),e=Math.imul(e,16777619);return e>>>0}function rh(i){return i?i.pendingInteraction?wt.help:i.running?wt.busy:i.completed?wt.done:wt.idle:wt.idle}function dw(i){let e=i?.projectionValues?.todos;if(!Array.isArray(e)||e.length===0)return null;let t=0;for(let n of e)(n?.status==="completed"||n?.done===!0)&&t++;return{done:t,total:e.length}}function fo(i){return{sessionId:i.id,displayTitle:i.displayTitle??i.title??i.id,updatedAt:i.updatedAt??0,pendingInteraction:i.pendingInteraction??null,todos:dw(i)}}function fw(i,{workspaceId:e=null,sessionCount:t=null}={}){let n=i?.projectionValues??null,s=null,r=n?.tokenUsage;if(r&&typeof r=="object"&&!Array.isArray(r)){let l=(Number(r.uncachedInput)||0)+(Number(r.output)||0)+(Number(r.cacheRead)||0)+(Number(r.cacheWrite)||0);s=Number.isFinite(l)?l:null}let a=null,o=n?.sessionStats;if(o&&typeof o=="object"&&!Array.isArray(o)){let l=Number(o.decodeMs),c=Number(o.decodeTokens);Number.isFinite(l)&&l>=1e3&&Number.isFinite(c)&&(a=Math.round(c/l*1e3))}return{tokens:s,dps:a,sessions:t,workspaceId:e??null}}function fg(i){return{tokens:null,dps:null,sessions:null,workspaceId:i??null}}function pg(i){if(!i||typeof i!="object")return null;let e=i.displayTitle??i.title??i.id??null,t=i.projectionValues?.turnOutline,n=Array.isArray(t)?t:Array.isArray(t?.turns)?t.turns:null,s=null,r=null;if(n&&n.length>0){let a=n[n.length-1];a&&typeof a=="object"&&(s=typeof a.prompt=="string"&&a.prompt.length>0?a.prompt:null,r=typeof a.response=="string"&&a.response.length>0?a.response:null)}return{title:e,prompt:s,response:r}}function mg({sessions:i,workspaces:e,positions:t={},studioState:n=new Map,summonEdges:s=null}){let r=i?.byId??{},a=i?.ids??[],o=e?.items??[],l=new Set(e?.archivedSessionIds??[]),c=new Map;for(let w of o)for(let I of w.sessionIds??[])c.has(I)||c.set(I,w.workspaceId);let h=new Map,d=new Map,u=[],f=new Set,m=new Map,v=new Map,g=w=>w&&!w.blank&&!l.has(w.id);for(let w of a){let I=r[w];if(!I)continue;if(I.parentId){let F=v.get(I.parentId);F?F.push(w):v.set(I.parentId,[w])}if(l.has(I.id)){let F=c.get(w);F&&(d.has(F)||d.set(F,[]),d.get(F).push(fo(I)));continue}if(I.blank)continue;if(I.origin==="subagent"&&I.parentId&&r[I.parentId]){m.has(I.parentId)||m.set(I.parentId,[]),m.get(I.parentId).push(I);continue}let N=c.get(w);if(!N){I.origin==="subagent"&&f.add(I.id),u.push(I);continue}h.has(N)||h.set(N,[]),h.get(N).push(I)}let p=o.map(w=>{let I=h.get(w.workspaceId)??[],N=d.get(w.workspaceId)??[],F=n.get(w.workspaceId),k=I.length,U=cg(F?.layer??3,k,F?.strikes??0);return{workspaceId:w.workspaceId,title:w.title,path:w.path,layer:U.layer,bees:I,cups:N,hysteresis:U}}),{placements:x,displaced:_}=lg(p.map(w=>({workspaceId:w.workspaceId,layer:w.layer})),t),y=new Map,E=[];for(let w of p){let I=x.get(w.workspaceId),N=w.layer,F=w.bees.map(D=>D.id),k=n.get(w.workspaceId)?.slots??null,U=hg(k,F,N);y.set(w.workspaceId,{layer:N,strikes:w.hysteresis.strikes,slots:U});let z=_m(I,N),q=kr(N),Z=w.bees.map(D=>{let H=U.get(D.id)??0,ee=z[Math.min(H,z.length-1)],ie=Xt(ee);return{...fo(D),state:wt[rh(D)],workspaceId:w.workspaceId,tipFace:fw(D,{workspaceId:w.workspaceId,sessionCount:w.bees.length}),cellIndex:H,cell:ee,pos:ie,y:dg,drones:[],activeDroneCount:0}});E.push({workspaceId:w.workspaceId,title:w.title,path:w.path,layer:N,center:I,radius:N-1,capacity:q,bees:Z,cups:w.cups})}let A=new Map(E.map(w=>[w.workspaceId,w])),R=new Map;for(let w of E)for(let I of w.bees)R.set(I.sessionId,I);for(let[w,I]of m){let N=R.get(w);for(let F of I){if(N){let z=wt[rh(F)];N.drones.push({...fo(F),state:z,workspaceId:N.workspaceId,tipFace:fg(N.workspaceId)}),z!==wt.done&&(N.activeDroneCount+=1);continue}let k=c.get(F.id),U=k?A.get(k):void 0;U?U.bees.push({...fo(F),state:wt[rh(F)],droneStandIn:!0,workspaceId:U.workspaceId,tipFace:fg(U.workspaceId),cellIndex:-1,cell:U.center,pos:Xt(U.center),y:dg,drones:[]}):(f.add(F.id),u.push(F))}}for(let w of E){let I=w.bees.filter(k=>k.droneStandIn);if(I.length===0)continue;let N=Xt(w.center),F=hw(I.length);I.map(k=>({bee:k,hash:uw(k.sessionId)})).sort((k,U)=>k.hash-U.hash||(k.bee.sessionId<U.bee.sessionId?-1:1)).forEach(({bee:k},U)=>{let z=(U+.5)/I.length*Math.PI*2;k.pos={x:N.x+Math.cos(z)*F,z:N.z+Math.sin(z)*F}})}for(let[w]of m){let I=R.get(w);if(!I)continue;let N=0,F=new Set([w]),k=[w];for(let U=0;U<k.length;U++)for(let z of v.get(k[U])??[]){if(F.has(z))continue;F.add(z);let q=r[z];q?.running&&!q?.blank&&!l.has(z)&&N++,k.push(z)}I.runningDescendants=N,N>0&&I.state===wt.idle&&(I.state=wt.busy)}if(s&&typeof s=="object"&&!Array.isArray(s)){let w=new Map;for(let I of E)for(let N of I.bees){w.set(N.sessionId,N);for(let F of N.drones)w.set(F.sessionId,F)}for(let[I,N]of Object.entries(s)){let F=N?.parentId;if(typeof F!="string"||!F||I===F)continue;let k=w.get(I),U=w.get(F);!k||!U||(k.summonedBy=F,Array.isArray(U.summonedTo)||(U.summonedTo=[]),U.summonedTo.push(I))}}let b=u.sort((w,I)=>(I.updatedAt??0)-(w.updatedAt??0)).map(w=>({...fo(w),state:wt[rh(w)],...f.has(w.id)?{droneStandIn:!0}:{}}));return{world:{studios:E,wildBees:b,occupancy:ug(x,new Map(E.map(w=>[w.workspaceId,w.layer]))),displaced:_},studioState:y}}var po={sig:0,brief:null,listeners:new Set,getSnapshot(){return this.sig},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},set(i){if(JSON.stringify(this.brief??null)!==JSON.stringify(i??null)){this.brief=i,this.sig+=1;for(let e of[...this.listeners])try{e()}catch{}}}};var ki="/api/dsh-hive";async function gg(){let i=await fetch(ki+"/state"),e=await i.json().catch(()=>({}));if(!i.ok)throw new Error(e.error||i.status+" "+i.statusText);return e.doc??null}async function us(i,e){let t=await fetch(ki+"/state",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({revision:i,...e})}),n=await t.json().catch(()=>({}));return t.status===409?{conflict:!0,doc:n.doc??null}:t.ok?{ok:!0,doc:n.doc??null}:{ok:!1,error:n.error||t.status+" "+t.statusText}}function vg(i,e){if(typeof EventSource>"u")return()=>{};let t=new EventSource(ki+"/events");return t.onmessage=n=>{try{let s=JSON.parse(n.data);s?.type==="layout-changed"&&s.doc?i(s.doc):s?.type==="bee-engine"&&e&&e(s)}catch{}},()=>t.close()}async function Od(i,e){try{let t=await fetch(ki+"/send",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({sessionId:i,prompt:e})}),n=await t.json().catch(()=>({}));return!t.ok||n.ok!==!0?{ok:!1,error:n.error||t.status+" "+t.statusText}:{ok:!0}}catch(t){return{ok:!1,error:String(t?.message||t)}}}async function xg({workspaceId:i,beeTypeId:e,prompt:t,autoSend:n}){try{let s=await fetch(ki+"/summon",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({workspaceId:i,...e?{beeTypeId:e}:{},...typeof t=="string"&&t.length?{prompt:t}:{},autoSend:n===!0})}),r=await s.json().catch(()=>({}));return!s.ok||r.ok!==!0?{ok:!1,error:r.error||s.status+" "+s.statusText,field:r.field}:{ok:!0,sessionId:r.sessionId}}catch(s){return{ok:!1,error:String(s?.message||s)}}}async function yg(i,e){try{let t=await fetch(ki+"/hatch",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({sessionId:i,capabilityId:e})}),n=await t.json().catch(()=>({}));return!t.ok||n.ok!==!0?{ok:!1,error:n.error||t.status+" "+t.statusText,missing:n.missing}:{ok:!0,sessionId:n.sessionId,degraded:n.degraded===!0}}catch(t){return{ok:!1,error:String(t?.message||t)}}}async function bg(i,e,t){try{let n=await fetch(ki+"/lane",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({workspaceId:i,action:e,...t?{sessionId:t}:{}})}),s=await n.json().catch(()=>({}));return!n.ok||s.ok!==!0?{ok:!1,error:s.error||n.status+" "+n.statusText}:{ok:!0,...s}}catch(n){return{ok:!1,error:String(n?.message||n)}}}async function _g(i,e){try{let t=await fetch(ki+"/latch",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({sessionId:i,...e?{capabilityId:e}:{}})}),n=await t.json().catch(()=>({}));return!t.ok||n.ok!==!0?{ok:!1,error:n.error||t.status+" "+t.statusText}:{ok:!0}}catch(t){return{ok:!1,error:String(t?.message||t)}}}async function Sg(i){try{let e=await fetch(ki+"/models?sessionId="+encodeURIComponent(i)),t=await e.json().catch(()=>({}));return e.ok?{ok:!0,models:t.models}:{ok:!1,error:t.error||e.status+" "+e.statusText}}catch(e){return{ok:!1,error:String(e?.message||e)}}}var ah=["hive","bee","floor"];function pw(){return{hive:[],bee:[],floor:[]}}function mw(i,e){return i==="hive"?e.summon===!0:i==="floor"?e.createBee===!0:!0}function gw(i,e){if(!e||typeof e!="object")return null;let t=typeof e.id=="string"?e.id:"",n=typeof e.name=="string"?e.name.trim():"";if(!t||!n)return null;let s={id:t,name:n,autoSend:e.autoSend===!0};if(i==="hive"||i==="floor"){let r=i==="hive"?e.summon===!0:e.createBee===!0;i==="hive"?s.summon=e.summon===!0:s.createBee=e.createBee===!0,r&&(typeof e.beeTypeId=="string"&&e.beeTypeId&&(s.beeTypeId=e.beeTypeId),typeof e.prompt=="string"&&e.prompt.trim()&&(s.prompt=e.prompt))}else if(typeof e.prompt=="string"&&e.prompt.trim())s.prompt=e.prompt;else return null;return s}function mi(i){let e=pw();if(!i||typeof i!="object")return e;for(let t of ah){let n=i[t];if(!Array.isArray(n))continue;let s=new Set,r=new Set;for(let a of n){if(e[t].length>=32)break;let o=gw(t,a);!o||s.has(o.id)||r.has(o.name)||(s.add(o.id),r.add(o.name),e[t].push(o))}}return e}function Ud(i,e,{capacity:t}={}){let n=new Set,s=Array.isArray(i)?i:[];for(let a=0;a<s.length;a++){let o=s[a]??{},l=typeof o.name=="string"?o.name.trim():"";if(!l)return{error:{index:a,field:"name",code:"hive.hb.err.invalidName"},overflow:0};if(n.has(l))return{error:{index:a,field:"name",code:"hive.hb.err.duplicateName"},overflow:0};n.add(l);let c=typeof o.prompt=="string"?o.prompt.trim():"";if(e==="bee"&&!c)return{error:{index:a,field:"prompt",code:"hive.hb.err.missingPrompt"},overflow:0};if(e!=="bee"&&c&&!mw(e,o))return{error:{index:a,field:"prompt",code:"hive.hb.err.promptBlocked"},overflow:0}}return s.length>32?{error:{index:32,field:"list",code:"hive.hb.err.tooManySlots"},overflow:0}:{error:null,overflow:Number.isFinite(t)&&t>0?Math.max(0,s.length-Math.floor(t)):0}}var vw={hive:[],bee:[{id:"default-hb-continue",nameKey:"hive.bar.defaults.beeContinue",promptKey:"hive.bar.defaults.beeContinuePrompt",builtin:!0,autoSend:!0},{id:"default-hb-archive",nameKey:"hive.bar.defaults.beeArchive",builtin:!0,autoSend:!1,action:"archive"},{id:"default-hb-open",nameKey:"hive.bar.defaults.beeOpen",builtin:!0,autoSend:!1,action:"open"}],floor:[{id:"default-hb-nest",nameKey:"hive.bar.defaults.floorNest",builtin:!0,createBee:!1,autoSend:!1}]},Bd=["bee"];function Mg(i,e,t){let n=Array.isArray(e)?e:[],s=Bd.includes(i);if(n.length>0&&!s)return n;let r=typeof t=="function"?t:o=>o,a=(vw[i]??[]).map(o=>{let l={id:o.id,name:String(r(o.nameKey)??""),autoSend:o.autoSend===!0,builtin:!0};if(o.summon!==void 0&&(l.summon=o.summon===!0),o.createBee!==void 0&&(l.createBee=o.createBee===!0),o.action!==void 0&&(l.action=o.action),o.promptKey){let c=String(r(o.promptKey)??"");c.trim()&&(l.prompt=c)}return l});return s?[...n,...a]:a}function wg({selection:i,selectedBee:e,floatOpen:t}={}){if(t)return null;let n=i?.kind;return n==="studio"?"hive":n==="tile"?"floor":n?null:e?"bee":null}function zd(i,e){let t=typeof i=="string"?i:"",n=String(e??"");return t.length===0?n:t+`
`+n}function Hd(i,e,t,n){if(t||!e||n?.byId?.[e]?.origin==="subagent")return null;for(let s of i?.studios??[])for(let r of s?.bees??[])if(r?.sessionId===e)return e;for(let s of i?.wildBees??[])if(s?.sessionId===e)return e;return null}function xw(){return{}}function yw(i){return typeof i=="string"?i.trim():""}function gi(i,e){let t=xw();if(!i||typeof i!="object"||Array.isArray(i))return t;let n=new Set((e??[]).map(s=>s.id));for(let[s,r]of Object.entries(i)){if(!s||!n.has(s))continue;if(Object.keys(t).length>=16)break;if(!r||typeof r!="object"||Array.isArray(r))continue;let a=yw(r.prompt);if(!a)continue;let o={prompt:a,autoSend:r.autoSend===!0};t[s]=o}return t}function Tg(i,e,t){let n={default:[]},s=t?.byId??{},r=o=>s[o]?.origin==="subagent",a=(o,l)=>{if(!o||o.state!=="done"||o.droneStandIn||r(o.sessionId))return;let c=l||"default";n[c]||(n[c]=[]),n[c].push({sessionId:o.sessionId,cellIndex:o.cellIndex??Number.MAX_SAFE_INTEGER})};for(let o of i?.studios??[])for(let l of o?.bees??[]){let c=e?.[l.sessionId]||"";a(l,c)}for(let o of i?.wildBees??[]){let l=e?.[o.sessionId]||"";a(o,l)}for(let o of Object.keys(n))n[o].sort((l,c)=>l.cellIndex-c.cellIndex||(l.sessionId<c.sessionId?-1:l.sessionId>c.sessionId?1:0));return n}function mo(i,e){return(i?.[e]??[]).map(n=>n.sessionId)}function Eg(i,e){let t=Math.max(0,Math.floor(Number(i)||0));return t===0?0:(Math.max(0,Math.floor(Number(e)||0))+1)%t}function Ag(i,e){return mo(i,e).slice()}var bw=34,_w=30,Sw=24,Mw=12;function Cg({reportCollapsed:i,reportRows:e}={}){if(i===!0)return _w;let t=Math.max(0,Math.floor(Number(e)||0));return bw+t*Sw+Mw}var Ng=require("@deepseek-ai/dsh-client-store");var fs=Object.freeze({m:[1,3],n:[1,8]}),ps=Object.freeze({m:[1,8],n:[1,2]}),ms=Object.freeze([1,20]),ds=Object.freeze({panelM:2,panelN:2,barM:8,barN:1});function jr(i,[e,t],n){let s=Math.round(Number(i));return Number.isFinite(s)?Math.min(t,Math.max(e,s)):n}function Rg(i){return jr(i,ms,Wr.reportRows)}function qr(i){let e=i&&typeof i=="object"?i:{};return{panelM:jr(e.panelM,fs.m,ds.panelM),panelN:jr(e.panelN,fs.n,ds.panelN),barM:jr(e.barM,ps.m,ds.barM),barN:jr(e.barN,ps.n,ds.barN)}}var go=Object.freeze(["default","amber","indigo","cyan","magenta","frost"]),Wr=Object.freeze({animation:"full",watermark:"show",drones:"active-only",hotkey:"alt+h",followCurrent:!0,renderer:"webgl",showFps:!0,reportCollapsed:!1,reportRows:8,cameraPitchDeg:45,rightDragSpin:!1,batchSendConfirm:!0,chromeScheme:"default",appearance:{...Hs,rev:Or},layout:{...ds}});function Ig(i){let t={...Wr,...i&&typeof i=="object"?i:{}};return t.appearance?.rev!==Or&&(t.appearance={...Wr.appearance}),t.cameraPitchDeg===38&&(t.cameraPitchDeg=Wr.cameraPitchDeg),t.followCurrentMigrated!==!0&&(t.followCurrent=!0,t.followCurrentMigrated=!0),t.layout=qr(t.layout),t.reportRows=jr(t.reportRows,ms,Wr.reportRows),t}var Vd="dsh-v-hive:settings";function ww(i,e){try{let t=localStorage?.getItem(i);return t==null?e:JSON.parse(t)}catch{return e}}function Pg(i,e){try{localStorage?.setItem(i,JSON.stringify(e))}catch{}}var Lg=(0,Ng.defineStore)({init:()=>({fullscreen:!1,settings:(()=>{let i=ww(Vd,{}),e=Ig(i);return i?.followCurrentMigrated!==!0&&Pg(Vd,e),e})(),toast:null,legend:!1,floatOpen:!1}),actions:{setFullscreen(i,e){i.fullscreen=!!e},openFloat(i){i.floatOpen=!0},closeFloat(i){i.floatOpen=!1},setSettings(i,e){i.settings={...i.settings,...e},e.layout&&(i.settings.layout=qr(i.settings.layout)),e.reportRows!==void 0&&(i.settings.reportRows=Rg(i.settings.reportRows)),e.chromeScheme!==void 0&&!go.includes(i.settings.chromeScheme)&&(i.settings.chromeScheme="default"),Pg(Vd,i.settings)},notify(i,e,t){i.toast={text:e,kind:t??"ok",seq:(i.toast?.seq??0)+1}},clearToast(i){i.toast=null},toggleLegend(i){i.legend=!i.legend}}}),Oi={beeTypes:[],assignments:{},listeners:new Set,getSnapshot(){return this.beeTypes},getAssignments(){return this.assignments},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},set(i,e){let t=Array.isArray(i)?i:[],n=e&&typeof e=="object"?e:{};if(!(JSON.stringify(this.beeTypes)===JSON.stringify(t)&&JSON.stringify(this.assignments)===JSON.stringify(n))){this.beeTypes=t,this.assignments=n;for(let s of[...this.listeners])try{s()}catch{}}}},Xr={hotbars:{hive:[],bee:[],floor:[]},statusCards:{},listeners:new Set,getSnapshot(){return this.hotbars},getStatusCards(){return this.statusCards},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},emit(){for(let i of[...this.listeners])try{i()}catch{}},set(i){let e=mi(i?.hotbars),t=gi(i?.statusCards,i?.beeTypes);(JSON.stringify(this.hotbars)!==JSON.stringify(e)||JSON.stringify(this.statusCards)!==JSON.stringify(t))&&(this.hotbars=e,this.statusCards=t,this.emit())}},oh={lane:{},sessions:{},listeners:new Set,getSnapshot(){return this},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},setFrame(i){let e=i?.lane&&typeof i.lane=="object"?i.lane:{},t=i?.sessions&&typeof i.sessions=="object"?i.sessions:{};if(!(JSON.stringify(this.lane)===JSON.stringify(e)&&JSON.stringify(this.sessions)===JSON.stringify(t))){this.lane=e,this.sessions=t;for(let n of[...this.listeners])try{n()}catch{}}}};var Dg=`
/* \u2500\u2500 \u753B\u5E03 chrome \u914D\u8272\u65B9\u6848\uFF08hive-interaction-polish \u8FFD\u52A0\uFF09\uFF1A--jyv-* \u53D8\u91CF\u5B9A\u4E49\u4E8E body\uFF0C
      \u9ED8\u8BA4\u503C = \u5B98\u65B9\u4EE4\u724C\uFF08\u4E0E\u65E2\u6709\u89C2\u611F\u4E00\u81F4\u3001\u968F\u5E94\u7528\u4E3B\u9898\uFF09\uFF1Bbody[data-jy-chrome] \u4E94\u5957
      \u4E3B\u9898\u5316\u65B9\u6848\u53EA\u8986\u76D6\u300C\u6D6E\u5728 3D \u753B\u5E03\u4E0A\u7684 chrome\u300D\uFF08\u9053\u5177\u680F/\u8702\u7FA4\u9762\u677F/\u72B6\u6001\u5361/\u6982\u8981\u6761/
      tips/\u53F3\u952E\u83DC\u5355/toast/FPS/\u8702\u5361\uFF09\u7684\u5E95\u56FE\u3001\u63CF\u8FB9\u3001hover \u4E0E\u6587\u5B57\u2014\u2014\u6A21\u6001/\u8F93\u5165\u4EF6/\u5EA7\u4F4D/
      \u9875\u9762\u5E27\u4ECD\u8D70\u5B98\u65B9\u4EE4\u724C\uFF08\u5728\u5E94\u7528\u5C42\uFF0C\u968F\u5E94\u7528\u4E3B\u9898\uFF09\uFF1B\u906E\u7F69\u4FDD\u6301\u7EAF\u538B\u6697\u3002 \u2500\u2500 */
body{--jyv-plate:var(--dsw-alias-bg-overlay);--jyv-card:var(--dsw-alias-button-tool-bar-fill);--jyv-card-hover:var(--dsw-alias-button-tool-bar-hover);--jyv-brd:var(--dsw-alias-border-l2);--jyv-accent:var(--dsw-alias-state-business-primary);--jyv-toast:var(--dsw-alias-tooltip-bg);--jyv-text:var(--dsw-alias-label-primary);--jyv-text-dim:var(--dsw-alias-label-tertiary)}
body[data-jy-chrome="amber"]{--jyv-plate:rgba(32,23,9,.86);--jyv-card:rgba(48,35,14,.88);--jyv-card-hover:rgba(66,48,19,.92);--jyv-brd:rgba(185,138,46,.55);--jyv-accent:#f2b544;--jyv-glow:0 0 10px rgba(242,181,68,.35);--jyv-toast:rgba(24,17,7,.94);--jyv-text:#f2e9d8;--jyv-text-dim:#cbbd97}
body[data-jy-chrome="indigo"]{--jyv-plate:rgba(13,11,28,.86);--jyv-card:rgba(20,16,42,.88);--jyv-card-hover:rgba(31,25,60,.92);--jyv-brd:rgba(93,82,150,.55);--jyv-accent:#22d3ee;--jyv-glow:0 0 10px rgba(34,211,238,.30);--jyv-toast:rgba(8,6,18,.94);--jyv-text:#e5e7f8;--jyv-text-dim:#a8adcc}
body[data-jy-chrome="cyan"]{--jyv-plate:rgba(6,24,28,.86);--jyv-card:rgba(8,32,36,.88);--jyv-card-hover:rgba(12,44,50,.92);--jyv-brd:rgba(34,150,166,.55);--jyv-accent:#7ce8f5;--jyv-glow:0 0 10px rgba(124,232,245,.30);--jyv-toast:rgba(4,18,20,.94);--jyv-text:#dff6fa;--jyv-text-dim:#9fc9cf}
body[data-jy-chrome="magenta"]{--jyv-plate:rgba(30,10,32,.86);--jyv-card:rgba(40,14,44,.88);--jyv-card-hover:rgba(56,20,60,.92);--jyv-brd:rgba(170,70,160,.50);--jyv-accent:#f472b6;--jyv-glow:0 0 10px rgba(244,114,182,.32);--jyv-toast:rgba(20,6,22,.94);--jyv-text:#f7e6f5;--jyv-text-dim:#d0a8cc}
body[data-jy-chrome="frost"]{--jyv-plate:rgba(240,242,248,.88);--jyv-card:rgba(255,255,255,.78);--jyv-card-hover:rgba(255,255,255,.94);--jyv-brd:rgba(15,23,42,.16);--jyv-accent:#2563eb;--jyv-glow:0 0 10px rgba(37,99,235,.25);--jyv-toast:rgba(248,250,252,.96);--jyv-text:#17233b;--jyv-text-dim:#4b5a75}
/* \u2500\u2500 \u4FA7\u680F\u5E95\u90E8\u5EA7\u4F4D\u6309\u94AE\uFF08Hive\uFF0C\u4EFF\u5B98\u65B9\u8BBE\u7F6E\u5EA7\u4F4D\u6392\u7248\uFF0Cinsight .tsn-seat \u540C\u6B3E\u601D\u8DEF\uFF1A
      \u5173\u952E border:none \u4FDD\u8BC1\u4E0E\u8BBE\u7F6E\u5EA7\u4F4D\u540C\u6B3E\uFF1Bwide \u53CC\u5F62\u6001\uFF09\u3002
      \u5BB9\u5668 [data-slot=sidebar.footer.action] \u4E3A display:contents\uFF0C\u5176\u7236
      .hHd-Xa_footerActions \u662F nowrap \u6A2A\u5411 flex\uFF08\u5BBD 256px\uFF09\u2014\u2014\u4E24\u4E2A 260px \u5BBD\u5EA7\u4F4D\u5E76\u5B58\u65F6
      \u7B2C\u4E8C\u4E2A\u4F1A\u88AB\u6324\u51FA\u4FA7\u680F\uFF1B\u7528 :has \u5728\u5BB9\u5668\u542B\u672C\u63D2\u4EF6\u5EA7\u4F4D\u65F6\u5141\u8BB8\u6362\u884C\uFF08Chromium 105+\uFF09\uFF0C
      Hive\uFF08order 10\uFF09\u56E0\u6B64\u72EC\u5360\u4E00\u884C\u3001\u4F4D\u4E8E Token\u7EDF\u8BA1\uFF0820\uFF09\u4E4B\u4E0A\u3002 \u2500\u2500 */
div:has(> [data-slot="sidebar.footer.action"]):has(.jyv-seat){flex-wrap:wrap}
.jyv-seat{display:contents}
.jyv-seat-row{box-sizing:border-box;cursor:pointer;width:calc(100% + 4px);height:42px;color:var(--dsw-alias-label-primary);background:0 0;border:none;border-radius:12px;flex:none;align-items:center;gap:8px;margin:4px -2px;padding:0 10px 0 8px;font-family:inherit;font-size:14px;line-height:22px;display:flex;overflow:hidden}
.jyv-seat-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.jyv-seat-rail{box-sizing:border-box;cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;gap:0;width:36px;height:36px;margin:8px 0 10px;padding:0;display:flex}
.jyv-seat-rail:hover{background:var(--dsw-alias-interactive-bg-hover)}
/* \u5F00\u5408\u6001\uFF08insight .tsn-seat \u540C\u6B3E\uFF09\uFF1Adata-active \u5728\u5BB9\u5668\u4E0A\uFF0C\u540E\u4EE3\u9009\u62E9\u5668\u547D\u4E2D\u6309\u94AE */
.jyv-seat[data-active="true"] .jyv-seat-row,.jyv-seat[data-active="true"] .jyv-seat-rail{color:var(--dsw-alias-state-business-primary)}
.jyv-seat-row svg,.jyv-seat-rail svg{width:16px;height:18px;flex:none}
.jyv-seat-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* \u2500\u2500 \u8702\u5DE2\u6574\u9875\u5E27\uFF08shell.overlay \u6761\u76EE\uFF1Bleft = \u4FA7\u680F\u53F3\u7F18\uFF0CuseSidebarLeft \u6D4B\u91CF\uFF1B
      \u964D\u7EA7\uFF08\u6D4B\u4E0D\u5230\u4FA7\u680F\uFF09\u2192 left:0\uFF1B\u5168\u5C4F \u2192 left:0 + \u66F4\u9AD8\u5C42\uFF09 \u2500\u2500 */
.jyv-page{position:absolute;top:0;right:0;bottom:0;z-index:1000;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base);border-left:1px solid var(--dsw-alias-border-l2);pointer-events:auto}
.jyv-page[data-degraded="true"]{left:0;box-shadow:none;border-left:none}
.jyv-page[data-full="true"]{left:0;z-index:1200}
.jyv-page:focus{outline:none}
.jyv-pageHead{border-bottom:1px solid var(--dsw-alias-border-l2);justify-content:space-between;align-items:center;gap:12px;padding:10px 16px;display:flex;flex:none}
.jyv-pageTitle{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:22px;display:flex;align-items:center;gap:8px;min-width:0}
.jyv-pageTitle .jyv-hexMark{width:15px;height:17px;flex:none}
.jyv-pageActions{align-items:center;gap:2px;display:flex;flex:none}
.jyv-canvasWrap{position:relative;flex:1;min-height:0;overflow:hidden;background:#0b0f16}
.jyv-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
/* CSS \u6697\u89D2\uFF08neon-scene-overhaul 5.2\uFF09\uFF1A\u753B\u5E03\u4E4B\u4E0A\u3001\u5361\u7247\u5C42\u4E4B\u4E0B\u2014\u2014\u96F6 GPU \u6210\u672C\u7684\u6DF1\u975B
   \u5F84\u5411\u6E10\u53D8\u906E\u7F69\uFF08\u8272\u5F69\u5BF9\u5E94 src/hive/palette.mjs vignette*\uFF09\uFF0Cpointer-events:none
   \u4E0D\u906E\u6C14\u6CE1\u64CD\u4F5C */
.jyv-vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 130% 110% at 50% 44%, rgba(18,16,42,0) 50%, rgba(8,7,20,0.62) 100%)}
.jyv-cardsRoot{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.jyv-cardsRoot .jyv-card{pointer-events:auto}
/* \u2500\u2500 FPS \u8BA1\u6570\u5668\uFF08context-hotbar-rework R8\uFF09\uFF1A\u753B\u5E03\u5DE6\u4E0A\u89D2\u53EA\u8BFB\u6D6E\u6807\uFF08\u8C03\u8BD5\u7528\uFF0C
      \u8BBE\u7F6E\u53EF\u5F00\u5173\uFF1B\u5B57\u53F7\u52A0\u5927\u4FBF\u4E8E\u89C2\u89C8\uFF09 \u2500\u2500 */
.jyv-fps{position:absolute;top:10px;left:10px;z-index:30;padding:4px 12px;border-radius:8px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);color:var(--jyv-text);font:600 14px/20px ui-monospace,SFMono-Regular,Menlo,monospace;pointer-events:none;font-variant-numeric:tabular-nums;user-select:none}
.jyv-toolBtn{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border:none;background:transparent;border-radius:7px;color:var(--dsw-alias-label-secondary);font-size:12px;cursor:pointer;white-space:nowrap}
.jyv-toolBtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.jyv-toolBtnOn{color:var(--dsw-alias-state-business-primary)}
.jyv-toolBtn svg{display:block;flex:none} /* \u5B98\u65B9 primitives \u56FE\u6807\uFF08\u8BBE\u7F6E\u9F7F\u8F6E\uFF09\u4E0E\u6587\u5B57\u5B57\u5F62\u57FA\u7EBF\u5BF9\u9F50\u62A4\u680F */
/* \u2500\u2500 \u56FE\u4F8B \u2500\u2500 */
.jyv-legend{display:flex;gap:10px;flex-wrap:wrap;padding:6px 12px;border-top:1px solid var(--dsw-alias-border-l1);font-size:11px;color:var(--dsw-alias-label-secondary);flex:none}
.jyv-legendItem{display:inline-flex;align-items:center;gap:5px}
.jyv-legendDot{width:9px;height:9px;border-radius:999px;flex:none}
/* \u2500\u2500 \u871C\u8702\u5361\u7247\uFF08HTML \u6295\u5F71\uFF09 \u2500\u2500 */
.jyv-card{position:absolute;top:0;left:0;width:230px;padding:8px 10px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);border-radius:10px;box-shadow:var(--dsw-shadow-lv3);font-size:12px;color:var(--jyv-text);will-change:transform}
.jyv-cardHead{display:flex;align-items:center;gap:6px;min-width:0}
.jyv-cardDot{width:8px;height:8px;border-radius:999px;flex:none}
.jyv-state-idle{background:#d8d3c8}
.jyv-state-busy{background:#3f8fd6}
.jyv-state-help{background:#e8a13c;box-shadow:0 0 6px #e8a13c}
.jyv-state-done{background:#57b26a}
.jyv-cardTitle{flex:1;min-width:0;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-cardPin{border:none;background:transparent;color:var(--jyv-text-dim);cursor:pointer;font-size:10px;padding:2px}
.jyv-cardPinOn{color:var(--jyv-accent)}
.jyv-cardMeta{color:var(--jyv-text-dim);font-size:11px;margin-top:3px}
.jyv-cardTodos{display:flex;align-items:center;gap:6px;margin-top:5px;color:var(--jyv-text-dim);font-size:11px}
.jyv-cardTodosBar{flex:1;height:4px;border-radius:999px;background:color-mix(in srgb,var(--jyv-text) 14%,transparent);overflow:hidden}
.jyv-cardTodosBar span{display:block;height:100%;background:var(--dsw-alias-state-success-primary);border-radius:999px}
.jyv-cardDrones{margin-top:4px;color:var(--jyv-text-dim);font-size:11px}
.jyv-cardActions{display:flex;gap:6px;margin-top:7px}
.jyv-cardBtn{border:1px solid color-mix(in srgb,var(--jyv-text) 25%,transparent);background:transparent;color:var(--jyv-text-dim);border-radius:6px;font-size:11px;padding:2px 8px;cursor:pointer}
.jyv-cardBtn:hover{color:var(--jyv-text);border-color:color-mix(in srgb,var(--jyv-text) 50%,transparent)}
.jyv-cardCup{width:210px}
.jyv-cardArchived{margin-top:5px;color:var(--jyv-text-dim);font-size:11px}
/* \u2500\u2500 \u5C0F\u6C14\u6CE1\uFF08\u6BCF\u8702\u5E38\u9A7B\u72B6\u6001\u70B9\u82AF\u7247\uFF1B\u70B9\u51FB\u5C55\u5F00\u5B8C\u6574\u5361\uFF1B\u6807\u9898\u8D70 tooltip\uFF09\u3002
      \u5C3A\u5BF8 = \u521D\u7248 2 \u500D\uFF08\u7528\u6237\u53CD\u9988\uFF1A\u6C14\u6CE1\u8FC7\u5C0F\uFF09\u2014\u2014padding/gap/\u5706\u70B9/\u5B57\u53F7\u5168\u91CF\u7FFB\u500D\uFF0C
      width:auto \u5185\u5BB9\u9A71\u52A8\uFF0C\u6574\u4F53\u968F\u4E4B\u7B49\u6BD4\u653E\u5927\uFF1B\u5BF9\u9F50\u4ECD\u4E3A bottom-center \u4E0D\u53D7\u5F71\u54CD\u3002 \u2500\u2500 */
.jyv-cardMini{width:auto;display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;cursor:pointer}
.jyv-cardMini:hover{border-color:var(--jyv-accent);background:color-mix(in srgb,var(--jyv-text) 8%,transparent)}
.jyv-cardMini .jyv-cardDot{width:18px;height:18px}
.jyv-bubbleTodo{color:var(--jyv-text-dim);font-size:20px;flex:none;line-height:1}
/* \u2500\u2500 \u53F3\u952E\u83DC\u5355 / toast \u2500\u2500 */
.jyv-menu{position:fixed;z-index:10000;min-width:170px;padding:4px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);border-radius:10px;box-shadow:var(--dsw-shadow-lv3)}
.jyv-menuItem{display:block;width:100%;text-align:left;padding:7px 12px;border:none;background:transparent;font:inherit;font-size:12.5px;color:var(--jyv-text);border-radius:7px;cursor:pointer}
.jyv-menuItem:hover{background:color-mix(in srgb,var(--jyv-text) 9%,transparent)}
.jyv-toast{position:fixed;left:16px;bottom:16px;z-index:10001;max-width:380px;padding:8px 14px;border-radius:8px;background:var(--jyv-toast);color:var(--jyv-text);font-size:12px;border:1px solid var(--jyv-brd);box-shadow:var(--dsw-shadow-lv2);animation:jyvToastIn .18s ease-out}
.jyv-toastErr{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}
@keyframes jyvToastIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
/* \u2500\u2500 \u4F1A\u8BDD\u5934\u65B9\u5F62\u56DE\u5DE2\u6309\u94AE\uFF08explorer \u540C\u6B3E\uFF09 \u2500\u2500 */
.jyv-toggleBtn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;flex:none;border:none;background:transparent;border-radius:8px;color:var(--dsw-alias-label-secondary);cursor:pointer;padding:0}
.jyv-toggleBtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.jyv-toggleBtn svg{width:15px;height:15px;display:block}
.jyv-toggleBtnOn{color:var(--dsw-alias-state-business-primary)}
/* \u2500\u2500 WebGL \u964D\u7EA7\u5361 \u2500\u2500 */
.jyv-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;background:#0c1118}
.jyv-fallbackCard{max-width:340px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:1.8;border:1px dashed var(--dsw-alias-border-l2);border-radius:12px;padding:20px}
.jyv-fallbackTitle{color:var(--dsw-alias-label-primary);font-weight:600;font-size:13px;margin-bottom:6px}
.jyv-fallbackRetry{margin-top:12px}
/* \u2500\u2500 \u8BBE\u7F6E\u5361 \u2500\u2500 */
.jyv-settings{display:flex;flex-direction:column;gap:2px}
.jyv-setRow{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:44px;padding:8px 2px;border-top:1px solid var(--dsw-alias-border-l1)}
.jyv-setRow:first-child{border-top:none}
.jyv-setLabel{font-size:13px;color:var(--dsw-alias-label-primary)}
.jyv-setHint{font-size:11px;color:var(--dsw-alias-label-tertiary);margin-top:2px}
.jyv-setSelect{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border-radius:8px;height:30px;padding:0 8px;font-size:12.5px}
.jyv-setToggle{position:relative;width:38px;height:21px;border-radius:999px;border:none;background:var(--dsw-alias-interactive-bg-hover);cursor:pointer;transition:background .15s}
.jyv-setToggle::after{content:"";position:absolute;top:2px;left:2px;width:17px;height:17px;border-radius:999px;background:var(--dsw-alias-label-primary);transition:transform .15s}
.jyv-setToggleOn{background:var(--dsw-alias-state-business-primary)}
.jyv-setToggleOn::after{transform:translateX(17px)}
/* \u2500\u2500 \u9875\u5185\u8BBE\u7F6E\u9762\u677F\uFF08\u56DB\u8F6E\uFF09\uFF1A\u5BF9\u9F50 DSH \u8BBE\u7F6E\u5F39\u5C42\u98CE\u683C\u2014\u2014\u5B9E\u8272\u6DF1\u5E95\u3001\u9AD8\u5BF9\u6BD4\u5206\u7EC4\u3001
      \u53EF\u89C1\u53EF\u62D6\u62FD\u7684\u6EDA\u52A8\u6761\uFF1B\u6ED1\u6746/\u53D6\u8272\u5668\u6CBF\u7528\u5BBF\u4E3B\u8BED\u4E49\u8272 \u2500\u2500 */
.jyv-setTabs{display:flex;gap:2px;padding:3px;background:var(--dsw-alias-bg-layer-3);border:1px solid var(--dsw-alias-border-l1);border-radius:9px;margin-bottom:4px}
.jyv-setTab{flex:1;border:none;background:transparent;color:var(--dsw-alias-label-secondary);border-radius:7px;height:30px;font-size:12.5px;cursor:pointer}
.jyv-setTab:hover{color:var(--dsw-alias-label-primary)}
.jyv-setTabOn{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);font-weight:600}
.jyv-setGroup{font-size:11px;font-weight:700;color:var(--dsw-alias-state-business-primary);letter-spacing:.08em;padding:14px 2px 4px;border-top:1px solid var(--dsw-alias-border-l1);margin-top:10px}
.jyv-setRangeWrap{display:flex;align-items:center;gap:8px}
.jyv-setRange{width:132px;accent-color:var(--dsw-alias-state-business-primary);cursor:pointer}
.jyv-setRangeVal{min-width:44px;text-align:right;font-size:12px;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}
.jyv-setColorWrap{display:flex;align-items:center;gap:8px}
.jyv-setColor{width:36px;height:26px;padding:0;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-3);cursor:pointer}
.jyv-setColor::-webkit-color-swatch-wrapper{padding:2px}
.jyv-setColor::-webkit-color-swatch{border:none;border-radius:4px}
.jyv-setColorVal{font-size:11px;color:var(--dsw-alias-label-secondary);font-family:ui-monospace,monospace}
.jyv-setActions{display:flex;justify-content:flex-end;padding:12px 2px 2px;border-top:1px solid var(--dsw-alias-border-l1);margin-top:10px}
.jyv-setReset{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);border-radius:8px;height:28px;padding:0 12px;font-size:12px;cursor:pointer}
.jyv-setReset:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
/* \u2500\u2500 \u4F1A\u8BDD\u6D6E\u7A97\uFF08hive-quick-commands D3 \u906E\u7F69\u5B54\u6D1E\u6A21\u578B\uFF1Bspike 3.2 \u7ED3\u8BBA\uFF09\uFF1A
      AppFrame \u6839 = position:relative + \u586B\u5145\u89C6\u53E3 + inline grid-template-columns
      \uFF08sidebar px / minmax(0,1fr) / details px \u663E\u5F0F\u4E09\u8F68\uFF09+ \u5B50\u5143\u7D20\u5E8F
      [sidebarCol, centerCol, detailsCol, overlayLayer([data-shell-overlay]), handles\u2026]\u3002
      \u5B54\u6D1E\u5750\u6807\u7CFB = AppFrame \u6839\uFF08\u906E\u7F69 chrome \u6302 overlay \u5C42 inset:0\uFF0C\u540C\u6E90\uFF09\uFF1A
      \u5BBD min(720px,80%)\u3001\u9AD8 70%\u3001\u6C34\u5E73\u5782\u76F4\u5C45\u4E2D\u3002\u4E2D\u5217\u6574\u5F62\u7528 position:absolute
      \uFF08\u76F8\u5BF9 frame\uFF0C\u4E0D\u7528 transform\u2014\u2014\u907F\u514D\u541E\u6389\u540E\u4EE3 fixed \u57FA\u51C6\uFF09\uFF1B\u96F6 z-index \u6539\u52A8\u3002 \u2500\u2500 */
[data-jy-float="open"] .jyv-page{visibility:hidden}
/* \u4E2D\u5217\u8131\u6D41\u9632 auto-placement \u5DE6\u79FB\uFF1A\u8BE6\u60C5\u5217\u9489\u56DE\u7B2C 3 \u8F68\u3001\u4FA7\u680F\u5217\u9489\u56DE\u7B2C 1 \u8F68
   \uFF08\u7ED3\u6784\u94A9\u5B50 = frame \u6839\u5C5E\u6027 + [data-shell-overlay] \u524D\u9A71 :has() \u94FE\uFF0C\u4E0D\u4F9D\u8D56\u54C8\u5E0C\u7C7B\u540D\uFF09 */
[data-jy-float="open"] > *:has(+ [data-shell-overlay]){grid-column:3 !important;grid-row:1 !important}
[data-jy-float="open"] > *:has(+ * + * + [data-shell-overlay]){grid-column:1 !important;grid-row:1 !important}
/* \u4E2D\u5217\u6574\u5F62\u4E3A\u5B54\u6D1E\u77E9\u5F62\uFF08\u5B98\u65B9\u5217\u5C42\u5E8F\u4E0D\u52A8\uFF1B\u5706\u89D2\u8FB9\u6846 + \u9634\u5F71 = \u6D6E\u8D77\u611F\uFF09 */
[data-jy-float="open"] > *:has(+ * + [data-shell-overlay]){
  position:absolute;
  left:calc((100% - min(720px,80%))/2);
  top:15%;
  width:min(720px,80%);
  height:70%;
  border-radius:14px;
  border:1px solid var(--dsw-alias-border-l2);
  box-shadow:var(--dsw-shadow-lv3);
  background:var(--dsw-alias-bg-base);
}
.jyv-floatChrome{position:absolute;inset:0;z-index:1300;pointer-events:none}
.jyv-floatMask{position:absolute;pointer-events:auto;cursor:pointer;background:var(--dsw-alias-bg-mask-3)}
.jyv-floatMaskT{top:0;left:0;right:0;height:15%}
.jyv-floatMaskB{bottom:0;left:0;right:0;height:15%}
.jyv-floatMaskL{top:15%;bottom:15%;left:0;width:calc((100% - min(720px,80%))/2)}
.jyv-floatMaskR{top:15%;bottom:15%;right:0;width:calc((100% - min(720px,80%))/2)}
.jyv-floatTitle{position:absolute;pointer-events:auto;box-sizing:border-box;left:calc((100% - min(720px,80%))/2);width:min(720px,80%);top:calc(15% - 34px);height:30px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 6px 0 12px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);border-bottom:none;border-radius:10px 10px 0 0;color:var(--dsw-alias-label-primary);font-size:13px;cursor:default}
.jyv-floatName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.jyv-floatClose{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:1;cursor:pointer;padding:4px 8px;border-radius:6px;flex:none}
.jyv-floatClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
/* \u2500\u2500 \u8BBE\u7F6E\u6A21\u6001\uFF08hive-quick-commands 5.x\uFF09\uFF1A\u9875\u5185\u5C45\u4E2D\u6A21\u6001\uFF0C\u9875\u7B7E tablist\u3002
      \u9AD8\u5EA6\u56FA\u5B9A\uFF08\u4E0D\u968F\u5185\u5BB9\u7F29\u653E\uFF09\uFF0C\u5185\u5BB9\u5728 modalBody \u5185\u6EDA\u52A8\u3002
      \uFF08\u300C\u5FEB\u6377\u6307\u4EE4\u300D\u5361\u5E26/\u7F16\u8F91\u5668\u6837\u5F0F\u5DF2\u968F context-hotbar-rework \u62C6\u9664\uFF1B
      \u6A21\u6001\u8868\u5355\u901A\u7528\u4EF6\uFF08qcRow \u7CFB\uFF09\u4E3A\u8702\u7FA4\u7F16\u8F91\u6CBF\u7528\u3002\uFF09 \u2500\u2500 */
.jyv-modalBack{position:absolute;inset:0;z-index:1400;display:flex;align-items:center;justify-content:center;background:var(--dsw-alias-bg-mask-3);cursor:pointer}
.jyv-modal{width:min(560px,92%);height:min(560px,88%);display:flex;flex-direction:column;box-sizing:border-box;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);border-radius:12px;box-shadow:var(--dsw-shadow-lv3);padding:12px 14px;cursor:auto}
.jyv-modalHead{display:flex;align-items:center;justify-content:space-between;padding-bottom:8px;flex:none}
.jyv-modalTitle{font-size:14px;font-weight:600;color:var(--dsw-alias-label-primary)}
.jyv-modalBody{flex:1 1 auto;overflow-y:auto;min-height:0;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;padding-top:4px}
/* \u2500\u2500 \u6A21\u6001\u8868\u5355\u901A\u7528\u4EF6\uFF08\u8702\u7FA4\u7F16\u8F91\u6CBF\u7528\uFF1B\u547D\u540D\u627F\u81EA\u65E7\u5FEB\u6377\u6307\u4EE4\u7F16\u8F91\u5668\uFF09\uFF1A
      \u6BCF\u6761\u4E00\u4E2A\u8FB9\u6846\u5706\u89D2\u5757\uFF0C\u9996\u884C\u540D\u79F0+\u5F00\u5173\uFF08\u5E26\u6587\u5B57\uFF09+\u6392\u5E8F/\u5220\u9664\uFF0C\u6B21\u884C textarea \u2500\u2500 */
.jyv-qcRows{display:flex;flex-direction:column;gap:6px}
.jyv-qcRow{flex-direction:column;gap:4px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:8px;display:flex}
.jyv-qcRowHead{align-items:center;gap:6px;display:flex}
.jyv-qcNameInput{flex:1;min-width:0;height:26px;box-sizing:border-box;font:12px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:3px 8px;outline:none}
.jyv-qcNameInput:focus{border-color:var(--dsw-alias-border-inverted)}
.jyv-qcPromptInput{resize:vertical;min-height:44px;box-sizing:border-box;font:12px ui-monospace,SFMono-Regular,Menlo,monospace;line-height:1.5;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:6px 8px;outline:none}
.jyv-qcPromptInput:focus{border-color:var(--dsw-alias-border-inverted)}
.jyv-qcAuto{flex:none;display:inline-flex;align-items:center;gap:5px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:16px;cursor:pointer;user-select:none}
.jyv-qcAuto input{accent-color:var(--dsw-alias-border-inverted);margin:0;cursor:pointer}
.jyv-qcMove{flex:none;cursor:pointer;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;padding:0;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);border-radius:6px;font-size:12px;line-height:1}
.jyv-qcMove:hover:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-dimmed)}
.jyv-qcMove:disabled{opacity:.4;cursor:not-allowed}
.jyv-qcRemove{cursor:pointer;border:0;background:0 0;color:var(--dsw-alias-label-tertiary);font-size:14px;line-height:18px;padding:2px 6px;border-radius:6px}
.jyv-qcRemove:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover)}
.jyv-qcEmpty{padding:16px 4px;color:var(--dsw-alias-label-tertiary);font-size:12px;text-align:center}
.jyv-qcActions{display:flex;align-items:center;gap:8px;padding-top:10px;margin-top:10px;border-top:1px solid var(--dsw-alias-border-l1)}
.jyv-qcAdd{border:1px dashed var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);border-radius:8px;height:28px;padding:0 12px;font-size:12px;cursor:pointer}
.jyv-qcAdd:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.jyv-qcSave{margin-left:auto;border:none;background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary-inverted);border-radius:8px;height:28px;padding:0 14px;font-size:12px;cursor:pointer}
.jyv-qcSave:disabled{opacity:.55;cursor:default}
.jyv-qcDirty{color:var(--dsw-alias-label-tertiary);font-size:11px}
.jyv-qcError{color:var(--dsw-alias-state-error-primary);font-size:11px}
.jyv-qcConfirm{display:flex;align-items:center;gap:8px;padding:8px 10px;margin-bottom:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;color:var(--dsw-alias-label-primary);font-size:12px;background:var(--dsw-alias-bg-layer-3);flex:none}
.jyv-qcDiscard{margin-left:auto;border:1px solid var(--dsw-alias-state-error-primary);background:transparent;color:var(--dsw-alias-state-error-primary);border-radius:7px;height:26px;padding:0 10px;font-size:11px;cursor:pointer}
.jyv-qcDiscard:hover{background:var(--dsw-alias-interactive-bg-hover)}
/* \u2500\u2500 \u8702\u7FA4\u7F16\u8F91\u6D6E\u7A97\uFF08custom-bee-types 4.x\uFF09\uFF1A\u590D\u7528\u8BBE\u7F6E\u6A21\u6001\u9AA8\u67B6 + \u53EF\u62D6\u62FD\u5934\u90E8 \u2500\u2500 */
.jyv-swarmBtn{flex:none;margin-right:2px}
.jyv-swarmModal{width:min(560px,calc(100vw - 48px));max-height:min(76vh,640px);display:flex;flex-direction:column}
.jyv-swarmHead{cursor:grab;user-select:none;touch-action:none}
.jyv-swarmHead:active{cursor:grabbing}
.jyv-swarmRowOn{outline:1px solid var(--dsw-alias-state-business-primary);outline-offset:-1px}
.jyv-swarmTypeRow{display:flex;align-items:flex-end;gap:10px;margin-top:8px;flex-wrap:wrap}
.jyv-swarmField{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--dsw-alias-label-secondary)}
.jyv-swarmField select{height:26px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;font-size:12px;padding:0 6px;max-width:220px}
.jyv-swarmFieldGrow{flex:1;min-width:180px}
.jyv-swarmFieldGrow select{max-width:none;width:100%}
.jyv-swarmHint{color:var(--dsw-alias-label-tertiary);font-size:11px;height:26px;display:inline-flex;align-items:center}
.jyv-swarmDesc{margin-top:8px}
/* \u9884\u8BBE\u63D0\u793A\u8BCD\u7F16\u8F91\u9879\uFF08hive-summon-tool 5.1\uFF09\uFF1Atextarea \u5F62\u6001\uFF0C\u590D\u7528 qcPromptInput \u57FA\u5F62\u3002 */
.jyv-swarmPreset{margin-top:6px;min-height:64px;font-family:inherit}
.jyv-swarmCaps{display:flex;flex-direction:column;gap:8px}
.jyv-swarmCapsHead{display:flex;align-items:center;justify-content:space-between;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:600}
.jyv-swarmCapture{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:8px}
.jyv-swarmCaptureRow{display:inline-flex;align-items:center;gap:4px}
.jyv-swarmCaptureName{width:64px;height:24px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;font-size:12px;padding:0 6px}
.jyv-swarmCapturePath{flex:1;min-width:140px;height:24px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;font-size:12px;padding:0 6px}
.jyv-swarmInsert{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
/* \u2500\u2500 \u8702\u5361\u8702\u79CD\u589E\u91CF\uFF08custom-bee-types 5.2/5.3\uFF09\uFF1A\u5FBD\u7AE0 / \u53D8\u91CF / \u23F8 \u8F66\u9053 / \u52A8\u4F5C\u884C\u3002
      \u5361\u7247\u951A\u70B9\u3001\u5BF9\u9F50\u4E0E\u906E\u6321\u8BED\u4E49\u96F6\u6539\u52A8\uFF08spec \u56FA\u5316\u9879\uFF09\u2014\u2014\u53EA\u5728\u5361\u5185\u8FFD\u52A0\u884C\u3002 \u2500\u2500 */
.jyv-bubbleBee{display:inline-flex;align-items:center;height:16px;padding:0 5px;border-radius:8px;background:color-mix(in srgb,var(--jyv-accent) 28%,transparent);color:var(--jyv-text);font-size:10px;line-height:16px;max-width:88px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-bubbleLane{display:inline-flex;align-items:center;height:16px;padding:0 5px;border-radius:8px;background:color-mix(in srgb,#d9a441 30%,transparent);color:#f5d9a0;font-size:10px;line-height:16px}
.jyv-cardBeeRow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px}
.jyv-cardBee{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:10px;background:color-mix(in srgb,var(--jyv-accent) 30%,transparent);color:var(--jyv-text);font-size:12px;line-height:20px;font-weight:600}
.jyv-cardQueue{color:var(--jyv-text-dim);font-size:11px}
.jyv-cardVars{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-top:6px}
.jyv-cardVar{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:9px;background:color-mix(in srgb,var(--jyv-text) 9%,transparent);color:var(--jyv-text-dim);font-size:10px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-cardVarReset{margin-left:auto}
.jyv-cardWaits{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.jyv-cardWait{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:9px;background:color-mix(in srgb,#d9a441 22%,transparent);color:#f0d9ad;font-size:10px}
.jyv-cardNotices{display:flex;flex-direction:column;gap:3px;margin-top:6px}
.jyv-cardNotice{color:var(--jyv-text-dim);font-size:11px;line-height:15px}
.jyv-cardHatch{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.jyv-cardHatchBtn{border-color:var(--jyv-accent);color:var(--jyv-accent)}
.jyv-menuItemOn{color:var(--jyv-accent);font-weight:600}
/* \u2500\u2500 \u5DE6\u7EB5\u6392\u6A21\u6001\u9AA8\u67B6\uFF08context-hotbar-rework 4.1/5.1\uFF0CD9\uFF09\uFF1A\u8BBE\u7F6E\u4E0E\u6307\u4EE4\u7F16\u8F91\u5171\u7528
      overlay+mask+panel+\u5DE6 nav rail\uFF08\u56FE\u6807+\u8282\u540D\uFF09+\u5185\u5BB9\u6EDA\u52A8\u533A\uFF1B\u81EA\u7ED8\u3001\u5168 token\u3002
      \u5C42\u5E8F\uFF1A\u6A21\u6001(1400) > \u6D6E\u7A97 chrome(1300) > \u8986\u76D6\u9762\u677F/\u9053\u5177\u680F > \u753B\u5E03\u62FE\u53D6\u3002 \u2500\u2500 */
.jyv-railModal{width:min(640px,94%);height:min(560px,88%);padding:12px 0 12px 12px}
.jyv-railBody{display:flex;gap:0;flex:1;min-height:0}
.jyv-railNav{display:flex;flex-direction:column;gap:2px;width:132px;flex:none;padding-right:10px;border-right:1px solid var(--dsw-alias-border-l1)}
.jyv-railItem{display:flex;align-items:center;gap:8px;width:100%;padding:7px 10px;border:none;background:transparent;border-radius:8px;color:var(--dsw-alias-label-secondary);font-size:12.5px;cursor:pointer;text-align:left}
.jyv-railItem:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.jyv-railItem:focus-visible{outline:1px solid var(--dsw-alias-border-inverted);outline-offset:-1px}
.jyv-railItemOn{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);font-weight:600}
.jyv-railIcon{width:16px;flex:none;text-align:center}
.jyv-railLabel{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-railContent{flex:1;min-width:0;min-height:0;padding-left:12px;display:flex;flex-direction:column}
.jyv-hbBody{padding-top:0}
/* \u2500\u2500 \u5E95\u90E8\u60C5\u5883\u9053\u5177\u680F\uFF086.x\uFF09\uFF1A\u7D27\u51D1\u9635\u5217\uFF08\u7528\u6237\u5B9A\u7A3F\uFF09\u2014\u2014\u65E0\u7A7A\u4F4D\u5360\u4F4D\u5361\uFF0C\u53EF\u89C1\u884C\u6570 =
      \u2308\u69FD\u4F4D\u6570/m\u2309 \u5C01\u9876 n\uFF08max-height + \u7EB5\u5411\u6EDA\u52A8\uFF09\uFF0C\u6761\u5BBD = min(\u69FD\u4F4D\u6570, m) \u4E14\u5E95\u90E8
      \u6C34\u5E73\u5C45\u4E2D\uFF1B\u5361\u7247 64\xD764 \u65B9\u5F62\uFF08\u4E0E\u8702\u7FA4\u9762\u677F\u540C\u89C4\u683C\uFF09\uFF1B\u4E09\u6001\u95E8\u63A7\u7531\u5916\u58F3\u6761\u4EF6\u6E32\u67D3
      \uFF08kind null \u6216\u65E0\u69FD\u4F4D\u4E0D\u6E32\u67D3\uFF09\u3002\u5C42\u5E8F 30\uFF1A\u753B\u5E03\u62FE\u53D6\u4E4B\u4E0A\u3001\u6D6E\u7A97 chrome \u4E4B\u4E0B\u3002 \u2500\u2500 */
.jyv-hotbar{position:absolute;left:0;right:0;bottom:0;z-index:30;margin-inline:auto;width:fit-content;box-sizing:border-box;max-height:calc(var(--jyv-hb-rows) * 64px + (var(--jyv-hb-rows) - 1) * 5px + 16px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;display:grid;grid-template-columns:repeat(var(--jyv-hb-cols),64px);grid-auto-rows:64px;gap:5px;padding:8px 10px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);border-radius:12px;box-shadow:var(--dsw-shadow-lv3)}
.jyv-hbCard{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;box-sizing:border-box;width:64px;height:64px;min-width:0;padding:5px 4px;border:1px solid var(--jyv-brd);background:var(--jyv-card);border-radius:10px;color:var(--jyv-text);font-size:11px;cursor:pointer;overflow:hidden}
.jyv-hbCard:hover:not(:disabled){background:var(--jyv-card-hover);border-color:var(--jyv-accent);box-shadow:var(--jyv-glow,none)}
.jyv-hbCard:disabled{opacity:.45;cursor:not-allowed}
.jyv-hbCard[data-auto]{border-color:var(--jyv-accent)}
/* \u52A8\u4F5C\u5361\u871C\u91D1\u63CF\u8FB9\uFF08hotbar-default-actions 9.1\uFF0C\u7528\u6237\u5B9A\u7A3F\uFF09\uFF1A\u5F52\u6863/\u6253\u5F00\u7B49\u5185\u7F6E\u52A8\u4F5C\u5361
   \u4E13\u5C5E\u8FA8\u8BC6\u8272\u2014\u2014\u4E0E\u573A\u666F\u5F52\u6863\u871C\u91D1/\u4F5C\u6218\u62A5\u544A\u5F52\u6863\u52A8\u8BCD\u540C\u6E90\uFF08#f2b544 = PALETTE.trimColor\uFF09\uFF0C
   \u4E0D\u5360\u7528\u300C\u84DD\u6846 = \u26A1\u76F4\u53D1\u300D\u8BED\u4E49\uFF1Bhover \u56DE\u843D label-dimmed \u4E0E\u65E2\u6709\u5361\u4E00\u81F4\u3002 */
.jyv-hbCard[data-action]{border-color:#f2b544}
.jyv-hbCard[data-busy]{opacity:.6}
.jyv-hbName{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;line-height:14px}
.jyv-hbBolt{position:absolute;top:3px;right:4px;font-size:10px;line-height:12px}
/* \u5185\u7F6E\u89D2\u6807\uFF08hotbar-default-actions 4.1\uFF09\uFF1A\u5DE6\u4E0A\u89D2\u5FAE\u578B\u5355\u884C chip\uFF0C\u4E0E \u26A1\uFF08\u53F3\u4E0A\uFF09\u5BF9\u79F0\uFF1B
   \u5168\u8D70 --dsw-alias-* token\uFF0Cabsolute \u5B9A\u4F4D\u4E0D\u5360 flex \u6D41\u2014\u2014\u4E0D\u7834 64px \u5361\u9762\u7F51\u683C\uFF1B
   cursor:help + title\uFF08\u6536\u56DE\u63D0\u793A\u6302\u5728\u5143\u7D20\u81EA\u8EAB\uFF0C\u7EC4\u4EF6\u63A5\u7EBF\uFF09\u3002 */
.jyv-hbBuiltin{position:absolute;top:2px;left:4px;max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 4px;border-radius:6px;background:color-mix(in srgb,var(--jyv-text) 12%,transparent);color:var(--jyv-text-dim);font-size:9px;line-height:11px;cursor:help}
.jyv-hbGlyph{flex:none;font-size:16px;line-height:18px}
.jyv-hbIndex{flex:none;min-width:16px;text-align:right;color:var(--jyv-text-dim);font-size:11px;font-variant-numeric:tabular-nums}
.jyv-hbRowOn{outline:1px solid var(--jyv-accent);outline-offset:-1px}
.jyv-hbForm{display:flex;flex-direction:column;gap:8px;margin-top:6px}
/* \u2500\u2500 \u5DE5\u8702\u9635\u5217\u8986\u76D6\u9762\u677F\uFF087.x\uFF0CD2/D8\uFF1Bhive-marquee-and-card-rework 4.3/4.4 16:9 \u6539\u7248\uFF09\uFF1A
      canvas \u53F3\u7F18\u8986\u76D6\uFF1B\u9762\u677F\u58F3\u53BB chrome\uFF08\u65E0\u5E95\u56FE/\u65E0\u8FB9\u6846/\u65E0\u9634\u5F71\uFF0C\u76F4\u63A5\u6D6E\u4E8E\u753B\u5E03\uFF09\uFF0C\u5934\u90E8
      \u53EA\u7559\u8BA1\u6570\uFF08studio = n/\u5BB9\u91CF\uFF1Bmarquee = \u5DF2\u9009 N \u53EA\uFF09\uFF1B\u5361\u7247 114\xD764 \u957F\u65B9\u5F62\uFF0816:9\uFF0C
      \u63A8\u7FFB 64\xD764 \u65B9\u5F62\u65E7\u5B9A\u7A3F\uFF09\u5DE6\u56FE\u53F3\u6587\u2014\u2014\u5DE6\u5217 48px \u6A21\u578B\u6E32\u67D3\u533A\uFF08128px \u5FEB\u7167\u6E90 dpr2
      \u4ECD\u6E05\u6670\uFF1B52px \u4F1A\u628A\u6587\u5B57\u533A\u6324\u5230 ~44px \u53CD\u6BD4\u65B9\u5361\u7A84\uFF0CF12\uFF09+ \u53F3\u5217\u6587\u5B57\u6808\uFF1B\u9762\u677F\u5BBD\u968F
      \u5185\u5BB9\uFF08\u4E0A\u9650 40vw\uFF1A3 \u5217 \u2248 380px\uFF0C\u5E38\u89C4\u753B\u5E03\u4E0D\u9876\u9650\uFF09\u3001\u9AD8\u968F\u5B9E\u9645\u884C\u6570\u81EA\u9002\u5E94\uFF08\u53EF\u89C6
      \u884C\u6570\u4E0A\u9650 = \u8BBE\u7F6E panelN\uFF0C\u8D85\u51FA\u7EB5\u5411\u6EDA\u52A8\uFF09\uFF0C\u5728\u753B\u5E03\u53EF\u7528\u533A\uFF08\u5E95\u7F18\u8BA9\u4F4D\u9053\u5177\u680F\uFF09\u5782\u76F4
      \u5C45\u4E2D\u3002 \u2500\u2500 */
.jyv-workerPanel{--jyv-wp-card-w:114px;position:absolute;top:0;right:10px;bottom:76px;z-index:30;margin-block:auto;height:fit-content;max-width:40vw;max-height:calc(100% - 96px);display:flex;flex-direction:column;min-height:0;background:transparent;border:none;border-radius:0;box-shadow:none;pointer-events:auto}
.jyv-wpHead{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:2px 4px;flex:none;text-shadow:0 1px 2px rgba(0,0,0,.5)}
.jyv-wpCount{color:var(--jyv-text);font-size:11px;font-weight:600;font-variant-numeric:tabular-nums}
.jyv-wpGrid{flex:1 1 auto;min-height:0;box-sizing:border-box;max-height:calc(var(--jyv-wp-rows) * 64px + (var(--jyv-wp-rows) - 1) * 6px + 16px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;display:grid;grid-template-columns:repeat(var(--jyv-wp-cols),var(--jyv-wp-card-w));grid-auto-rows:64px;gap:6px;padding:8px;justify-content:start}
.jyv-wpCard{position:relative;display:flex;flex-direction:row;align-items:stretch;gap:6px;box-sizing:border-box;width:var(--jyv-wp-card-w);height:64px;min-width:0;padding:6px;border:1px solid var(--jyv-brd);background:var(--jyv-card);border-radius:10px;color:var(--jyv-text);font-size:12px;cursor:pointer;text-align:left;overflow:hidden}
.jyv-wpCard:hover{border-color:var(--jyv-accent);background:var(--jyv-card-hover);box-shadow:var(--jyv-glow,none)}
.jyv-wpPlaceholder{border-style:dashed;border-color:var(--dsw-alias-border-l1);background:transparent;cursor:default;pointer-events:none}
/* \u5DE6\u5217\u6A21\u578B\u6E32\u67D3\u533A\uFF084.4\uFF09\uFF1A48px \u5BBD\uFF1B128px \u5FEB\u7167\u6E90 object-fit contain \u6536\u7EB3 */
.jyv-wpFig{position:relative;flex:none;width:48px;border-radius:6px;overflow:hidden;background:color-mix(in srgb,var(--jyv-brd) 22%,transparent)}
.jyv-wpPreview{position:absolute;inset:2px;display:block;width:calc(100% - 4px);height:calc(100% - 4px);object-fit:contain;pointer-events:none;filter:drop-shadow(0 1px 2px rgba(0,0,0,.45));user-select:none}
/* \u53F3\u5217\u6587\u5B57\u6808\uFF084.4\uFF09\uFF1A\u72B6\u6001\u70B9 + \u6807\u9898 / todo \u8FDB\u5EA6 / \u{1F41D}\u89D2\u6807 + \u8702\u79CD\u5FBD\u7AE0\uFF08~52px \u5BBD\uFF0C
   \u6807\u9898\u622A\u65AD\u60AC\u505C\u5B8C\u6574\uFF09 */
.jyv-wpBody{flex:1;display:flex;min-width:0;flex-direction:column;justify-content:center;gap:3px}
.jyv-wpCardHead{display:flex;align-items:center;gap:4px;min-width:0}
.jyv-wpName{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;font-size:11px;text-shadow:0 1px 2px rgba(0,0,0,.35)}
.jyv-wpMeta{display:flex;align-items:center;gap:4px;min-width:0}
.jyv-wpDrones{flex:none;color:var(--jyv-text-dim);font-size:10px;font-variant-numeric:tabular-nums;line-height:14px;text-shadow:0 1px 2px rgba(0,0,0,.35)}
.jyv-wpTodos{display:flex;align-items:center;gap:4px;color:var(--jyv-text-dim);font-size:10px}
.jyv-wpTodos .jyv-cardTodosBar{height:3px}
.jyv-wpTodosVal{flex:none;font-variant-numeric:tabular-nums}
.jyv-wpBadge{flex:none;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 5px;border-radius:7px;background:color-mix(in srgb,var(--jyv-accent) 26%,transparent);color:var(--jyv-text);font-size:10px;line-height:14px}
.jyv-wpEmpty{flex:1;display:flex;align-items:center;justify-content:center;padding:18px;color:var(--jyv-text-dim);font-size:12px;text-align:center}
/* \u2500\u2500 \u6846\u9009\u77E9\u5F62\u5C42\uFF08hive-marquee-and-card-rework 2.3\uFF09\uFF1AcanvasWrap \u5185 absolute \u8986\u76D6\uFF0C
      accent \u63CF\u8FB9 + \u4F4E\u900F\u660E\u586B\u5145\uFF1Bpointer-events:none\uFF08SHALL NOT \u53C2\u4E0E\u753B\u5E03\u62FE\u53D6\uFF09\uFF1B
      \u663E\u793A/\u4F4D\u7F6E\u7531 MarqueeOverlay \u547D\u4EE4\u5F0F\u5199 style\uFF08\u62D6\u62FD\u9AD8\u9891\u8DEF\u5F84\u96F6 React \u91CD\u6E32\u67D3\uFF09\u3002 \u2500\u2500 */
.jyv-marquee{position:absolute;z-index:40;box-sizing:border-box;display:none;border:1px solid var(--jyv-accent);border-radius:2px;background:color-mix(in srgb,var(--jyv-accent) 14%,transparent);pointer-events:none}
/* \u2500\u2500 \u4F5C\u6218\u62A5\u544A\u9762\u677F\uFF08hive-combat-log D6\uFF09\uFF1AcanvasWrap \u5185 absolute \u5DE6\u4E0B\uFF0C\u76F4\u63A5\u8D34\u5E95
      \uFF08bottom \u56FA\u5B9A 10px\uFF0C\u4E0D\u518D\u7528\u9053\u5177\u680F\u907F\u8BA9\u7B97\u5F0F\u2014\u2014\u4E4B\u524D var(--jyv-hb-rows,2) \u5728\u9053\u5177\u680F
      \u672A\u6E32\u67D3\u65F6\u56DE\u843D 2 \u884C\uFF0C\u628A\u9762\u677F\u62AC\u79BB\u5DE6\u4E0B\u89D2\uFF09\u3002
      \u5E95\u56FE\u900F\u660E\uFF08\u65E0\u80CC\u666F\u5361\u7247/border/\u9634\u5F71\uFF09\uFF0C\u6587\u5B57\u76F4\u63A5\u6D6E\u4E8E\u753B\u5E03\u4E4B\u4E0A\u3002 \u2500\u2500 */
.jyv-combatLog{position:absolute;left:10px;bottom:10px;z-index:30;width:280px;display:flex;flex-direction:column;box-sizing:border-box;background:transparent;pointer-events:auto;overflow:hidden;text-shadow:0 1px 2px rgba(0,0,0,.5)}
/* \u6298\u53E0\u6001 = \u5C0F\u80F6\u56CA + \u672A\u8BFB\u5FBD\u6570 */
.jyv-combatLog[data-collapsed="true"]{width:auto;display:inline-flex;flex-direction:row;align-items:center;background:transparent}
.jyv-combatLogPill{display:inline-flex;align-items:center;gap:6px;border:none;background:transparent;color:var(--dsw-alias-label-primary);font-size:12px;font-weight:600;cursor:pointer;padding:6px 10px;border-radius:999px;line-height:18px;text-shadow:0 1px 2px rgba(0,0,0,.5)}
.jyv-combatLogPill:hover{background:var(--dsw-alias-interactive-bg-hover)}
.jyv-combatLogBadge{min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--dsw-alias-state-error-primary);color:#fff;font-size:11px;font-weight:700;line-height:18px;text-align:center;font-variant-numeric:tabular-nums}
/* \u5C55\u5F00\u6001\u5934\u90E8\uFF08\u900F\u660E\u5E95\uFF0C\u4EC5\u5E95\u90E8\u7EC6\u5206\u9694\u7EBF\uFF09 */
.jyv-combatLogHead{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;background:transparent}
.jyv-combatLogTitle{flex:1;min-width:0;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jyv-combatLogFilter{display:inline-flex;align-items:center;gap:4px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px;cursor:pointer;user-select:none;white-space:nowrap}
.jyv-combatLogFilter input{accent-color:var(--dsw-alias-border-inverted);margin:0;cursor:pointer}
.jyv-combatLogClose{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:14px;line-height:1;cursor:pointer;padding:2px 6px;border-radius:6px;flex:none}
.jyv-combatLogClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.jyv-combatLogClear{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1;cursor:pointer;padding:2px 6px;border-radius:6px;flex:none}
.jyv-combatLogClear:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-state-error-primary)}
/* \u6EDA\u52A8\u5217\u8868\uFF08\u65F6\u95F4\u6B63\u5E8F = \u6700\u65B0\u5728\u5E95\uFF0C\u7EC8\u7AEF\u65E5\u5FD7\u5F0F\uFF0C\u81EA\u52A8\u6EDA\u5E95\uFF1Bthin scrollbar \u6CBF\u65E2\u6709\u7EAA\u5F8B\uFF09\u3002
   \u9AD8\u5EA6\u6052\u4E3A\u9ED8\u8BA4\u884C\u6570\uFF08--jyv-report-rows\uFF0C\u884C\u9AD8 24px\uFF1Apadding 4px\xD72 + line-height 16px\uFF09\uFF0C
   \u4E0D\u968F\u5185\u5BB9\u4F38\u7F29\u2014\u2014\u4E0D\u8DB3\u9ED8\u8BA4\u884C\u6570\u7559\u767D\u3001\u8D85\u51FA\u6EDA\u52A8\u3002 */
.jyv-combatLogList{flex:none;height:calc(var(--jyv-report-rows,8) * 24px + 12px);min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;padding:6px 0;display:flex;flex-direction:column;background:transparent}
.jyv-combatLogEmpty{padding:18px 12px;color:var(--dsw-alias-label-tertiary);font-size:11px;text-align:center}
/* \u901F\u8BFB\u884C\uFF08D6\uFF09\uFF1A\u884C\u9996 HH:MM tabular-nums\u3001\u8702\u540D\u7C97\u4F53\u3001\u9644\u52A0\u4FE1\u606F\u5F31\u5316\u8272 */
.jyv-combatRow{display:flex;align-items:baseline;gap:7px;padding:4px 10px;font-size:12px;line-height:16px;color:var(--dsw-alias-label-primary);animation:jyvCombatIn .18s ease-out}
.jyv-combatTime{flex:none;color:var(--dsw-alias-label-tertiary);font:11px/16px ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-numeric:tabular-nums}
.jyv-combatTitle{flex:none;color:#8fd3ff;font-weight:600;max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-combatVerb{flex:none;font-weight:600}
.jyv-combatBody{flex:1;min-width:0;overflow-wrap:break-word;color:var(--dsw-alias-label-secondary)}
.jyv-combatBody b{font-weight:700;color:var(--dsw-alias-label-primary)}
.jyv-combatExtra{color:var(--dsw-alias-label-tertiary)}
@keyframes jyvCombatIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
/* \u52A8\u8BCD\u914D\u8272\uFF08\u5B57\u9762\u91CF\u4E0E\u573A\u666F\u8272\u540C\u6E90\uFF0C\u89C1 src/hive/bees.mjs STATE_COLORS / palette.mjs PALETTE\uFF09\uFF1A
   \u53EC\u5524=\u9EC4 #ffd44d\uFF08PALETTE.hexFxYellow \u65B0\u8702\u51FA\u573A\u540C\u65CF\uFF09\u3001\u5F00\u59CB=\u84DD #3f8fd6\uFF08STATE_COLORS.busy\uFF09\u3001
   \u5B8C\u6210=\u7EFF #57b26a\uFF08STATE_COLORS.done\uFF09\u3001\u6C42\u52A9=\u7425\u73C0 #e8a13c\uFF08STATE_COLORS.help\uFF09\u3001
   \u5F52\u6863=\u871C\u91D1 #f2b544\uFF08PALETTE.trimColor\uFF09\u3002\u5F02\u5E38\u8272\uFF08--dsw-alias-state-error-primary\uFF09\u4E3A
   \u914D\u8272\u4F53\u7CFB\u5B8C\u6574\u6027\u9884\u7F6E\u9879\uFF0Cv1 \u4E8B\u4EF6\u76EE\u5F55\u4E0D\u4EA7\u751F\u5F02\u5E38\u884C\uFF08\u9519\u8BEF\u4FDD\u7559\u5F39\u6761\uFF09\u3002 */
.jyv-combatRow[data-kind="enterWorker"] .jyv-combatVerb{color:#ffd44d}
.jyv-combatRow[data-kind="dronesNew"] .jyv-combatVerb{color:#ffd44d}
.jyv-combatRow[data-kind="newNest"] .jyv-combatVerb{color:#ffd44d}
.jyv-combatRow[data-kind="start"] .jyv-combatVerb{color:#3f8fd6}
.jyv-combatRow[data-kind="done"] .jyv-combatVerb{color:#57b26a}
.jyv-combatRow[data-kind="dronesDone"] .jyv-combatVerb{color:#57b26a}
.jyv-combatRow[data-kind="help"]{background:color-mix(in srgb,#e8a13c 16%,transparent);border-left:2px solid #e8a13c;padding-left:8px}
.jyv-combatRow[data-kind="help"] .jyv-combatVerb{color:#e8a13c}
.jyv-combatRow[data-kind="archive"] .jyv-combatVerb{color:#f2b544}
.jyv-combatRow[data-kind="receipt"] .jyv-combatVerb{color:var(--dsw-alias-label-tertiary);font-weight:400}
/* \u4F4E\u4F18\u5148\u7EA7\u884C\uFF08\u5DE2\u642C\u79FB/\u91CE\u8702\u51FA\u73B0\uFF09\uFF1A\u6574\u4F53\u5F31\u5316\u4E2D\u6027\uFF1B\u88AB\u8FC7\u6EE4\u5F00\u5173\u9690\u85CF */
.jyv-combatRow[data-low="true"]{color:var(--dsw-alias-label-tertiary)}
.jyv-combatRow[data-low="true"] .jyv-combatVerb{color:var(--dsw-alias-label-tertiary);font-weight:500}
.jyv-combatRow[data-low="true"] .jyv-combatBody{color:var(--dsw-alias-label-tertiary)}
.jyv-combatLog[data-hidelow="true"] .jyv-combatRow[data-low="true"]{display:none}
/* \u51CF\u52A8\u6548\uFF1Areduced \u76F4\u63D2\u65E0\u52A8\u753B\uFF08CSS \u515C\u5E95 + prefers-reduced-motion\uFF09 */
.jyv-combatLog[data-reduced="true"] .jyv-combatRow{animation:none}
@media (prefers-reduced-motion: reduce){
  .jyv-combatRow{animation:none}
  .jyv-statusBar{transition:none}
}
/* \u2500\u2500 \u5B8C\u6210\u72B6\u6001\u680F\uFF08bee-status-cards D2\uFF09\uFF1AcanvasWrap \u5185\u5DE6\u7F18\u5782\u76F4\u5C45\u4E2D\uFF0Cmax-height
      \u6EDA\u52A8\uFF1B\u4E0B\u7F18\u6309 --jyv-statusBarBottom\uFF0876px \u9053\u5177\u680F + \u62A5\u544A\u8BA9\u4F4D reserve\uFF09\u52A8\u6001\u8BA9\u4F4D\u3002
      \u5E95\u56FE\u900F\u660E\u3001\u65E0\u8FB9\u6846\uFF08\u53EA\u4FDD\u7559\u5361\u7247\u4E0E\u6309\u94AE\uFF09\uFF1B\u5B8C\u6210\u4FE1\u606F \u22640 \u65F6\u6574\u680F\u5411\u5DE6\u6ED1\u51FA\u5C4F\u5E55\u5916\uFF0C
      >0 \u65F6\u4ECE\u5C4F\u5E55\u5916\u5411\u53F3\u5207\u5165\uFF08transform transition \u52A8\u6548\uFF09\u3002 \u2500\u2500 */
.jyv-statusBar{position:absolute;left:10px;top:50%;transform:translateY(-50%) translateX(0);z-index:30;display:flex;flex-direction:column;gap:6px;width:158px;max-height:calc(100% - 100px);box-sizing:border-box;padding:6px;pointer-events:auto;bottom:var(--jyv-statusBarBottom,76px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;transition:transform .28s cubic-bezier(.22,.61,.36,1)}
.jyv-statusBar[data-hidden="true"]{transform:translateY(-50%) translateX(calc(-100% - 24px));pointer-events:none}
/* \u51CF\u52A8\u6548\uFF1Areduced \u76F4\u63D2\u5230\u4F4D\u65E0\u6ED1\u5165\u52A8\u753B\uFF08CSS \u515C\u5E95 + prefers-reduced-motion\uFF09 */
.jyv-statusBar[data-reduced="true"]{transition:none}
.jyv-statusCard{position:relative;display:flex;align-items:center;gap:6px;flex:none;box-sizing:border-box;height:32px;padding:0 8px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);border-radius:8px;box-shadow:var(--dsw-shadow-lv2);color:var(--jyv-text);font-size:12px;cursor:pointer;overflow:hidden}
.jyv-statusCard:hover{color:var(--jyv-text)}
.jyv-statusName{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.jyv-statusCount{flex:none;min-width:18px;text-align:center;font-variant-numeric:tabular-nums;font-weight:600;color:var(--jyv-text-dim)}
.jyv-statusCountOn{color:var(--dsw-alias-state-success-primary)}
.jyv-statusSend{flex:none;border:none;background:transparent;color:var(--jyv-accent);font-size:13px;line-height:1;cursor:pointer;padding:4px 6px;border-radius:6px}
.jyv-statusSend:hover:not(:disabled){background:color-mix(in srgb,var(--jyv-text) 9%,transparent)}
.jyv-statusSend:disabled{color:var(--jyv-text-dim);cursor:default}
.jyv-statusDefault{opacity:.72}
/* \u786E\u8BA4\u5F39\u7A97\uFF08D5\uFF09\uFF1A\u8F7B\u91CF\u906E\u7F69\u9762\u677F\uFF0C\u590D\u7528 jyv-modal \u9AA8\u67B6 */
.jyv-statusConfirmBack{z-index:1500}
.jyv-statusConfirm{width:min(420px,92%);height:auto;max-height:70%}
.jyv-statusConfirmHint{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.6;margin-bottom:8px}
.jyv-statusConfirmLabel{font-size:11px;font-weight:700;color:var(--dsw-alias-state-business-primary);letter-spacing:.06em;margin:6px 2px 4px}
.jyv-statusConfirmPrompt{white-space:pre-wrap;word-break:break-word;max-height:200px;overflow-y:auto;margin:0;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace}
.jyv-statusConfirm .jyv-modalHead:last-child{justify-content:flex-end;gap:8px;border-top:1px solid var(--dsw-alias-border-l1);padding-top:8px;margin-top:8px}
/* \u72B6\u6001\u5361\u7247\u8282\u9ED8\u8BA4\u8702\u7070\u7F6E\u884C */
.jyv-hbStatusDefaultRow{opacity:.6;cursor:default}
.jyv-hbStatusDefaultRow .jyv-qcRowHead{cursor:default}
/* \u2500\u2500 \u9876\u90E8\u4F1A\u8BDD\u6982\u8981\u6761\uFF08session-brief-bar 5.2/D4 \u91CD\u8BBE\u8BA1\uFF09\uFF1AcanvasWrap \u9876\u90E8\u5C45\u4E2D\u534A\u900F\u660E
      \u53EA\u8BFB\u5361\u7247\uFF1Bpointer-events \u9650\u5B9A\u6761\u4F53\uFF08\u4E0D\u906E\u6321\u753B\u5E03\u624B\u52BF\uFF0C\u6761\u5916\u4E8B\u4EF6\u7A7F\u900F\uFF09\uFF1B\u6808\u5F0F\u5E03\u5C40\uFF1A
      \u6807\u9898\u884C\uFF08accent \u5706\u70B9 + \u52A0\u7C97\uFF0C\u5355\u884C\u7701\u7565\uFF09\u2192\u300C\u4EFB\u52A1\u300D\u5FBD\u6807\u884C\uFF08\u672B\u56DE\u5408 prompt\uFF09\u2192
      \u300C\u62A5\u544A\u300D\u5FBD\u6807\u884C\uFF08\u672B\u56DE\u5408 response\uFF09\uFF1B\u4EFB\u52A1/\u62A5\u544A\u6B63\u6587\u5404\u6700\u591A 2 \u884C\u6298\u884C\u622A\u65AD\uFF08\u7B2C 2 \u884C
      \u672B\u5C3E\u7701\u7565\u53F7\uFF09\uFF0C\u60AC\u505C title \u63D0\u793A\u5168\u6587\uFF1B\u65E0\u7A7A\u683C\u957F\u4E32\uFF08\u8DEF\u5F84/\u547D\u4EE4\uFF09\u4F9D\u8D56 word-break:break-all
      \u5F3A\u5236\u65AD\u884C\u2014\u2014legacy -webkit-box \u6298\u884C\u7BA1\u7EBF\u4E0D\u8BA4 overflow-wrap:anywhere\u3002 \u2500\u2500 */
.jyv-briefBar{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:30;display:flex;flex-direction:column;gap:4px;max-width:min(66%,620px);box-sizing:border-box;padding:7px 12px;border-radius:14px;background:color-mix(in srgb,var(--jyv-plate) 92%,transparent);border:1px solid var(--jyv-brd);box-shadow:var(--dsw-shadow-lv2);color:var(--jyv-text);font-size:12px;line-height:18px;pointer-events:auto;user-select:none;overflow:hidden}
.jyv-briefHead{display:flex;align-items:center;gap:6px;min-width:0}
.jyv-briefDot{flex:none;width:6px;height:6px;border-radius:99px;background:var(--jyv-accent)}
.jyv-briefTitle{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.jyv-briefRow{display:flex;align-items:flex-start;gap:8px;min-width:0}
.jyv-briefKey{flex:none;box-sizing:border-box;min-width:38px;margin-top:1px;padding:0 7px;border-radius:7px;background:color-mix(in srgb,var(--jyv-accent) 14%,transparent);color:var(--jyv-text-dim);font-size:10px;font-weight:600;line-height:16px;text-align:center;letter-spacing:1px}
.jyv-briefText{flex:1 1 auto;min-width:0;overflow:hidden;color:var(--jyv-text-dim);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;white-space:normal;word-break:break-all;overflow-wrap:anywhere}
/* \u2500\u2500 \u60AC\u505C tips \u5C42\uFF08hive-interaction-polish 6.3/D5\uFF09\uFF1A\u77AC\u6001 DOM \u5C42\uFF08cardRoot \u5144\u5F1F\uFF09\uFF0C
      \u6574\u5C42 pointer-events:none\uFF08SHALL NOT \u5E72\u6270\u62FE\u53D6\u4E0E\u5361\u7247\u70B9\u51FB\uFF09\uFF1B\u6307\u9488\u65C1\u504F\u79FB\u907F\u8BA9
      \u8702\u9876\u6C14\u6CE1\u5361\uFF1B\u516D\u5B57\u6BB5 rows\uFF08\u7C7B\u578B\u5FBD\u7AE0 + \u952E\u503C\u5BF9\uFF09\uFF0C\u7F3A\u5931\u503C\u4EE5\u300C-\u300D\u5360\u4F4D\u3002 \u2500\u2500 */
.jyv-tips{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:40}
.jyv-tip{position:absolute;top:0;left:0;min-width:150px;max-width:250px;box-sizing:border-box;padding:8px 11px;border-radius:10px;background:var(--jyv-plate);border:1px solid var(--jyv-brd);box-shadow:var(--dsw-shadow-lv3);font-size:12px;color:var(--jyv-text);will-change:transform}
.jyv-tipType{display:inline-flex;align-items:center;max-width:100%;box-sizing:border-box;height:18px;padding:0 7px;border-radius:9px;background:color-mix(in srgb,var(--jyv-accent) 26%,transparent);font-weight:600;font-size:11px;line-height:18px;margin-bottom:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jyv-tipRow{display:flex;align-items:baseline;gap:8px;line-height:18px;max-width:100%}
.jyv-tipKey{flex:none;color:var(--jyv-text-dim);font-size:11px}
.jyv-tipVal{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums}
/* \u56FE\u4F8B\u952E\u76D8\u624B\u52BF\u63D0\u793A\u9879\uFF08hive-interaction-polish 8.1\uFF09\uFF1A\u4E0E\u72B6\u6001\u56FE\u4F8B\u540C\u884C\uFF0C\u5F31\u5316\u8272 */
.jyv-legendKey{color:var(--dsw-alias-label-tertiary)}
`;var Tw=200,Ew=2e3,Aw="dsh-v-hive:combat-log",st=Object.freeze({enterWorker:"enterWorker",start:"start",done:"done",help:"help",dronesNew:"dronesNew",dronesDone:"dronesDone",archive:"archive",newNest:"newNest",nestMove:"nestMove",wildBee:"wildBee",receipt:"receipt"}),XC=new Set([st.nestMove,st.wildBee]);function Cw(i,e){let t=new Map,n=new Set,s=new Set(e?.archivedSessionIds??[]),r=new Map,a=new Map;for(let l of i?.studios??[]){n.add(l.workspaceId),r.set(l.workspaceId,l.center??null);for(let c of l.bees??[])t.set(c.sessionId,c.state??wt.idle)}for(let l of e?.items??[])n.add(l.workspaceId),r.has(l.workspaceId)||r.set(l.workspaceId,null);for(let l of i?.studios??[])for(let c of l.bees??[])for(let h of c.drones??[])a.set(h.sessionId,c.sessionId),t.set(h.sessionId,h.state??wt.idle);let o=new Set;for(let l of i?.wildBees??[])t.set(l.sessionId,l.state??wt.idle),o.add(l.sessionId);return{sessionState:t,workspaceIds:n,archived:s,centers:r,droneParent:a,wildSessions:o,lastEmitAt:new Map,lastEmitState:new Map}}function Rw(i,e){let t=new Map,n=new Set,s=new Set(e?.archivedSessionIds??[]),r=new Map,a=new Set,o=new Map,l=new Map;for(let c of i?.studios??[]){n.add(c.workspaceId),r.set(c.workspaceId,c.center??null);for(let h of c.bees??[]){t.set(h.sessionId,h.state??wt.idle),l.set(h.sessionId,c.title??"");for(let d of h.drones??[])t.set(d.sessionId,d.state??wt.idle),o.set(d.sessionId,h.sessionId),l.set(d.sessionId,c.title??"")}for(let h of c.cups??[])l.set(h.sessionId,c.title??"")}for(let c of e?.items??[])n.add(c.workspaceId),r.has(c.workspaceId)||r.set(c.workspaceId,null);for(let c of i?.wildBees??[])t.set(c.sessionId,c.state??wt.idle),a.add(c.sessionId);return{sessionState:t,workspaceIds:n,archived:s,centers:r,wildSessions:a,droneParent:o,sessionTitles:l}}function Iw(i,e){let t=e?.world??{},n=e?.workspaces??{items:[],archivedSessionIds:[]},s=e?.now??Date.now();if(!i)return{events:[],baseline:{...Cw(t,n),builtAt:s},now:s};let r=Rw(t,n),a=[],o=p=>a.push(p),l=new Set;for(let p of t?.studios??[])for(let x of p.bees??[])x.droneStandIn||(i.sessionState.has(x.sessionId)||o({key:"enter:"+x.sessionId,kind:st.enterWorker,low:!1,sessionId:x.sessionId,name:x.displayTitle,title:p.title??""}),l.add(x.sessionId));let c=[];for(let[p,x]of r.sessionState){let _=i.sessionState.has(p)?i.sessionState.get(p):null;_!==null&&x!==_&&c.push({sid:p,prevState:_,state:x})}let h=new Set;for(let p of t?.studios??[])for(let x of p.bees??[]){x.droneStandIn&&h.add(x.sessionId);for(let _ of x.drones??[])h.add(_.sessionId)}for(let p of t?.wildBees??[])p.droneStandIn&&h.add(p.sessionId);for(let p of c){if(p.state!==wt.help&&h.has(p.sid))continue;let x=p.state===wt.help,_=i.lastEmitState?.has(p.sid)??!1,y=i.lastEmitAt?.get(p.sid)??0,E=i.lastEmitState?.get(p.sid)??null,A=_&&s-y<Ew;if(x){let R="state:"+p.sid+":"+p.prevState+">"+p.state;o({key:R,kind:st.help,low:!1,sessionId:p.sid,from:p.prevState,to:p.state,title:r.sessionTitles.get(p.sid)??""})}else if(!A&&p.state!==E){let R=p.state===wt.busy?st.start:p.state===wt.done?st.done:null;R&&o({key:"state:"+p.sid+":"+p.prevState+">"+p.state,kind:R,low:!1,sessionId:p.sid,from:p.prevState,to:p.state,title:r.sessionTitles.get(p.sid)??""})}}let d=new Map;for(let p of t?.studios??[])for(let x of p.bees??[]){for(let _ of x.drones??[])if(!i.sessionState.has(_.sessionId)){let y=x.sessionId;d.has(y)||d.set(y,[]),d.get(y).push(_.sessionId)}if(x.droneStandIn&&!i.sessionState.has(x.sessionId)){let _="__standin__"+(p.workspaceId??"?");d.has(_)||d.set(_,[]),d.get(_).push(x.sessionId)}}for(let p of t?.wildBees??[])if(p.droneStandIn&&!i.sessionState.has(p.sessionId)){let x="__standin__"+p.sessionId;d.set(x,[p.sessionId])}for(let[p,x]of d)o({key:"drones-new:"+p+":"+x.slice().sort().join(","),kind:st.dronesNew,low:!1,sessionId:p,count:x.length,title:r.sessionTitles.get(p)??""});let u=new Map,f=(p,x)=>{let _=i.sessionState.get(p);r.sessionState.get(p)===wt.done&&_!==wt.done&&(u.has(x)||u.set(x,[]),u.get(x).push(p))};for(let p of t?.studios??[])for(let x of p.bees??[]){for(let _ of x.drones??[])f(_.sessionId,x.sessionId);x.droneStandIn&&f(x.sessionId,"__standin__"+(p.workspaceId??"?"))}for(let p of t?.wildBees??[])p.droneStandIn&&f(p.sessionId,"__standin__wild");for(let[p,x]of u)o({key:"drones-done:"+p+":"+x.slice().sort().join(","),kind:st.dronesDone,low:!1,sessionId:p,count:x.length,title:r.sessionTitles.get(p)??""});for(let p of r.archived)i.archived.has(p)||o({key:"archive:"+p,kind:st.archive,low:!1,sessionId:p,title:r.sessionTitles.get(p)??""});for(let p of r.workspaceIds)if(!i.workspaceIds.has(p)){let x=(n?.items??[]).find(_=>_.workspaceId===p);o({key:"ws-new:"+p,kind:st.newNest,low:!1,workspaceId:p,title:x?.title})}for(let[p,x]of r.centers){let _=i.centers.get(p);if(x&&_&&(x.q!==_.q||x.r!==_.r)){let y=(n?.items??[]).find(E=>E.workspaceId===p);o({key:"ws-move:"+p+":"+_.q+","+_.r+">"+x.q+","+x.r,kind:st.nestMove,low:!0,workspaceId:p,title:y?.title??""})}}for(let p of r.wildSessions)if(!i.wildSessions.has(p)){let x=(t?.wildBees??[]).find(_=>_.sessionId===p);o({key:"wild:"+p,kind:st.wildBee,low:!0,sessionId:p,name:x?.displayTitle})}let m=new Map(i.lastEmitAt??[]),v=new Map(i.lastEmitState??[]);for(let p of a)(p.kind===st.help||p.kind===st.start||p.kind===st.done)&&(m.set(p.sessionId,s),v.set(p.sessionId,p.to));let g={sessionState:r.sessionState,workspaceIds:r.workspaceIds,archived:r.archived,centers:r.centers,droneParent:r.droneParent,wildSessions:r.wildSessions,lastEmitAt:m,lastEmitState:v,builtAt:s};return{events:a,baseline:g,now:s}}var lh=class{constructor(e={}){this.cap=e.cap??Tw,this.now=e.now??(()=>Date.now()),this.storage=e.storage!==void 0?e.storage:typeof localStorage<"u"&&localStorage?localStorage:null,this.storageKey=e.storageKey??Aw,this.baseline=null,this.entries=[],this.seq=0,this.unread=0,this.collapsed=!1,this.version=0,this.listeners=new Set,this.restore()}restore(){if(!this.storage)return;let e=null;try{e=this.storage.getItem(this.storageKey)}catch{return}if(e==null)return;let t=null;try{t=JSON.parse(e)}catch{return}if(Array.isArray(t)){this.entries=t.filter(n=>n&&typeof n=="object"&&typeof n.seq=="number").slice(-this.cap);for(let n of this.entries)typeof n.seq=="number"&&n.seq>this.seq&&(this.seq=n.seq)}}persist(){if(this.storage)try{this.storage.setItem(this.storageKey,JSON.stringify(this.entries))}catch{}}clear(){this.entries=[],this.unread=0,this.persist(),this.notify()}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}getSnapshot(){return this.version}notify(){this.version+=1;for(let e of[...this.listeners])try{e()}catch{}}ingest(e){let t=Iw(this.baseline,{...e,now:this.now()});this.baseline=t.baseline;for(let n of t.events)this.push(n);return t.events}push(e){if(!e||!e.key)return!1;for(let n of this.entries)if(n.key===e.key)return!1;let t={seq:++this.seq,ts:this.now(),key:e.key,kind:e.kind,low:e.low===!0,sessionId:e.sessionId??null,name:e.name??null,count:e.count??null,from:e.from??null,to:e.to??null,workspaceId:e.workspaceId??null,title:e.title??null,text:e.text??null};return this.entries.push(t),this.entries.length>this.cap&&this.entries.splice(0,this.entries.length-this.cap),this.collapsed&&(this.unread+=1),this.persist(),this.notify(),!0}pushReceipt(e){return this.push({key:"toast:"+String(e),kind:st.receipt,low:!1,text:String(e)})}setCollapsed(e){let t=e===!0;t!==this.collapsed&&(this.collapsed=t,t||(this.unread=0),this.notify())}list(){return this.entries.slice()}};var M=require("react/jsx-runtime"),Fg="dsh-v-hive",vo="dsh-hive";function Bg(i){let e=Math.round(Number(i));return Number.isFinite(e)?Math.min(ms[1],Math.max(ms[0],e)):8}var Nw={current:null},Pn={open:!1,listeners:new Set,getSnapshot(){return this.open},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},set(i){if(this.open!==i){this.open=i;for(let e of[...this.listeners])try{e()}catch{}}}};function zg(){return(0,de.useSyncExternalStore)(i=>Pn.subscribe(i),()=>Pn.getSnapshot())}var Wd={id:null,listeners:new Set,getSnapshot(){return this.id},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},set(i){if(this.id!==i){this.id=i;for(let e of[...this.listeners])try{e()}catch{}}}},qd={selection:null,listeners:new Set,getSnapshot(){return this.selection},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},set(i){let e=i&&typeof i=="object"?{kind:i.kind,id:i.id}:null;if(JSON.stringify(this.selection)!==JSON.stringify(e)){this.selection=e;for(let t of[...this.listeners])try{t()}catch{}}}},yo={version:0,listeners:new Set,getSnapshot(){return this.version},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},bump(){this.version+=1;for(let i of[...this.listeners])try{i()}catch{}}},hh={version:0,map:{},listeners:new Set,getSnapshot(){return this.version},getMap(){return this.map},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},set(i,e){if(this.map[i]!==e){this.map={...this.map,[i]:e},this.version+=1;for(let t of[...this.listeners])try{t()}catch{}}}},Ui={ids:[],set:new Set,version:0,listeners:new Set,getSnapshot(){return this.version},getIds(){return this.ids},getSet(){return this.set},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},commit(i){let e=Array.isArray(i)?i:[];if(!(e.length===this.ids.length&&e.every((t,n)=>t===this.ids[n]))){this.ids=e,this.set=new Set(e),this.version+=1;for(let t of[...this.listeners])try{t()}catch{}}}},dh={rect:null,listeners:new Set,subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},set(i){this.rect=i;for(let e of[...this.listeners])try{e()}catch{}}},Yr=[];function Hg(i,e){Yd(i),Yr.push({id:i,guard:e})}function Yd(i){let e=Yr.findIndex(t=>t.id===i);e!==-1&&Yr.splice(e,1)}function kg(){return Yr.length?Yr[Yr.length-1].guard:null}var tn={sessionId:null,inputActions:null,input:null,phase:"plain",sig:0,listeners:new Set,getSnapshot(){return this.sig},subscribe(i){return this.listeners.add(i),()=>this.listeners.delete(i)},notify(){this.sig+=1;for(let i of[...this.listeners])try{i()}catch{}}};function Lw(i){let e=i.session??null,t=i.input??null,n=i.inputActions??null,s=t!==null&&typeof t.phase=="string"?t.phase:"plain",r=e?.sessionId!==tn.sessionId||s!==tn.phase||!!n!=!!tn.inputActions;if(tn.sessionId=e?.sessionId??null,tn.inputActions=n,tn.input=t,tn.phase=s,r){let a=()=>tn.notify();typeof queueMicrotask=="function"?queueMicrotask(a):setTimeout(a,0)}return(0,de.useEffect)(()=>()=>{tn.sessionId=null,tn.inputActions=null,tn.input=null,tn.phase="plain",tn.notify()},[]),null}function Og(i,e){let t=tn;if(!t.inputActions||t.sessionId!==i||t.phase!=="plain")return!1;let n=t.input!==null&&typeof t.input.draft=="string"?t.input.draft:"";return t.inputActions.setDraft(zd(n,e)),!0}function Dw(){return new Promise(i=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>i()):setTimeout(i,16)})}var Vg=3e3,Gg=400,Fw=120;function fh(i){try{vi.current?.actions.selectBee?.(i)}catch{}}async function Xd(i,e,t=Vg){let n=Date.now()+t,s=0;for(;;){if(vi.current?.actions.seedDraft?.(i,e))return fh(i),!0;let r=Date.now();if(r>=n)return!1;r-s>=Gg&&(s=r,fh(i)),await new Promise(a=>setTimeout(a,Fw))}}async function uh(i,e,t=Vg){if(Og(i,e))return!0;fh(i);let n=Date.now()+t,s=Date.now();for(;Date.now()<n;){if(await Dw(),Og(i,e))return!0;let r=Date.now();r-s>=Gg&&(s=r,fh(i))}return!1}var kw={"hive.title":"\u8702\u5DE2\u6307\u6325\u4E2D\u5FC3","hive.seat":"Hive","hive.seat.aria":"\u6253\u5F00\u8702\u5DE2\u6307\u6325\u4E2D\u5FC3","hive.fullscreen":"\u5168\u5C4F\u5DE1\u68C0","hive.exitFullscreen":"\u9000\u51FA\u5168\u5C4F\uFF08Esc\uFF09","hive.spinToggle":"\u53F3\u952E\u65CB\u8F6C","hive.spinToggle.tooltip":"\u5F00\u542F\u540E\uFF1A\u53F3\u952E\u62D6\u62FD = \u65B9\u4F4D\u65CB\u8F6C\uFF08\u4FEF\u4EF0\u9501\u5B9A\u4E3A\u8BBE\u7F6E\u503C\uFF09\uFF1B\u5173\u95ED\uFF08\u9ED8\u8BA4\uFF09= \u53F3\u952E\u62D6\u62FD = \u5168\u5411\u5E73\u79FB\uFF1B\u4E2D\u952E\u62D6\u62FD\u6052\u4E3A\u5E73\u79FB","hive.editToggle":"\u8702\u5DE2\u7F16\u8F91","hive.editToggle.tooltip":"\u5F00\u542F\u540E\uFF1A\u5148\u70B9\u9009\u4E00\u4E2A\u8702\u5DE2\uFF0C\u518D\u62D6\u52A8\u5B83\u642C\u5DE2\uFF1B\u5173\u95ED\u65F6\u62D6\u5DE2\u65E0\u52A8\u4F5C\uFF08\u76F8\u673A\u624B\u52BF\u5DF2\u96C6\u4E2D\u5230\u53F3\u952E\uFF09","hive.legend":"\u56FE\u4F8B","hive.state.idle":"\u5F85\u547D","hive.state.busy":"\u5FD9\u788C","hive.state.help":"\u7B49\u5F85\u4F60","hive.state.done":"\u5E26\u871C\u5F52","hive.pin":"\u9489\u4F4F\u5361\u7247","hive.shrink":"\u6536\u8D77\u5361\u7247","hive.collapse":"\u6298\u53E0\u65E0\u4EBA\u673A","hive.openSession":"\u6253\u5F00\u4F1A\u8BDD","hive.archive":"\u5F52\u6863","hive.archivedTag":"\u5DF2\u5F52\u6863 \xB7 \u50A8\u871C\u53EA\u8BFB","hive.todos":"todo {done}/{total}","hive.runningCount":"\u8FD0\u884C\u4E2D {n}","hive.activeCount":"\u6D3B\u8DC3 {n}","hive.time.now":"\u521A\u521A","hive.time.min":"{n} \u5206\u949F\u524D","hive.time.hour":"{n} \u5C0F\u65F6\u524D","hive.time.day":"{n} \u5929\u524D","hive.menu.newSession":"\u65B0\u4F1A\u8BDD","hive.menu.openDir":"\u5728\u7CFB\u7EDF\u4E2D\u6253\u5F00\u76EE\u5F55","hive.menu.archive":"\u5F52\u6863\u871C\u8702","hive.toast.newSession":"\u5DF2\u5728\u65B0\u5DE2\u5F00\u4F1A","hive.toast.archived":"\u871C\u8702\u5DF2\u5316\u871C\u5F52\u4ED3","hive.toast.openDir":"\u5DF2\u5728\u7CFB\u7EDF\u4E2D\u6253\u5F00\u76EE\u5F55","hive.toast.moveSaved":"\u8702\u5DE2\u5DF2\u642C\u79FB","hive.toast.moveConflict":"\u5E03\u5C40\u88AB\u5176\u5B83\u9875\u7B7E\u4FEE\u6539\uFF0C\u5DF2\u5408\u5E76\u91CD\u653E","hive.toast.moveInvalid":"\u843D\u70B9\u4F1A\u4E0E\u90BB\u5DE2\u53E0\u52A0\uFF0C\u5DF2\u53D6\u6D88","hive.toast.adoptUnavailable":"\u8BE5\u4F1A\u8BDD\u9489\u5728\u81EA\u5DF1\u7684\u5DE2\u91CC\uFF08cwd \u51B3\u5B9A\u5F52\u5C5E\uFF09\uFF0C\u65E0\u6CD5\u6362\u5DE2","hive.toast.adoptSelf":"\u5DF2\u91CD\u6392\u5230\u5DE2\u9996","hive.toast.fail":"\u64CD\u4F5C\u5931\u8D25","hive.fallback.title":"3D \u8702\u5DE2\u4E0D\u53EF\u7528","hive.fallback.body":"3D \u573A\u666F\u4E0D\u53EF\u7528\u6216\u5DF2\u5728\u8BBE\u7F6E\u4E2D\u9009\u62E9 2D \u964D\u7EA7\u3002\u53EF\u6539\u7528\u4FA7\u8FB9\u680F\u4F1A\u8BDD\u5217\u8868\uFF0C\u6216\u5728\u8BBE\u7F6E\u4E2D\u5207\u56DE WebGL\u3002","hive.fallback.retry":"\u91CD\u8BD5 WebGL","hive.settings.anim":"\u52A8\u6001\u6548\u679C","hive.settings.animHint":"\u8DDF\u968F\u7CFB\u7EDF = \u7CFB\u7EDF\u5F00\u542F\u300C\u51CF\u5C11\u52A8\u6001\u300D\u65F6\u505C\u6301\u7EED\u52A8\u753B\uFF1B\u5F3A\u5236\u5F00\u542F = \u5FFD\u7565\u7CFB\u7EDF\u8BBE\u7F6E\uFF0C\u5F53\u524D\u9875\u59CB\u7EC8\u64AD\u653E","hive.settings.renderer":"\u6E32\u67D3","hive.settings.rendererHint":"\u5F3A\u5236 2D \u964D\u7EA7\u65F6\u4E0D\u542F\u52A8 3D \u573A\u666F\uFF0C\u4EC5\u5448\u73B0\u9759\u6001\u964D\u7EA7\u5361","hive.settings.rendererWebgl":"WebGL\uFF08\u5931\u8D25\u81EA\u52A8\u964D\u7EA7\uFF09","hive.settings.renderer2d":"2D \u964D\u7EA7\uFF08\u65E0 3D \u573A\u666F\uFF09","hive.settings.showFps":"FPS \u8BA1\u6570","hive.settings.showFpsHint":"\u753B\u5E03\u5DE6\u4E0A\u89D2\u5E27\u7387\u8BFB\u6570\uFF08\u8C03\u8BD5\u7528\uFF09","hive.settings.cameraPitch":"\u76F8\u673A\u4FEF\u89D2","hive.settings.cameraPitchHint":"\u4FEF\u4EF0\u9501\u5B9A\u4E3A\u8BE5\u503C\uFF1A\u65CB\u8F6C/\u5E73\u79FB/\u7F29\u653E/\u805A\u7126\u90FD\u4E0D\u6539\u53D8\u4FEF\u4EF0\uFF1B\u9ED8\u8BA4 45\xB0\uFF0C\u8303\u56F4 15\xB0\u201370\xB0","hive.settings.drones":"\u65E0\u4EBA\u673A","hive.drones.activeOnly":"\u4EC5\u6D3B\u8DC3","hive.drones.all":"\u5168\u90E8\u663E\u793A","hive.settings.watermark":"\u5E95\u56FE\u6C34\u5370","hive.settings.hotkey":"\u5FEB\u6377\u952E","hive.settings.follow":"\u955C\u5934\u8DDF\u968F\u5F53\u524D\u4F1A\u8BDD","hive.settings.followHint":"\u5207\u6362\u4F1A\u8BDD\u4E0E\u6253\u5F00\u8702\u5DE2\u9875\u65F6\u955C\u5934\u81EA\u52A8\u5E73\u79FB\u5B9A\u4F4D\u5230\u5BF9\u5E94\u871C\u8702\uFF08\u9ED8\u8BA4\u5F00\uFF09","hive.settings.title":"\u8BBE\u7F6E","hive.settings.close":"\u5173\u95ED","hive.qc.moveUp":"\u4E0A\u79FB","hive.qc.moveDown":"\u4E0B\u79FB","hive.qc.save":"\u4FDD\u5B58","hive.qc.saving":"\u4FDD\u5B58\u4E2D\u2026","hive.qc.saveFailed":"\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","hive.qc.confirmDiscard":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\uFF0C\u653E\u5F03\u5E76\u5173\u95ED\uFF1F","hive.qc.discard":"\u653E\u5F03\u4FEE\u6539","hive.qc.keepEditing":"\u7EE7\u7EED\u7F16\u8F91","hive.settings.navScene":"\u573A\u666F","hive.settings.navAppearance":"\u5916\u89C2","hive.settings.navLayout":"\u5E03\u5C40","hive.settings.layoutPanelGroup":"\u8986\u76D6\u9762\u677F\uFF08\u53F3\u4FA7\u8702\u7FA4\u9635\u5217\uFF09","hive.settings.layoutPanelM":"\u5217\u6570 m","hive.settings.layoutPanelN":"\u884C\u6570 n","hive.settings.layoutBarGroup":"\u9053\u5177\u680F\uFF08\u5E95\u90E8\u9635\u5217\uFF09","hive.settings.layoutBarM":"\u5217\u6570 m","hive.settings.layoutBarN":"\u884C\u6570 n","hive.settings.reportGroup":"\u4F5C\u6218\u62A5\u544A\uFF08\u5DE6\u4E0B\u89D2\u9762\u677F\uFF09","hive.settings.reportRows":"\u53EF\u89C6\u884C\u6570","hive.settings.reportRowsHint":"\u9762\u677F\u951A\u5B9A\u5DE6\u4E0B\u89D2\uFF1B\u5217\u8868\u6309\u884C\u6570\u5B9A\u9AD8\uFF0C\u8D85\u51FA\u6EDA\u52A8","hive.settings.layoutHint":"\u8C03\u6574\u5373\u65F6\u751F\u6548\uFF0C\u4EC5\u4FDD\u5B58\u5728\u672C\u9875\u7B7E","hive.settings.resetAll":"\u6062\u590D\u9ED8\u8BA4","hive.hb.title":"\u6307\u4EE4\u7F16\u8F91","hive.hb.close":"\u5173\u95ED\u6307\u4EE4\u7F16\u8F91","hive.hb.tabHive":"\u5DE2\u680F","hive.hb.tabBee":"\u8702\u680F","hive.hb.tabFloor":"\u5730\u677F\u680F","hive.hb.add":"\u65B0\u589E\u69FD\u4F4D","hive.hb.empty":"\u8FD8\u6CA1\u6709\u69FD\u4F4D\u2014\u2014\u70B9\u51FB\u300C\u65B0\u589E\u69FD\u4F4D\u300D\u521B\u5EFA\u3002","hive.hb.namePlaceholder":"\u540D\u79F0\uFF08\u5982\uFF1A\u53EC\u5524\u8BBE\u8BA1\u8702\uFF09","hive.hb.delete":"\u5220\u9664","hive.hb.summon":"\u53EC\u5524\u65B0\u8702","hive.hb.summonHint":"\u52FE\u9009\u540E\u70B9\u51FB\u5361\u7247\u53EC\u5524\u65B0\u8702\uFF1B\u4E0D\u52FE\u9009\u5219\u5361\u7247\u4E3A\u7981\u7528\u6001\uFF08\u9884\u7559\u540E\u7EED\u5DE2\u7EA7\u52A8\u4F5C\uFF09","hive.hb.createBee":"\u5EFA\u5DE2\u540E\u521B\u5EFA\u65B0\u8702","hive.hb.createBeeHint":"\u53D6\u6D88\u52FE\u9009 = \u7EAF\u5EFA\u5DE2\uFF08\u7A7A\u5DE2\u843D\u5730\uFF0C\u4E0D\u5EFA\u8702\uFF09","hive.hb.beeType":"\u65B0\u8702\u79CD","hive.hb.beeTypeDefault":"\u673A\u68B0\u8702","hive.hb.prompt":"\u9884\u8BBE\u63D0\u793A\u8BCD","hive.hb.promptRequired":"\u5FC5\u586B","hive.hb.promptPlaceholder":"\u63D0\u793A\u8BCD\uFF08\u53D1\u7ED9\u65B0\u8702\u6216\u5F53\u524D\u4F1A\u8BDD\uFF09","hive.hb.autoSend":"\u81EA\u52A8\u53D1\u9001","hive.hb.autoSendHint":"\u52FE\u9009\u540E\u70B9\u51FB\u5361\u7247\u76F4\u63A5\u53D1\u9001\uFF1B\u4E0D\u52FE\u9009\u5219\u586B\u5165\u8F93\u5165\u6846\u4F9B\u5BA1\u67E5\u56DE\u8F66","hive.hb.pureSummonHint":"\u63D0\u793A\u8BCD\u7559\u7A7A = \u7EAF\u53EC\u5524\uFF08\u53EA\u5EFA\u8702\u4E0D\u53D1\u6D88\u606F\uFF09","hive.hb.summonOffHint":"\u53EC\u5524\u5173\u95ED\uFF1A\u63D0\u793A\u8BCD\u4E0D\u63A5\u53D7\uFF0C\u5361\u7247\u5728\u9053\u5177\u680F\u4E3A\u7981\u7528\u6001","hive.hb.overflow":"\u8D85\u51FA\u9635\u5217\u5BB9\u91CF {n} \u4E2A\u69FD\u4F4D\u2014\u2014\u4FDD\u5B58\u5141\u8BB8\uFF0C\u4F46\u8D85\u51FA\u90E8\u5206\u4E0D\u5728\u9053\u5177\u680F\u6E32\u67D3","hive.hb.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539","hive.hb.saveStale":"\u4FDD\u5B58\u672A\u88AB\u5BBF\u4E3B\u6301\u4E45\u5316\uFF08\u5BBF\u4E3B\u534A\u533A\u53EF\u80FD\u662F\u65E7\u7248\u672C\uFF09\u2014\u2014\u8BF7\u91CD\u542F dsh \u540E\u91CD\u8BD5","hive.hb.err.invalidName":"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","hive.hb.err.duplicateName":"\u69FD\u4F4D\u540D\u79F0\u91CD\u590D","hive.hb.err.missingPrompt":"\u8702\u680F\u63D0\u793A\u8BCD\u4E0D\u80FD\u4E3A\u7A7A\u767D","hive.hb.err.promptBlocked":"\u53EC\u5524/\u5EFA\u8702\u5173\u95ED\u65F6\u63D0\u793A\u8BCD\u4E0D\u63A5\u53D7","hive.hb.err.tooManySlots":"\u69FD\u4F4D\u6570\u91CF\u8D85\u51FA\u4E0A\u9650 32","hive.status.aria":"\u5B8C\u6210\u72B6\u6001\u680F","hive.status.cardTitle":"{name}\uFF1A\u5F53\u524D\u5E26\u871C\u5F52\u8702\u6570 {count}","hive.status.default":"\u673A\u68B0\u8702","hive.status.send":"\u6279\u91CF\u53D1\u9001","hive.status.sendEmpty":"\u6682\u65E0\u5B8C\u6210\u8702","hive.status.confirmTitle":"\u6279\u91CF\u53D1\u9001\u786E\u8BA4","hive.status.confirmPrompt":"\u9884\u8BBE\u63D0\u793A\u8BCD","hive.status.confirmTargets":"\u76EE\u6807\u8702\u6570","hive.status.confirmHint":"\u5C06\u628A\u9884\u8BBE\u63D0\u793A\u8BCD\u9010\u8702\u53D1\u9001\u7ED9\u5361\u5185\u5168\u90E8\u5B8C\u6210\u8702","hive.status.confirm":"\u786E\u8BA4\u53D1\u9001","hive.status.cancel":"\u53D6\u6D88","hive.status.toastSent":"\u5DF2\u53D1 {n} \u53EA\uFF0C{m} \u53EA\u5931\u8D25","hive.status.toastNone":"\u65E0\u76EE\u6807\u5B8C\u6210\u8702","hive.hb.tabStatus":"\u72B6\u6001\u5361\u7247","hive.hb.status.defaultRow":"\u673A\u68B0\u8702\u4E0D\u53EF\u8BBE\u7F6E\u72B6\u6001\u5361\u529F\u80FD","hive.hb.status.promptPlaceholder":"\u9884\u8BBE\u63D0\u793A\u8BCD\uFF08\u53D1\u7ED9\u8BE5\u8702\u79CD\u5168\u90E8\u5B8C\u6210\u8702\uFF09","hive.hb.status.autoSendHint":"\u52FE\u9009\u540E\u70B9\u51FB\u5361\u7247\u76F4\u63A5\u6279\u91CF\u53D1\u9001\uFF1B\u4E0D\u52FE\u9009\u5219\u5148\u5F39\u4EBA\u5DE5\u786E\u8BA4","hive.hb.status.clear":"\u6E05\u9664\u914D\u7F6E","hive.hb.status.cleared":"\u5DF2\u6E05\u9664\u914D\u7F6E","hive.hb.status.empty":"\u9009\u62E9\u8702\u79CD\u4EE5\u914D\u7F6E\u72B6\u6001\u5361\u529F\u80FD\u3002","hive.hb.status.err.missingType":"\u7F3A\u5C11\u8702\u79CD id","hive.hb.status.err.invalidPrompt":"\u63D0\u793A\u8BCD\u987B\u4E3A\u5B57\u7B26\u4E32","hive.settings.batchSendConfirm":"\u6279\u91CF\u53D1\u9001\u4EBA\u5DE5\u786E\u8BA4","hive.settings.batchSendConfirmHint":"\u5173\u95ED\u540E\uFF0C\u672A\u52FE\u9009\u81EA\u52A8\u53D1\u9001\u7684\u72B6\u6001\u5361\u70B9\u51FB\u5373\u76F4\u53D1\uFF08\u4E0D\u518D\u5F39\u786E\u8BA4\uFF09","hive.bar.aria.hive":"\u5DE2\u680F\u9053\u5177\u680F","hive.bar.aria.bee":"\u8702\u680F\u9053\u5177\u680F","hive.bar.aria.floor":"\u5730\u677F\u680F\u9053\u5177\u680F","hive.bar.pureSummon":"\u7EAF\u53EC\u5524","hive.bar.summonOff":"\u53EC\u5524\u5DF2\u5173\u95ED","hive.bar.floorHint":"\u9009\u5B9A\u76EE\u5F55\u5EFA\u5DE2","hive.bar.toastSummoned":"\u5DF2\u53EC\u5524\u65B0\u8702","hive.bar.toastSummonFailed":"\u53EC\u5524\u5931\u8D25","hive.bar.toastMissingBee":"\u8702\u79CD\u7F3A\u5931\uFF0C\u53EC\u5524\u88AB\u62D2","hive.bar.toastFloorCreated":"\u5DF2\u5EFA\u5DE2","hive.bar.toastFloorCreateFailed":"\u5EFA\u5DE2\u5931\u8D25","hive.bar.toastFloorPickFailed":"\u76EE\u5F55\u9009\u62E9\u5668\u4E0D\u53EF\u7528","hive.bar.toastFloorSummonFailed":"\u5EFA\u5DE2\u6210\u529F\uFF0C\u4F46\u53EC\u5524\u5931\u8D25\uFF08\u7A7A\u5DE2\u5DF2\u4FDD\u7559\uFF09","hive.bar.toastSummonAppendFailed":"\u53EC\u5524\u6210\u529F\uFF0C\u4F46\u63D0\u793A\u8BCD\u672A\u80FD\u586B\u5165\u8F93\u5165\u6846\uFF08\u4F1A\u8BDD\u5DF2\u6253\u5F00\uFF0C\u53EF\u624B\u52A8\u7C98\u8D34\uFF09","hive.bar.defaults.beeContinue":"\u7EE7\u7EED","hive.bar.defaults.beeContinuePrompt":"\u7EE7\u7EED","hive.bar.defaults.beeArchive":"\u5F52\u6863\u4F1A\u8BDD","hive.bar.defaults.beeArchiveTitle":"\u5F52\u6863\u5F53\u524D\u4F1A\u8BDD\uFF08\u871C\u8702\u5316\u871C\u5165\u5E93\uFF0C\u4E0D\u53EF\u6062\u590D\uFF09","hive.bar.defaults.beeOpen":"\u6253\u5F00\u4F1A\u8BDD","hive.bar.defaults.beeOpenTitle":"\u6536\u8D77\u8702\u5DE2\u9875\uFF0C\u6253\u5F00\u5F53\u524D\u4F1A\u8BDD","hive.bar.defaults.floorNest":"\u5EFA\u5DE2","hive.bar.defaults.badge":"\u5185\u7F6E","hive.bar.defaults.hint":"\u6DFB\u52A0\u81EA\u5B9A\u4E49\u69FD\u4F4D\u540E\u672C\u680F\u9ED8\u8BA4\u5361\u6536\u8D77","hive.bar.defaults.hintResident":"\u8702\u680F\u5185\u7F6E\u5361\u5E38\u9A7B\u663E\u793A\uFF0C\u4E0D\u968F\u81EA\u5B9A\u4E49\u69FD\u4F4D\u6536\u56DE","hive.panel.empty":"\u7A7A\u5DE2\u2014\u2014\u8FD8\u6CA1\u6709\u5DE5\u8702","hive.panel.drones":"\u65E0\u4EBA\u673A\uFF1A\u6D3B\u8DC3 {a} / \u603B\u6570 {n}","hive.panel.selected":"\u5DF2\u9009 {n} \u53EA","hive.swarm.title":"\u8702\u7FA4\u7F16\u8F91","hive.swarm.close":"\u5173\u95ED\u8702\u7FA4\u7F16\u8F91","hive.swarm.tabTypes":"\u8702\u79CD\u5217\u8868","hive.swarm.tabCaps":"\u80FD\u529B\u7F16\u8F91\u5668","hive.swarm.add":"\u65B0\u589E\u8702\u79CD","hive.swarm.empty":"\u8FD8\u6CA1\u6709\u81EA\u5B9A\u4E49\u8702\u79CD\u2014\u2014\u673A\u68B0\u8702\u4E4B\u5916\uFF0C\u70B9\u51FB\u300C\u65B0\u589E\u8702\u79CD\u300D\u521B\u5EFA\u7B2C\u4E00\u53EA\u3002","hive.swarm.namePlaceholder":"\u8702\u79CD\u540D\uFF08\u5982\uFF1A\u8BBE\u8BA1\u8702\uFF09","hive.swarm.descPlaceholder":"\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09","hive.swarm.presetPromptPlaceholder":"\u9884\u8BBE\u63D0\u793A\u8BCD\uFF08\u53EF\u9009\uFF0C\u5DE5\u5177\u53EC\u5524\u9996\u6761\u6D88\u606F = payload + \u672C\u5B57\u6BB5\uFF09","hive.swarm.presetPromptHint":"B \u4FA7\u884C\u4E3A\u5B9A\u4E49\uFF1A\u53EC\u5524\u8BE5\u8702\u79CD\u65F6\u9644\u52A0\u7684\u884C\u4E3A\u6307\u5F15\uFF08\u6570\u636E\u8D70\u8C03\u7528\u65B9\u7684 payload\uFF09","hive.swarm.queuePolicy":"\u6392\u961F\u7B56\u7565","hive.swarm.queueFree":"\u81EA\u7531\uFF08\u4E0D\u5360\u9053\uFF09","hive.swarm.queueSerialized":"\u6392\u961F\uFF08\u540C\u5DE2\u81EA\u52A8\u52A8\u4F5C\u4E92\u65A5\uFF09","hive.swarm.model":"\u5BF9\u8BDD\u6A21\u578B\uFF08\u53EF\u9009\uFF09","hive.swarm.beeModel":"\u5916\u89C2\u6A21\u578B","hive.beeModel.worker":"\u9ED8\u8BA4\u5DE5\u8702","hive.beeModel.purple_worker":"\u7D2B\u5DE5\u8702","hive.beeModel.pink_worker":"\u7C89\u5DE5\u8702","hive.beeModel.blue_worker":"\u84DD\u5CF0","hive.swarm.modelNone":"\u4F7F\u7528\u9ED8\u8BA4\u6A21\u578B","hive.swarm.modelLoading":"\u6A21\u578B\u76EE\u5F55\u52A0\u8F7D\u4E2D\u2026","hive.swarm.modelUnavailable":"\u6682\u65E0\u6D3B\u4F1A\u8BDD\u53EF\u53D6\u6A21\u578B\u76EE\u5F55","hive.swarm.capsFor":"\u80FD\u529B\uFF08{name}\uFF09","hive.swarm.capAdd":"\u65B0\u589E\u80FD\u529B","hive.swarm.capEmpty":"\u8BE5\u8702\u79CD\u8FD8\u6CA1\u6709\u80FD\u529B\u3002","hive.swarm.capNamePlaceholder":"\u80FD\u529B\u540D\uFF08\u5982\uFF1A\u4EA4\u63A5\uFF09","hive.swarm.capture":"\u6355\u83B7\u53D8\u91CF\uFF08\u53D8\u91CF\u540D=handoff JSON \u952E\u8DEF\u5F84\uFF0C\u5982 A=proposal\uFF09","hive.swarm.capturePlaceholder":"A=proposal","hive.swarm.filePredicate":"\u6587\u4EF6\u8C13\u8BCD\uFF08\u76F8\u5BF9\u8DEF\u5F84\u6A21\u677F\uFF0C\u53EF\u9009\uFF0C\u4EC5\u5B58\u5728\u6027\u68C0\u67E5\uFF09","hive.swarm.filePredicatePlaceholder":"openspec/changes/{A}/tasks.md","hive.swarm.actionType":"\u52A8\u4F5C","hive.swarm.actionSend":"\u81EA\u52A8\u56DE\u590D","hive.swarm.actionSpawn":"\u53EC\u5524\u65B0\u8702","hive.swarm.actionNotify":"\u8C03\u6574\u59FF\u6001","hive.swarm.actionConductor":"\u7F16\u6392\u8005\uFF08\u672C\u671F\u672A\u5B9E\u73B0\uFF09","hive.swarm.target":"\u76EE\u6807\u8702\u79CD","hive.swarm.promptTemplate":"\u63D0\u793A\u8BCD\u6A21\u677F\uFF08{\u53D8\u91CF} \u63D2\u503C\uFF09","hive.swarm.promptPlaceholder":"\u8BF7\u7528 /opsx:new \u521B\u5EFA\u63D0\u6848 {A}","hive.swarm.once":"\u540C\u503C\u95E9\u9501\uFF08\u540C\u6355\u83B7\u503C\u53EA\u89E6\u53D1\u4E00\u6B21\uFF09","hive.swarm.onceLabel":"\u4EC5\u89E6\u53D1\u4E00\u6B21","hive.swarm.insertVar":"\u63D2\u5165 {v}","hive.swarm.deleteType":"\u5220\u9664\u8702\u79CD\uFF08\u5176\u871C\u8702\u81EA\u52A8\u56DE\u843D\u673A\u68B0\u8702\uFF09","hive.swarm.deleteCap":"\u5220\u9664\u80FD\u529B","hive.swarm.dirty":"\u6709\u672A\u4FDD\u5B58\u7684\u8702\u79CD\u4FEE\u6539","hive.swarm.saved":"\u8702\u7FA4\u5DF2\u4FDD\u5B58","hive.swarm.hostStale":"\u4FDD\u5B58\u672A\u88AB\u5BBF\u4E3B\u6301\u4E45\u5316\uFF08\u5BBF\u4E3B\u534A\u533A\u53EF\u80FD\u662F\u65E7\u7248\u672C\uFF09\u2014\u2014\u8BF7\u91CD\u542F dsh \u540E\u91CD\u8BD5","hive.bee.err.duplicateId":"\u8702\u79CD id \u91CD\u590D","hive.bee.err.reservedId":"\u4E0D\u80FD\u4F7F\u7528\u4FDD\u7559\u5B57 default","hive.bee.err.missingName":"\u8702\u79CD\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A","hive.bee.err.missingId":"\u7F3A\u5C11\u8702\u79CD id","hive.bee.err.invalidId":"\u8702\u79CD id \u5F62\u72B6\u975E\u6CD5\uFF08\u5B57\u6BCD\u6570\u5B57-_\uFF09","hive.bee.err.invalidModel":"\u6A21\u578B\u5F62\u72B6\u975E\u6CD5\uFF08\u9700 provider + model\uFF09","hive.bee.err.invalidQueuePolicy":"\u6392\u961F\u7B56\u7565\u975E\u6CD5","hive.bee.err.invalidActionType":"\u52A8\u4F5C\u7C7B\u578B\u975E\u6CD5","hive.bee.err.missingTemplate":"send/spawn \u52A8\u4F5C\u5FC5\u987B\u586B\u63D0\u793A\u8BCD\u6A21\u677F","hive.bee.err.invalidTemplate":"\u6A21\u677F\u8BED\u6CD5\u975E\u6CD5\uFF08{\u53D8\u91CF} \u672A\u95ED\u5408\u6216\u53D8\u91CF\u540D\u975E\u6CD5\uFF09","hive.bee.err.missingTarget":"\u5B75\u5316\u52A8\u4F5C\u5FC5\u987B\u9009\u62E9\u76EE\u6807\u8702\u79CD","hive.bee.err.invalidTarget":"\u76EE\u6807\u8702\u79CD\u975E\u6CD5","hive.bee.err.invalidCaptureVar":"\u6355\u83B7\u53D8\u91CF\u540D\u975E\u6CD5","hive.bee.err.invalidCapturePath":"\u6355\u83B7\u952E\u8DEF\u5F84\u975E\u6CD5\uFF08\u70B9\u5206\u6BB5\uFF0C\u5982 proposal \u6216 a.b\uFF09","hive.bee.err.invalidPredicate":"\u6587\u4EF6\u8C13\u8BCD\u987B\u4E3A\u76F8\u5BF9\u8DEF\u5F84\uFF08\u7981\u7EDD\u5BF9\u8DEF\u5F84/\u4E0A\u8DF3\uFF09","hive.bee.err.invalidOnce":"\u95E9\u9501\u5F00\u5173\u987B\u4E3A\u5E03\u5C14","hive.bee.err.presetPromptTooLong":"\u9884\u8BBE\u63D0\u793A\u8BCD\u8D85\u51FA\u957F\u5EA6\u4E0A\u9650 4000","hive.bee.err.invalidPresetPrompt":"\u9884\u8BBE\u63D0\u793A\u8BCD\u987B\u4E3A\u975E\u7A7A\u5B57\u7B26\u4E32","hive.bee.err.tooManyBeeTypes":"\u8702\u79CD\u6570\u91CF\u8D85\u51FA\u4E0A\u9650 16","hive.bee.err.tooManyCapabilities":"\u80FD\u529B\u6570\u91CF\u8D85\u51FA\u4E0A\u9650 16","hive.bee.err.tooManyCaptureVars":"\u6355\u83B7\u53D8\u91CF\u8FC7\u591A\uFF08\u4E0A\u9650 8\uFF09","hive.bee.err.invalidShape":"\u914D\u7F6E\u7ED3\u6784\u975E\u6CD5","hive.bee.serialized":"\u6392\u961F\u8702","hive.bee.free":"\u81EA\u7531\u8702","hive.card.beeChanged":"\u8702\u79CD\u5DF2\u66F4\u6362\uFF08\u5F53\u6B21\u56DE\u5408\u4E0D\u8FFD\u6EAF\uFF0C\u4E0B\u4E00\u56DE\u5408\u8D77\u751F\u6548\uFF09","hive.card.beeCleared":"\u5DF2\u6E05\u9664\u7ED1\u5B9A\uFF0C\u56DE\u5230\u673A\u68B0\u8702","hive.card.hatchSent":"\u5B75\u5316\u5DF2\u6267\u884C","hive.card.hatchDegraded":"\u91CE\u8702\u65E0\u5DE2\uFF0C\u5DF2\u964D\u7EA7\u4E3A\u672C\u4F1A\u8BDD\u7EED\u53D1","hive.card.hatchFailed":"\u5B75\u5316\u5931\u8D25","hive.card.hatchMissing":"\u7F3A\u5C11\u5DF2\u6355\u83B7\u53D8\u91CF\uFF0C\u65E0\u6CD5\u5B75\u5316","hive.card.laneCanceled":"\u5DF2\u53D6\u6D88\u8F66\u9053\u7B49\u5F85","hive.card.latchReset":"\u95E9\u9501\u5DF2\u91CD\u7F6E\uFF08\u540C\u503C\u53EF\u91CD\u65B0\u89E6\u53D1\uFF09","hive.hatch":"\u5B75\u5316{name}","hive.lane.cancel":"\u53D6\u6D88\u7B49\u5F85","hive.lane.ahead":"\u524D\u65B9 {n} \u9879","hive.lane.holding":"\u5360\u9053\u4E2D","hive.latch.reset":"\u91CD\u7F6E\u95E9\u9501","hive.wait.marker":"\u7B49\u5F85\u6807\u8BB0","hive.wait.predicate":"\u7B49\u5F85\u6587\u4EF6\u8C13\u8BCD","hive.wait.latch":"\u95E9\u9501\u751F\u6548","hive.wait.watermark":"\u5DF2\u5904\u7406","hive.menu.changeBeeType":"\u66F4\u6362\u8702\u79CD","hive.menu.beeDefault":"\u673A\u68B0\u8702","hive.float.collapse":"\u6536\u8D77\u4F1A\u8BDD\u6D6E\u7A97\uFF08Esc\uFF09","hive.appearance.groupWall":"\u5DE2\u5899","hive.appearance.chromeGroup":"\u7A97\u53E3\u914D\u8272","hive.appearance.chrome":"\u914D\u8272\u65B9\u6848","hive.appearance.chromeHint":"\u753B\u5E03\u4E0A\u6D6E\u5C42\u5361\u7247/\u9762\u677F\uFF08\u9053\u5177\u680F\u3001\u8702\u7FA4\u9762\u677F\u3001\u72B6\u6001\u5361\u3001\u6982\u8981\u6761\u3001tips\u3001\u83DC\u5355\u3001toast\uFF09\u7684\u5E95\u56FE\u914D\u8272\uFF1B\u6A21\u6001\u4E0E\u8F93\u5165\u4EF6\u4ECD\u968F\u5E94\u7528\u4E3B\u9898","hive.appearance.chromeDefault":"\u5B98\u65B9\u4EE4\u724C\uFF08\u968F\u5E94\u7528\u4E3B\u9898\uFF09","hive.appearance.chromeAmber":"\u7425\u73C0\u91D1","hive.appearance.chromeIndigo":"\u975B\u591C\u9713\u8679","hive.appearance.chromeCyan":"\u8424\u5C18\u9752","hive.appearance.chromeMagenta":"\u73AB\u7470\u9713\u8679","hive.appearance.chromeFrost":"\u971C\u767D\u73BB\u7483","hive.appearance.groupFloor":"\u5730\u9762","hive.appearance.groupPad":"\u5DE2\u5185\u5730\u7816","hive.appearance.groupAccent":"\u70B9\u7F00","hive.appearance.groupSky":"\u5929\u7A79","hive.appearance.wallOuter":"\u5916\u56F4\u5899\u53EF\u89C1\u5EA6","hive.appearance.wallOuterHint":"\u5DE2\u7C07\u5916\u6846\u5899\u7684\u5B9E\u4F53\u611F\uFF08100% = \u5B9E\u8272\uFF09","hive.appearance.wallInner":"\u5185\u9694\u5899\u53EF\u89C1\u5EA6","hive.appearance.wallInnerHint":"\u5DE2\u5185\u516D\u9762\u4F53\u623F\u95F4\u7684\u9694\u65AD\uFF08\u8D8A\u4F4E\u8D8A\u900F\uFF09","hive.appearance.innerTrim":"\u5185\u5899\u8F6E\u5ED3\u8FB9\u6761\u900F\u660E\u5EA6","hive.appearance.innerTrimHint":"\u5185\u9694\u5899\u9876\u7F18\u7684\u91D1\u8272\u8FB9\u6761\uFF080 = \u9690\u85CF\uFF09","hive.appearance.trimGlow":"\u9876\u7F18\u9970\u6761\u4EAE\u5EA6","hive.appearance.trimGlowHint":"\u53D1\u5149\u500D\u6570\uFF1B\u9AD8\u4E8E\u9608\u503C\u65F6\u7ECF Bloom \u5448\u73B0\u8F89\u5149","hive.appearance.wallGold":"\u5899\u4F53\u91D1\u8272","hive.appearance.trimColor":"\u9970\u6761\u91D1\u8272","hive.appearance.floorBase":"\u57FA\u677F\u5E95\u8272","hive.appearance.floorLine":"\u8702\u7A9D\u7EBF\u8272","hive.appearance.padBase":"\u7816\u5E95\u91D1\u8272","hive.appearance.padInner":"\u5185\u5708\u91D1\u8272","hive.appearance.outline":"\u9009\u4E2D\u63CF\u8FB9\u8272","hive.appearance.amber":"\u871C\u676F\u7425\u73C0","hive.appearance.mote":"\u6570\u636E\u8424\u5C18","hive.appearance.skyTop":"\u7A79\u9876\u6DF1\u975B","hive.appearance.horizon":"\u5730\u5E73\u7EBF\u8F89\u5149","hive.anim.full":"\u8DDF\u968F\u7CFB\u7EDF","hive.anim.force":"\u5F3A\u5236\u5F00\u542F","hive.anim.reduced":"\u5173\u95ED","hive.hotkey.alt":"Alt + H","hive.hotkey.ctrl":"Ctrl + Alt + H","hive.hotkey.off":"\u5173\u95ED","hive.legend.idle":"\u5F85\u547D","hive.legend.busy":"\u5FD9\u788C","hive.legend.help":"\u6C42\u52A9","hive.legend.done":"\u5E26\u871C\u5F52","hive.legend.honey":"\u8702\u871C\uFF08\u5F52\u6863\uFF09","hive.legend.keysZC":"\u6309\u4F4F Z/C \u65CB\u8F6C\u955C\u5934","hive.legend.keysE":"\u6309 E \u76F4\u8FBE\u5F53\u524D\u4F1A\u8BDD","hive.brief.aria":"\u5F53\u524D\u4F1A\u8BDD\u6982\u8981\uFF08\u53EA\u8BFB\u9884\u89C8\uFF1A\u4EFB\u52A1\u4E0E\u62A5\u544A\uFF09","hive.brief.task":"\u4EFB\u52A1","hive.brief.report":"\u62A5\u544A","hive.tips.drone":"\u65E0\u4EBA\u673A","hive.tips.defaultBee":"\u673A\u68B0\u8702","hive.tips.status":"\u72B6\u6001","hive.tips.workspace":"\u6240\u5C5E\u5DE5\u4F5C\u533A","hive.tips.sessions":"\u5DE2\u5185\u4F1A\u8BDD","hive.tips.tokens":"token \u6D88\u8017","hive.tips.dps":"\u5E73\u5747 DPS","hive.tips.avg":"\u5E73\u5747","hive.report.title":"\u4F5C\u6218\u62A5\u544A","hive.report.collapse":"\u6536\u8D77\u4F5C\u6218\u62A5\u544A","hive.report.expand":"\u5C55\u5F00\u4F5C\u6218\u62A5\u544A\uFF08\u672A\u8BFB {n}\uFF09","hive.report.clear":"\u6E05\u7A7A\u4F5C\u6218\u62A5\u544A","hive.report.empty":"\u6682\u65E0\u4F5C\u6218\u8BB0\u5F55\u2014\u2014\u8702\u7FA4\u6D3B\u52A8\u4F1A\u5728\u8FD9\u91CC\u5B9E\u65F6\u6EDA\u52A8\u3002","hive.report.filterLow":"\u663E\u793A\u4F4E\u4F18\u5148\u7EA7","hive.report.filterLowOn":"\u9690\u85CF\u4F4E\u4F18\u5148\u7EA7","hive.report.enterWorker":"\u53EC\u5524\u4E86\u5DE5\u8702 {name}","hive.report.start":"{name} \u5F00\u59CB\u6267\u884C\u4EFB\u52A1","hive.report.done":"{name} \u5B8C\u6210\u4E86\u4EFB\u52A1","hive.report.help":"{name} \u53D1\u51FA\u6C42\u52A9","hive.report.dronesNew":"\u53EC\u5524\u4E86 {n} \u4E2A\u65E0\u4EBA\u673A","hive.report.dronesDone":"{n} \u4E2A\u65E0\u4EBA\u673A\u5B8C\u5DE5","hive.report.archive":"\u4F1A\u8BDD\u5DF2\u5F52\u6863\u5316\u871C","hive.report.newNest":"\u65B0\u5DE2\u5EFA\u7ACB\uFF1A{title}","hive.report.nestMove":"\u5DE2\u5DF2\u642C\u79FB\uFF1A{title}","hive.report.wildBee":"\u91CE\u8702\u51FA\u73B0\uFF1A{name}"},Ow={"hive.title":"Hive Command Center","hive.seat":"Hive","hive.seat.aria":"Open the Hive Command Center","hive.fullscreen":"Fullscreen patrol","hive.exitFullscreen":"Exit fullscreen (Esc)","hive.spinToggle":"Right-drag orbit","hive.spinToggle.tooltip":"When on: right-drag orbits (azimuth only; pitch stays at the configured value). When off (default): right-drag pans. Middle-drag always pans","hive.editToggle":"Hive edit","hive.editToggle.tooltip":"When on: click a studio to select it, then drag to move. When off: dragging a studio does nothing (camera gestures moved to the right button)","hive.legend":"Legend","hive.state.idle":"Idle","hive.state.busy":"Running","hive.state.help":"Needs you","hive.state.done":"Done","hive.pin":"Pin card","hive.shrink":"Shrink card","hive.collapse":"Fold drones","hive.openSession":"Open session","hive.archive":"Archive","hive.archivedTag":"Archived \xB7 honey is read-only","hive.todos":"todos {done}/{total}","hive.runningCount":"{n} running","hive.activeCount":"{n} active","hive.time.now":"just now","hive.time.min":"{n}m ago","hive.time.hour":"{n}h ago","hive.time.day":"{n}d ago","hive.menu.newSession":"New session","hive.menu.openDir":"Open directory in system","hive.menu.archive":"Archive bee","hive.toast.newSession":"New session started","hive.toast.archived":"Bee became honey","hive.toast.openDir":"Opened in system","hive.toast.moveSaved":"Studio moved","hive.toast.moveConflict":"Layout changed in another tab; merged and replayed","hive.toast.moveInvalid":"Drop would overlap a neighbor studio; cancelled","hive.toast.adoptUnavailable":"This session is pinned to its own studio (cwd-decided); move unavailable","hive.toast.adoptSelf":"Reordered to the front of its studio","hive.toast.fail":"Action failed","hive.fallback.title":"3D hive unavailable","hive.fallback.body":"The 3D scene is unavailable or 2D fallback is selected in settings. Use the sidebar session list, or switch back to WebGL in settings.","hive.fallback.retry":"Retry WebGL","hive.settings.anim":"Animation","hive.settings.animHint":"Follow system = stop continuous animation when the OS requests reduced motion; Always on = ignore the OS setting on this page","hive.settings.renderer":"Renderer","hive.settings.rendererHint":"2D fallback shows a static card and skips the 3D scene","hive.settings.rendererWebgl":"WebGL (auto-fallback)","hive.settings.renderer2d":"2D fallback (no 3D)","hive.settings.showFps":"FPS counter","hive.settings.showFpsHint":"Frame-rate readout at the canvas top-left (debug)","hive.settings.cameraPitch":"Camera pitch","hive.settings.cameraPitchHint":"Pitch locks to this value: orbit, pan, zoom and focus never change it. Default 45\xB0, range 15\xB0\u201370\xB0","hive.settings.drones":"Drones","hive.drones.activeOnly":"Active only","hive.drones.all":"Show all","hive.settings.watermark":"Floor watermark","hive.settings.hotkey":"Hotkey","hive.settings.follow":"Camera follows current session","hive.settings.followHint":"Gently pan the camera to the matching bee on session switch and page open (on by default)","hive.settings.title":"Settings","hive.settings.close":"Close","hive.qc.moveUp":"Move up","hive.qc.moveDown":"Move down","hive.qc.save":"Save","hive.qc.saving":"Saving\u2026","hive.qc.saveFailed":"Save failed, please retry","hive.qc.confirmDiscard":"You have unsaved changes. Discard and close?","hive.qc.discard":"Discard","hive.qc.keepEditing":"Keep editing","hive.settings.navScene":"Scene","hive.settings.navAppearance":"Appearance","hive.settings.navLayout":"Layout","hive.settings.layoutPanelGroup":"Overlay panel (worker grid, right)","hive.settings.layoutPanelM":"Columns m","hive.settings.layoutPanelN":"Rows n","hive.settings.layoutBarGroup":"Hotbar (bottom grid)","hive.settings.layoutBarM":"Columns m","hive.settings.layoutBarN":"Rows n","hive.settings.reportGroup":"Combat report (bottom-left panel)","hive.settings.reportRows":"Visible rows","hive.settings.reportRowsHint":"Panel is anchored bottom-left; the list height follows the row count and scrolls beyond it","hive.settings.layoutHint":"Applies instantly; stored per tab only","hive.settings.resetAll":"Reset to defaults","hive.hb.title":"Command editor","hive.hb.close":"Close the command editor","hive.hb.tabHive":"Hive bar","hive.hb.tabBee":"Bee bar","hive.hb.tabFloor":"Floor bar","hive.hb.add":"Add slot","hive.hb.empty":"No slots yet \u2014 add one to get started.","hive.hb.namePlaceholder":"Name (e.g. Summon designer)","hive.hb.delete":"Delete","hive.hb.summon":"Summon a new bee","hive.hb.summonHint":"Checked = clicking the card summons a new bee; unchecked = the card renders disabled (reserved)","hive.hb.createBee":"Create a bee after nesting","hive.hb.createBeeHint":"Unchecked = nest only (an empty studio, no bee)","hive.hb.beeType":"Bee type","hive.hb.beeTypeDefault":"Mechanical bee","hive.hb.prompt":"Preset prompt","hive.hb.promptRequired":"required","hive.hb.promptPlaceholder":"Prompt (sent to the new bee or the current session)","hive.hb.autoSend":"Auto send","hive.hb.autoSendHint":"Checked = a click sends directly; unchecked = fills the composer for review","hive.hb.pureSummonHint":"Empty prompt = summon only (no message sent)","hive.hb.summonOffHint":"Summon off: prompt not accepted; the card renders disabled in the hotbar","hive.hb.overflow":"{n} slots exceed the grid \u2014 saved, but the overflow is not rendered in the hotbar","hive.hb.dirty":"Unsaved changes","hive.hb.saveStale":"Save was not persisted by the host (host half may be outdated) \u2014 restart dsh and retry","hive.hb.err.invalidName":"Name cannot be empty","hive.hb.err.duplicateName":"Duplicate slot name","hive.hb.err.missingPrompt":"Bee-bar prompt cannot be blank","hive.hb.err.promptBlocked":"Prompt is not accepted while summon/create-bee is off","hive.hb.err.tooManySlots":"Too many slots (limit 32)","hive.status.aria":"Completion status bar","hive.status.cardTitle":"{name}: {count} bee(s) carrying honey now","hive.status.default":"Mechanical bee","hive.status.send":"Batch send","hive.status.sendEmpty":"No completed bees","hive.status.confirmTitle":"Confirm batch send","hive.status.confirmPrompt":"Preset prompt","hive.status.confirmTargets":"Target bees","hive.status.confirmHint":"The preset prompt will be sent to every completed bee on this card, one by one","hive.status.confirm":"Send","hive.status.cancel":"Cancel","hive.status.toastSent":"Sent {n}, {m} failed","hive.status.toastNone":"No completed bees to send to","hive.hb.tabStatus":"Status cards","hive.hb.status.defaultRow":"The mechanical bee cannot have a status card action","hive.hb.status.promptPlaceholder":"Preset prompt (sent to every completed bee of this type)","hive.hb.status.autoSendHint":"Checked = a click batch-sends directly; unchecked = confirm first","hive.hb.status.clear":"Clear config","hive.hb.status.cleared":"Config cleared","hive.hb.status.empty":"Select a bee type to configure its status card action.","hive.hb.status.err.missingType":"Missing bee type id","hive.hb.status.err.invalidPrompt":"Prompt must be a string","hive.settings.batchSendConfirm":"Batch-send confirmation","hive.settings.batchSendConfirmHint":"When off, cards without auto-send send directly on click (no confirmation)","hive.bar.aria.hive":"Hive hotbar","hive.bar.aria.bee":"Bee hotbar","hive.bar.aria.floor":"Floor hotbar","hive.bar.pureSummon":"Summon only","hive.bar.summonOff":"Summon off","hive.bar.floorHint":"Pick a directory to nest","hive.bar.toastSummoned":"New bee summoned","hive.bar.toastSummonFailed":"Summon failed","hive.bar.toastMissingBee":"Bee type missing; summon refused","hive.bar.toastFloorCreated":"Studio registered","hive.bar.toastFloorCreateFailed":"Studio creation failed","hive.bar.toastFloorPickFailed":"Directory picker unavailable","hive.bar.toastFloorSummonFailed":"Studio created, but summon failed (empty studio kept)","hive.bar.toastSummonAppendFailed":"Bee summoned, but the prompt could not be filled into the composer (session opened; paste it manually)","hive.bar.defaults.beeContinue":"Continue","hive.bar.defaults.beeContinuePrompt":"Continue","hive.bar.defaults.beeArchive":"Archive session","hive.bar.defaults.beeArchiveTitle":"Archive the current session (bee becomes honey; cannot be undone)","hive.bar.defaults.beeOpen":"Open session","hive.bar.defaults.beeOpenTitle":"Close the hive page and open the current session","hive.bar.defaults.floorNest":"Nest","hive.bar.defaults.badge":"Built-in","hive.bar.defaults.hint":"Defaults collapse once this column has a custom slot","hive.bar.defaults.hintResident":"Bee-column built-ins always show; custom slots don't collapse them","hive.panel.empty":"Empty studio \u2014 no workers yet","hive.panel.drones":"Drones: {a} active / {n} total","hive.panel.selected":"{n} selected","hive.swarm.title":"Bee swarm editor","hive.swarm.close":"Close the bee swarm editor","hive.swarm.tabTypes":"Bee types","hive.swarm.tabCaps":"Capabilities","hive.swarm.add":"Add bee type","hive.swarm.empty":"No custom bee types yet \u2014 add the first one besides the mechanical bee.","hive.swarm.namePlaceholder":"Bee type name (e.g. Designer)","hive.swarm.descPlaceholder":"Description (optional)","hive.swarm.presetPromptPlaceholder":"Preset prompt (optional; summon first message = payload + this field)","hive.swarm.presetPromptHint":"B-side behavior: guidance appended when this bee type is summoned (task data goes in the caller's payload)","hive.swarm.queuePolicy":"Queue policy","hive.swarm.queueFree":"Free (never queues)","hive.swarm.queueSerialized":"Serialized (auto actions queue per studio)","hive.swarm.model":"Chat model (optional)","hive.swarm.beeModel":"Bee model","hive.beeModel.worker":"Default worker","hive.beeModel.purple_worker":"Purple worker","hive.beeModel.pink_worker":"Pink worker","hive.beeModel.blue_worker":"Lanfeng","hive.swarm.modelNone":"Use default model","hive.swarm.modelLoading":"Loading model catalog\u2026","hive.swarm.modelUnavailable":"No live session to read the model catalog from","hive.swarm.capsFor":"Capabilities ({name})","hive.swarm.capAdd":"Add capability","hive.swarm.capEmpty":"This bee type has no capabilities yet.","hive.swarm.capNamePlaceholder":"Capability name (e.g. Handoff)","hive.swarm.capture":"Capture vars (name=handoff JSON key path, e.g. A=proposal)","hive.swarm.capturePlaceholder":"A=proposal","hive.swarm.filePredicate":"File predicate (relative path template, optional, existence-only)","hive.swarm.filePredicatePlaceholder":"openspec/changes/{A}/tasks.md","hive.swarm.actionType":"Action","hive.swarm.actionSend":"Auto reply","hive.swarm.actionSpawn":"Summon a new bee","hive.swarm.actionNotify":"Adjust posture","hive.swarm.actionConductor":"Conductor (not implemented yet)","hive.swarm.target":"Target bee type","hive.swarm.promptTemplate":"Prompt template ({var} interpolation)","hive.swarm.promptPlaceholder":"Use /opsx:new to create proposal {A}","hive.swarm.once":"Value latch (fire once per captured value)","hive.swarm.onceLabel":"Fire only once","hive.swarm.insertVar":"Insert {v}","hive.swarm.deleteType":"Delete bee type (its bees fall back to the mechanical bee)","hive.swarm.deleteCap":"Delete capability","hive.swarm.dirty":"Unsaved bee swarm changes","hive.swarm.saved":"Bee swarm saved","hive.swarm.hostStale":"Save was not persisted by the host (host half may be outdated) \u2014 restart dsh and retry","hive.bee.err.duplicateId":"Duplicate bee type id","hive.bee.err.reservedId":"Reserved word default cannot be used","hive.bee.err.missingName":"Bee type name cannot be empty","hive.bee.err.missingId":"Missing bee type id","hive.bee.err.invalidId":"Bee type id shape is invalid (letters/digits/-/_)","hive.bee.err.invalidModel":"Model shape is invalid (provider + model required)","hive.bee.err.invalidQueuePolicy":"Invalid queue policy","hive.bee.err.invalidActionType":"Invalid action type","hive.bee.err.missingTemplate":"send/spawn actions require a prompt template","hive.bee.err.invalidTemplate":"Template syntax invalid ({var} unclosed or bad name)","hive.bee.err.missingTarget":"Hatch actions require a target bee type","hive.bee.err.invalidTarget":"Invalid target bee type","hive.bee.err.invalidCaptureVar":"Invalid capture variable name","hive.bee.err.invalidCapturePath":"Invalid capture key path (dot segments, e.g. proposal or a.b)","hive.bee.err.invalidPredicate":"File predicate must be a relative path (no absolute/..)","hive.bee.err.invalidOnce":"Latch switch must be a boolean","hive.bee.err.presetPromptTooLong":"Preset prompt exceeds the 4000 character limit","hive.bee.err.invalidPresetPrompt":"Preset prompt must be a non-empty string","hive.bee.err.tooManyBeeTypes":"Too many bee types (limit 16)","hive.bee.err.tooManyCapabilities":"Too many capabilities (limit 16)","hive.bee.err.tooManyCaptureVars":"Too many capture vars (limit 8)","hive.bee.err.invalidShape":"Invalid configuration shape","hive.bee.serialized":"Serialized","hive.bee.free":"Free","hive.card.beeChanged":"Bee type changed (no retroactive trigger; effective from the next turn)","hive.card.beeCleared":"Binding cleared; back to the mechanical bee","hive.card.hatchSent":"Hatch executed","hive.card.hatchDegraded":"Wild bee has no studio; degraded to a followup here","hive.card.hatchFailed":"Hatch failed","hive.card.hatchMissing":"Captured variables missing; cannot hatch","hive.card.laneCanceled":"Lane wait cancelled","hive.card.latchReset":"Latch reset (same value can fire again)","hive.hatch":"Hatch {name}","hive.lane.cancel":"Cancel wait","hive.lane.ahead":"{n} ahead","hive.lane.holding":"Holding lane","hive.latch.reset":"Reset latch","hive.wait.marker":"Waiting for marker","hive.wait.predicate":"Waiting for file predicate","hive.wait.latch":"Latched","hive.wait.watermark":"Processed","hive.menu.changeBeeType":"Change bee type","hive.menu.beeDefault":"Mechanical bee","hive.float.collapse":"Collapse session float (Esc)","hive.appearance.groupWall":"Walls","hive.appearance.chromeGroup":"Chrome palette","hive.appearance.chrome":"Color scheme","hive.appearance.chromeHint":"Backgrounds of cards & panels over the 3D canvas (hotbar, swarm panel, status cards, brief bar, tips, menu, toast); modals follow the app theme","hive.appearance.chromeDefault":"Official tokens (follow app theme)","hive.appearance.chromeAmber":"Honey amber","hive.appearance.chromeIndigo":"Indigo neon","hive.appearance.chromeCyan":"Cyan HUD","hive.appearance.chromeMagenta":"Rose neon","hive.appearance.chromeFrost":"Frost glass","hive.appearance.groupFloor":"Floor","hive.appearance.groupPad":"Studio tiles","hive.appearance.groupAccent":"Accents","hive.appearance.groupSky":"Sky dome","hive.appearance.wallOuter":"Outer wall visibility","hive.appearance.wallOuterHint":"Solidity of the studio boundary walls (100% = solid)","hive.appearance.wallInner":"Inner partition visibility","hive.appearance.wallInnerHint":"Hex-room partitions inside a studio (lower = clearer)","hive.appearance.innerTrim":"Inner trim opacity","hive.appearance.innerTrimHint":"Gold edge strip on studio partitions (0 = hidden)","hive.appearance.trimGlow":"Trim glow intensity","hive.appearance.trimGlowHint":"Emissive multiplier; blooms above threshold","hive.appearance.wallGold":"Wall gold","hive.appearance.trimColor":"Trim gold","hive.appearance.floorBase":"Lattice base","hive.appearance.floorLine":"Honeycomb line","hive.appearance.padBase":"Tile gold","hive.appearance.padInner":"Inner gold","hive.appearance.outline":"Selection outline","hive.appearance.amber":"Honey amber","hive.appearance.mote":"Data motes","hive.appearance.skyTop":"Dome indigo","hive.appearance.horizon":"Horizon glow","hive.anim.full":"Follow system","hive.anim.force":"Always on","hive.anim.reduced":"Off","hive.hotkey.alt":"Alt + H","hive.hotkey.ctrl":"Ctrl + Alt + H","hive.hotkey.off":"Off","hive.legend.idle":"Idle","hive.legend.busy":"Running","hive.legend.help":"Needs you","hive.legend.done":"Done","hive.legend.honey":"Honey (archived)","hive.legend.keysZC":"Hold Z/C to orbit the camera","hive.legend.keysE":"Press E to open the current session","hive.brief.aria":"Current session brief (read-only preview: task & report)","hive.brief.task":"Task","hive.brief.report":"Report","hive.tips.drone":"Drone","hive.tips.defaultBee":"Mechanical bee","hive.tips.status":"Status","hive.tips.workspace":"Workspace","hive.tips.sessions":"Studio sessions","hive.tips.tokens":"Tokens","hive.tips.dps":"Avg DPS","hive.tips.avg":"avg","hive.report.title":"Combat report","hive.report.collapse":"Collapse the combat report","hive.report.expand":"Expand the combat report ({n} unread)","hive.report.clear":"Clear the combat report","hive.report.empty":"No combat log yet \u2014 swarm activity will scroll here in real time.","hive.report.filterLow":"Show low-priority","hive.report.filterLowOn":"Hide low-priority","hive.report.enterWorker":"Summoned worker {name}","hive.report.start":"{name} started a task","hive.report.done":"{name} completed a task","hive.report.help":"{name} needs help","hive.report.dronesNew":"Summoned {n} drones","hive.report.dronesDone":"{n} drones finished","hive.report.archive":"Session archived into honey","hive.report.newNest":"New studio: {title}","hive.report.nestMove":"Studio moved: {title}","hive.report.wildBee":"Wild bee appeared: {name}"};function Uw(i,e){let t=null,n=new Map,s=null,r=!1,a=null,o=null,l=[],c=null,h="",d="",u=null,f=new Map,m=null,v=new lh,g=()=>s?.positions??{};function p(D){Xr.set(D),Oi.set(D?.beeTypes??[],D?.beeAssignments??{}),_()}function x(D){oh.setFrame(D),_()}function _(){t?.setBeeOverlay?.({beeTypes:Oi.beeTypes,assignments:Oi.assignments,engineState:s?.beeEngineState??{},lane:oh.lane,sessions:oh.sessions})}function y(){let D=i.sessions?.list?.getSnapshot?.()?.current??null;Wd.set(Hd(t?.world??null,D,t?.getSelection?.()??null,i.sessions?.list?.getSnapshot?.())),qd.set(t?.getSelection?.()??null)}async function E(){try{let D=await gg();if(r||!D)return;s=D,p(D),t?.setLayout(D),F()}catch{s||(s={version:1,revision:0,positions:{},camera:null}),p(s),F()}}async function A(D){if(!s)return;let H=async(ie,ce)=>{let Ne=await us(ie,ce);return Ne.conflict?{conflict:!0,doc:Ne.doc}:Ne.ok?(s=Ne.doc,{conflict:!1}):(e(String(Ne.error??"layout write failed"),"err"),{conflict:!1})},ee=await H(s.revision,D);if(ee.conflict){s=ee.doc??s;let ie={positions:{...g(),...D.positions??{}}};if(D.camera!==void 0&&(ie.camera=D.camera),ee=await H(s?.revision??0,ie),ee.conflict){s=ee.doc??s,p(s),F(),e("conflict-retry","err");return}e("conflict-replay","ok")}ee.doc&&(s=ee.doc,p(s)),F()}async function R(D,H){if(!s)return{ok:!1,error:"layout not ready"};let ee=mi(D),ie=gi(H,s.beeTypes??[]),ce={hotbars:ee};H!==void 0&&(ce.statusCards=ie);let Ne=He=>JSON.stringify(mi(He?.hotbars??{}))!==JSON.stringify(ee)||JSON.stringify(gi(He?.statusCards??{},He?.beeTypes??[]))!==JSON.stringify(ie),Be=await us(s.revision,ce);return Be.conflict&&(s=Be.doc??s,Be=await us(s?.revision??0,ce),Be.conflict)?(s=Be.doc??s,p(s),F(),{ok:!1,error:"conflict"}):Be.ok?(s=Be.doc,p(s),F(),Ne(s)?{ok:!1,error:"host-stale"}:{ok:!0,doc:s}):{ok:!1,error:String(Be.error??"hotbars save failed")}}async function b(D){if(!s)return{ok:!1,error:"layout not ready"};let H=wd(D),ee={beeTypes:H},ie=Ne=>JSON.stringify(Ne?.beeTypes??[])!==JSON.stringify(H),ce=await us(s.revision,ee);return ce.conflict&&(s=ce.doc??s,ce=await us(s?.revision??0,ee),ce.conflict)?(s=ce.doc??s,p(s),F(),{ok:!1,error:"conflict"}):ce.ok?(s=ce.doc,p(s),F(),ie(s)?{ok:!1,error:"host-stale"}:{ok:!0,doc:s}):{ok:!1,error:String(ce.error??"bee types save failed"),field:ce.field,code:ce.code}}async function w(D,H){if(!s)return{ok:!1,error:"layout not ready"};let ee={...s.beeAssignments??{}};H?ee[D]=H:delete ee[D];let ie=await us(s.revision,{beeAssignments:ee});return ie.conflict&&(s=ie.doc??s,ie=await us(s?.revision??0,{beeAssignments:ee}),ie.conflict)?(s=ie.doc??s,p(s),F(),{ok:!1,error:"conflict"}):ie.ok?(s=ie.doc,p(s),F(),{ok:!0,doc:s}):{ok:!1,error:String(ie.error??"assignment save failed")}}let I=!1,N=0;function F(){if(I)return;I=!0;let D=()=>{if(r){I=!1;return}document.hidden||(I=!1,k())};typeof requestAnimationFrame=="function"?N=requestAnimationFrame(D):D()}l.push(()=>cancelAnimationFrame(N));function k(){if(r||!i.sessions||!i.workspaces)return;let D=i.sessions.list.getSnapshot(),H=i.workspaces.list.getSnapshot(),ee=mg({sessions:D,workspaces:H,positions:g(),studioState:n,summonEdges:s?.summonEdges??null});if(n=ee.studioState,f=new Map(ee.world.studios.map(ie=>[ie.workspaceId,ie.center])),t?.setWorld(ee.world),v.ingest({world:ee.world,workspaces:H}),ee.world.displaced?.length){let ie=[...ee.world.displaced].sort().join(",");ie!==d&&(d=ie,clearTimeout(u),u=setTimeout(()=>{if(r)return;let ce={...g()};for(let Ne of ie.split(",")){let Be=f.get(Ne);Be&&(ce[Ne]={q:Be.q,r:Be.r})}A({positions:ce}).catch(()=>{})},300),u.unref?.())}y(),po.set(pg(D.byId[D.current])),yo.bump()}let U={selectBee(D){i.sessions.open(D)},refreshSessions(){try{i.sessions?.refresh?.()?.catch?.(()=>{})}catch{}},seedDraft(D,H){try{let ie=(typeof i.get=="function"?i.get("conversation"):i.conversation)?.input?.shell?.(D);if(!ie||typeof ie.setDraft!="function")return!1;let ce=ie.snapshot?.draft;return ie.setDraft(zd(typeof ce=="string"?ce:"",String(H??""))),!0}catch{return!1}},openBeeSession(D){i.sessions.open(D),U.isWorkerBee(D)&&o?.openFloat?.()},isWorkerBee(D){return!!D&&Hd(t?.world??null,D,null,i.sessions?.list?.getSnapshot?.())===D},beeTitleOf(D){let H=t?.world;for(let ie of H?.studios??[]){let ce=(ie?.bees??[]).find(Ne=>Ne.sessionId===D);if(ce)return ce.displayTitle??""}return(H?.wildBees??[]).find(ie=>ie.sessionId===D)?.displayTitle??""},saveBeeTypes:b,setBeeType:w,saveHotbars:R,async summon(D){return xg(D)},async pickDirectory(){return i.uiWorkspace?.pickDirectory?.()??null},async createWorkspace(D){return i.workspaces.create({path:D})},clearSelection(){t?.clearSelection()},clearMarquee(){Ui.commit([]),t?.setMarqueeIds?.(new Set)},async hatch(D,H){return yg(D,H)},async laneCancel(D,H){return bg(D,"cancel",H)},async latchReset(D){return _g(D)},async fetchModelCatalog(D){return Sg(D)},anyLiveSessionId(){let D=i.sessions?.list?.getSnapshot?.(),H=D?.byId??{};for(let ee of D?.ids??[])if(H[ee]?.origin!=="subagent"&&!H[ee]?.blank)return ee;return D?.current??null},sessionsSnapshot(){return i.sessions?.list?.getSnapshot?.()??null},openFloat(){o?.openFloat?.()},closeFloat(){o?.closeFloat?.()},selectDrone(D){let H=i.sessions.subagentAddress?.(D);H?i.sessions.openSubagent(H):i.sessions.open(D)},newSession(D){try{i.workspaces.startSession(D),e("newSession","ok")}catch(H){e(String(H?.message||H),"err")}},async openDirectory(D){try{await i.workspaces.openPath(D),e("openDir","ok")}catch(H){e(String(H?.message||H),"err")}},async archiveBee(D){try{await i.workspaces.archiveSession(D),e("archived","ok")}catch(H){e(String(H?.message||H),"err")}},async beeDropped(D,H){try{await i.workspaces.insertSessionBefore(H,D),e("adoptSelf","ok")}catch{e("adoptUnavailable","err")}},async studioMoved(D,H){await A({positions:{...g(),[D]:{q:H.q,r:H.r}}}),e("moveSaved","ok")},focusSession(D){t?.focusBee(D)},attachScene(D){t||(t=new sh(D,z.t,{onSelectBee:H=>U.selectBee(H),onOpenSession:H=>U.openBeeSession(H),onSelectCup:()=>{},onSelectStudio:()=>{},onStudioMenu:(H,ee,ie)=>{let Ne=i.workspaces.list.getSnapshot().items.find(Be=>Be.workspaceId===H);a?.({kind:"studio",workspaceId:H,path:Ne?.path,title:Ne?.title,x:ee,y:ie})},onBeeMenu:(H,ee,ie)=>a?.({kind:"bee",sessionId:H,x:ee,y:ie}),onStudioMoved:(H,ee)=>U.studioMoved(H,ee),onBeeDropped:(H,ee)=>U.beeDropped(H,ee),onInvalidDrop:()=>e("moveInvalid","err"),onDragCancel:()=>{},onArchiveBee:H=>U.archiveBee(H),onHatch:(H,ee)=>{U.hatch(H,ee).then(ie=>{ie?.ok?e(ie.degraded?"hatchDegraded":"hatchSent","ok"):ie?.missing?.length?e("hatchMissing","err"):e("hatchFailed","err")})},onLaneCancel:(H,ee)=>{U.laneCancel(H,ee).then(ie=>{e(ie?.ok?"laneCanceled":"fail",ie?.ok?"ok":"err")})},onLatchReset:H=>{U.latchReset(H).then(ee=>{e(ee?.ok?"latchReset":"fail",ee?.ok?"ok":"err")})},onContextLost:()=>e("contextLost","err"),onBeePreview:(H,ee)=>hh.set(H,ee),onMarqueeRect:H=>dh.set(H),onMarqueeCommit:H=>{Ui.commit(H),t?.setMarqueeIds?.(Ui.getSet())},onMarqueeCancel:()=>dh.set(null)}),s&&t.setLayout(s),t.setSelected(i.sessions?.list.getSnapshot()?.current),t.setSettings(o?.getSettings?.()??{}),t.onSelectionChange=y,Z(),F()),t.reattach(D),t.start();{let H=i.sessions?.list.getSnapshot()?.current??null;m=H,o?.getSettings?.().followCurrent&&H&&t.followBee(H)}return t},detachScene(){t?.stop()},setMenuHandler(D){a=D},setStoreBridge(D){o=D},getScene:()=>t},z={t:D=>D};l.push(i.sessions?.list.subscribe(()=>F())),l.push(i.workspaces?.list.subscribe(()=>F())),l.push(i.sessions?.list.subscribe(()=>{let D=i.sessions.list.getSnapshot().current;t?.setSelected(D),y(),D!==m&&(m=D,o?.getSettings?.().followCurrent&&D&&t?.followBee(D))})),l.push(vg(D=>{s=D,p(D),_(),F()},D=>x(D)));let q=()=>E();window.addEventListener("focus",q),l.push(()=>window.removeEventListener("focus",q));function Z(){c||(c=setInterval(()=>{if(r||!t)return;let D=JSON.stringify(t.cameraPose());D!==h&&(h=D,A({camera:t.cameraPose()}).catch(()=>{}))},2e4),c.unref?.())}return l.push(()=>{c&&clearInterval(c),c=null,u&&clearTimeout(u),u=null}),E(),{actions:U,getFeed:()=>v,setT(D){z.t=D},dispose(){r=!0;for(let D of l.splice(0))try{D()}catch{}t?.dispose(),t=null}}}var Kd='<svg viewBox="0 0 24 28" fill="none" aria-hidden="true"><path d="M12 1.5 22.5 7.5v13L12 26.5 1.5 20.5v-13L12 1.5z" stroke="currentColor" stroke-width="1.6"/><path d="M12 8.5 17 11.4v5.7L12 20l-5-2.9v-5.7L12 8.5z" fill="currentColor" opacity=".55"/></svg>';function Bw(){return(0,M.jsx)("span",{style:{display:"inline-flex",width:16,height:18},dangerouslySetInnerHTML:{__html:Kd}})}function zw({wide:i,t:e}){let t=zg(),n=()=>Pn.set(!Pn.getSnapshot());return i?(0,M.jsx)("div",{className:"jyv-seat","data-active":t||void 0,children:(0,M.jsxs)("button",{type:"button",className:"jyv-seat-row","data-plugin-anchor":"dsh-v-hive:seat","aria-expanded":t,onClick:n,children:[(0,M.jsx)(Bw,{}),(0,M.jsx)("span",{className:"jyv-seat-label",children:e("hive.seat")})]})}):(0,M.jsx)("div",{className:"jyv-seat","data-active":t||void 0,children:(0,M.jsx)("button",{type:"button",className:"jyv-seat-rail","data-plugin-anchor":"dsh-v-hive:seat","aria-label":e("hive.seat.aria"),"aria-expanded":t,title:e("hive.seat"),onClick:n,dangerouslySetInnerHTML:{__html:Kd}})})}function Hw({t:i,menu:e,onClose:t,onAction:n,beeTypes:s=[],assignments:r={}}){let a=(0,de.useRef)(null);if((0,de.useEffect)(()=>{if(!e)return;let d=u=>{a.current&&u.target instanceof Node&&a.current.contains(u.target)||t()};return window.addEventListener("pointerdown",d,!0),window.addEventListener("blur",d),()=>{window.removeEventListener("pointerdown",d,!0),window.removeEventListener("blur",d)}},[e,t]),!e)return null;let o=Math.min(e.x,window.innerWidth-210),l=Math.min(e.y,window.innerHeight-130),c=(d,u,f)=>(0,M.jsx)("button",{type:"button",className:"jyv-menuItem"+(f?.active?" jyv-menuItemOn":""),onClick:()=>{t(),n(u,{...e,...f})},children:d}),h=e.kind==="bee"?r[e.sessionId]??null:null;return(0,M.jsxs)("div",{ref:a,className:"jyv-menu",style:{left:o,top:l},onPointerDown:d=>d.stopPropagation(),children:[e.kind==="studio"&&c(i("hive.menu.newSession"),"newSession"),e.kind==="studio"&&e.path&&c(i("hive.menu.openDir"),"openDir"),e.kind==="bee"&&c(i("hive.menu.changeBeeType"),"noop",{header:!0}),e.kind==="bee"&&(s.length>0||h?s.map(d=>c("\u27E1 "+d.name,"setBeeType",{typeId:d.id,active:h===d.id})):c("\u27E1 "+i("hive.menu.changeBeeType")+" \xB7 0","noop",{header:!0})),e.kind==="bee"&&c(i("hive.menu.beeDefault"),"setBeeType",{typeId:null,active:!h}),e.kind==="bee"&&c(i("hive.menu.archive"),"archive")]})}function Vw({t:i,onRetry:e}){return(0,M.jsx)("div",{className:"jyv-fallback",children:(0,M.jsxs)("div",{className:"jyv-fallbackCard",children:[(0,M.jsx)("div",{className:"jyv-fallbackTitle",children:i("hive.fallback.title")}),i("hive.fallback.body"),e?(0,M.jsx)("div",{className:"jyv-fallbackRetry",children:(0,M.jsx)("button",{type:"button",className:"jyv-setReset",onClick:e,children:i("hive.fallback.retry")})}):null]})})}function Gw({t:i,selectedBee:e}){let t=(0,de.useSyncExternalStore)(s=>po.subscribe(s),()=>po.getSnapshot()),n=po.brief;return!e||!n?null:(0,M.jsxs)("div",{className:"jyv-briefBar",role:"note","aria-label":i("hive.brief.aria"),children:[(0,M.jsxs)("div",{className:"jyv-briefHead",children:[(0,M.jsx)("span",{className:"jyv-briefDot","aria-hidden":"true"}),(0,M.jsx)("span",{className:"jyv-briefTitle",title:n.title??"",children:n.title??"-"})]}),(0,M.jsxs)("div",{className:"jyv-briefRow",children:[(0,M.jsx)("span",{className:"jyv-briefKey",children:i("hive.brief.task")}),(0,M.jsx)("span",{className:"jyv-briefText",title:n.prompt??"",children:n.prompt??"-"})]}),(0,M.jsxs)("div",{className:"jyv-briefRow",children:[(0,M.jsx)("span",{className:"jyv-briefKey",children:i("hive.brief.report")}),(0,M.jsx)("span",{className:"jyv-briefText",title:n.response??"",children:n.response??"-"})]})]})}var jw=function(e){return zg()?(0,M.jsx)(Ww,{...e}):null};function Ww(i){let{t:e,useStore:t,ctl:n,setFullscreen:s,toggleLegend:r,clearToast:a,notify:o,setSettings:l,openFloat:c,closeFloat:h}=i,d=t(j=>j.fullscreen),u=t(j=>j.toast),f=t(j=>j.legend),m=t(j=>j.settings),v=t(j=>j.floatOpen),g=(0,de.useSyncExternalStore)(j=>Oi.subscribe(j),()=>Oi.getSnapshot()),p=(0,de.useSyncExternalStore)(j=>Wd.subscribe(j),()=>Wd.getSnapshot()),x=(0,de.useSyncExternalStore)(j=>Xr.subscribe(j),()=>Xr.getSnapshot()),_=(0,de.useSyncExternalStore)(j=>Xr.subscribe(j),()=>Xr.getStatusCards()),y=(0,de.useSyncExternalStore)(j=>qd.subscribe(j),()=>qd.getSnapshot()),E=(0,de.useSyncExternalStore)(j=>yo.subscribe(j),()=>yo.getSnapshot()),A=(0,de.useSyncExternalStore)(j=>hh.subscribe(j),()=>hh.getSnapshot()),R=(0,de.useSyncExternalStore)(j=>Ui.subscribe(j),()=>Ui.getSnapshot()),b=(0,de.useRef)(null),w=(0,de.useRef)(null),I=qw(b,w),N=I===null,F=(0,de.useRef)(null),[k,U]=(0,de.useState)(m.renderer==="fallback2d"),[z,q]=(0,de.useState)(0),[Z,D]=(0,de.useState)(null),[H,ee]=(0,de.useState)(!1),[ie,ce]=(0,de.useState)(!1),Ne=(0,de.useRef)(null),[Be,He]=(0,de.useState)(!1),C=(0,de.useRef)(null),[X,O]=(0,de.useState)(!1),Q=(0,de.useRef)(null),[ye,xe]=(0,de.useState)(null),[Ye,ze]=(0,de.useState)("idle"),et=()=>{let j=!H;ee(j),n().actions.getScene?.()?.setEditMode(j)},$e=!!(m.rightDragSpin??!1),Qe=()=>l({rightDragSpin:!$e});(0,de.useEffect)(()=>{if(m.renderer==="fallback2d"){n().actions.detachScene();for(let j of[".jyv-canvas",".jyv-vignette",".jyv-cardsRoot",".jyv-tips"])F.current?.querySelector(j)?.remove();U(!0);return}U(!1);try{n().actions.setMenuHandler(D),n().actions.attachScene(F.current)}catch(j){console.error("[dsh-v-hive] scene attach failed:",j);for(let oe of[".jyv-canvas",".jyv-vignette",".jyv-cardsRoot",".jyv-tips"])F.current?.querySelector(oe)?.remove();U(!0)}return()=>n().actions.detachScene()},[n,D,m.renderer,z]),(0,de.useEffect)(()=>{let oe=(b.current?.closest("[data-shell-overlay]")??null)?.parentElement??null;if(!oe){console.warn("[dsh-v-hive] float frame root unresolved: no [data-shell-overlay] ancestor \u2014 float reshaping skipped (host DOM drift?)");return}return v?oe.setAttribute("data-jy-float","open"):oe.removeAttribute("data-jy-float"),()=>oe.removeAttribute("data-jy-float")},[v]),(0,de.useEffect)(()=>{if(v)return n().actions.getScene?.()?.stop(),()=>{Pn.getSnapshot()&&n().actions.getScene?.()?.start()}},[v,n]),(0,de.useEffect)(()=>()=>h(),[h]),(0,de.useEffect)(()=>{let j=oe=>{if(oe.key!=="Escape")return;let ae=n().actions.getScene?.();if(ae?.dragInProgress)return;if(v){h();return}if(d){s(!1);return}let ue=kg();if(ue){ue();return}if(ae?.cards?.expandedKey){ae.cards.setExpanded(null);return}if(ae?.getSelection?.()){ae.clearSelection();return}if(Ui.getSet().size>0){Ui.commit([]),ae?.setMarqueeIds?.(new Set);return}Pn.set(!1)};return window.addEventListener("keydown",j),()=>window.removeEventListener("keydown",j)},[d,v,s,h,n]),(0,de.useEffect)(()=>{if(!Be)return;ze("loading");let j=!0,oe=n().actions.anyLiveSessionId?.();if(!oe){ze("unavailable"),xe(null);return}return n().actions.fetchModelCatalog?.(oe).then(ae=>{j&&(ae?.ok?(xe(ae.models),ze("ready")):(xe(null),ze("unavailable")))}),()=>{j=!1}},[Be,n]),(0,de.useEffect)(()=>{b.current?.focus?.()},[]),(0,de.useEffect)(()=>{let j=m?.hotkey??"alt+h";if(j==="off")return;let oe=ae=>{let ue=ae.altKey,Ee=ae.ctrlKey||ae.metaKey;String(ae.key).toLowerCase()==="h"&&(j==="alt+h"&&ue&&!Ee||j==="ctrl+alt+h"&&ue&&Ee)&&(ae.preventDefault(),Pn.set(!Pn.getSnapshot()))};return window.addEventListener("keydown",oe),()=>window.removeEventListener("keydown",oe)},[m?.hotkey]),(0,de.useEffect)(()=>{let j=window.matchMedia?.("(prefers-reduced-motion: reduce)"),oe=()=>{let ae=!!j?.matches,ue=m.animation==="reduced"||m.animation!=="force"&&ae;n().actions.getScene?.()?.setReducedMotion(ue)};return oe(),j?.addEventListener?.("change",oe),()=>j?.removeEventListener?.("change",oe)},[n,m.animation]),(0,de.useEffect)(()=>{n().actions.getScene?.()?.setSettings(m)},[n,m]),(0,de.useEffect)(()=>{let j=go.includes(m.chromeScheme)?m.chromeScheme:"default";return j==="default"?delete document.body.dataset.jyChrome:document.body.dataset.jyChrome=j,()=>{delete document.body.dataset.jyChrome}},[m.chromeScheme]),(0,de.useEffect)(()=>{if(!u)return;let j=setTimeout(()=>a(),2600);return()=>clearTimeout(j)},[u,a]);let Lt=async(j,oe)=>{j==="newSession"?await n().actions.newSession(oe.workspaceId):j==="openDir"?await n().actions.openDirectory(oe.path):j==="archive"?await n().actions.archiveBee(oe.sessionId):j==="setBeeType"&&((await n().actions.setBeeType?.(oe.sessionId,oe.typeId))?.ok?o(oe.typeId?"beeChanged":"beeCleared","ok"):oe.header||o("fail","err"))},_t=()=>Pn.set(!1),Ot=(0,de.useRef)(null);Ot.current=p;let jt=(0,de.useRef)(null);jt.current=_t,(0,de.useEffect)(()=>{let j=new Set,oe=()=>n().actions.getScene?.(),ae=pe=>gm({activeElement:document.activeElement,modalGuard:kg(),floatOpen:v,dragInProgress:!!oe()?.dragInProgress,isComposing:pe?.isComposing===!0}),ue=pe=>{let se=String(pe.key??"").toLowerCase();if(se==="z"||se==="c"){if(ae(pe)||j.has(se))return;j.add(se),oe()?.setSpinKey?.(se,!0);return}if(se==="e"){if(pe.repeat||ae(pe))return;let ve=Ot.current;if(!ve)return;n().actions.selectBee?.(ve),jt.current?.()}},Ee=pe=>{let se=String(pe.key??"").toLowerCase();se!=="z"&&se!=="c"||(j.delete(se),oe()?.setSpinKey?.(se,!1))},Pe=()=>{j.clear(),oe()?.clearSpinKeys?.()},Oe=()=>Pe(),B=()=>{document.hidden&&Pe()};return window.addEventListener("keydown",ue),window.addEventListener("keyup",Ee),window.addEventListener("blur",Oe),document.addEventListener("visibilitychange",B),()=>{Pe(),window.removeEventListener("keydown",ue),window.removeEventListener("keyup",Ee),window.removeEventListener("blur",Oe),document.removeEventListener("visibilitychange",B)}},[n,v]);let vt=qr(m.layout),ht=wg({selection:y,selectedBee:p,floatOpen:v}),V=async j=>{let oe=String(j.prompt??"");if(!oe.trim()||!p)return;if(j.autoSend===!0){let ue=await Od(p,oe);ue.ok||console.warn("[dsh-v-hive] hotbar send failed:",ue.error);return}await uh(p,oe)&&c()},[en,nt]=(0,de.useState)(!1),P=async j=>{if(!(en||!y||y.kind!=="studio")){nt(!0);try{let oe=String(j.prompt??""),ae=await n().actions.summon({workspaceId:y.id,beeTypeId:j.beeTypeId||void 0,prompt:oe,autoSend:j.autoSend===!0});if(!ae.ok){o(ae.field==="beeTypeId"?"summonMissingBee":"summonFailed","err");return}if(!oe.trim()){o("summoned","ok");return}j.autoSend!==!0&&(n().actions.refreshSessions?.(),await Xd(ae.sessionId,oe)||await uh(ae.sessionId,oe,800)?_t():o("summonAppendFailed","err"))}finally{nt(!1)}}},[S,W]=(0,de.useState)(!1),J=async j=>{if(!S){W(!0);try{let oe=null;try{oe=await n().actions.pickDirectory()}catch(Oe){console.warn("[dsh-v-hive] pickDirectory failed:",Oe),o("floorPickFailed","err");return}if(!oe)return;let ae;try{ae=await n().actions.createWorkspace(oe)}catch(Oe){console.warn("[dsh-v-hive] workspace create failed:",Oe),o("floorCreateFailed","err");return}let ue=ae?.workspaceId??ae?.id??null;if(!ue){o("floorCreateFailed","err");return}if(j.createBee!==!0){o("floorCreated","ok");return}let Ee=String(j.prompt??""),Pe=await n().actions.summon({workspaceId:ue,beeTypeId:j.beeTypeId||void 0,prompt:Ee,autoSend:j.autoSend===!0});if(!Pe.ok){o(Pe.field==="beeTypeId"?"summonMissingBee":"floorSummonFailed","err");return}if(!Ee.trim()){o("floorCreated","ok");return}j.autoSend!==!0&&(n().actions.refreshSessions?.(),await Xd(Pe.sessionId,Ee)||await uh(Pe.sessionId,Ee,800)?_t():o("summonAppendFailed","err"))}finally{W(!1)}}},te=n().actions.getScene?.()?.world??null,me=y?.kind==="studio"?(te?.studios??[]).find(j=>j.workspaceId===y.id)??null:null,ge=Ui.getSet(),ne=null;if(ge.size>0){let j=new Map;for(let oe of te?.studios??[])for(let ae of oe.bees??[])ae.droneStandIn||j.set(ae.sessionId,ae);ne=Ui.getIds().map(oe=>j.get(oe)).filter(Boolean),ne.length===0&&(ne=null)}let re=v&&p?String(n().actions.beeTitleOf?.(p)??""):"";return(0,M.jsxs)(M.Fragment,{children:[(0,M.jsxs)("div",{ref:b,className:"jyv-page",tabIndex:-1,"data-degraded":N||void 0,"data-full":d||void 0,style:d||N?{left:0}:{left:I},children:[(0,M.jsxs)("div",{className:"jyv-pageHead",children:[(0,M.jsxs)("button",{type:"button",className:"jyv-toolBtn jyv-swarmBtn"+(Be?" jyv-toolBtnOn":""),title:e("hive.swarm.title"),"aria-label":e("hive.swarm.title"),"aria-haspopup":"dialog",onClick:()=>He(!0),children:["\u27E1 ",e("hive.swarm.title")]}),(0,M.jsxs)("button",{type:"button",className:"jyv-toolBtn jyv-swarmBtn"+(X?" jyv-toolBtnOn":""),title:e("hive.hb.title"),"aria-label":e("hive.hb.title"),"aria-haspopup":"dialog",onClick:()=>O(!0),children:["\u2318 ",e("hive.hb.title")]}),(0,M.jsxs)("button",{type:"button",className:"jyv-toolBtn"+(H?" jyv-toolBtnOn":""),title:e("hive.editToggle.tooltip"),"aria-pressed":H,onClick:et,children:["\u270E ",e("hive.editToggle")]}),(0,M.jsxs)("button",{type:"button",className:"jyv-toolBtn"+($e?" jyv-toolBtnOn":""),title:e("hive.spinToggle.tooltip"),"aria-pressed":$e,onClick:Qe,children:["\u27F3 ",e("hive.spinToggle")]}),(0,M.jsxs)("span",{className:"jyv-pageTitle",children:[(0,M.jsx)("span",{className:"jyv-hexMark",dangerouslySetInnerHTML:{__html:Kd}}),e("hive.title")]}),(0,M.jsxs)("span",{className:"jyv-pageActions",children:[(0,M.jsx)("button",{type:"button",className:"jyv-toolBtn"+(f?" jyv-toolBtnOn":""),title:e("hive.legend"),"aria-label":e("hive.legend"),onClick:r,children:"\u25D1"}),(0,M.jsx)("button",{type:"button",className:"jyv-toolBtn"+(ie?" jyv-toolBtnOn":""),title:e("hive.settings.title"),"aria-label":e("hive.settings.title"),"aria-haspopup":"dialog",onClick:()=>ce(!0),children:(0,M.jsx)(Ug.IconSettingsOutline16,{size:16})}),(0,M.jsx)("button",{type:"button",className:"jyv-toolBtn",title:e(d?"hive.exitFullscreen":"hive.fullscreen"),onClick:()=>s(!d),children:d?"\u2921":"\u2922"}),(0,M.jsx)("button",{type:"button",className:"jyv-toolBtn",title:e("hive.title"),onClick:_t,children:"\xD7"})]})]}),(0,M.jsxs)("div",{className:"jyv-canvasWrap",ref:F,children:[k?(0,M.jsx)(Vw,{t:e,onRetry:m.renderer!=="fallback2d"?()=>q(j=>j+1):null}):null,m.showFps!==!1?(0,M.jsx)(Kw,{}):null,(0,M.jsx)(Gw,{t:e,selectedBee:p}),(0,M.jsx)(Jg,{t:e,studio:me,marquee:ne,layout:vt,assignments:Oi.getAssignments(),beeTypes:g,previews:hh.getMap(),onPickBee:j=>{n().actions.clearSelection?.(),n().actions.clearMarquee?.(),n().actions.selectBee(j)}}),(0,M.jsx)(Jw,{}),(0,M.jsx)($w,{t:e,ctl:n,settings:m,setSettings:l}),(0,M.jsx)(Zg,{t:e,ctl:n,settings:m,beeTypes:g,assignments:Oi.getAssignments(),statusCards:_,notify:o,disabled:ie||Be||X})]}),f?(0,M.jsxs)("div",{className:"jyv-legend",children:[(0,M.jsxs)("span",{className:"jyv-legendItem",children:[(0,M.jsx)("span",{className:"jyv-legendDot jyv-state-idle"}),e("hive.legend.idle")]}),(0,M.jsxs)("span",{className:"jyv-legendItem",children:[(0,M.jsx)("span",{className:"jyv-legendDot jyv-state-busy"}),e("hive.legend.busy")]}),(0,M.jsxs)("span",{className:"jyv-legendItem",children:[(0,M.jsx)("span",{className:"jyv-legendDot jyv-state-help"}),e("hive.legend.help")]}),(0,M.jsxs)("span",{className:"jyv-legendItem",children:[(0,M.jsx)("span",{className:"jyv-legendDot jyv-state-done"}),e("hive.legend.done")]}),(0,M.jsxs)("span",{className:"jyv-legendItem",children:["\u{1F36F} ",e("hive.legend.honey")]}),(0,M.jsx)("span",{className:"jyv-legendItem jyv-legendKey",children:e("hive.legend.keysZC")}),(0,M.jsx)("span",{className:"jyv-legendItem jyv-legendKey",children:e("hive.legend.keysE")})]}):null,(0,M.jsx)(Kg,{t:e,kind:ht,slots:ht?Mg(ht,x[ht],e):[],layout:vt,bridgeReady:tn.inputActions!==null&&tn.phase==="plain",disabled:ie||Be||X,summonBusy:en,floorBusy:S,onSlot:async j=>{if(ht==="bee"){if(j.action==="archive"){p&&await n().actions.archiveBee(p);return}if(j.action==="open"){_t();return}await V(j)}else ht==="hive"?await P(j):ht==="floor"&&await J(j)}}),ie?(0,M.jsx)(qg,{t:e,settings:m,setSettings:l,guardRef:Ne,onClose:()=>ce(!1)}):null,Be?(0,M.jsx)(Wg,{t:e,beeTypes:g,guardRef:C,onClose:()=>He(!1),onSave:j=>n().actions.saveBeeTypes?.(j)??Promise.resolve({ok:!1,error:"controller unavailable"}),onNotify:(j,oe)=>o?.(j,oe),modelCatalog:ye,modelState:Ye}):null,X?(0,M.jsx)($g,{t:e,hotbars:x,statusCards:_,beeTypes:g,layout:vt,guardRef:Q,onClose:()=>O(!1),onSave:(j,oe)=>n().actions.saveHotbars?.(j,oe)??Promise.resolve({ok:!1,error:"controller unavailable"})}):null]}),v?(0,M.jsxs)("div",{className:"jyv-floatChrome",children:[(0,M.jsx)("div",{className:"jyv-floatMask jyv-floatMaskT",onClick:h}),(0,M.jsx)("div",{className:"jyv-floatMask jyv-floatMaskB",onClick:h}),(0,M.jsx)("div",{className:"jyv-floatMask jyv-floatMaskL",onClick:h}),(0,M.jsx)("div",{className:"jyv-floatMask jyv-floatMaskR",onClick:h}),(0,M.jsxs)("div",{className:"jyv-floatTitle",children:[(0,M.jsx)("span",{className:"jyv-floatName",children:re}),(0,M.jsx)("button",{type:"button",className:"jyv-floatClose",title:e("hive.float.collapse"),"aria-label":e("hive.float.collapse"),onClick:h,children:"\xD7"})]})]}):null,(0,M.jsx)(Hw,{t:e,menu:Z,onClose:()=>D(null),onAction:Lt,beeTypes:g,assignments:Oi.getAssignments()}),u?(0,M.jsx)("div",{className:"jyv-toast"+(u.kind==="err"?" jyv-toastErr":""),children:jg(e,u.text)},u.seq):null]})}function qw(i,e){let[t,n]=(0,de.useState)(null);return(0,de.useEffect)(()=>{let s=null,r=0,a=90,o=!1,l=-1,c=()=>{try{return document.querySelector('[data-slot="sidebar"]')?.parentElement??null}catch{return null}},h=()=>{let f=c(),m=i.current?.closest("[data-shell-overlay]")??null;if(!f||!m)return!1;let v=f.getBoundingClientRect(),g=m.getBoundingClientRect();if(v.width<=0&&v.height<=0)return!1;let p=Math.max(0,Math.round(v.right-g.left));return p!==l&&(l=p,e.current=p,n(p)),!0},d=()=>{r&&cancelAnimationFrame(r),r=requestAnimationFrame(()=>{r=0,h()})},u=()=>{if(!o){if(h()){let f=c();f&&typeof ResizeObserver<"u"&&(s=new ResizeObserver(d),s.observe(f)),window.addEventListener("resize",d);return}a-- >0&&(r=requestAnimationFrame(u))}};return u(),()=>{o=!0,r&&cancelAnimationFrame(r),s?.disconnect(),window.removeEventListener("resize",d)}},[]),t}function jg(i,e){return{newSession:i("hive.toast.newSession"),archived:i("hive.toast.archived"),openDir:i("hive.toast.openDir"),moveSaved:i("hive.toast.moveSaved"),"conflict-replay":i("hive.toast.moveConflict"),"conflict-retry":i("hive.toast.moveConflict"),moveInvalid:i("hive.toast.moveInvalid"),adoptUnavailable:i("hive.toast.adoptUnavailable"),adoptSelf:i("hive.toast.adoptSelf"),contextLost:i("hive.fallback.title"),swarmSaved:i("hive.swarm.saved"),beeChanged:i("hive.card.beeChanged"),beeCleared:i("hive.card.beeCleared"),hatchSent:i("hive.card.hatchSent"),hatchDegraded:i("hive.card.hatchDegraded"),hatchFailed:i("hive.card.hatchFailed"),hatchMissing:i("hive.card.hatchMissing"),laneCanceled:i("hive.card.laneCanceled"),latchReset:i("hive.card.latchReset"),summoned:i("hive.bar.toastSummoned"),summonFailed:i("hive.bar.toastSummonFailed"),summonMissingBee:i("hive.bar.toastMissingBee"),floorCreated:i("hive.bar.toastFloorCreated"),floorCreateFailed:i("hive.bar.toastFloorCreateFailed"),floorPickFailed:i("hive.bar.toastFloorPickFailed"),floorSummonFailed:i("hive.bar.toastFloorSummonFailed"),summonAppendFailed:i("hive.bar.toastSummonAppendFailed")}[e]??e}var ot=({label:i,hint:e,children:t})=>(0,M.jsxs)("div",{className:"jyv-setRow",children:[(0,M.jsxs)("span",{children:[(0,M.jsx)("div",{className:"jyv-setLabel",children:i}),e?(0,M.jsx)("div",{className:"jyv-setHint",children:e}):null]}),t]}),xo=({value:i,options:e,onChange:t})=>(0,M.jsx)("select",{className:"jyv-setSelect",value:i,onChange:n=>t(n.target.value),children:e.map(([n,s])=>(0,M.jsx)("option",{value:n,children:s},n))}),ch=({value:i,onChange:e})=>(0,M.jsx)("button",{type:"button",className:"jyv-setToggle"+(i?" jyv-setToggleOn":""),onClick:()=>e(!i),"aria-pressed":i}),xi=({value:i,min:e,max:t,step:n,format:s,onChange:r})=>(0,M.jsxs)("span",{className:"jyv-setRangeWrap",children:[(0,M.jsx)("input",{type:"range",className:"jyv-setRange",min:e,max:t,step:n,value:i,onChange:a=>r(Number(a.target.value))}),(0,M.jsx)("span",{className:"jyv-setRangeVal",children:s(i)})]}),$n=({value:i,onChange:e})=>(0,M.jsxs)("span",{className:"jyv-setColorWrap",children:[(0,M.jsx)("input",{type:"color",className:"jyv-setColor",value:i,onChange:t=>e(t.target.value),"aria-label":i}),(0,M.jsx)("span",{className:"jyv-setColorVal",children:i})]}),Bi=({label:i})=>(0,M.jsx)("div",{className:"jyv-setGroup",children:i});function Wg({t:i,beeTypes:e,guardRef:t,onClose:n,onSave:s,onNotify:r,modelCatalog:a,modelState:o}){let[l,c]=(0,de.useState)("types"),[h,d]=(0,de.useState)(!1),u=(0,de.useRef)({}),f=(0,de.useRef)(!1),[m,v]=(0,de.useState)(()=>e.map(C=>({...C,capabilities:(C.capabilities??[]).map(X=>({...X,trigger:{...X.trigger??{}}}))}))),[g,p]=(0,de.useState)(null),[x,_]=(0,de.useState)(!1),[y,E]=(0,de.useState)(()=>e[0]?.id??null),A=JSON.stringify(m)!==JSON.stringify(e);f.current=A,(0,de.useEffect)(()=>{A||v(e.map(C=>({...C,capabilities:(C.capabilities??[]).map(X=>({...X,trigger:{...X.trigger??{}}}))})))},[e,A]);let R=(0,de.useRef)(null),[b,w]=(0,de.useState)(null),I=C=>{C.target.closest("button")||(R.current={startX:C.clientX,startY:C.clientY,base:b??{x:0,y:0}},C.currentTarget.setPointerCapture?.(C.pointerId))},N=C=>{if(!R.current)return;let{startX:X,startY:O,base:Q}=R.current;w({x:Q.x+(C.clientX-X),y:Q.y+(C.clientY-O)})},F=()=>{R.current=null},k=()=>{if(f.current){d(!0);return}n()};Jd("swarm",t,k);let U=(C,X)=>v(O=>O.map(Q=>Q.id===C?{...Q,...X}:Q)),z=()=>{p(null);let C="bee-"+Date.now().toString(36);v(X=>[...X,{id:C,name:"",queuePolicy:"free",capabilities:[]}]),E(C),c("types")},q=C=>{v(X=>X.filter(O=>O.id!==C).map(O=>({...O,capabilities:(O.capabilities??[]).filter(Q=>!(Q.action?.type==="spawn"&&Q.action?.targetBeeTypeId===C))}))),E(X=>X===C?null:X)},Z=(C,X)=>v(O=>{let Q=O.findIndex(ze=>ze.id===C),ye=Q+X;if(Q<0||ye<0||ye>=O.length)return O;let xe=[...O],[Ye]=xe.splice(Q,1);return xe.splice(ye,0,Ye),xe}),D=m.find(C=>C.id===y)??null,H=(C,X,O)=>v(Q=>Q.map(ye=>ye.id===C?{...ye,capabilities:(ye.capabilities??[]).map(xe=>xe.id===X?{...xe,...O}:xe)}:ye)),ee=C=>{let X="cap-"+Date.now().toString(36);v(O=>O.map(Q=>Q.id===C?{...Q,capabilities:[...Q.capabilities??[],{id:X,name:"",trigger:{capture:{}},action:{type:"send",promptTemplate:""},once:!0}]}:Q))},ie=(C,X)=>v(O=>O.map(Q=>Q.id===C?{...Q,capabilities:(Q.capabilities??[]).filter(ye=>ye.id!==X)}:Q)),ce=C=>C?.code?i("hive.bee.err."+C.code):null,Ne=async()=>{let C=km(m);if(C){p(ce(C)??i("hive.bee.err.invalidShape"));return}_(!0);let X=wd(m).map(Q=>({...Q,capabilities:(Q.capabilities??[]).map(ye=>({...ye,trigger:{...ye.trigger}}))})),O=await s(X);if(_(!1),O?.ok){p(null),v(X.map(Q=>({...Q,capabilities:(Q.capabilities??[]).map(ye=>({...ye,trigger:{...ye.trigger}}))}))),r?.("swarmSaved","ok");return}p(O?.error==="host-stale"?i("hive.swarm.hostStale"):i("hive.qc.saveFailed"))},Be=C=>{let X=["types","caps"],O=X.indexOf(l),Q=null;C.key==="ArrowRight"?Q=X[(O+1)%X.length]:C.key==="ArrowLeft"&&(Q=X[(O+X.length-1)%X.length]),Q&&(C.preventDefault(),c(Q),u.current[Q]?.focus?.())},He=(C,X)=>(0,M.jsx)("button",{type:"button",ref:O=>u.current[C]=O,role:"tab",id:"jyv-swarmTab-"+C,"aria-selected":l===C,"aria-controls":"jyv-swarmPanel-"+C,tabIndex:l===C?0:-1,className:"jyv-setTab"+(l===C?" jyv-setTabOn":""),onClick:()=>c(C),children:i(X)});return(0,M.jsx)("div",{className:"jyv-modalBack",onClick:k,children:(0,M.jsxs)("div",{className:"jyv-modal jyv-swarmModal",role:"dialog","aria-modal":"true","aria-label":i("hive.swarm.title"),style:b?{transform:`translate(${b.x}px, ${b.y}px)`}:void 0,onClick:C=>C.stopPropagation(),children:[(0,M.jsxs)("div",{className:"jyv-modalHead jyv-swarmHead",onPointerDown:I,onPointerMove:N,onPointerUp:F,onDoubleClick:()=>w(null),children:[(0,M.jsx)("span",{className:"jyv-modalTitle",children:i("hive.swarm.title")}),(0,M.jsx)("button",{type:"button",className:"jyv-toolBtn",title:i("hive.swarm.close"),onClick:k,children:"\xD7"})]}),(0,M.jsxs)("div",{className:"jyv-setTabs",role:"tablist","aria-label":i("hive.swarm.title"),onKeyDown:Be,children:[He("types","hive.swarm.tabTypes"),He("caps","hive.swarm.tabCaps")]}),h?(0,M.jsxs)("div",{className:"jyv-qcConfirm",role:"alertdialog","aria-label":i("hive.qc.confirmDiscard"),children:[(0,M.jsx)("span",{children:i("hive.qc.confirmDiscard")}),(0,M.jsx)("button",{type:"button",className:"jyv-qcMove",title:i("hive.qc.keepEditing"),onClick:()=>d(!1),children:"\u21A9"}),(0,M.jsx)("button",{type:"button",className:"jyv-qcDiscard",onClick:n,children:i("hive.qc.discard")})]}):null,(0,M.jsxs)("div",{role:"tabpanel",id:"jyv-swarmPanel-types","aria-labelledby":"jyv-swarmTab-types",className:"jyv-modalBody",hidden:l!=="types",children:[(0,M.jsxs)("div",{className:"jyv-qcRows",children:[m.length===0?(0,M.jsx)("div",{className:"jyv-qcEmpty",children:i("hive.swarm.empty")}):null,m.map((C,X)=>(0,M.jsxs)("div",{className:"jyv-qcRow"+(y===C.id?" jyv-swarmRowOn":""),onClick:()=>E(C.id),children:[(0,M.jsxs)("div",{className:"jyv-qcRowHead",children:[(0,M.jsx)("input",{className:"jyv-qcNameInput",value:C.name,placeholder:i("hive.swarm.namePlaceholder"),onChange:O=>U(C.id,{name:O.target.value})}),(0,M.jsx)("button",{type:"button",className:"jyv-qcMove",disabled:X===0,title:i("hive.qc.moveUp"),onClick:()=>Z(C.id,-1),children:"\u2191"}),(0,M.jsx)("button",{type:"button",className:"jyv-qcMove",disabled:X===m.length-1,title:i("hive.qc.moveDown"),onClick:()=>Z(C.id,1),children:"\u2193"}),(0,M.jsx)("button",{type:"button",className:"jyv-qcRemove",title:i("hive.swarm.deleteType"),"aria-label":i("hive.swarm.deleteType"),onClick:()=>q(C.id),children:"\u2715"})]}),(0,M.jsxs)("div",{className:"jyv-swarmTypeRow",onClick:O=>O.stopPropagation(),children:[(0,M.jsxs)("label",{className:"jyv-swarmField",children:[(0,M.jsx)("span",{children:i("hive.swarm.queuePolicy")}),(0,M.jsxs)("select",{value:C.queuePolicy??"free",onChange:O=>U(C.id,{queuePolicy:O.target.value}),children:[(0,M.jsx)("option",{value:"free",children:i("hive.swarm.queueFree")}),(0,M.jsx)("option",{value:"serialized",children:i("hive.swarm.queueSerialized")})]})]}),(0,M.jsxs)("label",{className:"jyv-swarmField",children:[(0,M.jsx)("span",{children:i("hive.swarm.beeModel")}),(0,M.jsx)("select",{value:C.beeModel??"worker",onChange:O=>U(C.id,O.target.value==="worker"?{beeModel:void 0}:{beeModel:O.target.value}),children:fi.map(O=>(0,M.jsx)("option",{value:O,children:i("hive.beeModel."+O)},O))})]}),(0,M.jsxs)("label",{className:"jyv-swarmField jyv-swarmFieldGrow",children:[(0,M.jsx)("span",{children:i("hive.swarm.model")}),o==="loading"?(0,M.jsx)("span",{className:"jyv-swarmHint",children:i("hive.swarm.modelLoading")}):a?(0,M.jsxs)("select",{value:C.model?C.model.provider+"/"+C.model.model+(C.model.reasoningEffort?"/"+C.model.reasoningEffort:""):"",onChange:O=>U(C.id,O.target.value?{model:JSON.parse(O.target.value)}:{model:void 0}),children:[(0,M.jsx)("option",{value:"",children:i("hive.swarm.modelNone")}),(a.groups??[]).flatMap(O=>(O.models??[]).map(Q=>{let ye=Q.reasoning?.efforts??[];return(ye.length?ye:[null]).map(Ye=>{let ze=JSON.stringify({provider:O.id,model:Q.id,...Ye?{reasoningEffort:Ye.id}:{}}),et=O.name+" \xB7 "+Q.name+(Ye?" \xB7 "+Ye.name:"");return(0,M.jsx)("option",{value:ze,children:et},ze)})}))]}):(0,M.jsx)("span",{className:"jyv-swarmHint",children:i("hive.swarm.modelUnavailable")})]})]}),(0,M.jsx)("input",{className:"jyv-qcPromptInput jyv-swarmDesc",value:C.description??"",placeholder:i("hive.swarm.descPlaceholder"),onChange:O=>U(C.id,{description:O.target.value})}),(0,M.jsx)("textarea",{className:"jyv-qcPromptInput jyv-swarmPreset",value:C.presetPrompt??"",placeholder:i("hive.swarm.presetPromptPlaceholder"),"aria-label":i("hive.swarm.presetPromptPlaceholder"),title:i("hive.swarm.presetPromptHint"),onChange:O=>U(C.id,O.target.value.trim()?{presetPrompt:O.target.value}:{presetPrompt:void 0})})]},C.id))]}),(0,M.jsxs)("div",{className:"jyv-qcActions",children:[(0,M.jsxs)("button",{type:"button",className:"jyv-qcAdd",onClick:z,children:["+ ",i("hive.swarm.add")]}),g?(0,M.jsx)("span",{className:"jyv-qcError",role:"alert",children:g}):null,A&&!g?(0,M.jsx)("span",{className:"jyv-qcDirty",children:i("hive.swarm.dirty")}):null,(0,M.jsx)("button",{type:"button",className:"jyv-qcSave",disabled:x,onClick:Ne,children:i(x?"hive.qc.saving":"hive.qc.save")})]})]}),(0,M.jsxs)("div",{role:"tabpanel",id:"jyv-swarmPanel-caps","aria-labelledby":"jyv-swarmTab-caps",className:"jyv-modalBody",hidden:l!=="caps",children:[D?(0,M.jsxs)("div",{className:"jyv-swarmCaps",children:[(0,M.jsxs)("div",{className:"jyv-swarmCapsHead",children:[(0,M.jsx)("span",{children:i("hive.swarm.capsFor").replace("{name}",D.name||D.id)}),(0,M.jsxs)("button",{type:"button",className:"jyv-qcAdd",onClick:()=>ee(D.id),children:["+ ",i("hive.swarm.capAdd")]})]}),(D.capabilities??[]).length===0?(0,M.jsx)("div",{className:"jyv-qcEmpty",children:i("hive.swarm.capEmpty")}):null,(D.capabilities??[]).map(C=>{let X=Object.entries(C.trigger?.capture??{}),O=Array.from(new Set([...X.map(([Q])=>Q)]));return(0,M.jsxs)("div",{className:"jyv-qcRow",children:[(0,M.jsxs)("div",{className:"jyv-qcRowHead",children:[(0,M.jsx)("input",{className:"jyv-qcNameInput",value:C.name,placeholder:i("hive.swarm.capNamePlaceholder"),onChange:Q=>H(D.id,C.id,{name:Q.target.value})}),(0,M.jsxs)("label",{className:"jyv-qcAuto",title:i("hive.swarm.once"),children:[(0,M.jsx)("input",{type:"checkbox",checked:C.once!==!1,onChange:Q=>H(D.id,C.id,{once:Q.target.checked})}),i("hive.swarm.onceLabel")]}),(0,M.jsx)("button",{type:"button",className:"jyv-qcRemove",title:i("hive.swarm.deleteCap"),onClick:()=>ie(D.id,C.id),children:"\u2715"})]}),(0,M.jsxs)("div",{className:"jyv-swarmTypeRow",children:[(0,M.jsxs)("label",{className:"jyv-swarmField",children:[(0,M.jsx)("span",{children:i("hive.swarm.actionType")}),(0,M.jsxs)("select",{value:C.action?.type??"send",onChange:Q=>H(D.id,C.id,{action:{...C.action,type:Q.target.value}}),children:[(0,M.jsx)("option",{value:"send",children:i("hive.swarm.actionSend")}),(0,M.jsx)("option",{value:"spawn",children:i("hive.swarm.actionSpawn")}),(0,M.jsx)("option",{value:"notify",children:i("hive.swarm.actionNotify")}),(0,M.jsx)("option",{value:"conductor",children:i("hive.swarm.actionConductor")})]})]}),C.action?.type==="spawn"?(0,M.jsxs)("label",{className:"jyv-swarmField jyv-swarmFieldGrow",children:[(0,M.jsx)("span",{children:i("hive.swarm.target")}),(0,M.jsxs)("select",{value:C.action?.targetBeeTypeId??"",onChange:Q=>H(D.id,C.id,{action:{...C.action,targetBeeTypeId:Q.target.value}}),children:[(0,M.jsx)("option",{value:"",children:"\u2014"}),m.filter(Q=>Q.id!==D.id).map(Q=>(0,M.jsx)("option",{value:Q.id,children:Q.name||Q.id},Q.id))]})]}):null]}),(0,M.jsxs)("div",{className:"jyv-swarmCapture",children:[X.map(([Q,ye])=>(0,M.jsxs)("span",{className:"jyv-swarmCaptureRow",children:[(0,M.jsx)("input",{className:"jyv-swarmCaptureName",value:Q,"aria-label":i("hive.swarm.capture"),onChange:xe=>{let Ye={...C.trigger?.capture??{}};delete Ye[Q],xe.target.value&&(Ye[xe.target.value]=ye),H(D.id,C.id,{trigger:{...C.trigger,capture:Ye}})}}),(0,M.jsx)("span",{children:"="}),(0,M.jsx)("input",{className:"jyv-swarmCapturePath",value:ye,placeholder:i("hive.swarm.capturePlaceholder"),onChange:xe=>H(D.id,C.id,{trigger:{...C.trigger,capture:{...C.trigger?.capture??{},[Q]:xe.target.value}}})}),(0,M.jsx)("button",{type:"button",className:"jyv-qcRemove",onClick:()=>{let xe={...C.trigger?.capture??{}};delete xe[Q],H(D.id,C.id,{trigger:{...C.trigger,capture:xe}})},children:"\u2715"})]},Q)),(0,M.jsx)("button",{type:"button",className:"jyv-qcMove",title:i("hive.swarm.capture"),onClick:()=>{let Q="V"+(X.length+1);H(D.id,C.id,{trigger:{...C.trigger,capture:{...C.trigger?.capture??{},[Q]:""}}})},children:"+"})]}),(0,M.jsx)("input",{className:"jyv-qcPromptInput jyv-swarmDesc",value:C.trigger?.filePredicate??"",placeholder:i("hive.swarm.filePredicatePlaceholder"),onChange:Q=>H(D.id,C.id,{trigger:{...C.trigger,filePredicate:Q.target.value}})}),C.action?.type==="send"||C.action?.type==="spawn"?(0,M.jsxs)("div",{children:[(0,M.jsx)("textarea",{className:"jyv-qcPromptInput",rows:Math.min(6,Math.max(2,String(C.action?.promptTemplate??"").split(`
`).length)),value:C.action?.promptTemplate??"",placeholder:i("hive.swarm.promptPlaceholder"),onChange:Q=>H(D.id,C.id,{action:{...C.action,promptTemplate:Q.target.value}})}),O.length?(0,M.jsx)("div",{className:"jyv-swarmInsert",children:O.map(Q=>(0,M.jsx)("button",{type:"button",className:"jyv-qcMove",title:i("hive.swarm.insertVar").replace("{v}",Q),onClick:()=>H(D.id,C.id,{action:{...C.action,promptTemplate:String(C.action?.promptTemplate??"")+"{"+Q+"}"}}),children:"{"+Q+"}"},Q))}):null]}):null]},C.id)})]}):(0,M.jsx)("div",{className:"jyv-qcEmpty",children:i("hive.swarm.empty")}),(0,M.jsxs)("div",{className:"jyv-qcActions",children:[g?(0,M.jsx)("span",{className:"jyv-qcError",role:"alert",children:g}):null,A&&!g?(0,M.jsx)("span",{className:"jyv-qcDirty",children:i("hive.swarm.dirty")}):null,(0,M.jsx)("button",{type:"button",className:"jyv-qcSave",disabled:x,onClick:Ne,children:i(x?"hive.qc.saving":"hive.qc.save")})]})]})]})})}function qg({t:i,settings:e,setSettings:t,guardRef:n,onClose:s}){let[r,a]=(0,de.useState)("scene"),o=()=>{s()};return Jd("settings",n,o),(0,M.jsxs)(Xg,{t:i,title:i("hive.settings.title"),closeLabel:i("hive.settings.close"),sections:[{key:"scene",icon:"\u25C7",label:i("hive.settings.navScene")},{key:"appearance",icon:"\u2726",label:i("hive.settings.navAppearance")},{key:"layout",icon:"\u25A6",label:i("hive.settings.navLayout")}],active:r,onNavigate:a,requestClose:o,children:[(0,M.jsx)("div",{className:"jyv-modalBody",role:"tabpanel",id:"jyv-railPanel-scene","aria-labelledby":"jyv-railTab-scene",hidden:r!=="scene",children:(0,M.jsx)(Xw,{t:i,settings:e,setSettings:t})}),(0,M.jsx)("div",{className:"jyv-modalBody",role:"tabpanel",id:"jyv-railPanel-appearance","aria-labelledby":"jyv-railTab-appearance",hidden:r!=="appearance",children:(0,M.jsx)(Yw,{t:i,settings:e,setSettings:t})}),(0,M.jsx)("div",{className:"jyv-modalBody",role:"tabpanel",id:"jyv-railPanel-layout","aria-labelledby":"jyv-railTab-layout",hidden:r!=="layout",children:(0,M.jsx)(Yg,{t:i,settings:e,setSettings:t})})]})}function Jd(i,e,t){(0,de.useEffect)(()=>(e.current=t,Hg(i,t),()=>{e.current=null,Yd(i)}))}function Xg({t:i,title:e,closeLabel:t,sections:n,active:s,onNavigate:r,requestClose:a,children:o}){let l=(0,de.useRef)({});return(0,M.jsx)("div",{className:"jyv-modalBack",onClick:a,children:(0,M.jsxs)("div",{className:"jyv-modal jyv-railModal",role:"dialog","aria-modal":"true","aria-label":e,onClick:h=>h.stopPropagation(),children:[(0,M.jsxs)("div",{className:"jyv-modalHead",children:[(0,M.jsx)("span",{className:"jyv-modalTitle",children:e}),(0,M.jsx)("button",{type:"button",className:"jyv-toolBtn",title:t,onClick:a,children:"\xD7"})]}),(0,M.jsxs)("div",{className:"jyv-railBody",children:[(0,M.jsx)("div",{className:"jyv-railNav",role:"tablist","aria-label":e,"aria-orientation":"vertical",onKeyDown:h=>{let d=n.map(m=>m.key),u=d.indexOf(s),f=null;h.key==="ArrowDown"?f=d[(u+1)%d.length]:h.key==="ArrowUp"?f=d[(u+d.length-1)%d.length]:h.key==="Home"?f=d[0]:h.key==="End"&&(f=d[d.length-1]),f&&(h.preventDefault(),r(f),l.current[f]?.focus?.())},children:n.map(h=>(0,M.jsxs)("button",{type:"button",ref:d=>l.current[h.key]=d,role:"tab",id:"jyv-railTab-"+h.key,"aria-selected":s===h.key,"aria-controls":"jyv-railPanel-"+h.key,tabIndex:s===h.key?0:-1,className:"jyv-railItem"+(s===h.key?" jyv-railItemOn":""),onClick:()=>r(h.key),children:[(0,M.jsx)("span",{className:"jyv-railIcon","aria-hidden":"true",children:h.icon}),(0,M.jsx)("span",{className:"jyv-railLabel",children:h.label})]},h.key))}),(0,M.jsx)("div",{className:"jyv-railContent",children:o})]})]})})}function Xw({t:i,settings:e,setSettings:t}){let n=s=>t?.(s);return(0,M.jsxs)("div",{className:"jyv-settings",children:[(0,M.jsx)(ot,{label:i("hive.settings.renderer"),hint:i("hive.settings.rendererHint"),children:(0,M.jsx)(xo,{value:e?.renderer??"webgl",options:[["webgl",i("hive.settings.rendererWebgl")],["fallback2d",i("hive.settings.renderer2d")]],onChange:s=>n({renderer:s})})}),(0,M.jsx)(ot,{label:i("hive.settings.showFps"),hint:i("hive.settings.showFpsHint"),children:(0,M.jsx)(ch,{value:e?.showFps!==!1,onChange:s=>n({showFps:s})})}),(0,M.jsx)(ot,{label:i("hive.settings.anim"),hint:i("hive.settings.animHint"),children:(0,M.jsx)(xo,{value:e?.animation??"full",options:[["full",i("hive.anim.full")],["force",i("hive.anim.force")],["reduced",i("hive.anim.reduced")]],onChange:s=>n({animation:s})})}),(0,M.jsx)(ot,{label:i("hive.settings.cameraPitch"),hint:i("hive.settings.cameraPitchHint"),children:(0,M.jsx)(xi,{value:e?.cameraPitchDeg??45,min:15,max:70,step:1,format:s=>s+"\xB0",onChange:s=>n({cameraPitchDeg:s})})}),(0,M.jsx)(ot,{label:i("hive.settings.drones"),children:(0,M.jsx)(xo,{value:e?.drones??"active-only",options:[["active-only",i("hive.drones.activeOnly")],["all",i("hive.drones.all")]],onChange:s=>n({drones:s})})}),(0,M.jsx)(ot,{label:i("hive.settings.watermark"),children:(0,M.jsx)(ch,{value:(e?.watermark??"show")==="show",onChange:s=>n({watermark:s?"show":"hide"})})}),(0,M.jsx)(ot,{label:i("hive.settings.hotkey"),children:(0,M.jsx)(xo,{value:e?.hotkey??"alt+h",options:[["alt+h",i("hive.hotkey.alt")],["ctrl+alt+h",i("hive.hotkey.ctrl")],["off",i("hive.hotkey.off")]],onChange:s=>n({hotkey:s})})}),(0,M.jsx)(ot,{label:i("hive.settings.follow"),hint:i("hive.settings.followHint"),children:(0,M.jsx)(ch,{value:!!e?.followCurrent,onChange:s=>n({followCurrent:s})})}),(0,M.jsx)(ot,{label:i("hive.settings.batchSendConfirm"),hint:i("hive.settings.batchSendConfirmHint"),children:(0,M.jsx)(ch,{value:e?.batchSendConfirm!==!1,onChange:s=>n({batchSendConfirm:s})})})]})}function Yw({t:i,settings:e,setSettings:t}){let n=a=>t?.(a),s={...Hs,rev:Or,...e?.appearance??{}},r=a=>n({appearance:{...s,...a}});return(0,M.jsxs)("div",{className:"jyv-settings",children:[(0,M.jsx)(Bi,{label:i("hive.appearance.chromeGroup")}),(0,M.jsx)(ot,{label:i("hive.appearance.chrome"),hint:i("hive.appearance.chromeHint"),children:(0,M.jsx)(xo,{value:go.includes(e?.chromeScheme)?e.chromeScheme:"default",onChange:a=>n({chromeScheme:a}),options:[["default",i("hive.appearance.chromeDefault")],["amber",i("hive.appearance.chromeAmber")],["indigo",i("hive.appearance.chromeIndigo")],["cyan",i("hive.appearance.chromeCyan")],["magenta",i("hive.appearance.chromeMagenta")],["frost",i("hive.appearance.chromeFrost")]]})}),(0,M.jsx)(Bi,{label:i("hive.appearance.groupWall")}),(0,M.jsx)(ot,{label:i("hive.appearance.wallOuter"),hint:i("hive.appearance.wallOuterHint"),children:(0,M.jsx)(xi,{value:s.outerWallAlpha,min:.05,max:1,step:.05,format:a=>Math.round(a*100)+"%",onChange:a=>r({outerWallAlpha:a})})}),(0,M.jsx)(ot,{label:i("hive.appearance.wallInner"),hint:i("hive.appearance.wallInnerHint"),children:(0,M.jsx)(xi,{value:s.innerWallAlpha,min:.02,max:1,step:.02,format:a=>Math.round(a*100)+"%",onChange:a=>r({innerWallAlpha:a})})}),(0,M.jsx)(ot,{label:i("hive.appearance.innerTrim"),hint:i("hive.appearance.innerTrimHint"),children:(0,M.jsx)(xi,{value:s.innerTrimAlpha,min:0,max:1,step:.05,format:a=>Math.round(a*100)+"%",onChange:a=>r({innerTrimAlpha:a})})}),(0,M.jsx)(ot,{label:i("hive.appearance.trimGlow"),hint:i("hive.appearance.trimGlowHint"),children:(0,M.jsx)(xi,{value:s.trimGlow,min:0,max:4,step:.1,format:a=>"\xD7"+Number(a).toFixed(1),onChange:a=>r({trimGlow:a})})}),(0,M.jsx)(ot,{label:i("hive.appearance.wallGold"),children:(0,M.jsx)($n,{value:s.wallGold,onChange:a=>r({wallGold:a})})}),(0,M.jsx)(ot,{label:i("hive.appearance.trimColor"),children:(0,M.jsx)($n,{value:s.trimColor,onChange:a=>r({trimColor:a})})}),(0,M.jsx)(Bi,{label:i("hive.appearance.groupFloor")}),(0,M.jsx)(ot,{label:i("hive.appearance.floorBase"),children:(0,M.jsx)($n,{value:s.floorBase,onChange:a=>r({floorBase:a})})}),(0,M.jsx)(ot,{label:i("hive.appearance.floorLine"),children:(0,M.jsx)($n,{value:s.floorLine,onChange:a=>r({floorLine:a})})}),(0,M.jsx)(Bi,{label:i("hive.appearance.groupPad")}),(0,M.jsx)(ot,{label:i("hive.appearance.padBase"),children:(0,M.jsx)($n,{value:s.padBase,onChange:a=>r({padBase:a})})}),(0,M.jsx)(ot,{label:i("hive.appearance.padInner"),children:(0,M.jsx)($n,{value:s.padInner,onChange:a=>r({padInner:a})})}),(0,M.jsx)(Bi,{label:i("hive.appearance.groupAccent")}),(0,M.jsx)(ot,{label:i("hive.appearance.outline"),children:(0,M.jsx)($n,{value:s.outlineColor,onChange:a=>r({outlineColor:a})})}),(0,M.jsx)(ot,{label:i("hive.appearance.amber"),children:(0,M.jsx)($n,{value:s.amberColor,onChange:a=>r({amberColor:a})})}),(0,M.jsx)(ot,{label:i("hive.appearance.mote"),children:(0,M.jsx)($n,{value:s.moteColor,onChange:a=>r({moteColor:a})})}),(0,M.jsx)(Bi,{label:i("hive.appearance.groupSky")}),(0,M.jsx)(ot,{label:i("hive.appearance.skyTop"),children:(0,M.jsx)($n,{value:s.skyTop,onChange:a=>r({skyTop:a})})}),(0,M.jsx)(ot,{label:i("hive.appearance.horizon"),children:(0,M.jsx)($n,{value:s.horizonGlow,onChange:a=>r({horizonGlow:a})})})]})}function Yg({t:i,settings:e,setSettings:t}){let n=a=>t?.(a),s=qr(e?.layout),r=a=>n({layout:{...s,...a}});return(0,M.jsxs)("div",{className:"jyv-settings",children:[(0,M.jsx)(Bi,{label:i("hive.settings.layoutPanelGroup")}),(0,M.jsx)(ot,{label:i("hive.settings.layoutPanelM"),hint:i("hive.settings.layoutHint"),children:(0,M.jsx)(xi,{value:s.panelM,min:fs.m[0],max:fs.m[1],step:1,format:a=>String(a),onChange:a=>r({panelM:a})})}),(0,M.jsx)(ot,{label:i("hive.settings.layoutPanelN"),children:(0,M.jsx)(xi,{value:s.panelN,min:fs.n[0],max:fs.n[1],step:1,format:a=>String(a),onChange:a=>r({panelN:a})})}),(0,M.jsx)(Bi,{label:i("hive.settings.layoutBarGroup")}),(0,M.jsx)(ot,{label:i("hive.settings.layoutBarM"),hint:i("hive.settings.layoutHint"),children:(0,M.jsx)(xi,{value:s.barM,min:ps.m[0],max:ps.m[1],step:1,format:a=>String(a),onChange:a=>r({barM:a})})}),(0,M.jsx)(ot,{label:i("hive.settings.layoutBarN"),children:(0,M.jsx)(xi,{value:s.barN,min:ps.n[0],max:ps.n[1],step:1,format:a=>String(a),onChange:a=>r({barN:a})})}),(0,M.jsx)(Bi,{label:i("hive.settings.reportGroup")}),(0,M.jsx)(ot,{label:i("hive.settings.reportRows"),hint:i("hive.settings.reportRowsHint"),children:(0,M.jsx)(xi,{value:Bg(e.reportRows),min:ms[0],max:ms[1],step:1,format:a=>String(a),onChange:a=>n({reportRows:a})})}),(0,M.jsx)("div",{className:"jyv-setActions",children:(0,M.jsx)("button",{type:"button",className:"jyv-setReset",onClick:()=>n({animation:"full",watermark:"show",drones:"active-only",hotkey:"alt+h",followCurrent:!0,renderer:"webgl",reportCollapsed:!1,reportRows:8,cameraPitchDeg:45,rightDragSpin:!1,batchSendConfirm:!0,appearance:{...Hs,rev:Or},layout:{...ds}}),children:i("hive.settings.resetAll")})})]})}function Kw(){let i=(0,de.useRef)(null);return(0,de.useEffect)(()=>{let e=0,t=0,n=performance.now(),s=r=>{if(t+=1,r-n>=500){let a=Math.round(t*1e3/(r-n));i.current&&(i.current.textContent=String(a)+" FPS"),t=0,n=r}e=requestAnimationFrame(s)};return e=requestAnimationFrame(s),()=>cancelAnimationFrame(e)},[]),(0,M.jsx)("div",{ref:i,className:"jyv-fps",children:"-- FPS"})}function Kg({t:i,kind:e,slots:t,layout:n,bridgeReady:s,disabled:r,summonBusy:a,floorBusy:o,onSlot:l}){if(!e)return null;let c=Math.max(1,n.barM),h=Math.max(1,n.barN),d=c*h,u=t.slice(0,d);if(u.length===0)return null;let f=Math.min(u.length,c),m=i(Bd.includes(e)?"hive.bar.defaults.hintResident":"hive.bar.defaults.hint");return(0,M.jsx)("div",{className:"jyv-hotbar",role:"group","aria-label":i("hive.bar.aria."+e),"data-kind":e,style:{"--jyv-hb-cols":f,"--jyv-hb-rows":h},children:u.map(v=>{let g=String(v.prompt??""),p=!g.trim(),x=r,_=g;return e==="bee"?v.action?_=v.action==="archive"?i("hive.bar.defaults.beeArchiveTitle"):i("hive.bar.defaults.beeOpenTitle"):x=x||p||v.autoSend!==!0&&!s:e==="hive"?(x=x||v.summon!==!0||a,_=v.summon===!0?g||i("hive.bar.pureSummon"):i("hive.bar.summonOff")):(x=x||o,_=g||i("hive.bar.floorHint")),(0,M.jsxs)("button",{type:"button",className:"jyv-hbCard","data-auto":v.autoSend===!0||void 0,"data-action":v.action||void 0,"data-busy":e==="hive"&&a||e==="floor"&&o||void 0,disabled:x,title:_,onClick:()=>l(v),children:[e==="hive"?(0,M.jsx)("span",{className:"jyv-hbGlyph","aria-hidden":"true",children:"\u{1F95A}"}):null,e==="floor"?(0,M.jsx)("span",{className:"jyv-hbGlyph","aria-hidden":"true",children:"\u2B21"}):null,v.autoSend===!0?(0,M.jsx)("span",{className:"jyv-hbBolt","aria-hidden":"true",children:"\u26A1"}):null,v.builtin===!0?(0,M.jsx)("span",{className:"jyv-hbBuiltin",title:m,children:i("hive.bar.defaults.badge")}):null,(0,M.jsx)("span",{className:"jyv-hbName",children:v.name})]},v.id)})})}function Jg({t:i,studio:e,marquee:t,layout:n,assignments:s,beeTypes:r,previews:a,onPickBee:o}){let l=Array.isArray(t);if(!l&&!e)return null;let c=Math.max(1,n.panelM),h=Math.max(1,n.panelN),d=g=>r.find(p=>p.id===g)?.name??"",u=g=>{let p=r.find(x=>x.id===g);return p&&fi.includes(p.beeModel)?p.beeModel:Fi},f=l?t:(e.bees??[]).filter(g=>!g.droneStandIn).slice().sort((g,p)=>(g.cellIndex??0)-(p.cellIndex??0)),m=f.length%c,v=l||m===0?0:c-m;return(0,M.jsxs)("div",{className:"jyv-workerPanel","data-mode":l?"marquee":"studio","data-empty":f.length===0||void 0,style:{"--jyv-wp-cols":c,"--jyv-wp-rows":h},children:[(0,M.jsx)("div",{className:"jyv-wpHead",children:l?(0,M.jsx)("span",{className:"jyv-wpCount",children:i("hive.panel.selected").replace("{n}",String(f.length))}):(0,M.jsxs)("span",{className:"jyv-wpCount",children:[f.length,"/",e.capacity??f.length]})}),f.length===0?(0,M.jsx)("div",{className:"jyv-wpEmpty",children:i("hive.panel.empty")}):(0,M.jsxs)("div",{className:"jyv-wpGrid",children:[f.map(g=>{let p=s?.[g.sessionId]??"",x=p?d(p):"",_=g.state??"idle",y=a?.[u(p)+":"+_]??null,E=g.drones?.length??0;return(0,M.jsxs)("button",{type:"button",className:"jyv-wpCard jyv-state-"+_,title:g.displayTitle??"",onClick:()=>o(g.sessionId),children:[(0,M.jsx)("span",{className:"jyv-wpFig",children:y?(0,M.jsx)("img",{className:"jyv-wpPreview",src:y,alt:"",draggable:!1}):null}),(0,M.jsxs)("span",{className:"jyv-wpBody",children:[(0,M.jsxs)("span",{className:"jyv-wpCardHead",children:[(0,M.jsx)("span",{className:"jyv-legendDot jyv-state-"+_}),(0,M.jsx)("span",{className:"jyv-wpName",children:g.displayTitle??g.sessionId})]}),g.todos?(0,M.jsxs)("span",{className:"jyv-wpTodos",children:[(0,M.jsx)("span",{className:"jyv-cardTodosBar",children:(0,M.jsx)("span",{style:{width:Math.round(g.todos.done/Math.max(1,g.todos.total)*100)+"%"}})}),(0,M.jsxs)("span",{className:"jyv-wpTodosVal",children:[g.todos.done,"/",g.todos.total]})]}):null,E>0||x?(0,M.jsxs)("span",{className:"jyv-wpMeta",children:[E>0?(0,M.jsxs)("span",{className:"jyv-wpDrones",title:i("hive.panel.drones").replace("{a}",String(g.activeDroneCount??0)).replace("{n}",String(E)),children:["\u{1F41D}",g.activeDroneCount??0,"/",E]}):null,x?(0,M.jsx)("span",{className:"jyv-wpBadge",children:x}):null]}):null]})]},g.sessionId)}),Array.from({length:v},(g,p)=>(0,M.jsx)("div",{className:"jyv-wpCard jyv-wpPlaceholder","aria-hidden":"true"},"ph-"+p))]})]})}function Jw(){let i=(0,de.useRef)(null);return(0,de.useEffect)(()=>dh.subscribe(()=>{let e=i.current;if(!e)return;let t=dh.rect;if(!t){e.style.display="none";return}e.style.display="block",e.style.left=t.x0+"px",e.style.top=t.y0+"px",e.style.width=Math.max(0,t.x1-t.x0)+"px",e.style.height=Math.max(0,t.y1-t.y0)+"px"}),[]),(0,M.jsx)("div",{ref:i,className:"jyv-marquee",style:{display:"none"},"aria-hidden":"true"})}function Zw({t:i,entry:e}){let t=e.name??"",n="",s=[];switch(e.kind){case st.enterWorker:n=i("hive.report.enterWorker").replace("{name}",t);break;case st.start:n=i("hive.report.start").replace("{name}",t);break;case st.done:n=i("hive.report.done").replace("{name}",t);break;case st.help:n=i("hive.report.help").replace("{name}",t);break;case st.dronesNew:n=i("hive.report.dronesNew").replace("{n}",String(e.count??0));break;case st.dronesDone:n=i("hive.report.dronesDone").replace("{n}",String(e.count??0));break;case st.archive:n=i("hive.report.archive");break;case st.newNest:n=i("hive.report.newNest").replace("{title}",e.title??"");break;case st.nestMove:n=i("hive.report.nestMove").replace("{title}",e.title??"");break;case st.wildBee:n=i("hive.report.wildBee").replace("{name}",t);break;case st.receipt:n=jg(i,e.text??"");break;default:n=""}let r=new Date(e.ts),a=String(r.getHours()).padStart(2,"0"),o=String(r.getMinutes()).padStart(2,"0"),l=e.title!=null&&e.title!==""&&e.kind!==st.newNest&&e.kind!==st.nestMove&&e.kind!==st.wildBee&&e.kind!==st.receipt;return(0,M.jsxs)("div",{className:"jyv-combatRow","data-kind":e.kind,"data-low":e.low?"true":void 0,children:[(0,M.jsxs)("span",{className:"jyv-combatTime",children:[a,":",o]}),l?(0,M.jsxs)("span",{className:"jyv-combatTitle",children:["[",e.title,"]"]}):null,(0,M.jsx)("span",{className:"jyv-combatVerb",children:n}),s.length?(0,M.jsx)("span",{className:"jyv-combatBody",children:s}):null]})}function $w({t:i,ctl:e,settings:t,setSettings:n}){let s=e().feed(),r=(0,de.useSyncExternalStore)(p=>s?s.subscribe(p):()=>{},()=>s?s.getSnapshot():0),[a,o]=(0,de.useState)(!0),l=(0,de.useRef)(null),[c,h]=(0,de.useState)(()=>typeof window<"u"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);(0,de.useEffect)(()=>{let p=typeof window<"u"?window.matchMedia?.("(prefers-reduced-motion: reduce)"):null;if(!p)return;let x=()=>h(!!p.matches);return x(),p.addEventListener?.("change",x),()=>p?.removeEventListener?.("change",x)},[]);let d=t.animation==="reduced"||t.animation!=="force"&&c,u=t.reportCollapsed===!0,f=Bg(t.reportRows);if(!s)return null;let m=p=>{s.setCollapsed(p),n({reportCollapsed:p})},v=s.list(),g=a?v:v.filter(p=>!p.low);return(0,de.useEffect)(()=>{let p=l.current;p&&(p.scrollTop=p.scrollHeight)},[r,g.length,u]),(0,M.jsx)("div",{className:"jyv-combatLog","data-collapsed":u?"true":void 0,"data-hidelow":a?void 0:"true","data-reduced":d?"true":void 0,style:{"--jyv-report-rows":f},children:u?(0,M.jsxs)("button",{type:"button",className:"jyv-combatLogPill",title:i("hive.report.expand").replace("{n}",String(s.unread)),"aria-label":i("hive.report.expand").replace("{n}",String(s.unread)),onClick:()=>m(!1),children:["\u2694 ",i("hive.report.title"),s.unread>0?(0,M.jsx)("span",{className:"jyv-combatLogBadge",children:s.unread}):null]}):(0,M.jsxs)(M.Fragment,{children:[(0,M.jsxs)("div",{className:"jyv-combatLogHead",children:[(0,M.jsx)("span",{className:"jyv-combatLogTitle",children:i("hive.report.title")}),(0,M.jsxs)("label",{className:"jyv-combatLogFilter",title:i("hive.report.filterLow"),children:[(0,M.jsx)("input",{type:"checkbox",checked:a,onChange:p=>o(p.target.checked)}),i(a?"hive.report.filterLowOn":"hive.report.filterLow")]}),(0,M.jsx)("button",{type:"button",className:"jyv-combatLogClear",title:i("hive.report.clear"),"aria-label":i("hive.report.clear"),onClick:()=>s.clear(),children:"\u{1F5D1}"}),(0,M.jsx)("button",{type:"button",className:"jyv-combatLogClose",title:i("hive.report.collapse"),"aria-label":i("hive.report.collapse"),onClick:()=>m(!0),children:"\xD7"})]}),g.length===0?(0,M.jsx)("div",{className:"jyv-combatLogEmpty",children:i("hive.report.empty")}):(0,M.jsx)("div",{className:"jyv-combatLogList",ref:l,children:g.map(p=>(0,M.jsx)(Zw,{t:i,entry:p},p.seq))})]})})}function Zg({t:i,ctl:e,settings:t,beeTypes:n,assignments:s,statusCards:r,notify:a,disabled:o}){let l=(0,de.useSyncExternalStore)(k=>yo.subscribe(k),()=>yo.getSnapshot()),[c,h]=(0,de.useState)(()=>typeof window<"u"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);(0,de.useEffect)(()=>{let k=typeof window<"u"?window.matchMedia?.("(prefers-reduced-motion: reduce)"):null;if(!k)return;let U=()=>h(!!k.matches);return U(),k.addEventListener?.("change",U),()=>k?.removeEventListener?.("change",U)},[]);let d=t.animation==="reduced"||t.animation!=="force"&&c,u=e().actions.getScene?.()?.world??null,f=e().actions.sessionsSnapshot?.()??null,m=Tg(u,s,f),v=Cg({reportCollapsed:t.reportCollapsed===!0,reportRows:t.reportRows}),g=(0,de.useRef)({}),[p,x]=(0,de.useState)(null),[_,y]=(0,de.useState)(null),E=[...n.map(k=>({typeId:k.id,name:k.name||k.id})),{typeId:"default",name:i("hive.status.default")}],A=k=>{let U=mo(m,k);if(U.length===0)return;let z=Eg(U.length,g.current[k]??0);g.current[k]=z,e().actions.clearSelection?.(),e().actions.selectBee(U[z])},R=async k=>{let U=r?.[k];if(!U||!String(U.prompt??"").trim())return;let z=Ag(m,k);if(z.length===0){a(i("hive.status.toastNone"),"err");return}if(U.autoSend!==!0&&t.batchSendConfirm!==!1){y({typeId:k,prompt:U.prompt,targets:z});return}await w(k,z)},b=()=>{y(null)};(0,de.useEffect)(()=>{if(_)return Hg("statusConfirm",b),()=>Yd("statusConfirm")},[_]);let w=async(k,U)=>{let z=r?.[k];x({typeId:k,sending:!0});let q=0,Z=0;for(let D of U){let H=await Od(D,z?.prompt??"");H?.ok?q++:(Z++,console.warn("[dsh-v-hive] status-card send failed:",D,H?.error))}x(null),a(i("hive.status.toastSent").replace("{n}",String(q)).replace("{m}",String(Z)),Z>0?"err":"ok")},I=async()=>{let k=_;y(null),k&&await w(k.typeId,k.targets)};if(o)return null;let N=E,F=N.reduce((k,U)=>k+mo(m,U.typeId).length,0);return(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)("div",{className:"jyv-statusBar",role:"group","aria-label":i("hive.status.aria"),"data-hidden":F<=0?"true":void 0,"data-reduced":d?"true":void 0,style:{"--jyv-statusBarBottom":"calc(76px + "+v+"px)"},children:N.map(k=>{let z=mo(m,k.typeId).length,q=r?.[k.typeId],Z=!!q&&String(q.prompt??"").trim().length>0,D=k.typeId==="default",H=p?.sending&&p.typeId===k.typeId,ee=z===0||H;return(0,M.jsxs)("div",{className:"jyv-statusCard"+(D?" jyv-statusDefault":""),title:i("hive.status.cardTitle").replace("{name}",k.name).replace("{count}",String(z)),onClick:()=>A(k.typeId),children:[(0,M.jsx)("span",{className:"jyv-statusName",children:k.name}),(0,M.jsx)("span",{className:"jyv-statusCount"+(z>0?" jyv-statusCountOn":""),children:z}),!D&&Z?(0,M.jsx)("button",{type:"button",className:"jyv-statusSend",disabled:ee,title:i(z===0?"hive.status.sendEmpty":"hive.status.send"),onClick:ie=>{ie.stopPropagation(),R(k.typeId)},children:H?"\u2026":"\u27A4"}):null]},k.typeId)})}),_?(0,M.jsx)("div",{className:"jyv-modalBack jyv-statusConfirmBack",onClick:b,children:(0,M.jsxs)("div",{className:"jyv-modal jyv-statusConfirm",role:"dialog","aria-modal":"true","aria-label":i("hive.status.confirmTitle"),onClick:k=>k.stopPropagation(),children:[(0,M.jsxs)("div",{className:"jyv-modalHead",children:[(0,M.jsx)("span",{className:"jyv-modalTitle",children:i("hive.status.confirmTitle")}),(0,M.jsx)("button",{type:"button",className:"jyv-toolBtn",title:i("hive.status.cancel"),onClick:b,children:"\xD7"})]}),(0,M.jsxs)("div",{className:"jyv-modalBody",children:[(0,M.jsxs)("div",{className:"jyv-statusConfirmHint",children:[i("hive.status.confirmHint")," \xB7 ",i("hive.status.confirmTargets"),": ",_.targets.length]}),(0,M.jsx)("div",{className:"jyv-statusConfirmLabel",children:i("hive.status.confirmPrompt")}),(0,M.jsx)("pre",{className:"jyv-statusConfirmPrompt",children:_.prompt})]}),(0,M.jsxs)("div",{className:"jyv-modalHead",children:[(0,M.jsx)("button",{type:"button",className:"jyv-qcSave",onClick:I,children:i("hive.status.confirm")}),(0,M.jsx)("button",{type:"button",className:"jyv-qcDiscard",onClick:b,children:i("hive.status.cancel")})]})]})}):null]})}function Gd(){try{if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID()}catch{}return"slot-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10)}function $g({t:i,hotbars:e,statusCards:t,beeTypes:n,layout:s,guardRef:r,onClose:a,onSave:o}){let[l,c]=(0,de.useState)("hive"),[h,d]=(0,de.useState)(!1),[u,f]=(0,de.useState)(null),[m,v]=(0,de.useState)(null),[g,p]=(0,de.useState)(!1),[x,_]=(0,de.useState)(()=>mi(e)),[y,E]=(0,de.useState)(()=>gi(t,n)),[A,R]=(0,de.useState)(null),b=JSON.stringify(x)!==JSON.stringify(mi(e)),w=JSON.stringify(y)!==JSON.stringify(gi(t,n)),I=b||w,N=(0,de.useRef)(!1);N.current=I,(0,de.useEffect)(()=>{b||_(mi(e))},[e,b]),(0,de.useEffect)(()=>{w||(E(gi(t,n)),R(C=>C&&!n.some(X=>X.id===C)?null:C))},[t,n,w]);let F=()=>{if(N.current){d(!0);return}a()};Jd("hotbars",r,F);let k=x[l]??[],U=Math.max(1,s.barM)*Math.max(1,s.barN),z=k.find(C=>C.id===u)??null,q=(C,X)=>_(O=>({...O,[l]:O[l].map(Q=>Q.id===C?{...Q,...X}:Q)})),Z=()=>{v(null);let C=l==="bee"?{id:Gd(),name:"",prompt:"",autoSend:!1}:l==="hive"?{id:Gd(),name:"",summon:!1,autoSend:!1}:{id:Gd(),name:"",createBee:!0,autoSend:!1};_(X=>({...X,[l]:[...X[l],C]})),f(C.id)},D=C=>{_(X=>({...X,[l]:X[l].filter(O=>O.id!==C)})),f(X=>X===C?null:X)},H=(C,X)=>_(O=>{let Q=O[l],ye=Q.findIndex(et=>et.id===C),xe=ye+X;if(ye<0||xe<0||xe>=Q.length)return O;let Ye=[...Q],[ze]=Ye.splice(ye,1);return Ye.splice(xe,0,ze),{...O,[l]:Ye}}),ee=(C,X)=>E(O=>{let Q={...O},ye={prompt:"",autoSend:!1,...Q[C]??{},...X},xe=String(ye.prompt??"").trim();return xe?Q[C]={prompt:xe,autoSend:ye.autoSend===!0}:delete Q[C],Q}),ie=C=>E(X=>{let O={...X};return delete O[C],O}),ce=async()=>{for(let Q of ah){let ye=Ud(x[Q]??[],Q,{capacity:U});if(ye.error){v({...ye.error,kind:Q}),c(Q);return}}p(!0);let C=mi(x),X=gi(y,n),O=await o(C,X);if(p(!1),O?.ok){v(null),_(mi(O.doc?.hotbars??C)),E(gi(O.doc?.statusCards??X,n));return}v(O?.error==="host-stale"?{code:"hostStale"}:{code:"saveFailed"})},Ne=ah.reduce((C,X)=>{let O=Ud(x[X]??[],X,{capacity:U});return C+(O.error?0:O.overflow)},0),Be=m?.code==="hostStale"?i("hive.hb.saveStale"):m?.code==="saveFailed"?i("hive.qc.saveFailed"):m?.code?i(m.code):null,He=C=>i("hive.hb.tab"+C.charAt(0).toUpperCase()+C.slice(1));return(0,M.jsxs)(Xg,{t:i,title:i("hive.hb.title"),closeLabel:i("hive.hb.close"),sections:[{key:"hive",icon:"\u2B21",label:He("hive")},{key:"bee",icon:"\u{1F41D}",label:He("bee")},{key:"floor",icon:"\u25A4",label:He("floor")},{key:"status",icon:"\u2726",label:i("hive.hb.tabStatus")}],active:l,onNavigate:c,requestClose:F,children:[h?(0,M.jsxs)("div",{className:"jyv-qcConfirm",role:"alertdialog","aria-label":i("hive.qc.confirmDiscard"),children:[(0,M.jsx)("span",{children:i("hive.qc.confirmDiscard")}),(0,M.jsx)("button",{type:"button",className:"jyv-qcMove",title:i("hive.qc.keepEditing"),onClick:()=>d(!1),children:"\u21A9"}),(0,M.jsx)("button",{type:"button",className:"jyv-qcDiscard",onClick:a,children:i("hive.qc.discard")})]}):null,(0,M.jsxs)("div",{className:"jyv-modalBody jyv-hbBody",role:"tabpanel",id:"jyv-railPanel-"+l,"aria-labelledby":"jyv-railTab-"+l,children:[l==="status"?(0,M.jsx)(Qg,{t:i,beeTypes:n,statusDraft:y,selected:A,onSelect:R,onPatch:ee,onClear:ie}):(0,M.jsx)(M.Fragment,{children:(0,M.jsxs)("div",{className:"jyv-qcRows",children:[k.length===0?(0,M.jsx)("div",{className:"jyv-qcEmpty",children:i("hive.hb.empty")}):null,k.map((C,X)=>(0,M.jsxs)("div",{className:"jyv-qcRow"+(u===C.id?" jyv-hbRowOn":""),onClick:()=>f(C.id),children:[(0,M.jsxs)("div",{className:"jyv-qcRowHead",children:[(0,M.jsx)("span",{className:"jyv-hbIndex","aria-hidden":"true",children:X+1}),(0,M.jsx)("input",{className:"jyv-qcNameInput",value:C.name,placeholder:i("hive.hb.namePlaceholder"),onClick:O=>O.stopPropagation(),onChange:O=>q(C.id,{name:O.target.value})}),(0,M.jsx)("button",{type:"button",className:"jyv-qcMove",disabled:X===0,title:i("hive.qc.moveUp"),"aria-label":i("hive.qc.moveUp"),onClick:O=>{O.stopPropagation(),H(C.id,-1)},children:"\u2191"}),(0,M.jsx)("button",{type:"button",className:"jyv-qcMove",disabled:X===k.length-1,title:i("hive.qc.moveDown"),"aria-label":i("hive.qc.moveDown"),onClick:O=>{O.stopPropagation(),H(C.id,1)},children:"\u2193"}),(0,M.jsx)("button",{type:"button",className:"jyv-qcRemove",title:i("hive.hb.delete"),"aria-label":i("hive.hb.delete"),onClick:O=>{O.stopPropagation(),D(C.id)},children:"\u2715"})]}),u===C.id?(0,M.jsxs)("div",{className:"jyv-hbForm",onClick:O=>O.stopPropagation(),children:[l==="hive"?(0,M.jsxs)("label",{className:"jyv-qcAuto",title:i("hive.hb.summonHint"),children:[(0,M.jsx)("input",{type:"checkbox",checked:C.summon===!0,onChange:O=>q(C.id,{summon:O.target.checked})}),i("hive.hb.summon")]}):null,l==="floor"?(0,M.jsxs)("label",{className:"jyv-qcAuto",title:i("hive.hb.createBeeHint"),children:[(0,M.jsx)("input",{type:"checkbox",checked:C.createBee===!0,onChange:O=>q(C.id,{createBee:O.target.checked})}),i("hive.hb.createBee")]}):null,l!=="bee"?(0,M.jsxs)("label",{className:"jyv-swarmField",children:[(0,M.jsx)("span",{children:i("hive.hb.beeType")}),(0,M.jsxs)("select",{value:C.beeTypeId??"",disabled:l==="hive"?C.summon!==!0:C.createBee!==!0,onChange:O=>q(C.id,O.target.value?{beeTypeId:O.target.value}:{beeTypeId:void 0}),children:[(0,M.jsx)("option",{value:"",children:i("hive.hb.beeTypeDefault")}),n.map(O=>(0,M.jsx)("option",{value:O.id,children:O.name||O.id},O.id))]})]}):null,(0,M.jsxs)("label",{className:"jyv-swarmField",children:[(0,M.jsxs)("span",{children:[i("hive.hb.prompt"),l==="bee"?" \xB7 "+i("hive.hb.promptRequired"):""]}),(0,M.jsx)("textarea",{className:"jyv-qcPromptInput",rows:Math.min(6,Math.max(2,String(C.prompt??"").split(`
`).length)),value:C.prompt??"",disabled:l==="hive"?C.summon!==!0:l==="floor"?C.createBee!==!0:!1,placeholder:i("hive.hb.promptPlaceholder"),onChange:O=>q(C.id,{prompt:O.target.value})})]}),(0,M.jsxs)("label",{className:"jyv-qcAuto",title:i("hive.hb.autoSendHint"),children:[(0,M.jsx)("input",{type:"checkbox",checked:C.autoSend===!0,onChange:O=>q(C.id,{autoSend:O.target.checked})}),i("hive.hb.autoSend")]}),l==="hive"&&C.summon===!0?(0,M.jsx)("div",{className:"jyv-swarmHint",children:i("hive.hb.pureSummonHint")}):null,l==="hive"&&C.summon!==!0?(0,M.jsx)("div",{className:"jyv-swarmHint",children:i("hive.hb.summonOffHint")}):null]}):null]},C.id))]})}),(0,M.jsxs)("div",{className:"jyv-qcActions",children:[l!=="status"?(0,M.jsxs)("button",{type:"button",className:"jyv-qcAdd",disabled:k.length>=32,onClick:Z,children:["+ ",i("hive.hb.add")]}):null,m?(0,M.jsx)("span",{className:"jyv-qcError",role:"alert",children:Be}):null,l!=="status"&&Ne>0?(0,M.jsx)("span",{className:"jyv-qcDirty",children:i("hive.hb.overflow").replace("{n}",String(Ne))}):null,I&&!m&&(l!=="status"||Ne===0)?(0,M.jsx)("span",{className:"jyv-qcDirty",children:i("hive.hb.dirty")}):null,(0,M.jsx)("button",{type:"button",className:"jyv-qcSave",disabled:g,onClick:ce,children:i(g?"hive.qc.saving":"hive.qc.save")})]})]})]})}function Qg({t:i,beeTypes:e,statusDraft:t,selected:n,onSelect:s,onPatch:r,onClear:a}){let o=[...e.map(h=>({typeId:h.id,name:h.name||h.id,isDefault:!1})),{typeId:"default",name:i("hive.status.default"),isDefault:!0}],l=n&&!o.some(h=>h.typeId===n)?null:n,c=l?t?.[l]??null:null;return(0,M.jsx)("div",{className:"jyv-qcRows",children:o.map(h=>(0,M.jsxs)("div",{className:"jyv-qcRow"+(l===h.typeId?" jyv-hbRowOn":"")+(h.isDefault?" jyv-hbStatusDefaultRow":""),onClick:()=>{h.isDefault||s(h.typeId)},children:[(0,M.jsxs)("div",{className:"jyv-qcRowHead",children:[(0,M.jsx)("span",{className:"jyv-hbName",children:h.name}),h.isDefault?(0,M.jsx)("span",{className:"jyv-qcDirty",children:i("hive.hb.status.defaultRow")}):null,c&&l===h.typeId?(0,M.jsx)("button",{type:"button",className:"jyv-qcRemove",title:i("hive.hb.status.clear"),"aria-label":i("hive.hb.status.clear"),onClick:d=>{d.stopPropagation(),a(h.typeId)},children:"\u2715"}):null]}),l===h.typeId&&!h.isDefault?(0,M.jsxs)("div",{className:"jyv-hbForm",onClick:d=>d.stopPropagation(),children:[(0,M.jsxs)("label",{className:"jyv-swarmField",children:[(0,M.jsx)("span",{children:i("hive.hb.prompt")}),(0,M.jsx)("textarea",{className:"jyv-qcPromptInput",rows:Math.min(6,Math.max(2,String(c?.prompt??"").split(`
`).length)),value:c?.prompt??"",placeholder:i("hive.hb.status.promptPlaceholder"),onChange:d=>r(h.typeId,{prompt:d.target.value})})]}),(0,M.jsxs)("label",{className:"jyv-qcAuto",title:i("hive.hb.status.autoSendHint"),children:[(0,M.jsx)("input",{type:"checkbox",checked:c?.autoSend===!0,onChange:d=>r(h.typeId,{autoSend:d.target.checked})}),i("hive.hb.autoSend")]}),(0,M.jsx)("button",{type:"button",className:"jyv-qcDiscard",onClick:()=>a(h.typeId),children:i("hive.hb.status.clear")})]}):null]},h.typeId))})}var Qw='<svg viewBox="0 0 24 28" fill="none" aria-hidden="true"><path d="M12 1.5 22.5 7.5v13L12 26.5 1.5 20.5v-13L12 1.5z" stroke="currentColor" stroke-width="1.8"/><path d="M12 8.5 17 11.4v5.7L12 20l-5-2.9v-5.7L12 8.5z" fill="currentColor" opacity=".55"/></svg>',ev=null,eT={current:!1};function tT(i){typeof document>"u"||i.effect(()=>{let e=document.createElement("button");e.type="button",e.className="jyv-toggleBtn",e.title="V \u8702\u5DE2 / Hive",e.setAttribute("aria-label","V \u8702\u5DE2 / Hive"),e.innerHTML=Qw,e.addEventListener("click",()=>ev?.());let t=!1,n=null,s=c=>{if(e.isConnected)return;let h=c.querySelector('[class*="sessionLogButton"]');h?h.after(e):c.appendChild(e),e.classList.toggle("jyv-toggleBtnOn",eT.current)},r=()=>{let c=document.querySelectorAll('[class*="headerUtilities"]');for(let h of c)if(h.querySelector('[class*="sessionLogButton"]')||h.offsetParent!==null)return h;return c[0]??null},a=c=>{s(c),n?.disconnect(),n=new MutationObserver(()=>{t||!e.isConnected&&c.isConnected&&s(c)}),n.observe(c,{childList:!0})},o=new MutationObserver(()=>{if(t||e.isConnected)return;let c=r();c&&a(c)});o.observe(document.body,{childList:!0,subtree:!0});let l=r();return l&&a(l),()=>{t=!0,o.disconnect(),n?.disconnect(),e.remove()}},"dsh-v-hive: header toggle button")}function nT(i){typeof document>"u"||i.effect(()=>{let e=document.createElement("style");return e.dataset.plugin=Fg,e.dataset.pluginCss=Fg+"/hive.css",e.textContent=Dg,document.head.appendChild(e),()=>e.remove()},"dsh-v-hive: stylesheets")}var iT=["slots","locale","sessions","workspaces","uiWorkspace"],vi={current:null},jd={current:null};function sT(i){Nw.current=i,nT(i),i.effect(()=>i.locale.register(vo,{zh:kw,en:Ow}),"dsh-v-hive: dictionaries");let e=i.locale.bind(vo);i.effect(()=>(vi.current=Uw(i,(t,n)=>jd.current?.notify?.(t,n)),()=>{vi.current?.dispose(),vi.current=null}),"dsh-v-hive: mirror controller"),i.slots.inject("sidebar.footer.action",()=>i.slots.register({name:"sidebar.footer.action",id:"v-hive-seat",order:10,locale:vo},zw)),i.slots.inject("shell.overlay",()=>i.slots.register({name:"shell.overlay",id:"v-hive-page",order:40,store:Lg,locale:vo,inject:t=>{ev=()=>Pn.set(!Pn.getSnapshot());let n=(s,r)=>{if(r==="err")return t.notify(s,r);let a=vi.current?.getFeed?.();a?a.pushReceipt(s):t.notify(s,r)};return{setFullscreen:s=>t.setFullscreen(s),toggleLegend:()=>t.toggleLegend(),clearToast:()=>t.clearToast(),notify:(s,r)=>n(s,r),setSettings:s=>t.setSettings(s),openFloat:()=>t.openFloat(),closeFloat:()=>t.closeFloat(),ctl:()=>({actions:vi.current?.actions??{},feed:()=>vi.current?.getFeed?.()??null})}}},function(n){let{t:s,useStore:r,setFullscreen:a,toggleLegend:o,clearToast:l,notify:c,setSettings:h,openFloat:d,closeFloat:u,ctl:f}=n,m=r(v=>v.settings);return jd.current={notify:c,setSettings:h,getSettings:()=>m,openFloat:d,closeFloat:u},(0,de.useEffect)(()=>{vi.current?.actions.setStoreBridge(jd.current)}),vi.current?.setT?.(e),(0,M.jsx)(jw,{t:s,useStore:r,setFullscreen:a,toggleLegend:o,clearToast:l,notify:c,setSettings:h,openFloat:d,closeFloat:u,ctl:f})})),i.slots.inject("conversation.composer.dock",()=>i.slots.register({name:"conversation.composer.dock",id:"v-hive-bridge",order:-2,locale:vo},Lw)),tT(i)}
return module.exports;
} });
