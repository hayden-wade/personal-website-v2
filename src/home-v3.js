(()=>{
 const body=document.body;
 if(!body.classList.contains('home-v3'))return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const finePointer=window.matchMedia('(pointer:fine)').matches;
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));

 // Reveal elements with a light, non-blocking observer.
 const reveals=[...document.querySelectorAll('.reveal')];
 if(!reduced&&'IntersectionObserver' in window){
   body.classList.add('motion-ready');
   const revealObserver=new IntersectionObserver(entries=>{
     for(const entry of entries){
       if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}
     }
   },{threshold:.09,rootMargin:'0px 0px -4% 0px'});
   reveals.forEach(el=>revealObserver.observe(el));
 }else reveals.forEach(el=>el.classList.add('is-visible'));

 // Hero intro: subtle, no scroll interception.
 const hero=document.querySelector('[data-hero]');
 const heroTitle=hero?.querySelector('.hero-title');
 if(heroTitle&&!reduced&&window.scrollY<50){
   heroTitle.animate([{opacity:.05,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}],{duration:1050,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
   hero?.querySelector('.hero-top')?.animate([{opacity:0},{opacity:1}],{duration:700,delay:180,fill:'both'});
   hero?.querySelector('.hero-role')?.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:760,delay:450,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
 }

 // Sticky top navigation and active section state.
 const nav=document.querySelector('[data-sticky-nav]');
 const navLinks=[...document.querySelectorAll('[data-nav]')];
 const sections=[...document.querySelectorAll('[data-section]')];
 let lastY=window.scrollY;
 let scheduled=false;

 function updateNavigation(){
   scheduled=false;
   const y=window.scrollY;
   const heroHeight=hero?.offsetHeight||window.innerHeight;
   const shouldShow=y>heroHeight*.72;
   nav?.classList.toggle('is-visible',shouldShow);
   nav?.classList.toggle('is-compact',shouldShow&&y>lastY&&y>heroHeight+140);

   if(heroTitle&&!reduced){
     const ratio=clamp(y/heroHeight,0,1);
     heroTitle.style.opacity=String(1-ratio*.72);
     heroTitle.style.transform=`translate3d(${-ratio*3.5}vw,${ratio*8}px,0) scale(${1-ratio*.08})`;
   }

   let active=sections[0]?.id||'';
   for(const section of sections){
     if(section.getBoundingClientRect().top<=Math.max(110,window.innerHeight*.34))active=section.id;
   }
   for(const link of navLinks){
     const selected=link.dataset.nav===active;
     link.classList.toggle('is-active',selected);
     if(selected)link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
   }
   lastY=y;
   updateLifecycle();
 }
 function requestUpdate(){if(!scheduled){scheduled=true;requestAnimationFrame(updateNavigation);}}
 window.addEventListener('scroll',requestUpdate,{passive:true});
 window.addEventListener('resize',requestUpdate,{passive:true});

 // Experience accordion — one role open at a time.
 const expItems=[...document.querySelectorAll('[data-exp-item]')];
 function setExp(item,open){
   const trigger=item.querySelector('.v3-exp-trigger');
   const panel=item.querySelector('.v3-exp-panel');
   const toggle=item.querySelector('.v3-exp-toggle');
   item.classList.toggle('is-open',open);
   trigger?.setAttribute('aria-expanded',String(open));
   if(panel)panel.hidden=!open;
   if(toggle)toggle.textContent=open?'−':'+';
 }
 for(const item of expItems){
   item.querySelector('.v3-exp-trigger')?.addEventListener('click',()=>{
     const opening=!item.classList.contains('is-open');
     expItems.forEach(other=>setExp(other,false));
     if(opening)setExp(item,true);
   });
 }

 // Project lifecycle line: one continuous state that changes as completed work arrives.
 const stage=document.querySelector('[data-project-stage]');
 const marker=document.querySelector('[data-completed-marker]');
 const lifeProgress=document.querySelector('[data-life-progress]');
 const lifeDot=document.querySelector('[data-life-dot]');
 const lifeLabel=document.querySelector('[data-life-label]');
 const lifeCount=document.querySelector('[data-life-count]');
 function updateLifecycle(){
   if(!stage||!lifeProgress||!lifeDot)return;
   const rect=stage.getBoundingClientRect();
   const total=Math.max(1,rect.height-window.innerHeight*.42);
   const travelled=clamp(window.innerHeight*.30-rect.top,0,total);
   const progress=clamp(travelled/total,0,1);
   const pct=progress*100;
   lifeProgress.style.width=`${pct}%`;
   lifeDot.style.left=`${pct}%`;
   const completed=marker ? marker.getBoundingClientRect().top<window.innerHeight*.46 : progress>.68;
   if(lifeLabel)lifeLabel.textContent=completed?'COMPLETED':'IN PROGRESS';
   if(lifeCount)lifeCount.textContent=completed?'02 PROJECTS':'04 ACTIVE';
 }

 // Slight project-media drift for active work only. It never modifies the page's scroll position.
 const activeProjectImages=[...document.querySelectorAll('.v3-project-grid--active .v3-project-media>img')];
 function updateProjectDrift(){
   if(reduced||!finePointer||window.innerWidth<801)return;
   const center=window.innerHeight/2;
   for(const image of activeProjectImages){
     const r=image.getBoundingClientRect();
     if(r.bottom<0||r.top>window.innerHeight)continue;
     const p=clamp((r.top+r.height/2-center)/(window.innerHeight+r.height),-1,1);
     image.style.setProperty('--drift',`${(-p*8).toFixed(2)}px`);
   }
 }
 // Use a transform wrapper-free fallback: only when not hovered, translate image gently.
 if(activeProjectImages.length&&!reduced&&finePointer){
   const driftStyle=document.createElement('style');
   driftStyle.textContent='.home-v3 .v3-project-grid--active .v3-project:not(:hover) .v3-project-media>img{transform:translate3d(0,var(--drift,0),0) scale(1.02)}';
   document.head.appendChild(driftStyle);
   window.addEventListener('scroll',()=>requestAnimationFrame(updateProjectDrift),{passive:true});
   updateProjectDrift();
 }

 // Writing image preview follows the cursor on desktop.
 const preview=document.querySelector('[data-writing-preview]');
 const previewImg=preview?.querySelector('img');
 const writingLinks=[...document.querySelectorAll('.v3-writing-feature[data-preview]')];
 if(preview&&previewImg&&finePointer&&!reduced){
   let px=0,py=0,tx=0,ty=0,previewFrame=0;
   const animatePreview=()=>{
     px+=(tx-px)*.16;py+=(ty-py)*.16;
     preview.style.left=`${px}px`;preview.style.top=`${py}px`;
     if(Math.abs(tx-px)>.2||Math.abs(ty-py)>.2)previewFrame=requestAnimationFrame(animatePreview);else previewFrame=0;
   };
   for(const link of writingLinks){
     link.addEventListener('mouseenter',()=>{previewImg.src=link.dataset.preview;preview.classList.add('is-visible');});
     link.addEventListener('mousemove',event=>{
       tx=clamp(event.clientX+150,150,window.innerWidth-150);
       ty=clamp(event.clientY-25,120,window.innerHeight-120);
       if(!previewFrame)previewFrame=requestAnimationFrame(animatePreview);
     });
     link.addEventListener('mouseleave',()=>preview.classList.remove('is-visible'));
   }
 }

 // Contact panel gets a single rising entrance.
 const contact=document.querySelector('.v3-contact');
 if(contact&&!reduced&&'IntersectionObserver' in window){
   const contactObserver=new IntersectionObserver(entries=>{
     if(entries[0]?.isIntersecting){contact.classList.add('is-entering');contactObserver.disconnect();}
   },{threshold:.12});
   contactObserver.observe(contact);
 }

 // Lightweight lightbox support for photography buttons on the homepage.
 const dialog=document.querySelector('.lightbox');
 let opener=null;
 if(dialog){
   for(const button of document.querySelectorAll('[data-enlarge]'))button.addEventListener('click',()=>{
     opener=button;
     const source=button.dataset.enlarge||button.querySelector('img')?.src;
     const image=dialog.querySelector('img');
     const caption=dialog.querySelector('p');
     if(image){image.src=source||'';image.alt=button.querySelector('img')?.alt||'';}
     if(caption)caption.textContent=button.dataset.caption||image?.alt||'';
     if(typeof dialog.showModal==='function')dialog.showModal();
   });
   dialog.querySelector('.lightbox-close')?.addEventListener('click',()=>dialog.close());
   dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
   dialog.addEventListener('close',()=>opener?.focus());
 }

 // Close navigation gaps cleanly when using anchors; native browser scroll remains in control.
 for(const link of navLinks){
   link.addEventListener('click',()=>nav?.classList.add('is-visible'));
 }
 updateNavigation();
})();
