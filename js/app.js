/* Logika tampilan: memuat content/index.json (artikel Markdown) dan content/kamus.json. */
const $=id=>document.getElementById(id);
const IC={fish:'<path d="M3 12c3-5 9-6 13-2l5-3v10l-5-3c-4 4-10 3-13-2z"/><circle cx="8" cy="11" r=".6" fill="currentColor"/>',tank:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11c3 2 6-2 9 0s6 2 9 0"/>',box:'<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',dots:'<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="14.5" cy="9" r="1" fill="currentColor"/><circle cx="12" cy="14.5" r="1" fill="currentColor"/>',drop:'<path d="M12 3.5c3.5 4.5 5.5 7.2 5.5 10a5.5 5.5 0 01-11 0c0-2.8 2-5.5 5.5-10z"/>',cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',wave:'<path d="M3 9c3-3 6 3 9 0s6-3 9 0M3 15c3-3 6 3 9 0s6-3 9 0"/>'};
const ic=(n,s=28)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${IC[n]}</svg>`;

let A=[],K=[],P=[],cat='all',kcat='all';
const KC={all:'Semua',ikan:'Ikan',rawat:'Perawatan',air:'Air & Alat',sakit:'Penyakit'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pth=p=>esc(String(p||'').replace(/^\/+/,''));
const tip=(t,c='warn')=>`<div class="box c-${c}">${t}</div>`;

/* ---------- Markdown + blok khusus ---------- */
function attrs(s){const o={};s.replace(/(\w+)="([^"]*)"/g,(m,k,v)=>o[k]=v);return o}
function block(s){
 if(s.startsWith(':::')){const m=s.match(/^:::(\w+)\n([\s\S]*?)\n:::/);return `<div class="box c-${esc(m[1])}">${marked.parse(m[2])}</div>`}
 const m=s.match(/\{\{(\w+) (.*)\}\}/),t=m[1],a=attrs(m[2]);
 if(t==='video')return `<figure><video controls playsinline preload="metadata" ${a.poster?`poster="${pth(a.poster)}"`:''} src="${pth(a.src)}"></video>${a.caption?`<figcaption>${esc(a.caption)}</figcaption>`:''}</figure>`;
 if(t==='youtube')return `<figure><div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(a.id)}" title="${esc(a.caption||'Video')}" allowfullscreen loading="lazy"></iframe></div>${a.caption?`<figcaption>${esc(a.caption)}</figcaption>`:''}</figure>`;
 if(t==='galeri')return `<div class="gal">${(a.images||'').split('|').filter(Boolean).map(i=>`<img src="${pth(i)}" alt="">`).join('')}</div>`;
 return ''}
function renderMd(md){
 const re=/^:::\w+\n[\s\S]*?\n:::[ \t]*$|^[ \t]*(?:(?:[-*+]|\d+\.)[ \t]+)?\{\{\w+ .*\}\}[ \t]*$/gm;let out='',last=0,m;
 while((m=re.exec(md))){out+=marked.parse(md.slice(last,m.index))+block(m[0]);last=re.lastIndex}
 out+=marked.parse(md.slice(last));
 return out.replace(/(src|poster)="\/(?!\/)/g,'$1="').replace(/<img /g,'<img loading="lazy" ')}

/* ---------- Kartu & beranda ---------- */
const thumb=a=>a.cover?`<img src="${pth(a.cover)}" alt="" loading="lazy" class="w-14 h-14 rounded-2xl object-cover shrink-0 border border-bd">`:`<div class="w-14 h-14 rounded-2xl bg-soft border border-bd flex items-center justify-center text-pri shrink-0">${ic(IC[a.icon]?a.icon:'fish',28)}</div>`;
const card=a=>`<button onclick="openA('${esc(a.id)}')" class="w-full text-left bg-card border border-bd rounded-2xl p-4 flex gap-3 items-center active:scale-[.99]">${thumb(a)}<div class="min-w-0"><p class="text-[10px] font-bold text-pri uppercase tracking-wide">${esc(CATS[a.category]||'Materi')} · ${esc(a.minutes||5)} mnt baca</p><p class="text-sm font-bold leading-snug">${esc(a.title)}</p><p class="text-xs text-mu mt-0.5">${esc(a.summary)}</p></div></button>`;
function chips(){$('chips').innerHTML=[['all','Semua'],...Object.entries(CATS)].map(([k,v])=>`<button onclick="cat='${k}';chips();feat()" class="px-4 py-2 rounded-xl text-xs whitespace-nowrap border ${cat==k?'bg-tx font-bold':'bg-soft border-bd text-mu'}" ${cat==k?'style="color:var(--bg)"':''}>${v}</button>`).join('')}
function feat(){const l=A.filter(a=>cat=='all'||a.category==cat);$('feat').innerHTML=l.slice(0,3).map(card).join('')||'<p class="text-xs text-mu">Belum ada artikel.</p>'}
function startA(){const a=A.find(x=>x.id==START_ID)||A[0];if(a)openA(a.id)}

/* ---------- Pencarian ---------- */
const hay=a=>(a.title+' '+a.summary+' '+(a.keywords||'')+' '+(a.body||'')).toLowerCase();
function doSearch(){const v=$('q').value.toLowerCase().trim();const r=!v?A:A.filter(a=>{const h=hay(a);return h.includes(v)||v.split(/\s+/).every(w=>h.includes(w))});$('res').innerHTML=r.length?r.map(card).join(''):'<p class="text-xs text-mu">Tidak ditemukan. Coba kata kunci lain (nama penyakit, gejala, jenis ikan).</p>'}
function goSearch(){go('cari');setTimeout(()=>$('q').focus(),50)}
function go(t){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.id=='t-'+t));document.querySelectorAll('.nv').forEach(x=>x.classList.toggle('on',x.dataset.t==t));$('main').scrollTop=0}

