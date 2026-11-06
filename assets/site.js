'use strict';
const dialog = document.querySelector('#site-search');
const input = document.querySelector('#search-input');
const results = document.querySelector('#search-results');
const locale = document.body.dataset.locale === 'tr' ? 'tr' : 'en';
let entries;
const normalize = text => text.toLocaleLowerCase(locale).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
function search() {
 if (!entries) return;
 const query = normalize(input.value.trim());
 const matches = entries.filter(e => normalize(e.title+' '+e.description).includes(query));
 results.replaceChildren();
 for (const entry of matches) {
  const a=document.createElement('a'), title=document.createElement('strong'), description=document.createElement('p');
  a.href=entry.url; title.textContent=entry.title; description.textContent=entry.description;
  a.append(title,description); results.append(a);
 }
 if (!matches.length) results.textContent=results.dataset.empty;
}
document.querySelector('#search-open').addEventListener('click',async()=>{
 dialog.showModal(); input.focus();
 if(!entries) {
  results.textContent=locale==='tr'?'Yükleniyor…':'Loading…';
  try { const response=await fetch(`/assets/search-${locale}.json`); if(!response.ok)throw Error('Search unavailable'); entries=await response.json(); }
  catch {results.textContent=locale==='tr'?'Arama yüklenemedi. Lütfen tekrar deneyin.':'Search could not load. Please try again.';return;}
 }
 search();
});
document.querySelector('#search-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>document.querySelector('#search-open').focus());
input.addEventListener('input',search);
document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.mobile-navigation[open]').forEach(d=>d.open=false);});
