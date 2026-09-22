(()=>{
 if(document.body?.classList.contains('home-v3'))return;
 const current=document.currentScript;
 const base=document.createElement('script');
 base.src=new URL('client-base.js',current?.src||location.href).href;
 base.async=false;
 document.head.appendChild(base);
})();
