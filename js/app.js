/* Logika tampilan: navigasi, pencarian, detail artikel, kamus. */
const $=id=>document.getElementById(id);
const IC={fish:'<path d="M3 12c3-5 9-6 13-2l5-3v10l-5-3c-4 4-10 3-13-2z"/><circle cx="8" cy="11" r=".6" fill="currentColor"/>',tank:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11c3 2 6-2 9 0s6 2 9 0"/>',box:'<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',dots:'<circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="14.5" cy="9" r="1" fill="currentColor"/><circle cx="12" cy="14.5" r="1" fill="currentColor"/>',drop:'<path d="M12 3.5c3.5 4.5 5.5 7.2 5.5 10a5.5 5.5 0 01-11 0c0-2.8 2-5.5 5.5-10z"/>',cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',wave:'<path d="M3 9c3-3 6 3 9 0s6-3 9 0M3 15c3-3 6 3 9 0s6-3 9 0"/>'};
const ic=(n,s=28)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${IC[n]}</svg>`;
const card=a=>`<button onclick="openA('${a.id}')" class="w-full text-left bg-card border border-bd rounded-2xl p-4 flex gap-3 items-center active:scale-[.99]"><div class="w-14 h-14 rounded-2xl bg-soft border border-bd flex items-center justify-center text-pri shrink-0">${ic(a.e,28)}</div><div class="min-w-0"><p class="text-[10px] font-bold text-pri uppercase tracking-wide">${CATS[a.cat]} · ${a.m} mnt baca</p><p class="text-sm font-bold leading-snug">${a.t}</p><p class="text-xs text-mu mt-0.5">${a.s}</p></div></button>`;
let cat='all';
function chips(){$('chips').innerHTML=[['all','Semua'],...Object.entries(CATS)].map(([k,v])=>`<button onclick="cat='${k}';chips();feat()" class="px-4 py-2 rounded-xl text-xs whitespace-nowrap border ${cat==k?'bg-tx font-bold':'bg-soft border-bd text-mu'}" ${cat==k?'style="color:var(--bg)"':''}>${v}</button>`).join('')}
function feat(){const l=A.filter(a=>cat=='all'||a.cat==cat);$('feat').innerHTML=l.slice(0,3).map(card).join('')||'<p class="text-xs text-mu">Belum ada.</p>'}
function init(){chips();feat();
 $('pop').innerHTML=A.filter(a=>a.pop).map(a=>`<button onclick="openA('${a.id}')" class="shrink-0 w-36 text-left bg-card border border-bd rounded-2xl p-3"><div class="text-pri">${ic(a.e,28)}</div><p class="text-xs font-bold mt-2 leading-snug">${a.t}</p><p class="text-[10px] text-mu mt-1">${a.m} mnt</p></button>`).join('');
 $('list').innerHTML=A.map(card).join('');
 $('soon').innerHTML=SOON.map(s=>`<span class="text-[11px] px-3 py-1.5 rounded-full bg-soft border border-bd text-mu">${s}</span>`).join('');
 $('sug').innerHTML=['white spot','berenang miring','filter','oranda','karantina','borok'].map(s=>`<button onclick="$('q').value='${s}';doSearch()" class="text-[11px] px-3 py-1.5 rounded-full bg-soft border border-bd">${s}</button>`).join('');
 doSearch();rK()}
function doSearch(){const v=$('q').value.toLowerCase().trim();const r=!v?A:A.filter(a=>(a.t+' '+a.s+' '+a.k).toLowerCase().includes(v)||v.split(/\s+/).every(w=>(a.k+a.t).toLowerCase().includes(w)));$('res').innerHTML=r.length?r.map(card).join(''):'<p class="text-xs text-mu">Tidak ditemukan. Coba kata kunci lain (nama penyakit, gejala, jenis ikan).</p>'}
function goSearch(){go('cari');setTimeout(()=>$('q').focus(),50)}
function go(t){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.id=='t-'+t));document.querySelectorAll('.nv').forEach(x=>x.classList.toggle('on',x.dataset.t==t));$('main').scrollTop=0}
function openA(id){const i=A.findIndex(a=>a.id==id),a=A[i],p=A[i-1],n=A[i+1];
 $('dcat').textContent=CATS[a.cat];
 const toc=a.S.map((s,j)=>`<button onclick="$('s${j}').scrollIntoView({behavior:'smooth'})" class="text-[11px] px-3 py-1.5 rounded-full bg-soft border border-bd whitespace-nowrap">${s[0]}</button>`).join('');
 const rel=A.filter(x=>x.cat==a.cat&&x.id!=id).slice(0,2);
 $('dbody').innerHTML=`<div class="mt-4 text-pri">${ic(a.e,44)}</div><h2 class="text-xl font-extrabold mt-2 leading-tight">${a.t}</h2><p class="text-xs text-mu mt-1">${a.m} menit baca · Gratis</p><p class="mt-3">${a.s}</p>
 <div class="flex gap-2 overflow-x-auto ns mt-3 pb-1">${toc}</div>
 ${a.S.map((s,j)=>`<h3 id="s${j}" class="text-sm font-bold mt-5 mb-1">${j+1}. ${s[0]}</h3>${s[1]}`).join('')}
 ${a.cat=='sakit'||a.cat=='baru'?tip('Dosis obat tidak boleh digeneralisasi. Selalu pertimbangkan bahan aktif, volume air aktual, petunjuk produk, dan kondisi ikan. Gejala serupa dapat memiliki penyebab berbeda.'):''}
 ${rel.length?`<h3 class="text-sm font-bold mt-6 mb-2">Artikel terkait</h3><div class="space-y-3">${rel.map(card).join('')}</div>`:''}
 <div class="flex gap-3 mt-6">${p?`<button onclick="openA('${p.id}')" class="flex-1 text-left bg-soft border border-bd rounded-xl p-3 text-xs"><span class="text-mu">← Sebelumnya</span><br><b>${p.t}</b></button>`:'<div class="flex-1"></div>'}${n?`<button onclick="openA('${n.id}')" class="flex-1 text-right bg-soft border border-bd rounded-xl p-3 text-xs"><span class="text-mu">Berikutnya →</span><br><b>${n.t}</b></button>`:'<div class="flex-1"></div>'}</div>`;
 $('det').classList.remove('hidden');$('det').classList.add('flex');$('dbody').scrollTop=0}
function closeA(){$('det').classList.add('hidden');$('det').classList.remove('flex')}
function theme(t){document.documentElement.dataset.theme=t}
let kcat='all';
function rK(){const v=$('kq').value.toLowerCase().trim();
 $('kc').innerHTML=Object.entries(KC).map(([k,n])=>`<button onclick="kcat='${k}';rK()" class="px-4 py-2 rounded-xl text-xs whitespace-nowrap border ${kcat==k?'bg-tx font-bold':'bg-soft border-bd text-mu'}" ${kcat==k?'style="color:var(--bg)"':''}>${n}</button>`).join('');
 const r=K.filter(x=>(kcat=='all'||x[1]==kcat)&&(!v||(x[0]+' '+x[2]).toLowerCase().includes(v))).sort((a,b)=>a[0].localeCompare(b[0],'id'));
 let L='',h='';
 r.forEach(x=>{const l=x[0][0].toUpperCase();if(l!=h){h=l;L+=`<p class="text-xs font-extrabold text-pri mt-4 mb-2">${l}</p>`}
 L+=`<div class="bg-card border border-bd rounded-2xl p-4 mb-2"><div class="flex justify-between gap-2"><p class="text-sm font-bold">${x[0]}</p><span class="text-[10px] text-mu shrink-0">${KC[x[1]]}</span></div><p class="text-xs text-mu mt-1 leading-relaxed">${x[2]}</p>${x[3]?`<button onclick="openA('${x[3]}')" class="text-xs text-pri font-semibold mt-2">Baca panduan →</button>`:''}</div>`});
 $('kl').innerHTML=L||'<p class="text-xs text-mu">Istilah tidak ditemukan.</p>'}

init();go('home');
