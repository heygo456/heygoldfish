/* Logika tampilan: memuat content/index.json (artikel Markdown) dan content/kamus.json. */
const $=id=>document.getElementById(id);
const IC={fish:'<path d="M3 12c3-5 9-6 13-2l5-3v10l-5-3c-4 4-10 3-13-2z"/><circle cx="8" cy="11" r=".6" fill="currentColor"/>',tank:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11c3 2 6-2 9 0s6 2 9 0"/>',box:'<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',dots:'<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="14.5" cy="9" r="1" fill="currentColor"/><circle cx="12" cy="14.5" r="1" fill="currentColor"/>',drop:'<path d="M12 3.5c3.5 4.5 5.5 7.2 5.5 10a5.5 5.5 0 01-11 0c0-2.8 2-5.5 5.5-10z"/>',cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',wave:'<path d="M3 9c3-3 6 3 9 0s6-3 9 0M3 15c3-3 6 3 9 0s6-3 9 0"/>'};
const ic=(n,s=28)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${IC[n]}</svg>`;

let A=[],K=[],P=[],S={},IN={},cat='all',kcat='all',tcat='all';
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

const SUN='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>',MOON='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>';
const isDark=()=>{const t=document.documentElement.dataset.theme;return t?t==='dark':!!(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)};
function paintTheme(){const b=$('tg');if(!b)return;b.innerHTML=isDark()?SUN:MOON;b.setAttribute('aria-label',isDark()?'Mode terang':'Mode gelap')}
function toggleTheme(){const t=isDark()?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}paintTheme()}

/* ---------- Kontak, WhatsApp & ikon ---------- */
const ok=u=>/^https?:\/\//i.test(u||'');
const WAN=()=>String(S.whatsapp||'6282375366949').replace(/\D/g,'');
const wa=t=>`https://wa.me/${WAN()}?text=${encodeURIComponent(t)}`;
const sv=(d,w=18)=>`<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const IW=sv('<path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3z"/><path d="M9 8.5c0 3.2 2.8 6 6 6l1-2-2-1-1 1c-1-.4-2-1.4-2.4-2.4l1-1-1-2z"/>');
const IT=sv('<path d="M14 4v10.5a3.5 3.5 0 11-3.5-3.5"/><path d="M14 4c.4 2.2 2 3.6 4 3.8"/>');
const IPIN=sv('<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>');
const IGR=sv('<circle cx="9" cy="9" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 6.5a3 3 0 010 5.5M18 20c0-2.2-1-4-2.5-5"/>');
const ISH=sv('<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',20);
const BTN='flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl active:scale-95';
const ext=(u,bg,t,fg='#fff')=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" class="${BTN}" style="background:${bg};color:${fg};text-decoration:none">${t}</a>`;
function toast(m){const t=$('toast');t.textContent=m;t.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.opacity=0,2200)}
const DEF_FAQ=[{q:'Bagaimana cara membeli ikan?',a:'Buka menu Toko, pilih ikan, lalu tekan tombol WhatsApp. Kami akan mengonfirmasi ketersediaan, harga, dan cara pembayaran.'},{q:'Bagaimana cara membeli perlengkapan dan obat?',a:'Perlengkapan, obat, dan pakan dibeli lewat Shopee atau Tokopedia. Tekan tombol toko yang tersedia pada kartu produk.'},{q:'Apakah materi di website ini gratis?',a:'Ya, seluruh artikel dan kamus dapat dibaca gratis tanpa biaya.'}];

