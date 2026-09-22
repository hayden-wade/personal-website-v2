import {site,jobs,gallery} from './site.mjs';
import {shell,img,e30Image} from './templates.mjs';

const navItems=['About','Experience','Projects','Writing','Photography','Contact'];
const nav=navItems.map((item,i)=>`<a href="#${item.toLowerCase()}" data-nav="${item.toLowerCase()}"><span>0${i+1}</span>${item}</a>`).join('');

const schematic=`<svg class="v3-schematic" viewBox="0 0 760 380" fill="none" role="img" aria-label="Automotive electrical schematic"><g stroke="currentColor" stroke-width="1.1" opacity=".75"><path d="M70 92H210V154H330M384 154H520V94H665M520 154V278H665"/><rect x="28" y="54" width="90" height="76"/><rect x="330" y="118" width="54" height="72"/><rect x="665" y="54" width="70" height="76"/><rect x="665" y="242" width="70" height="76"/><path d="M72 130V308H592M592 300V316M580 303V313M568 306V310"/><circle cx="210" cy="92" r="4" fill="currentColor"/><circle cx="520" cy="154" r="4" fill="currentColor"/></g><g stroke="#A45A3A" stroke-width="2.3"><path d="M330 154H346M368 154H384M349 166L366 142"/></g><g fill="currentColor" font-family="Arial,sans-serif" font-size="11" letter-spacing="1.5" opacity=".86"><text x="28" y="38">POWER</text><text x="49" y="98">12 V</text><text x="322" y="102">RELAY</text><text x="636" y="38">ENGINE ECU</text><text x="631" y="337">CONNECTOR</text><text x="228" y="139" opacity=".55">FUSED SUPPLY</text><text x="98" y="334" opacity=".55">GROUND</text></g></svg>`;

const experienceMeta=[
 {meta:'Brisbane, Australia · Defence / Cyber / Engineering',skills:['Product Security','Systems Engineering','Defence','Cyber']},
 {meta:'Australia · Digital Health / Cyber / Delivery',skills:['Cyber Planning','Risk & Assurance','ISM / PSPF','Delivery']},
 {meta:'Australia · Defence / Engineering / Capability',skills:['Engineering','Capability','Cyber','Sustainment']}
];

const experience=jobs.map((job,i)=>`<article class="v3-exp-item ${i===0?'is-open':''}" data-exp-item>
  <button class="v3-exp-trigger" type="button" aria-expanded="${i===0?'true':'false'}">
    <span class="v3-exp-number">0${i+1}</span>
    <span class="v3-exp-heading"><strong>${job.name}</strong><span>${job.role}</span></span>
    <time>${job.date.replace('NOW','')}</time>
    <span class="v3-exp-toggle" aria-hidden="true">${i===0?'−':'+'}</span>
  </button>
  <div class="v3-exp-panel" ${i===0?'':'hidden'}>
    <div class="v3-exp-panel-inner">
      <p class="v3-exp-meta">${experienceMeta[i].meta}</p>
      <p>${job.copy}</p>
      <div class="v3-exp-skills">${experienceMeta[i].skills.map(skill=>`<span>${skill}</span>`).join('')}</div>
    </div>
  </div>
</article>`).join('');

const projectTile=(cls,href,title,copy,meta,visual)=>`<a class="v3-project ${cls} reveal" href="${href}">
  <div class="v3-project-media">${visual}</div>
  <div class="v3-project-copy"><div><h3>${title}</h3><p>${copy}</p><span class="v3-project-meta">${meta}</span></div><span class="v3-project-arrow" aria-hidden="true">↗</span></div>
</a>`;

