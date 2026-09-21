const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(pointer:fine)');

function animateHeroIntro(){
 const hero=document.querySelector('.hero');
 const title=hero?.querySelector('.hero-title');
 if(!hero||!title||reduced.matches||window.scrollY>80||typeof title.animate!=='function')return;
 const lines=[...title.children];
 const label=lines.map(line=>line.textContent.trim()).join(' ');
 title.setAttribute('aria-label',label);
 let characterIndex=0;
 for(const line of lines){
  const text=line.textContent;
  line.textContent='';
  line.style.overflow='hidden';
  for(const character of text){
   const span=document.createElement('span');
   span.textContent=character===' '?'\u00a0':character;
   span.setAttribute('aria-hidden','true');
   span.style.display='inline-block';
   span.style.willChange='transform, opacity';
   line.appendChild(span);
   const animation=span.animate([
    {opacity:0,transform:'translateY(82%)'},
    {opacity:1,transform:'translateY(0)'}
   ],{duration:1050,delay:170+characterIndex*45,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
   animation.onfinish=()=>{span.style.opacity='1';span.style.transform='translateY(0)';span.style.willChange='auto';animation.cancel();};
   characterIndex++;
  }
 }
 const fadeUp=(element,delay,distance=12)=>{
  if(!element)return;
  const animation=element.animate([
   {opacity:0,transform:`translateY(${distance}px)`},
   {opacity:1,transform:'translateY(0)'}
  ],{duration:900,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
  animation.onfinish=()=>{element.style.opacity='1';element.style.transform='translateY(0)';animation.cancel();};
 };
 fadeUp(hero.querySelector('.hero-top'),300,8);
 fadeUp(hero.querySelector('.hero-role'),1250,14);
 [...hero.querySelectorAll('.hero-bottom > *')].forEach((element,index)=>fadeUp(element,1500+index*120,10));
}
animateHeroIntro();

/* A deliberately light layer of inertia for desktop wheel / trackpad input.
   Touch, keyboard, scrollbar dragging and reduced-motion users retain native scrolling. */
let wheelSmoothing=false;
let wheelFrame=0;
let scrollCurrent=window.scrollY;
let scrollTarget=window.scrollY;
let previousInlineScrollBehavior='';
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const maxScrollY=()=>Math.max(0,document.documentElement.scrollHeight-window.innerHeight);

function endWheelSmoothing(){
 if(wheelFrame){cancelAnimationFrame(wheelFrame);wheelFrame=0;}
 wheelSmoothing=false;
 scrollCurrent=window.scrollY;
 scrollTarget=window.scrollY;
 document.documentElement.style.scrollBehavior=previousInlineScrollBehavior;
}

function wheelStep(){
 const distance=scrollTarget-scrollCurrent;
 scrollCurrent+=distance*.14;
 window.scrollTo(0,scrollCurrent);
 if(Math.abs(distance)>.45){
  wheelFrame=requestAnimationFrame(wheelStep);
 }else{
  window.scrollTo(0,scrollTarget);
  wheelFrame=0;
  wheelSmoothing=false;
  scrollCurrent=scrollTarget;
  document.documentElement.style.scrollBehavior=previousInlineScrollBehavior;
 }
}

window.addEventListener('wheel',event=>{
 if(reduced.matches||!finePointer.matches||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||document.body.style.overflow==='hidden')return;
 event.preventDefault();
 const unit=event.deltaMode===1?16:event.deltaMode===2?window.innerHeight:1;
 const delta=clamp(event.deltaY*unit,-190,190);
 if(!wheelSmoothing){
  wheelSmoothing=true;
  scrollCurrent=window.scrollY;
  scrollTarget=window.scrollY;
  previousInlineScrollBehavior=document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior='auto';
 }
 scrollTarget=clamp(scrollTarget+delta*.92,0,maxScrollY());
 if(!wheelFrame)wheelFrame=requestAnimationFrame(wheelStep);
},{passive:false});

window.addEventListener('pointerdown',()=>{if(wheelSmoothing)endWheelSmoothing();},{passive:true});
window.addEventListener('keydown',event=>{
 if(wheelSmoothing&&['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))endWheelSmoothing();
});

const parallaxItems=[...document.querySelectorAll('.about-photo .image-button,.project-tile img,.photo-grid .image-button')];
if(!reduced.matches&&finePointer.matches){
 for(const item of parallaxItems)item.style.willChange='transform';
}
function updateParallax(){
 if(reduced.matches||!finePointer.matches||window.innerWidth<=700)return;
 const viewportCenter=window.innerHeight/2;
 for(const item of parallaxItems){
  const rect=item.getBoundingClientRect();
  if(rect.bottom<-80||rect.top>window.innerHeight+80)continue;
  const range=viewportCenter+rect.height/2;
  const position=(rect.top+rect.height/2-viewportCenter)/Math.max(1,range);
  const shift=clamp(-position*12,-12,12);
  item.style.transform=`translate3d(0,${shift.toFixed(2)}px,0)`;
 }
}

const reveals=[...document.querySelectorAll('.reveal')];
if('IntersectionObserver' in window&&!reduced.matches){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}},{threshold:.08});
 document.documentElement.classList.add('motion-ready');
 reveals.forEach(el=>observer.observe(el));
}
const navLinks=[...document.querySelectorAll('.toc a')];
const homeSections=[...document.querySelectorAll('.content-section')];
let scheduled=false;
function updateScroll(){
 scheduled=false;
 const hero=document.querySelector('.hero');
 if(hero&&!reduced.matches){
  const ratio=Math.min(1,window.scrollY/hero.offsetHeight);
  const title=hero.querySelector('.hero-title');
  title.style.transform=`translateX(${-ratio*7}vw) scale(${1-ratio*.2})`;
  title.style.opacity=String(1-ratio*.8);
  const heroImage=hero.querySelector('.hero-image');
  if(heroImage)heroImage.style.transform=`translate3d(0,${ratio*14}px,0) scale(1.025)`;
  const side=document.querySelector('.sidebar');
  if(side)side.style.opacity=String(Math.max(0,Math.min(1,(window.scrollY/hero.offsetHeight-.45)*2)));
 }
 updateParallax();
 if(homeSections.length){let active=homeSections[0].id;for(const section of homeSections)if(section.getBoundingClientRect().top<=window.innerHeight*.36)active=section.id;
 for(const a of navLinks){const selected=a.hash==='#'+active;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}}
 const progress=document.querySelector('.reading-progress');
 if(progress){const article=document.querySelector('.article-layout');const start=article.offsetTop;const end=article.offsetTop+article.offsetHeight-window.innerHeight;progress.style.width=Math.max(0,Math.min(100,(window.scrollY-start)/Math.max(1,end-start)*100))+'%';}
}
window.addEventListener('scroll',()=>{if(!wheelSmoothing){scrollCurrent=window.scrollY;scrollTarget=window.scrollY;}if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});
window.addEventListener('resize',()=>{scrollTarget=clamp(scrollTarget,0,maxScrollY());updateScroll();});
updateScroll();
for(const link of document.querySelectorAll('.mobile-nav nav a'))link.addEventListener('click',()=>link.closest('details').removeAttribute('open'));
const dialog=document.querySelector('.lightbox');
let opener=null;
if(dialog){
 for(const button of document.querySelectorAll('[data-enlarge]'))button.addEventListener('click',()=>{opener=button;const img=button.querySelector('img');dialog.querySelector('img').src=button.dataset.enlarge||img.src;dialog.querySelector('img').alt=img.alt;dialog.querySelector('p').textContent=button.dataset.caption||img.alt;dialog.showModal();document.body.style.overflow='hidden';});
 function close(){dialog.close();}
 dialog.querySelector('.lightbox-close').addEventListener('click',close);
 dialog.addEventListener('click',e=>{if(e.target===dialog||e.target.classList.contains('lightbox-inner'))close();});
 dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus();});
}