/* ---------- Toko ---------- */
const rp=n=>{if(n===null||n===undefined||String(n).trim()==='')return '';const v=Number(n);return isFinite(v)?'Rp '+v.toLocaleString('id-ID'):esc(n)};
const ST={tersedia:['Tersedia','#1E8E4E'],preorder:['Pre-order','#B7791F'],terjual:['Terjual','#6C757D']};
const isFish=p=>p.type==='ikan';
function fishBtn(p){const s=p.status||'tersedia';
 if(s==='terjual')return '<span class="block text-center text-xs font-bold py-2.5 rounded-xl bg-soft text-mu border border-bd">Terjual</span>';
 return ext(wa(`Halo HeyGoldfish, saya tertarik dengan ${p.title}${p.size?' ukuran '+p.size:''}. ${s==='preorder'?'Apakah bisa pre-order?':'Apakah masih tersedia?'}`),'#25D366',IW+(s==='preorder'?'Pesan via WhatsApp':'Tanya via WhatsApp'))}
function shopBtns(p){const b=[];if(ok(p.shopee))b.push(['Beli di Shopee','#EE4D2D',p.shopee]);if(ok(p.tokopedia))b.push(['Beli di Tokopedia','#03AC0E',p.tokopedia]);if(!b.length&&ok(p.url))b.push(['Beli','var(--pri)',p.url]);return b.map(x=>ext(x[2],x[1],x[0])).join('')}
function pcard(p){const s=ST[p.status||'tersedia']||ST.tersedia;
 return `<div class="bg-card border border-bd rounded-2xl overflow-hidden flex flex-col h-full"><div class="relative">${p.image?`<img src="${pth(p.image)}" alt="${esc(p.title)}" loading="lazy" class="w-full aspect-square object-cover bg-soft" style="margin:0;border-radius:0">`:`<div class="w-full aspect-square bg-soft flex items-center justify-center text-pri">${ic(isFish(p)?'fish':'box',40)}</div>`}${isFish(p)?`<span class="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-1 rounded-full" style="background:${s[1]}">${s[0]}</span>`:''}</div><div class="p-3 flex flex-col flex-1"><div class="text-xs font-bold leading-snug">${esc(p.title)}</div>${p.size?`<div class="text-[11px] text-mu mt-0.5">Ukuran ${esc(p.size)}</div>`:''}<div class="text-sm font-extrabold text-pri mt-1">${rp(p.price)||(isFish(p)?'Tanya harga':'')}</div><div class="mt-auto pt-3 space-y-2">${isFish(p)?fishBtn(p):shopBtns(p)}</div></div></div>`}
function rT(){const T={all:'Semua',ikan:'Ikan',produk:'Perlengkapan'};
 $('tc').innerHTML=Object.entries(T).map(([k,n])=>`<button onclick="tcat='${k}';rT()" class="px-4 py-2 rounded-xl text-xs border ${tcat==k?'bg-tx font-bold':'bg-soft border-bd text-mu'}" ${tcat==k?'style="color:var(--bg)"':''}>${n}</button>`).join('');
 const l=P.filter(p=>tcat=='all'||(tcat=='ikan')==isFish(p)).sort((a,b)=>(a.status==='terjual')-(b.status==='terjual'));
 $('tk').innerHTML=l.length?l.map(pcard).join(''):'<p class="col-span-2 text-xs text-mu">Produk segera hadir.</p>'}
function rHome(){const f=P.filter(p=>isFish(p)&&p.status!=='terjual').slice(0,6);
 $('stokw').classList.toggle('hidden',!f.length);
 $('stok').innerHTML=f.map(p=>`<div class="shrink-0 w-40">${pcard(p)}</div>`).join('');
 $('qa').innerHTML=ext(wa('Halo HeyGoldfish, saya ingin bertanya.'),'#25D366',IW+'Tanya via WhatsApp')+(ok(S.komunitas)?ext(S.komunitas,'var(--tx)',IGR+'Gabung Komunitas','var(--bg)'):`<button onclick="go('toko')" class="${BTN}" style="background:var(--tx);color:var(--bg)">Lihat Toko</button>`)}
