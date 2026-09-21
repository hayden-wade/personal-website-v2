(()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=window.matchMedia('(pointer:fine)');
 const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
 const maxScrollY=()=>Math.max(0,document.documentElement.scrollHeight-window.innerHeight);

 let wheelActive=false;
 let wheelFrame=0;
 let wheelCurrent=window.scrollY;
 let wheelTarget=window.scrollY;
 let previousInlineScrollBehavior='';

 const visualRoots=[...document.querySelectorAll('body > header, body > main, body > footer')];
 const rootTransforms=new Map(visualRoots.map(el=>[el,el.style.transform]));
 const stickySidebar=document.querySelector('.sidebar');
 const sidebarTransform=stickySidebar?.style.transform||'';
 let nativeLag=0;
 let nativeLagFrame=0;
 let lastNativeY=window.scrollY;

 function applyNativeLag(){
  const value=nativeLag.toFixed(2);
  for(const root of visualRoots)root.style.transform=`translate3d(0,${value}px,0)`;
  if(stickySidebar)stickySidebar.style.transform=`translate3d(0,${(-nativeLag).toFixed(2)}px,0)`;
 }

 function clearNativeLag(){
  nativeLag=0;
  if(nativeLagFrame){cancelAnimationFrame(nativeLagFrame);nativeLagFrame=0;}
  for(const root of visualRoots)root.style.transform=rootTransforms.get(root)||'';
  if(stickySidebar)stickySidebar.style.transform=sidebarTransform;
 }

 function settleNativeLag(){
  nativeLag+=(0-nativeLag)*.085;
  applyNativeLag();
  if(Math.abs(nativeLag)>.08){
   nativeLagFrame=requestAnimationFrame(settleNativeLag);
  }else{
   clearNativeLag();
  }
 }

 function stopWheel(){
  if(wheelFrame){cancelAnimationFrame(wheelFrame);wheelFrame=0;}
  wheelActive=false;
  wheelCurrent=window.scrollY;
  wheelTarget=window.scrollY;
  document.documentElement.style.scrollBehavior=previousInlineScrollBehavior;
 }

 function wheelStep(){
  const distance=wheelTarget-wheelCurrent;
  wheelCurrent+=distance*.085;
  window.scrollTo(0,wheelCurrent);
  if(Math.abs(distance)>.35){
   wheelFrame=requestAnimationFrame(wheelStep);
  }else{
   window.scrollTo(0,wheelTarget);
   wheelFrame=0;
   wheelActive=false;
   wheelCurrent=wheelTarget;
   document.documentElement.style.scrollBehavior=previousInlineScrollBehavior;
  }
 }

 window.addEventListener('wheel',event=>{
  if(reduced.matches||!finePointer.matches||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||document.body.style.overflow==='hidden')return;
  event.preventDefault();
  event.stopImmediatePropagation();
  clearNativeLag();
  const unit=event.deltaMode===1?16:event.deltaMode===2?window.innerHeight:1;
  const delta=clamp(event.deltaY*unit,-220,220);
  if(!wheelActive){
   wheelActive=true;
   wheelCurrent=window.scrollY;
   wheelTarget=window.scrollY;
   previousInlineScrollBehavior=document.documentElement.style.scrollBehavior;
   document.documentElement.style.scrollBehavior='auto';
  }
  wheelTarget=clamp(wheelTarget+delta*.98,0,maxScrollY());
  if(!wheelFrame)wheelFrame=requestAnimationFrame(wheelStep);
 },{passive:false,capture:true});

 window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  const delta=y-lastNativeY;
  lastNativeY=y;
  if(reduced.matches||!finePointer.matches||window.innerWidth<=700||wheelActive||document.body.style.overflow==='hidden')return;
  if(Math.abs(delta)<.1)return;
  nativeLag=clamp(nativeLag+delta*.32,-130,130);
  applyNativeLag();
  if(!nativeLagFrame)nativeLagFrame=requestAnimationFrame(settleNativeLag);
 },{passive:true});

 window.addEventListener('pointerdown',()=>{
  if(wheelActive)stopWheel();
 },{passive:true,capture:true});

 window.addEventListener('keydown',event=>{
  if(wheelActive&&['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))stopWheel();
 },{capture:true});

 window.addEventListener('resize',()=>{
  wheelTarget=clamp(wheelTarget,0,maxScrollY());
  if(window.innerWidth<=700)clearNativeLag();
 },{passive:true});

 const current=document.currentScript;
 const base=document.createElement('script');
 base.src=new URL('client-base.js',current?.src||location.href).href;
 base.async=false;
 document.head.appendChild(base);
})();
