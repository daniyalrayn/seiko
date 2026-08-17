const grid=document.getElementById('watchGrid');
const emailLink=document.getElementById('emailLink');
const cfg=window.SITE_CONFIG||{};
emailLink.href=`mailto:${cfg.contactEmail||''}?subject=Watch%20enquiry`;
document.getElementById('year').textContent=new Date().getFullYear();

function money(v){return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(v)}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function imagePaths(w){
 const base=w.image.replace(/\.jpg$/i,'');
 return [`${base}.jpg`,`${base}-2.jpg`,`${base}-3.jpg`];
}
function photo(src,label,large=false){
 const path=esc(src);
 return `<div class="photo-frame ${large?'large':''}"><img src="${path}" alt="${esc(label)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="placeholder-fallback"><div class="camera">＋</div><span>Photo placeholder</span><small>${path}</small></div></div>`;
}
function card(w){const imgs=imagePaths(w);return `<article class="watch-card ${w.brand==='Seiko'||w.brand==='Grand Seiko'?'seiko-card':''}" data-id="${esc(w.id)}" tabindex="0" aria-label="View ${esc(w.name)}"><div class="card-media">${photo(imgs[0],w.brand+' '+w.name)}</div><div class="card-body"><div class="brand-line">${esc(w.brand)} · ${esc(w.type)}</div><div class="card-title">${esc(w.name)}</div><div class="card-ref">Reference ${esc(w.display)}</div><div class="price-line"><span class="price">${money(w.price)}</span><span class="condition">${esc(w.condition)}</span></div><div class="view-piece">View all 3 photographs <span>→</span></div></div></article>`}
grid.innerHTML=window.WATCHES.map(card).join('');

document.querySelectorAll('.watch-card').forEach(c=>{c.addEventListener('click',()=>openWatch(c.dataset.id));c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openWatch(c.dataset.id)}})});

function openWatch(id){
 const w=window.WATCHES.find(x=>x.id===id); if(!w)return;
 const old=document.getElementById('watchModal'); if(old)old.remove();
 const imgs=imagePaths(w);
 const modal=document.createElement('div'); modal.id='watchModal'; modal.className='modal';
 modal.innerHTML=`<div class="modal-backdrop" data-close></div><div class="modal-panel"><button class="modal-close" data-close aria-label="Close">×</button><div class="modal-gallery"><div class="gallery-main">${photo(imgs[0],w.brand+' '+w.name+' main photograph',true)}</div><div class="gallery-thumbs">${imgs.map((src,i)=>`<button class="gallery-thumb ${i===0?'active':''}" data-photo="${i}" aria-label="View photograph ${i+1}">${photo(src,w.name+' photograph '+(i+1))}</button>`).join('')}</div><p class="gallery-note">3 photographs · Front / detail / box or case</p></div><div class="modal-content"><div class="seiko-mini">${w.brand==='Grand Seiko'?'GRAND SEIKO':w.brand==='Seiko'?'SEIKO':'G-SHOCK'}</div><p class="eyebrow">${esc(w.brand)} · ${esc(w.type)}</p><h2>${esc(w.name)}</h2><p class="modal-description">${esc(w.description)}</p><div class="price-box"><div><span class="label">PRIVATE SALE ASKING PRICE</span><strong>${money(w.price)}</strong></div><span class="market">Indicative UK market range<br><b>${esc(w.market)}</b></span></div><div class="condition-highlight"><b>${esc(w.condition)}</b><span>Private collection · Availability subject to prior sale</span></div><div class="spec-grid">${w.specs.map(s=>`<div><span>${esc(s[0])}</span><b>${esc(s[1])}</b></div>`).join('')}</div><div class="modal-actions"><a class="button dark" href="mailto:${cfg.contactEmail||''}?subject=Enquiry%20about%20${encodeURIComponent(w.display)}&body=Hello,%0D%0A%0D%0AI am interested in the ${encodeURIComponent(w.display)}. Please let me know if it is still available.%0D%0A%0D%0AThanks">Enquire to buy</a><a class="button outline" href="#collection" data-close>Back to collection</a></div><p class="fine">This is a private-sale catalogue. Price is an indicative asking price and not a formal valuation. Exact condition, box, papers, warranty, accessories and provenance will be confirmed directly with the owner.</p></div></div>`;
 document.body.appendChild(modal); document.body.classList.add('modal-open');
 const main=modal.querySelector('.gallery-main');
 modal.querySelectorAll('.gallery-thumb').forEach((btn,i)=>btn.addEventListener('click',()=>{main.innerHTML=photo(imgs[i],w.name+' photograph '+(i+1),true);modal.querySelectorAll('.gallery-thumb').forEach(x=>x.classList.remove('active'));btn.classList.add('active')}));
 modal.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeModal));
 window.addEventListener('keydown',escClose,{once:true});
}
function closeModal(){document.getElementById('watchModal')?.remove();document.body.classList.remove('modal-open')}
function escClose(e){if(e.key==='Escape')closeModal()}
