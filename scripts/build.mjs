import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as T from '../src/templates.mjs';
import {posts} from '../src/site.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
export const slug=s=>s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');
function inline(s){return T.esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>/^(https?:\/\/|\/|#|mailto:)/.test(url)?`<a href="${url}">${label}</a>`:label);}
function markdown(raw){const headings=[];const html=raw.split(/\n\s*\n/).map(b=>{b=b.trim();if(b.startsWith('# '))return '';if(b.startsWith('## ')){const text=b.slice(3);const id=slug(text);headings.push({text,id});return `<h2 id="${id}">${inline(text)}</h2>`;}const m=b.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);if(m)return `<figure><button class="image-button" data-enlarge="${m[2]}" data-caption="${T.esc(m[1])}" aria-label="Enlarge: ${T.esc(m[1])}">${T.img(m[2],m[1])}</button><figcaption>${T.esc(m[1])}</figcaption></figure>`;if(b.startsWith('> '))return `<blockquote>${inline(b.slice(2))}</blockquote>`;return `<p>${inline(b).replaceAll('\n',' ')}</p>`;}).join('\n');return {html,headings};}

const hondaArchive=`<div class="archive-series reveal"><div class="archive-series-head"><div><span class="eyebrow">From the archive / 2022</span><h3 class="serif">Honda CB500 Four.</h3></div><p>Four build notes from the cafe-racer project: teardown, carburettors, engine rebuild and the custom m.unit wiring harness.</p></div><div class="archive-posts"><a class="archive-post" href="https://haydenbwade.com/tearing-down-the-honda-cb550/"><time>10 Feb 2022</time><span>Tearing down the bike</span><span class="archive-arrow" aria-hidden="true">↗</span></a><a class="archive-post" href="https://haydenbwade.com/cb550f-carburetor-disassembly-and-restoration/"><time>10 Feb 2022</time><span>Carburetor disassembly & restoration</span><span class="archive-arrow" aria-hidden="true">↗</span></a><a class="archive-post" href="https://haydenbwade.com/engine-rebuild/"><time>05 Mar 2022</time><span>Engine rebuild</span><span class="archive-arrow" aria-hidden="true">↗</span></a><a class="archive-post" href="https://haydenbwade.com/cb500-cafe-racer-build-rewiring-the-bike-with-m-unit/"><time>28 Mar 2022</time><span>Rewiring the bike with m.unit</span><span class="archive-arrow" aria-hidden="true">↗</span></a></div></div>`;
function refineHome(html){
 html=html.replace('Selected things<br><em>I’m building.</em>','Selected work.<br><em>Things I’m building.</em>');
 html=html.replace('Notes, projects &<br><em>things I’ve learned.</em>','Notes from things<br><em>I’ve actually done.</em>');
 const marker='<div style="margin-top:40px"><a class="small-link" href="/writing/">All writing<span aria-hidden="true">→</span></a></div>';
 return html.replace(marker,hondaArchive+marker);
}
function refineWriting(html){
 html=html.replace('Learning,<br><em>out loud.</em>','Things worth<br><em>writing down.</em>');
 const marker='<div style="margin-top:50px"><a class="small-link" href="https://haydenbwade.com/blog/">Earlier posts on my original site<span aria-hidden="true">↗</span></a></div>';
 return html.replace(marker,hondaArchive+'<div style="margin-top:50px"><a class="small-link" href="https://haydenbwade.com/blog/">View the original archive<span aria-hidden="true">↗</span></a></div>');
}

export function build(){fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});fs.cpSync(path.join(root,'public'),out,{recursive:true});fs.mkdirSync(path.join(out,'assets'),{recursive:true});for(const name of ['styles.css','refinements.css','client.js','client-base.js'])fs.copyFileSync(path.join(root,'src',name),path.join(out,'assets',name));fs.copyFileSync(path.join(root,'public/fonts/fonts.css'),path.join(out,'assets/fonts.css'));
const routes=[];
function write(route,html){const relative=route==='/'?'':route.replace(/^\//,'');const file=path.join(out,relative,'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});const prefix=path.relative(path.dirname(file),out).split(path.sep).join('/')||'.';
html=html.replace('</head>','<link rel="stylesheet" href="/assets/refinements.css"></head>');
// Relative links keep exported pages usable under any subdirectory and from disk.
html=html.replace(/(href|src|data-enlarge)="\/(?!\/)([^"]*)"/g,(_,attr,value)=>{const [pathname,hash]=value.split('#');let target=pathname;if(!target||target.endsWith('/'))target+='index.html';return `${attr}="${prefix}/${target}${hash?'#'+hash:''}"`;});
html=html.replace(/srcset="([^"]+)"/g,(_,set)=>'srcset="'+set.split(', ').map(entry=>entry.startsWith('/')?prefix+entry:entry).join(', ')+'"');
fs.writeFileSync(file,html);routes.push(route);}
write('/',refineHome(T.home()));write('/writing/e30-respray/',T.series());
posts.forEach((p,i)=>{const raw=read('content/writing/e30-respray/'+p.slug+'.md');const {html,headings}=markdown(raw);write(T.postUrl(p),T.article(p,i,html,headings,raw.split(/\s+/).length));});
write('/about/',T.textPage('A little about me.','Engineer / Builder / Curious by default',markdown(read('content/about.md')).html));
write('/experience/',T.experience(markdown(read('content/experience.md')).html));
write('/projects/',T.projects());
write('/projects/chassiswire/',T.textPage('ChassisWire.','Automotive / Electrical / Software',markdown(read('content/projects/chassiswire.md')).html));
write('/projects/automotive-engineering/',T.textPage('Engineering old cars.','Ongoing projects / Workshop notes',markdown(read('content/projects/automotive-engineering.md')).html));
write('/writing/',refineWriting(T.writing()));write('/photography/',T.photography());
fs.writeFileSync(path.join(out,'404.html'),T.shell('Page not found','This page could not be found.',`<main class="text-page" id="main"><p class="eyebrow">404 / Wrong turn</p><h1 class="serif">A road<br><em>less travelled.</em></h1><p>This page has moved or doesn’t exist.</p><a class="small-link" href="/">Back to the homepage →</a></main>`));
fs.writeFileSync(path.join(out,'routes.json'),JSON.stringify(routes,null,2));console.log(`Built ${routes.length} pages in dist/`);return routes;}
if(process.argv[1]===fileURLToPath(import.meta.url))build();
