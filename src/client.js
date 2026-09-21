const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(pointer:fine)');

function createLoaderStyles(){
 if(document.getElementById('site-loader-styles'))return;
 const style=document.createElement('style');
 style.id='site-loader-styles';
 style.textContent=`
.site-loader{position:fixed;inset:0;z-index:9999;color:#1B1D1B;font-family:'DM Sans',Arial,Helvetica,sans-serif;pointer-events:all;overflow:hidden}
.site-loader__panel{position:absolute;left:0;right:0;height:calc(50% + 1px);background:#D6D1C6;z-index:0;transition:transform 900ms cubic-bezier(.76,0,.24,1);will-change:transform}
.site-loader__panel--top{top:0}.site-loader__panel--bottom{bottom:0}
.site-loader__ui{position:relative;z-index:1;width:100%;height:100%;transition:opacity 420ms cubic-bezier(.4,0,.2,1),transform 650ms cubic-bezier(.16,1,.3,1);opacity:0}
.site-loader--active .site-loader__ui{opacity:1}
.site-loader__meta{position:absolute;left:clamp(24px,4.4vw,88px);right:clamp(24px,4.4vw,88px);display:flex;justify-content:space-between;gap:24px;font-size:11px;line-height:1.4;letter-spacing:.13em;text-transform:uppercase;color:#5F625D}
.site-loader__meta--top{top:28px}.site-loader__meta--bottom{bottom:27px}
.site-loader__center{position:absolute;left:50%;top:50%;width:min(620px,72vw);transform:translate(-50%,-50%);text-align:center}
.site-loader__name{font-family:'Instrument Serif',Georgia,'Times New Roman',serif;font-size:clamp(54px,6.6vw,104px);font-weight:400;line-height:.84;letter-spacing:-.045em;color:#1B1D1B}
.site-loader__line{display:block;overflow:hidden;padding:.07em 0 .13em}
.site-loader__line:last-child{font-style:italic}
.site-loader__char{display:inline-block;opacity:0;transform:translateY(108%);will-change:transform,opacity;transition-property:transform,opacity;transition-duration:1050ms;transition-timing-function:cubic-bezier(.16,1,.3,1)}
.site-loader--active .site-loader__char{opacity:1;transform:translateY(0)}
.site-loader__track{position:relative;height:1px;background:rgba(95,98,93,.28);margin:34px auto 16px;overflow:visible}
.site-loader__fill{position:absolute;inset:0;background:#1B1D1B;transform:scaleX(0);transform-origin:center;will-change:transform}
.site-loader__track:after{content:'';position:absolute;top:-1px;left:0;width:38px;height:3px;background:#A45A3A;opacity:0;transform:translateX(-42px)}
.site-loader--complete .site-loader__track:after{animation:site-loader-pulse 520ms cubic-bezier(.65,0,.35,1) forwards}
.site-loader__status{display:flex;align-items:center;justify-content:space-between;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#5F625D}
.site-loader__count{font-variant-numeric:tabular-nums;color:#1B1D1B}
.site-loader--exit{pointer-events:none}
.site-loader--exit .site-loader__panel--top{transform:translateY(-101%)}
.site-loader--exit .site-loader__panel--bottom{transform:translateY(101%)}
.site-loader--exit .site-loader__ui{opacity:0;transform:scale(.992)}
@keyframes site-loader-pulse{0%{opacity:0;transform:translateX(-42px)}18%{opacity:1}82%{opacity:1}100%{opacity:0;transform:translateX(calc(min(620px,72vw) - 2px))}}
@media(max-width:700px){.site-loader__center{width:78vw}.site-loader__name{font-size:clamp(48px,16vw,76px)}.site-loader__meta{font-size:9px;letter-spacing:.11em}.site-loader__meta--top{top:22px}.site-loader__meta--bottom{bottom:22px}.site-loader__meta--bottom span:first-child{max-width:190px}.site-loader__track{margin-top:28px}}
@media(prefers-reduced-motion:reduce){.site-loader{display:none!important}}
`;
 document.head.appendChild(style);
}

