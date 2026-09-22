const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals=[...document.querySelectorAll('.reveal')];
if(!reduced&&'IntersectionObserver' in window){
  document.documentElement.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
    }
  },{threshold:.08,rootMargin:'0px 0px -3% 0px'});
  reveals.forEach(el=>observer.observe(el));
}else reveals.forEach(el=>el.classList.add('visible'));
const hero=document.querySelector('.hero');
const heroTitle=hero?.querySelector('.hero-title');
if(heroTitle&&!reduced&&window.scrollY<40&&typeof heroTitle.animate==='function'){
  heroTitle.animate([{opacity:.05,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{duration:900,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
}
const navLinks=[...document.querySelectorAll('.toc a')];
const homeSections=[...document.querySelectorAll('.content-section')];
let scheduled=false;
function updateScrollState(){
  scheduled=false;
  if(homeSections.length){
    let active=homeSections[0].id;
    for(const section of homeSections)if(section.getBoundingClientRect().top<=window.innerHeight*.36)active=section.id;
    for(const link of navLinks){
      const selected=link.hash==='#'+active;
      link.classList.toggle('active',selected);
      if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    }
  }
  const progress=document.querySelector('.reading-progress');
  const article=document.querySelector('.article-layout');
  if(progress&&article){
    const start=article.offsetTop;
    const end=article.offsetTop+article.offsetHeight-window.innerHeight;
    progress.style.width=Math.max(0,Math.min(100,(window.scrollY-start)/Math.max(1,end-start)*100))+'%';
  }
}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScrollState);}},{passive:true});
window.addEventListener('resize',updateScrollState,{passive:true});
updateScrollState();
for(const link of document.querySelectorAll('.mobile-nav nav a'))link.addEventListener('click',()=>link.closest('details')?.removeAttribute('open'));
const dialog=document.querySelector('.lightbox');
let opener=null;
if(dialog){
  for(const button of document.querySelectorAll('[data-enlarge]'))button.addEventListener('click',()=>{
    opener=button;
    const source=button.dataset.enlarge||button.querySelector('img')?.src||'';
    const image=dialog.querySelector('img');
    const caption=dialog.querySelector('p');
    if(image){image.src=source;image.alt=button.querySelector('img')?.alt||'';}
    if(caption)caption.textContent=button.dataset.caption||image?.alt||'';
    dialog.showModal?.();
  });
  dialog.querySelector('.lightbox-close')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>opener?.focus());
}
