import{c as d,B as j}from"./index-Cr7VuEg-.js";import{c as N,d as E,r as _,j as i}from"./app-DE48DAeG.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]],B=d("GraduationCap",L);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]],I=d("Mail",S);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],z=d("Moon",$);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],C=d("Sun",A);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],P=d("X",D);function R(M){const e=N.c(22);let s,r;e[0]!==M?({className:r,...s}=M,e[0]=M,e[1]=s,e[2]=r):(s=e[1],r=e[2]);const v=r===void 0?"":r,{appearance:a,updateAppearance:g}=E(),[t,b]=_.useState(!1);let l,m;e[3]!==a?(l=()=>{const c=()=>{const y=a==="dark"||a==="system"&&typeof window<"u"&&window.matchMedia("(prefers-color-scheme: dark)").matches;b(y)};if(c(),a==="system"&&typeof window<"u"){const y=window.matchMedia("(prefers-color-scheme: dark)");return y.addEventListener("change",c),()=>y.removeEventListener("change",c)}},m=[a],e[3]=a,e[4]=l,e[5]=m):(l=e[4],m=e[5]),_.useEffect(l,m);let h,p;e[6]===Symbol.for("react.memo_cache_sentinel")?(h=()=>{const c=new MutationObserver(()=>{b(document.documentElement.classList.contains("dark"))});return c.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),()=>c.disconnect()},p=[],e[6]=h,e[7]=p):(h=e[6],p=e[7]),_.useEffect(h,p);let u;e[8]!==t||e[9]!==g?(u=()=>{g(t?"light":"dark")},e[8]=t,e[9]=g,e[10]=u):u=e[10];const w=u,x=t?"Passer en mode clair":"Passer en mode sombre";let n;e[11]!==t?(n=t?i.jsx(C,{className:"h-5 w-5"}):i.jsx(z,{className:"h-5 w-5"}),e[11]=t,e[12]=n):n=e[12];let k;e[13]===Symbol.for("react.memo_cache_sentinel")?(k=i.jsx("span",{className:"sr-only",children:"Toggle theme"}),e[13]=k):k=e[13];let o;e[14]!==x||e[15]!==n||e[16]!==w?(o=i.jsxs(j,{variant:"ghost",size:"icon",className:"h-9 w-9 rounded-md",onClick:w,"aria-label":x,children:[n,k]}),e[14]=x,e[15]=n,e[16]=w,e[17]=o):o=e[17];let f;return e[18]!==v||e[19]!==s||e[20]!==o?(f=i.jsx("div",{className:v,...s,children:o}),e[18]=v,e[19]=s,e[20]=o,e[21]=f):f=e[21],f}export{R as A,B as G,I as M,C as S,P as X,z as a};
