import{c as k,j as s}from"./app-2H9fKCfZ.js";import{b}from"./index-Pd254wjl.js";import{S as E}from"./spinner-c2uFqB7i.js";import{m as $}from"./proxy-DKucgXTk.js";import{L as z}from"./loader-circle-BmDD-9gQ.js";const F=()=>{const n=k.c(1);let e;return n[0]===Symbol.for("react.memo_cache_sentinel")?(e=s.jsxs("div",{className:"relative w-[65px] aspect-square",children:[s.jsx("span",{className:"absolute rounded-[50px] animate-loaderAnim shadow-[inset_0_0_0_3px] shadow-gray-800 dark:shadow-gray-100"}),s.jsx("span",{className:"absolute rounded-[50px] animate-loaderAnim animation-delay shadow-[inset_0_0_0_3px] shadow-gray-800 dark:shadow-gray-100"}),s.jsxs("style",{children:[" ",`
            @keyframes loaderAnim {
              0% {
                inset: 0 35px 35px 0;
              }
              12.5% {
                inset: 0 35px 0 0;
              }
              25% {
                inset: 35px 35px 0 0;
              }
              37.5% {
                inset: 35px 0 0 0;
              }
              50% {
                inset: 35px 0 0 35px;
              }
              62.5% {
                inset: 0 0 0 35px;
              }
              75% {
                inset: 0 0 35px 35px;
              }
              87.5% {
                inset: 0 0 35px 0;
              }
              100% {
                inset: 0 35px 35px 0;
              }
            }
            .animate-loaderAnim {
              animation: loaderAnim 2.5s infinite;
            }
            .animation-delay {
              animation-delay: -1.25s;
            }
          `]})]}),n[0]=e):e=n[0],e};function I(){const n=k.c(4);let e,a,t;n[0]===Symbol.for("react.memo_cache_sentinel")?(e=s.jsx("div",{className:"pl__outer-ring"}),a=s.jsx("div",{className:"pl__inner-ring"}),t=s.jsx("div",{className:"pl__track-cover"}),n[0]=e,n[1]=a,n[2]=t):(e=n[0],a=n[1],t=n[2]);let i;return n[3]===Symbol.for("react.memo_cache_sentinel")?(i=s.jsxs("div",{className:"pl",children:[e,a,t,s.jsxs("div",{className:"pl__ball",children:[s.jsx("div",{className:"pl__ball-texture"}),s.jsx("div",{className:"pl__ball-outer-shadow"}),s.jsx("div",{className:"pl__ball-inner-shadow"}),s.jsx("div",{className:"pl__ball-side-shadows"})]})]}),n[3]=i):i=n[3],i}function R(n,e,a){const t={size:e,className:b("text-[color:var(--accent-500)]",a)};switch(n){case"loader2":return s.jsx(z,{className:b("animate-spin text-[color:var(--primary-500)]",a),size:e});case"luma-spin":return s.jsx(F,{});case"snow-ball":return s.jsx(I,{});case"default":case"circle":case"pinwheel":case"circle-filled":case"ellipsis":case"ring":case"bars":case"infinite":return s.jsx(E,{variant:n,...t});default:return s.jsx(z,{className:b("animate-spin text-[color:var(--primary-500)]",a),size:e})}}function G(n){const e=k.c(26),{isLoading:a,spinnerType:t,spinnerSize:i,message:d,subtitle:x,className:N,overlayClassName:C,zIndex:A}=n,g=t===void 0?"loader2":t,w=i===void 0?64:i,S=A===void 0?1e4:A;if(!a)return null;let f,u,_;e[0]===Symbol.for("react.memo_cache_sentinel")?(f={opacity:0},u={opacity:1},_={opacity:0},e[0]=f,e[1]=u,e[2]=_):(f=e[0],u=e[1],_=e[2]);const L=C||"bg-[color:var(--primary-500)]/5";let l;e[3]!==N||e[4]!==L?(l=b("fixed inset-0 flex items-center justify-center backdrop-blur-sm",L,N),e[3]=N,e[4]=L,e[5]=l):l=e[5];let r;e[6]!==S?(r={zIndex:S},e[6]=S,e[7]=r):r=e[7];let y,j,h;e[8]===Symbol.for("react.memo_cache_sentinel")?(y={scale:.8,opacity:0},j={scale:1,opacity:1},h={scale:.8,opacity:0},e[8]=y,e[9]=j,e[10]=h):(y=e[8],j=e[9],h=e[10]);let o;e[11]!==w||e[12]!==g?(o=R(g,w),e[11]=w,e[12]=g,e[13]=o):o=e[13];let c;e[14]!==d?(c=d&&s.jsx("p",{className:"text-lg font-medium text-foreground",children:d}),e[14]=d,e[15]=c):c=e[15];let m;e[16]!==x?(m=x&&s.jsx("p",{className:"text-sm text-muted-foreground",children:x}),e[16]=x,e[17]=m):m=e[17];let p;e[18]!==o||e[19]!==c||e[20]!==m?(p=s.jsxs($.div,{initial:y,animate:j,exit:h,className:"flex flex-col items-center gap-4",children:[o,c,m]}),e[18]=o,e[19]=c,e[20]=m,e[21]=p):p=e[21];let v;return e[22]!==p||e[23]!==l||e[24]!==r?(v=s.jsx($.div,{initial:f,animate:u,exit:_,className:l,style:r,children:p}),e[22]=p,e[23]=l,e[24]=r,e[25]=v):v=e[25],v}export{G as F};
