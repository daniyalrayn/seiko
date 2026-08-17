const grid=document.getElementById('watchGrid');
const emailLink=document.getElementById('emailLink');
const cfg=window.SITE_CONFIG||{};
emailLink.href=`mailto:${cfg.contactEmail||''}?subject=Watch%20enquiry`;
document.getElementById('year').textContent=new Date().getFullYear();

function money(v){return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(v)}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function card(w){return `<article class="watch-card" data-id="${esc(w.id)}" tabindex="0" aria-label="View ${esc(w.name)}"><div class="card-media"><div class="placeholder"><div class="camera">＋</div><span>Add watch photo</span><small>${esc(w.image)}</small></div></div><div class="card-body"><div class="brand-line">${esc(w.brand)} · ${esc(w.type)}</div><div class="card-title">${esc(w.name)}</div><div class="card-ref">Reference ${esc(w.display)}</div><div class="price-line"><span class="price">${money(w.price)}</span><span class="condition">${esc(w.condition)}</span></div></div></article>`}
grid.innerHTML=window.WATCHES.map(card).join('');

document.querySelectorAll('.watch-card').forEach(c=>{c.addEventListener('click',()=>openWatch(c.dataset.id));c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openWatch(c.dataset.id)}})});

function openWatch(id){
 const w=window.WATCHES.find(x=>x.id===id); if(!w)return;
 const old=document.getElementById('watchModal'); if(old)old.remove();
 const modal=document.createElement('div'); modal.id='watchModal'; modal.className='modal';
 modal.innerHTML=`<div class="modal-backdrop" data-close></div><div class="modal-panel"><button class="modal-close" data-close aria-label="Close">×</button><div class="modal-image"><div class="placeholder large"><div class="camera">＋</div><span>Add photo for ${esc(w.display)}</span><small>Upload to ${esc(w.image)}</small></div></div><div class="modal-content"><p class="eyebrow">${esc(w.brand)} · ${esc(w.type)}</p><h2>${esc(w.name)}</h2><p class="modal-description">${esc(w.description)}</p><div class="price-box"><div><span class="label">PRIVATE SALE ASKING</span><strong>${money(w.price)}</strong></div><span class="market">Current UK reference range<br><b>${esc(w.market)}</b></span></div><div class="spec-grid">${w.specs.map(s=>`<div><span>${esc(s[0])}</span><b>${esc(s[1])}</b></div>`).join('')}</div><div class="modal-actions"><a class="button dark" href="mailto:${cfg.contactEmail||''}?subject=Enquiry%20about%20${encodeURIComponent(w.display)}">Enquire about this watch</a><a class="button outline" href="${esc(w.image)}" target="_blank" rel="noreferrer">Photo path</a></div><p class="fine">Reference pricing is an indicative private-sale asking price, not a guaranteed valuation. Confirm the exact reference, condition, accessories and provenance before agreeing a purchase.</p></div></div>`;
 document.body.appendChild(modal); document.body.classList.add('modal-open');
 modal.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeModal));
 window.addEventListener('keydown',escClose,{once:true});
}
function closeModal(){document.getElementById('watchModal')?.remove();document.body.classList.remove('modal-open')}
function escClose(e){if(e.key==='Escape')closeModal()}