function rI(){const b=[ext(wa('Halo HeyGoldfish, saya ingin bertanya.'),'#25D366',IW+'WhatsApp'),ext(S.tiktok||'https://www.tiktok.com/@heygoldfish.bwi','var(--tx)',IT+'TikTok','var(--bg)')];
 if(ok(S.komunitas))b.push(ext(S.komunitas,'var(--pri)',IGR+'Gabung Komunitas'));
 if(ok(S.formulir))b.push(ext(S.formulir,'var(--soft)',IGR+'Daftar Penghobi','var(--tx)'));
 $('kontak').innerHTML=`<div class="bg-card border border-bd rounded-2xl p-4 flex gap-3 items-start"><span class="text-pri mt-0.5">${IPIN}</span><div><div class="text-xs font-bold">${esc(S.alamat||'Banyuwangi, Jawa Timur')}</div>${S.jam?`<div class="text-xs text-mu mt-0.5">${esc(S.jam)}</div>`:''}${ok(S.maps)?`<a href="${esc(S.maps)}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold mt-1 inline-block">Buka di Google Maps →</a>`:''}</div></div><div class="grid grid-cols-2 gap-3 mt-3">${b.join('')}</div>`;
 $('faq').innerHTML=(S.faq&&S.faq.length?S.faq:DEF_FAQ).map(f=>`<details class="bg-card border border-bd rounded-2xl px-4 py-3 mb-2"><summary class="text-xs font-bold cursor-pointer">${esc(f.q)}</summary><div class="text-xs text-mu mt-2 leading-relaxed">${esc(f.a)}</div></details>`).join('')}

/* ---------- Kartu artikel, beranda, pencarian ---------- */
const thumb=a=>a.cover?`<img src="${pth(a.cover)}" alt="" loading="lazy" class="w-14 h-14 rounded-2xl object-cover shrink-0 border border-bd" style="margin:0">`:`<div class="w-14 h-14 rounded-2xl bg-soft border border-bd flex items-center justify-center text-pri shrink-0">${ic(IC[a.icon]?a.icon:'fish',28)}</div>`;
const card=a=>`<button onclick="openA('${esc(a.id)}')" class="w-full text-left bg-card border border-bd rounded-2xl p-4 flex gap-3 items-center active:scale-[.99]">${thumb(a)}<div class="min-w-0"><div class="text-[10px] font-bold text-pri uppercase tracking-wide">${esc(CATS[a.category]||'Materi')} · ${esc(a.minutes||5)} mnt baca</div><div class="text-sm font-bold leading-snug">${esc(a.title)}</div><div class="text-xs text-mu mt-0.5">${esc(a.summary)}</div></div></button>`;
function chips(){$('chips').innerHTML=[['all','Semua'],...Object.entries(CATS)].map(([k,v])=>`<button onclick="cat='${k}';chips();feat()" class="px-4 py-2 rounded-xl text-xs whitespace-nowrap border ${cat==k?'bg-tx font-bold':'bg-soft border-bd text-mu'}" ${cat==k?'style="color:var(--bg)"':''}>${v}</button>`).join('')}
function feat(){const l=A.filter(a=>cat=='all'||a.category==cat);$('feat').innerHTML=l.slice(0,3).map(card).join('')||'<p class="text-xs text-mu">Belum ada artikel.</p>'}
function startA(){const a=A.find(x=>x.id==START_ID)||A[0];if(a)openA(a.id)}
const hay=a=>(a.title+' '+a.summary+' '+(a.keywords||'')+' '+(a.body||'')).toLowerCase();
function doSearch(){const v=$('q').value.toLowerCase().trim();const r=!v?A:A.filter(a=>{const h=hay(a);return h.includes(v)||v.split(/\s+/).every(w=>h.includes(w))});$('res').innerHTML=r.length?r.map(card).join(''):'<p class="text-xs text-mu">Tidak ditemukan. Coba kata kunci lain (nama penyakit, gejala, jenis ikan).</p>'}
function goSearch(){const v=$('q0').value;$('q0').value='';go('cari');if(v){$('q').value=v;doSearch()}setTimeout(()=>$('q').focus(),50)}
function go(t){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.id=='t-'+t));document.querySelectorAll('.nv').forEach(x=>x.classList.toggle('on',x.dataset.t==(t=='cari'?'home':t)));$('main').scrollTop=0}