function shouldShowSiteLoader(){
 const hero=document.querySelector('.hero');
 if(!hero||reduced.matches)return false;
 const navigation=performance.getEntriesByType?.('navigation')?.[0];
 if(navigation?.type==='reload')return true;
 if(!document.referrer)return true;
 try{return new URL(document.referrer).origin!==location.origin;}catch{return true;}
}

function runSiteLoader(){
 if(!shouldShowSiteLoader())return Promise.resolve(false);
 createLoaderStyles();
 const previousOverflow=document.body.style.overflow;
 document.body.style.overflow='hidden';
 const loader=document.createElement('div');
 loader.className='site-loader';
 loader.setAttribute('aria-hidden','true');
 loader.innerHTML=`<div class="site-loader__panel site-loader__panel--top"></div><div class="site-loader__panel site-loader__panel--bottom"></div><div class="site-loader__ui"><div class="site-loader__meta site-loader__meta--top"><span>Hayden Wade</span><span>Brisbane / AU</span></div><div class="site-loader__center"><div class="site-loader__name"><span class="site-loader__line" data-loader-line="Hayden"></span><span class="site-loader__line" data-loader-line="Wade"></span></div><div class="site-loader__track"><span class="site-loader__fill"></span></div><div class="site-loader__status"><span>Initialising</span><span class="site-loader__count">00</span></div></div><div class="site-loader__meta site-loader__meta--bottom"><span>Cybersecurity · Engineering · Old cars</span><span>Portfolio / 2026</span></div></div>`;
 document.body.prepend(loader);
 let charIndex=0;
 for(const line of loader.querySelectorAll('[data-loader-line]')){
  const text=line.dataset.loaderLine||'';
  for(const character of text){
   const span=document.createElement('span');
   span.className='site-loader__char';
   span.textContent=character===' '?'\u00a0':character;
   span.style.transitionDelay=`${140+charIndex*48}ms`;
   line.appendChild(span);
   charIndex++;
  }
 }
 const fill=loader.querySelector('.site-loader__fill');
 const count=loader.querySelector('.site-loader__count');
 requestAnimationFrame(()=>requestAnimationFrame(()=>loader.classList.add('site-loader--active')));
 const heroImage=document.querySelector('.hero-image');
 let assetsReady=document.readyState==='complete';
 const pageReady=document.readyState==='complete'?Promise.resolve():new Promise(resolve=>window.addEventListener('load',resolve,{once:true}));
 const imageReady=heroImage?.decode?heroImage.decode().catch(()=>{}):Promise.resolve();
 Promise.all([pageReady,imageReady]).then(()=>{assetsReady=true;});
 const start=performance.now();
 const minimum=1780;
 const maximum=3600;
 let displayed=0;
 return new Promise(resolve=>{
  const tick=now=>{
   const elapsed=now-start;
   const timeTarget=Math.min(92,(elapsed/1450)*92);
   const target=(assetsReady&&elapsed>=minimum)||elapsed>=maximum?100:timeTarget;
   displayed+=Math.max(.12,(target-displayed)*.12);
   displayed=Math.min(target,displayed);
   const rounded=Math.min(100,Math.floor(displayed));
   fill.style.transform=`scaleX(${displayed/100})`;
   count.textContent=String(rounded).padStart(2,'0');
   if(target===100&&displayed>=99.35){
    fill.style.transform='scaleX(1)';
    count.textContent='100';
    loader.classList.add('site-loader--complete');
    window.setTimeout(()=>{
     loader.classList.add('site-loader--exit');
     window.setTimeout(()=>{
      document.body.style.overflow=previousOverflow;
      resolve(true);
     },260);
     window.setTimeout(()=>loader.remove(),980);
    },260);
    return;
   }
   requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
 });
}

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
runSiteLoader().then(()=>animateHeroIntro());

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
