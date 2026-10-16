/** Presentation helpers. No policy, grader or result fabrication. */
import {parseCSV} from '../v4/runtime.mjs';
export const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function tableHTML(content){
 const rows=parseCSV(content),headers=rows.shift()||[];
 return `<div class="sheet-scroll"><table class="sheet"><thead><tr><th class="row-number">#</th>${headers.map(h=>`<th scope="col">${esc(h.replaceAll('_',' '))}</th>`).join('')}</tr></thead><tbody>${rows.map((row,i)=>`<tr><td class="row-number">${i+1}</td>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
/** Intentionally small safe renderer: no raw HTML, images, links or executable markup. */
export function markdownHTML(text){
 return String(text).split(/\n\s*\n/).map(block=>{
  if(/^# /.test(block))return `<h2>${esc(block.slice(2))}</h2>`;
  if(/^## /.test(block))return `<h3>${esc(block.slice(3))}</h3>`;
  return `<p>${esc(block).replaceAll('\n','<br>')}</p>`;
 }).join('');
}
export function renderArtifact(a,source=false){
 if(!a)return '<div class="empty"><h3>No artifact supplied.</h3></div>';
 if(source)return `<pre class="raw-source">${esc(a.content)}</pre>`;
 if(a.type==='text/csv')return tableHTML(a.content);
 if(a.type==='text/markdown')return `<div class="paper-document">${markdownHTML(a.content)}</div>`;
 return `<pre class="raw-source">${esc(a.content)}</pre>`;
}
/** Display-only blind mode; full fixture source is public and cannot provide secure blinding. */
export function publicRecord(record){
 const copy=structuredClone(record);
 if(copy.kind==='comparison'&&!copy.vote){
  for(const run of copy.agents||[]){delete run.policy;delete run.checks;delete run.passed;}
 }
 return copy;
}
export function artifactAt(run,kind){return run.artifacts.find(a=>kind==='table'?a.type==='text/csv':a.type==='text/markdown')||run.artifacts[0];}
export function filterTasks(tasks,{domain='all',query='',status='all'}={}){
 const q=query.trim().toLowerCase();
 return tasks.filter(t=>(domain==='all'||t.domain===domain)&&(status==='all'||t.status===status)&&[t.title,t.subtitle,t.brief,t.domain,t.workflow,...t.artifacts].join(' ').toLowerCase().includes(q));
}
export function validRecord(r,getTask,version){
 if(!r||r.version!==version||typeof r.id!=='string'||typeof r.brief!=='string')return false;
 if(r.kind==='draft')return true;
 return r.kind==='comparison'&&!!getTask(r.taskId)&&Array.isArray(r.agents)&&r.agents.length===2&&r.agents.every(a=>Array.isArray(a.artifacts)&&Array.isArray(a.events)&&a.result&&Array.isArray(a.checks))&&[null,'a','b','tie','neither'].includes(r.vote);
}