/* ---------- Detail artikel ---------- */
function openA(id){const i=A.findIndex(a=>a.id==id);if(i<0)return;const a=A[i],p=A[i-1],n=A[i+1];
 $('dcat').textContent=CATS[a.category]||'Materi';
 const heads=[];let html=renderMd(a.body||'').replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g,(m,t)=>{heads.push(t.replace(/<[^>]+>/g,''));const j=heads.length-1;return `<h2 id="s${j}">${j+1}. ${t}</h2>`});
 const toc=heads.length>2?`<div class="flex gap-2 overflow-x-auto ns mt-3 pb-1">${heads.map((h,j)=>`<button onclick="$('s${j}').scrollIntoView({behavior:'smooth'})" class="text-[11px] px-3 py-1.5 rounded-full bg-soft border border-bd whitespace-nowrap">${esc(h)}</button>`).join('')}</div>`:'';
 const rel=A.filter(x=>x.category==a.category&&x.id!=id).slice(0,2);
 $('dbody').innerHTML=(a.cover?`<img class="cover" src="${pth(a.cover)}" alt="">`:`<div class="mt-4 text-pri">${ic(IC[a.icon]?a.icon:'fish',44)}</div>`)+
 `<h2 class="text-xl font-extrabold mt-2 leading-tight" style="margin-top:.5rem;font-size:20px">${esc(a.title)}</h2><p class="text-xs text-mu mt-1">${esc(a.minutes||5)} menit baca · Gratis</p><p class="mt-3">${esc(a.summary)}</p>${toc}${html}
 ${a.category=='sakit'||a.category=='baru'?tip('Dosis obat tidak boleh digeneralisasi. Selalu pertimbangkan bahan aktif, volume air aktual, petunjuk produk, dan kondisi ikan. Gejala serupa dapat memiliki penyebab berbeda.'):''}
 ${rel.length?`<h3 class="text-sm font-bold mt-6 mb-2">Artikel terkait</h3><div class="space-y-3">${rel.map(card).join('')}</div>`:''}
 <div class="flex gap-3 mt-6">${p?`<button onclick="openA('${esc(p.id)}')" class="flex-1 text-left bg-soft border border-bd rounded-xl p-3 text-xs"><span class="text-mu">← Sebelumnya</span><br><b>${esc(p.title)}</b></button>`:'<div class="flex-1"></div>'}${n?`<button onclick="openA('${esc(n.id)}')" class="flex-1 text-right bg-soft border border-bd rounded-xl p-3 text-xs"><span class="text-mu">Berikutnya →</span><br><b>${esc(n.title)}</b></button>`:'<div class="flex-1"></div>'}</div>`;
 $('det').classList.remove('hidden');$('det').classList.add('flex');$('dbody').scrollTop=0}
function closeA(){$('det').classList.add('hidden');$('det').classList.remove('flex')}
const SUN='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>',MOON='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>';
const isDark=()=>{const t=document.documentElement.dataset.theme;return t?t==='dark':!!(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)};
function paintTheme(){const b=$('tg');if(!b)return;b.innerHTML=isDark()?SUN:MOON;b.setAttribute('aria-label',isDark()?'Mode terang':'Mode gelap')}
function toggleTheme(){const t=isDark()?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}paintTheme()}