/* ---------- Detail artikel (alamat #/artikel/slug) ---------- */
function show(id){const i=A.findIndex(a=>a.id==id);if(i<0)return hideA();const a=A[i],p=A[i-1],n=A[i+1];
 $('dcat').textContent=CATS[a.category]||'Materi';$('dsh').onclick=()=>shareA(id);
 const heads=[];const html=renderMd(a.body||'').replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g,(m,t)=>{heads.push(t.replace(/<[^>]+>/g,''));const j=heads.length-1;return `<h2 id="s${j}">${j+1}. ${t}</h2>`});
 const toc=heads.length>2?`<div class="flex gap-2 overflow-x-auto ns mt-3 pb-1">${heads.map((h,j)=>`<button onclick="$('s${j}').scrollIntoView({behavior:'smooth'})" class="text-[11px] px-3 py-1.5 rounded-full bg-soft border border-bd whitespace-nowrap">${esc(h)}</button>`).join('')}</div>`:'';
 const rel=A.filter(x=>x.category==a.category&&x.id!=id).slice(0,2),prod=P.filter(x=>(x.articles||[]).includes(id)).slice(0,4);
 $('dbody').innerHTML=(a.cover?`<img class="cover" src="${pth(a.cover)}" alt="">`:`<div class="mt-4 text-pri">${ic(IC[a.icon]?a.icon:'fish',44)}</div>`)+
 `<h2 style="margin-top:.5rem;font-size:20px;line-height:1.25;font-weight:800">${esc(a.title)}</h2><div class="text-xs text-mu mt-1">${esc(a.minutes||5)} menit baca · Gratis</div><p class="mt-3">${esc(a.summary)}</p>${toc}${html}
 ${a.category=='sakit'||a.category=='baru'?tip('Dosis obat tidak boleh digeneralisasi. Selalu pertimbangkan bahan aktif, volume air aktual, petunjuk produk, dan kondisi ikan. Gejala serupa dapat memiliki penyebab berbeda.'):''}
 ${prod.length?`<h3 class="text-sm font-bold mt-6 mb-2">Produk terkait</h3><div class="grid grid-cols-2 gap-3">${prod.map(pcard).join('')}</div>`:''}
 <div class="box c-ok" style="margin-top:20px"><div class="text-sm font-bold">Ada pertanyaan tentang ikan Anda?</div><div class="text-xs text-mu" style="margin:.25rem 0 .75rem">Tanyakan langsung kepada HeyGoldfish.</div>${ext(wa(`Halo HeyGoldfish, saya baru membaca artikel "${a.title}" dan ingin bertanya.`),'#25D366',IW+'Tanya via WhatsApp')}</div>
 ${rel.length?`<h3 class="text-sm font-bold mt-6 mb-2">Artikel terkait</h3><div class="space-y-3">${rel.map(card).join('')}</div>`:''}
 <div class="flex gap-3 mt-6">${p?`<button onclick="openA('${esc(p.id)}')" class="flex-1 text-left bg-soft border border-bd rounded-xl p-3 text-xs"><span class="text-mu">← Sebelumnya</span><br><b>${esc(p.title)}</b></button>`:'<div class="flex-1"></div>'}${n?`<button onclick="openA('${esc(n.id)}')" class="flex-1 text-right bg-soft border border-bd rounded-xl p-3 text-xs"><span class="text-mu">Berikutnya →</span><br><b>${esc(n.title)}</b></button>`:'<div class="flex-1"></div>'}</div>`;
 $('det').classList.remove('hidden');$('det').classList.add('flex');$('dbody').scrollTop=0}