const projectGrid=`<div class="v3-project-stage" data-project-stage>
  <div class="v3-lifecycle" data-lifecycle>
    <span class="v3-life-label" data-life-label>IN PROGRESS</span>
    <div class="v3-life-track"><span class="v3-life-progress" data-life-progress></span><span class="v3-life-dot" data-life-dot></span></div>
    <span class="v3-life-count" data-life-count>04 ACTIVE</span>
  </div>
  <div class="v3-project-grid v3-project-grid--active">
    ${projectTile('v3-project--chassis','/projects/chassiswire/','ChassisWire','A clearer way to document, understand and modify automotive electrical systems.','SOFTWARE · OPEN SOURCE · 2026—',`<div class="v3-technical"><span>CHASSISWIRE / AUTOMOTIVE ELECTRICAL SYSTEMS</span>${schematic}<span>FROM A PIN TO THE WHOLE PICTURE</span></div>`)}
    ${projectTile('v3-project--house','/projects/','House renovation','Turning a 1980s Brisbane house into a better home, workshop and place to build things.','RENOVATION · 2025—',img('/images/photography/workshop.jpg','Workshop and renovation projects'))}
    ${projectTile('v3-project--is','/projects/automotive-engineering/','E30 318iS','Returning the 318iS to the road properly — mechanical, interior and detail work.','RESTORATION · ONGOING',img(e30Image('back-home'),'BMW E30 restoration work'))}
    ${projectTile('v3-project--m54','/projects/automotive-engineering/','E30 318i + M54','A full restoration wrapped around an M54B30 conversion and the engineering to make it work.','RESTORATION / ENGINE SWAP · ONGOING',img('/images/projects/workshop.jpg','BMW engine and workshop projects'))}
  </div>
  <div class="v3-project-turn" aria-hidden="true"><span>work in motion</span><i></i><span>finished work</span></div>
  <div class="v3-completed-marker" data-completed-marker></div>
  <div class="v3-project-grid v3-project-grid--completed">
    ${projectTile('v3-project--respray','/writing/e30-respray/','E30 sedan respray','From hail-damaged daily to a complete DIY bodywork and respray project.','COMPLETED · E30 RESPRAY',img(e30Image('finished'),'Completed Glacier Blue BMW E30 respray'))}
    ${projectTile('v3-project--honda','https://haydenbwade.com/blog/','Honda CB500 Four','Restoration, engine work, carburettors and a completely reworked electrical system.','COMPLETED · CB500 FOUR',img('/images/photography/e30-detail.jpg','Mechanical detail'))}
  </div>
</div>`;

const writing=`<div class="v3-writing-list">
  <a class="v3-writing-feature reveal" href="/writing/e30-respray/" data-preview="/images/e30-respray/finished.jpg">
    <span class="v3-writing-number">01</span><div class="v3-writing-main"><div class="v3-writing-kicker"><span>E30 RESPRAY</span><span>7-PART SERIES</span></div><h3>Restoring an E30</h3><p>From hail-damaged daily to a full DIY respray.</p></div><span class="v3-writing-arrow">→</span>
  </a>
  <a class="v3-writing-feature reveal" href="https://haydenbwade.com/blog/" data-preview="/images/projects/workshop.jpg">
    <span class="v3-writing-number">02</span><div class="v3-writing-main"><div class="v3-writing-kicker"><span>HONDA CB500 FOUR</span><span>BLOG SERIES</span></div><h3>Rebuilding an old Honda</h3><p>Restoration, wiring and the long process of making old machinery work properly again.</p></div><span class="v3-writing-arrow">→</span>
  </a>
  <div class="v3-more-notes"><p class="v3-small-label">MORE NOTES</p>
    <a href="/projects/chassiswire/"><time>2026</time><span><strong>Building ChassisWire</strong><small>Designing better automotive wiring documentation.</small></span><b>→</b></a>
    <a href="/projects/automotive-engineering/"><time>2026</time><span><strong>Engine swaps, wiring & old BMWs</strong><small>Notes from doing things the difficult way.</small></span><b>→</b></a>
  </div>
  <a class="v3-text-link" href="/writing/">VIEW ALL WRITING <span>→</span></a>
  <div class="v3-writing-preview" data-writing-preview aria-hidden="true"><img alt=""></div>
</div>`;

const photos=gallery.slice(0,4);
const photography=`<div class="v3-photo-grid">${photos.map((g,i)=>`<figure class="v3-photo v3-photo--${i+1} reveal"><button class="image-button" data-enlarge="${g.image}" data-caption="${g.caption}" aria-label="Enlarge: ${g.caption}">${img(g.image,g.caption)}</button><figcaption><span>${g.caption}</span><span>${g.category}</span></figcaption></figure>`).join('')}</div><a class="v3-text-link" href="/photography/">VIEW PHOTOGRAPHY <span>→</span></a>`;