/* ---------- Kamus ---------- */
function rK(){const v=$('kq').value.toLowerCase().trim();
 $('kc').innerHTML=Object.entries(KC).map(([k,n])=>`<button onclick="kcat='${k}';rK()" class="px-4 py-2 rounded-xl text-xs whitespace-nowrap border ${kcat==k?'bg-tx font-bold':'bg-soft border-bd text-mu'}" ${kcat==k?'style="color:var(--bg)"':''}>${n}</button>`).join('');
 const r=K.filter(x=>(kcat=='all'||x.cat==kcat)&&(!v||(x.term+' '+x.def).toLowerCase().includes(v))).sort((a,b)=>a.term.localeCompare(b.term,'id'));
 let L='',h='';
 r.forEach(x=>{const l=x.term[0].toUpperCase();if(l!=h){h=l;L+=`<p class="text-xs font-extrabold text-pri mt-4 mb-2">${esc(l)}</p>`}
 L+=`<div class="bg-card border border-bd rounded-2xl p-4 mb-2"><div class="flex justify-between gap-2"><p class="text-sm font-bold">${esc(x.term)}</p><span class="text-[10px] text-mu shrink-0">${esc(KC[x.cat]||'')}</span></div><p class="text-xs text-mu mt-1 leading-relaxed">${esc(x.def)}</p>${x.article&&A.some(a=>a.id==x.article)?`<button onclick="openA('${esc(x.article)}')" class="text-xs text-pri font-semibold mt-2">Baca panduan →</button>`:''}</div>`});
 $('kl').innerHTML=L||'<p class="text-xs text-mu">Istilah tidak ditemukan.</p>'}

/* ---------- Toko ---------- */
const rp=n=>{if(n===null||n===undefined||String(n).trim()==='')return '';const v=Number(n);return isFinite(v)?'Rp '+v.toLocaleString('id-ID'):esc(n)};
const safeUrl=u=>/^https?:\/\//i.test(u||'')?esc(u):'#';
function rT(){
 $('tk').innerHTML=P.length?P.map(p=>`<div class="bg-card border border-bd rounded-2xl overflow-hidden flex flex-col">${p.image?`<img src="${pth(p.image)}" alt="${esc(p.title)}" loading="lazy" class="w-full aspect-square object-cover bg-soft">`:`<div class="w-full aspect-square bg-soft flex items-center justify-center text-pri">${ic('box',40)}</div>`}<div class="p-3 flex flex-col flex-1"><p class="text-xs font-bold leading-snug">${esc(p.title)}</p><p class="text-sm font-extrabold text-pri mt-1">${rp(p.price)}</p><div class="mt-auto pt-3"><a href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer" class="block text-center bg-pri text-white text-xs font-bold py-2.5 rounded-xl active:scale-95">Beli</a></div></div></div>`).join(''):'<p class="col-span-2 text-xs text-mu">Produk segera hadir.</p>'}

/* ---------- Mulai ---------- */
function init(){chips();feat();
 $('pop').innerHTML=A.filter(a=>a.popular).map(a=>`<button onclick="openA('${esc(a.id)}')" class="shrink-0 w-36 text-left bg-card border border-bd rounded-2xl p-3">${a.cover?`<img src="${pth(a.cover)}" alt="" class="w-full h-16 object-cover rounded-xl">`:`<div class="text-pri">${ic(IC[a.icon]?a.icon:'fish',28)}</div>`}<p class="text-xs font-bold mt-2 leading-snug">${esc(a.title)}</p><p class="text-[10px] text-mu mt-1">${esc(a.minutes||5)} mnt</p></button>`).join('');
 $('list').innerHTML=A.map(card).join('');
 $('soon').innerHTML=SOON.map(s=>`<span class="text-[11px] px-3 py-1.5 rounded-full bg-soft border border-bd text-mu">${s}</span>`).join('');
 $('sug').innerHTML=['white spot','berenang miring','filter','oranda','karantina','borok'].map(s=>`<button onclick="$('q').value='${s}';doSearch()" class="text-[11px] px-3 py-1.5 rounded-full bg-soft border border-bd">${s}</button>`).join('');
 doSearch();rK();rT()}
async function load(){
 try{
  const j=u=>fetch(u,{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(u);return r.json()});
  const [i,k,t]=await Promise.all([j('content/index.json'),j('content/kamus.json').catch(()=>({items:[]})),j('content/toko.json').catch(()=>({items:[]}))]);
  A=(i.articles||[]).sort((a,b)=>(a.order??99)-(b.order??99));K=k.items||[];P=t.items||[];
 }catch(e){
  const m='<div class="box c-warn">Konten tidak dapat dimuat. Jalankan lewat server (mis. <b>npm start</b>) dan pastikan <b>content/index.json</b> ada.</div>';
  $('feat').innerHTML=m;$('list').innerHTML=m;console.error(e)}
 init()}
load();go('home');paintTheme();