function hideA(){$('det').classList.add('hidden');$('det').classList.remove('flex')}
function openA(id){const h='#/artikel/'+id;if(location.hash===h)show(id);else location.hash=h}
function closeA(){if(location.hash)location.hash='';else hideA()}
function route(){const m=location.hash.match(/^#\/artikel\/(.+)$/);m?show(decodeURIComponent(m[1])):hideA()}
function shareA(id){const a=A.find(x=>x.id==id);if(!a)return;const u=location.href.split('#')[0]+'#/artikel/'+id;
 if(navigator.share)navigator.share({title:a.title,url:u}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(u).then(()=>toast('Tautan artikel disalin'),()=>toast(u));else toast(u)}
addEventListener('hashchange',route);

/* ---------- Halaman Info: teks dari content/info.json + galeri geser ---------- */
function rInfo(){const t=IN;
 $('itop').innerHTML=`<h2 class="text-lg font-extrabold" style="margin:.9rem 0 0">${esc(t.judul||'Tentang HeyGoldfish')}</h2>${t.subjudul?`<div class="text-sm font-bold text-pri mt-1">${esc(t.subjudul)}</div>`:''}${t.isi?renderMd(t.isi):''}${t.penutup?`<div class="box bg-ok mt-4 text-center"><b>${esc(t.penutup)}</b></div>`:''}`;
 $('kjudul').textContent=t.kontak_judul||'Terhubung dengan HeyGoldFish';$('kteks').textContent=t.kontak_teks||'';$('fjudul').textContent=t.faq_judul||'Pertanyaan Seputar Pembelian';rG()}
function rG(){const g=(IN.galeri||[]).filter(x=>x&&x.image),w=$('igal');clearInterval(rG.t);
 if(!g.length){w.innerHTML='';return}
 const arrow=(d,l)=>`<button onclick="gGo(${d})" aria-label="${d<0?'Foto sebelumnya':'Foto berikutnya'}" class="absolute top-1/2 -translate-y-1/2 ${l} w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold" style="background:rgba(0,0,0,.45);color:#fff">${d<0?'‹':'›'}</button>`;
 w.innerHTML=`<div class="relative mt-1"><div id="gs" class="flex overflow-x-auto ns" style="scroll-snap-type:x mandatory;border-radius:18px">${g.map(x=>`<div class="shrink-0 w-full relative" style="scroll-snap-align:center"><img src="${pth(x.image)}" alt="${esc(x.caption||'Galeri HeyGoldfish')}" loading="lazy" class="w-full object-cover" style="aspect-ratio:16/10;margin:0;border-radius:0">${x.caption?`<div class="absolute inset-x-0 bottom-0 px-4 py-3 text-xs font-semibold" style="color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.65))">${esc(x.caption)}</div>`:''}</div>`).join('')}</div>${g.length>1?arrow(-1,'left-2')+arrow(1,'right-2'):''}</div>${g.length>1?`<div id="gd" class="flex justify-center gap-1.5 mt-2">${g.map((_,i)=>`<button onclick="gTo(${i})" aria-label="Foto ${i+1}" style="width:8px;height:8px;border-radius:9px;background:var(--pri);opacity:.3;padding:0"></button>`).join('')}</div>`:''}`;
 const s=$('gs');let hold=0;rG.n=g.length;
 const cur=()=>s.clientWidth?Math.round(s.scrollLeft/s.clientWidth):0;
 const dots=()=>{const d=$('gd');if(d)[...d.children].forEach((b,k)=>b.style.opacity=k==cur()?1:.3)};
 gTo=i=>{s.scrollTo({left:i*s.clientWidth,behavior:'smooth'})};
 gGo=d=>{hold=Date.now()+7000;gTo((cur()+d+g.length)%g.length)};
 s.addEventListener('scroll',dots,{passive:true});
 ['pointerdown','touchstart','wheel'].forEach(e=>s.addEventListener(e,()=>hold=Date.now()+7000,{passive:true}));
 if(g.length>1&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))rG.t=setInterval(()=>{if(Date.now()<hold||!$('t-info').classList.contains('on')||!s.clientWidth)return;gTo((cur()+1)%g.length)},4000);
 dots()}
let gTo=()=>{},gGo=()=>{};

/* ---------- Kamus ---------- */
function rK(){const v=$('kq').value.toLowerCase().trim();
 $('kc').innerHTML=Object.entries(KC).map(([k,n])=>`<button onclick="kcat='${k}';rK()" class="px-4 py-2 rounded-xl text-xs whitespace-nowrap border ${kcat==k?'bg-tx font-bold':'bg-soft border-bd text-mu'}" ${kcat==k?'style="color:var(--bg)"':''}>${n}</button>`).join('');
 const r=K.filter(x=>(kcat=='all'||x.cat==kcat)&&(!v||(x.term+' '+x.def).toLowerCase().includes(v))).sort((a,b)=>a.term.localeCompare(b.term,'id'));
 let L='',h='';
 r.forEach(x=>{const l=x.term[0].toUpperCase();if(l!=h){h=l;L+=`<div class="text-xs font-extrabold text-pri mt-4 mb-2">${esc(l)}</div>`}
 L+=`<div class="bg-card border border-bd rounded-2xl p-4 mb-2"><div class="flex justify-between gap-2"><div class="text-sm font-bold">${esc(x.term)}</div><span class="text-[10px] text-mu shrink-0">${esc(KC[x.cat]||'')}</span></div><div class="text-xs text-mu mt-1 leading-relaxed">${esc(x.def)}</div>${x.article&&A.some(a=>a.id==x.article)?`<button onclick="openA('${esc(x.article)}')" class="text-xs text-pri font-semibold mt-2">Baca panduan →</button>`:''}</div>`});
 $('kl').innerHTML=L||'<p class="text-xs text-mu">Istilah tidak ditemukan.</p>'}

/* ---------- Mulai ---------- */
function init(){$('dsh').innerHTML=ISH;chips();feat();
 $('pop').innerHTML=A.filter(a=>a.popular).map(a=>`<button onclick="openA('${esc(a.id)}')" class="shrink-0 w-36 text-left bg-card border border-bd rounded-2xl p-3">${a.cover?`<img src="${pth(a.cover)}" alt="" class="w-full h-16 object-cover rounded-xl" style="margin:0">`:`<div class="text-pri">${ic(IC[a.icon]?a.icon:'fish',28)}</div>`}<div class="text-xs font-bold mt-2 leading-snug">${esc(a.title)}</div><div class="text-[10px] text-mu mt-1">${esc(a.minutes||5)} mnt</div></button>`).join('');
 $('list').innerHTML=A.map(card).join('');
 $('soon').innerHTML=SOON.map(s=>`<span class="text-[11px] px-3 py-1.5 rounded-full bg-soft border border-bd text-mu">${s}</span>`).join('');
 $('sug').innerHTML=['white spot','berenang miring','filter','oranda','karantina','borok'].map(s=>`<button onclick="$('q').value='${s}';doSearch()" class="text-[11px] px-3 py-1.5 rounded-full bg-soft border border-bd">${s}</button>`).join('');
 doSearch();rK();rT();rHome();rI();rInfo()}
async function load(){
 try{
  const j=u=>fetch(u,{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error(u);return r.json()});
  const [i,k,t,s,n]=await Promise.all([j('content/index.json'),j('content/kamus.json').catch(()=>({items:[]})),j('content/toko.json').catch(()=>({items:[]})),j('content/pengaturan.json').catch(()=>({})),j('content/info.json').catch(()=>({}))]);
  A=(i.articles||[]).sort((a,b)=>(a.order??99)-(b.order??99));K=k.items||[];P=t.items||[];S=s||{};IN=n||{};
 }catch(e){
  const m='<div class="box c-warn">Konten tidak dapat dimuat. Jalankan lewat server (mis. <b>npm start</b>) dan pastikan <b>content/index.json</b> ada.</div>';
  $('feat').innerHTML=m;$('list').innerHTML=m;console.error(e)}
 init();route()}
load();go('home');paintTheme();