const body=`<header class="hero v3-hero" data-hero>
  ${img('/images/hero/alpine-e30.jpg','Red E30 in an alpine landscape — concept artwork','hero-image',true)}
  <div class="hero-top"><span class="hero-discipline">Cybersecurity · Engineering · Old cars</span><a href="#contact">Let’s talk ↗</a></div>
  <h1 class="hero-title"><span>Hayden</span><span>Wade</span></h1>
  <p class="hero-role">Product Security Engineer<br>+ Builder</p>
  <div class="hero-bottom"><p>Based in Brisbane,<br>Australia</p><a class="explore" href="#about"><span class="round-arrow" aria-hidden="true">↓</span>Explore</a><p>Selected work<br>2026</p></div>
</header>
<nav class="v3-nav" data-sticky-nav aria-label="Homepage navigation"><a class="v3-nav-brand" href="#top">HAYDEN WADE</a><div class="v3-nav-links">${nav}</div></nav>
<main id="main" class="v3-main">
  <section id="about" class="v3-section v3-about" data-section>
    <div class="v3-section-label"><span>01 / ABOUT</span><span>↘</span></div>
    <h2 class="v3-display reveal">Engineer by profession.<br><em>Compulsive project starter<br>by nature.</em></h2>
    <div class="v3-about-grid reveal">
      <div class="v3-about-copy"><p>I work across engineering, cyber, software and complex technical systems.</p><p>Outside work, I’m usually rebuilding an old BMW, working on the house, taking photos or starting something else I probably don’t have time for.</p><a class="v3-text-link" href="/about/">MORE ABOUT ME <span>→</span></a></div>
      <figure class="v3-about-portrait"><div class="v3-image-window">${img('/images/about/portrait.jpg','Hayden Wade')}</div><figcaption><span>BRISBANE / AU</span><span>ENGINEER · MAKER</span></figcaption></figure>
      <div class="v3-about-index"><span>BRISBANE, AU</span><a href="#experience">ENGINEERING</a><a href="#projects">OLD CARS</a><a href="#photography">PHOTOGRAPHY</a><a href="#projects">MAKING</a></div>
    </div>
  </section>

  <section id="experience" class="v3-section v3-experience" data-section>
    <div class="v3-section-label"><span>02 / EXPERIENCE</span><span>↘</span></div>
    <h2 class="v3-display reveal">A technical foundation.<br><em>A broader perspective.</em></h2>
    <div class="v3-experience-list reveal">${experience}</div>
    <a class="v3-text-link" href="/experience/">FULL EXPERIENCE & CREDENTIALS <span>→</span></a>
  </section>

  <section id="projects" class="v3-section v3-projects" data-section>
    <div class="v3-section-label"><span>03 / PROJECTS</span><span>↘</span></div>
    <h2 class="v3-display reveal">Selected work.<br><em>Things I’m building, restoring<br>and finishing.</em></h2>
    ${projectGrid}
  </section>

  <section id="writing" class="v3-section v3-writing" data-section>
    <div class="v3-section-label"><span>04 / WRITING</span><span>↘</span></div>
    <h2 class="v3-display reveal">Notes from things<br><em>I’ve actually done.</em></h2>
    ${writing}
  </section>

  <section id="photography" class="v3-section v3-photography" data-section>
    <div class="v3-section-label"><span>05 / PHOTOGRAPHY</span><span>↘</span></div>
    <h2 class="v3-display reveal">Places, cars<br><em>& other things.</em></h2>
    ${photography}
  </section>

  <section id="contact" class="v3-contact" data-section>
    <div class="v3-contact-inner">
      <div class="v3-section-label"><span>06 / CONTACT</span><span>↘</span></div>
      <p class="v3-contact-question reveal">Have a project, idea,<br>or old BMW problem?</p>
      <h2 class="v3-contact-title reveal">Let’s <em>talk.</em></h2>
      <div class="v3-contact-links reveal"><a href="mailto:${site.email}">EMAIL <span>↗</span></a><a href="${site.linkedin}">LINKEDIN <span>↗</span></a><a href="${site.github}">GITHUB <span>↗</span></a></div>
      <div class="v3-contact-foot"><span>BRISBANE, AUSTRALIA</span><span>© HAYDEN WADE / 2026</span></div>
    </div>
  </section>
</main>`;

export function homeV3(){
 const html=shell('Hayden Wade','Product Security Engineer in Brisbane. Cybersecurity, engineering, old BMWs and the things I learn along the way.',body);
 return html.replace('<body>','<body class="home-v3">').replace('</head>','<link rel="stylesheet" href="/assets/home-v3.css"><script src="/assets/home-v3.js" defer></script></head>');
}
