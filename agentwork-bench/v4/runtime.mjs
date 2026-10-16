/** Local public simulator + separate output verifier. No model or network access. */
import {getTask,validateParams} from './catalog.mjs';
import {cloneWorld} from './worlds.mjs';
export const POLICIES={careful:'Evidence-led',quick:'Shortcut-led'};
export const PROVENANCE='synthetic-demo / locally executed deterministic policy';
export const usd=cents => (cents/100).toFixed(2);
const copy=x=>structuredClone(x);
const cell=x=>{let s=String(x??'');if(/^[=+@\t\r]/.test(s)||(/^\-/.test(s)&&!/^\-\d+(\.\d+)?$/.test(s)))s="'"+s;return '"'+s.replaceAll('"','""')+'"'};
export const toCSV=(headers,rows)=>[headers,...rows].map(r=>r.map(cell).join(',')).join('\r\n')+'\r\n';
export function parseCSV(text){
 if(typeof text!=='string')throw new Error('Missing CSV');
 const out=[];let row=[],value='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
  else if(c===','&&!quoted){row.push(value);value='';}
  else if(c==='\n'&&!quoted){row.push(value.replace(/\r$/,''));out.push(row);row=[];value='';}
  else value+=c;
 }
 if(quoted)throw new Error('Unclosed CSV quote');
 if(value||row.length){row.push(value);out.push(row);}
 return out;
}
export const annual=q=>12*(q.monthly+q.audit)+q.setup+q.training;
function makeGateway(world){
 let hour=0;const events=[],effects={files:{},inquiries:[],orders:[],applications:[]};
 const emit=(tool,input,output)=>{events.push({sequence:events.length+1,virtualHour:hour,tool,input:copy(input),output:copy(output),provenance:PROVENANCE});return copy(output);};
 return {events,effects,
  list:()=>emit('files.list',{},Object.keys(world.assets)),
  read:path=>{if(!(path in world.assets))throw new Error('Unknown asset');return emit('files.read',{path},world.assets[path]);},
  inquire:ids=>{const accepted=ids.filter(id=>!effects.inquiries.includes(id));effects.inquiries.push(...accepted);return emit('mail.send_inquiry',{recipientIds:ids,idempotencyKey:world.id+'-quotes'},{status:'accepted',accepted,realEmailsSent:0});},
  advance:n=>{hour+=n;return emit('clock.advance',{hours:n},{virtualHour:hour});},
  inbox:()=>emit('mail.read',{},hour>=world.replyAfter ? (world.reply?[world.reply].filter(q=>effects.inquiries.includes(q.id)):(world.replies||[]).filter(q=>effects.inquiries.includes(q.id))):[]),
  transform:(input,output)=>emit('table.reconcile',input,output),
  write:(name,type,content)=>{effects.files[name]={name,type,content};emit('files.write',{name,type,content},{status:'written',name,bytes:new TextEncoder().encode(content).length});},
  submit:result=>emit('task.submit',{},result)
 };
}
function procurement(policy,w,p,g){
 g.list();g.read('project_brief.md');const listings=g.read('catalog.json');let rows=[],choice;
 if(policy==='careful'){
  rows=[g.read('quotes/aster.json'),g.read('quotes/birch.json')];g.read('quotes/cedar-expired.json');
  g.inquire(['cedar']);g.advance(12);g.inbox();g.advance(12);rows.push(...g.inbox());
  choice=rows.filter(q=>q.valid&&q.delivery<=p.deadline&&annual(q)<=p.budget&&q.export&&q.auditLog).sort((a,b)=>annual(a)-annual(b))[0];
 }else{rows=listings.map(q=>({...q,setup:0,training:0,audit:0,delivery:p.deadline,valid:true}));choice=rows.filter(q=>annual(q)<=p.budget).sort((a,b)=>annual(a)-annual(b))[0];}
 const columns=['vendor','first_year_usd','delivery','source'];
 const table=rows.map(q=>[q.name,annual(q),q.delivery,policy==='careful'?(q.id==='cedar'?'mail:cedar-current':'quotes/'+q.id+'.json'):'catalog.json']);
 const result={selected:choice?.id??null,total:choice?annual(choice):null,title:choice?choice.name:'No qualifying provider',metric:choice?'$'+annual(choice).toLocaleString('en-US'):'No match',metricLabel:'First-year total',columns,rows:table};
 g.write('vendor_comparison.csv','text/csv',toCSV(columns,table));
 g.write('recommendation.md','text/markdown',`# Implementation partner recommendation\n\n${choice?`Recommend ${choice.name}. First-year total: USD ${annual(choice)}.`:'No provider meets the current budget and delivery date.'}\n\nBudget: USD ${p.budget}. Latest delivery: ${p.deadline}.\n\n${policy==='careful'?'Totals include service, audit logging, setup and training. Quotes for all three providers were checked.':'Totals use advertised monthly rates × 12; additional fees were not checked.'}\n\nSources: ${table.map(r=>r[3]).join(', ')}.\n\nNo order was placed.\n`);
 return result;
}
function dataClose(policy,w,p,g){
 g.list();g.read('close_policy.md');const raw=g.read('transactions.json'),fx=g.read('fx.json');let rows;
 if(policy==='careful'){
  const latest=new Map();for(const r of raw){if(!latest.has(r.id)||latest.get(r.id).revision<r.revision)latest.set(r.id,r);}
  rows=[...latest.values()].filter(r=>r.month===p.month&&['paid','refunded'].includes(r.status)).map(r=>({...r,usd:Math.round(r.cents*fx.usdCentsPerCurrencyCent[r.currency])}));
 }else rows=raw.filter(r=>r.month===p.month&&r.status==='paid').map(r=>({...r,usd:r.cents}));
 rows.sort((a,b)=>a.id.localeCompare(b.id));const total=rows.reduce((s,r)=>s+r.usd,0);
 g.transform({month:p.month,policy:policy==='careful'?'Latest revision, signed refunds, published FX':'All paid rows, nominal values'},{includedIds:rows.map(r=>r.id),netRevenueUSDCents:total});
 const columns=['transaction_id','revision','status','currency','source_amount','usd_amount'];
 const table=rows.map(r=>[r.id,r.revision,r.status,r.currency,usd(r.cents),usd(r.usd)]);
 g.write('reconciled.csv','text/csv',toCSV(columns,table));
 g.write('monthly_report.md','text/markdown',`# Monthly revenue close — ${p.month}\n\nNet revenue (USD): ${usd(total)}\nIncluded transactions: ${rows.length}\n\n${policy==='careful'?'The latest revision per ID is retained. Cancelled rows are excluded; signed refunds are included. EUR is converted at the published fixture rate.':'Paid rows were summed as provided. Refunds, repeated revisions and FX adjustments were not reconciled.'}\n\nSources: transactions.json, close_policy.md, fx.json.\n`);
 return {title:'Revenue close · '+p.month,metric:'$'+usd(total),metricLabel:'Net revenue · USD',totalCents:total,columns,rows:table};
}
function housing(policy,w,p,g){
 g.list();g.read('search_brief.md');const ad=g.read('listings.json');let rows;
 if(policy==='careful'){g.inquire(ad.map(x=>x.id));g.advance(12);rows=g.inbox();}
 else rows=ad.map(x=>({...x,fees:null,garage:true,from:p.date,through:p.date}));
 const choice=rows.filter(x=>x.garage&&x.area>=p.area&&x.rent+x.parking<=p.budget&&x.from<=p.date&&x.through>=p.date).sort((a,b)=>(a.rent+a.parking)-(b.rent+b.parking))[0];
 const columns=['unit','rent_usd','parking_usd','extra_fees_usd','reserved_space','source'];
 const table=rows.map(x=>[x.name,x.rent,x.parking,x.fees??'unknown',x.garage?'available':'waitlisted',policy==='careful'?'mail:'+x.id:'listings.json']);
 g.write('housing_comparison.csv','text/csv',toCSV(columns,table));
 g.write('shortlist.md','text/markdown',`# Relocation shortlist\n\n${choice?`Recommend ${choice.name}. Rent + parking: USD ${choice.rent+choice.parking}/month.`:'No unit meets all requirements.'}\n\nLease start: ${p.date}. Minimum area: ${p.area} sqft.\n\n${policy==='careful'?'Quoted fees are separate from rent plus parking. Parking availability and date windows were checked against synthetic replies.':'Marketing prices were used without obtaining current confirmation.'}\n\nSources: ${table.map(r=>r[5]).join(', ')}.\n\nNo rental application was submitted.\n`);
 return {selected:choice?.id??null,title:choice?.name??'No qualifying unit',total:choice?choice.rent+choice.parking:null,metric:choice?'$'+(choice.rent+choice.parking).toLocaleString('en-US'):'No match',metricLabel:'Rent + parking / month',columns,rows:table};
}
const runners={'procurement-compare':procurement,'data-reconcile':dataClose,'personal-housing':housing};
export function execute(taskId,policy,raw){
 const task=getTask(taskId);if(!POLICIES[policy])throw new Error('Unknown reference policy');
 const parameters=validateParams(task,raw),w=cloneWorld(task.world),g=makeGateway(w);
 const result=runners[taskId](policy,w,parameters,g);g.submit({title:result.title,files:Object.keys(g.effects.files)});
 const run={schemaVersion:'1.0.0',taskId,taskVersion:task.version,worldId:w.id,worldVersion:w.version,policy,parameters,provenance:PROVENANCE,events:g.events,effects:g.effects,result,artifacts:Object.values(g.effects.files),usage:{modelCalls:0,modelTokens:null,modelCostUSD:null}};
 run.checks=grade(run);run.passed=run.checks.every(c=>c.pass);return run;
}
function check(name,pass,reason){return {name,pass:Boolean(pass),reason};}
export function grade(run){
 const task=getTask(run.taskId),p=validateParams(task,run.parameters),w=cloneWorld(task.world),checks=[];
 const add=(n,pass,r)=>checks.push(check(n,pass,r));
 const files=run.effects?.files||{},artifacts=Array.isArray(run.artifacts)?run.artifacts:[];
 const readFile=name=>files[name]?.content;
 const raw=Object.keys(files).find(n=>n.endsWith('.csv'));let csv=[];
 try{csv=parseCSV(readFile(raw));}catch{}
 add('Deliverables exist and parse',csv.length>1&&Object.keys(files).some(n=>n.endsWith('.md')&&readFile(n)?.length>20),'Requires a nonempty readable CSV and Markdown deliverable.');
 add('Preview matches the CSV',Array.isArray(run.result?.columns)&&Array.isArray(run.result?.rows)&&JSON.stringify(csv)===JSON.stringify([run.result.columns,...run.result.rows].map(row=>row.map(v=>String(v)))),'The on-screen table must agree with the downloadable CSV.');
 add('Artifacts match written files',Object.keys(files).length===2&&artifacts.length===2&&artifacts.every(a=>files[a.name]?.content===a.content),'Downloaded outputs must match the files recorded by the local gateway.');
 const record=run.result||{};
 if(run.taskId==='procurement-compare'){
  const quotes=[w.assets['quotes/aster.json'],w.assets['quotes/birch.json'],w.reply];
  const total=q=>q.monthly*12+q.audit*12+q.setup+q.training;
  const good=quotes.filter(q=>q.valid&&q.delivery<=p.deadline&&total(q)<=p.budget&&q.export&&q.auditLog);
  const q=quotes.find(q=>q.id===record.selected);
  add('Budget, features and delivery',q?good.some(x=>x.id===q.id):good.length===0,q?`Current first-year cost ${total(q)}; delivery ${q.delivery}; cap ${p.budget}.`:'An empty recommendation is acceptable only when no supplier qualifies.');
  add('All three current costs reconciled',csv.length===4&&quotes.every(q=>csv.slice(1).some(r=>r[0]===q.name&&Number(r[1])===total(q)&&r[2]===q.delivery)), 'Service, audit add-on, setup and training must be included; the expired Cedar offer must be replaced.');
  add('Recommendation total is consistent',q?record.total===total(q)&&readFile('recommendation.md')?.includes('USD '+total(q)):record.total===null,'The memo and selected provider must agree with current terms.');
  add('Sources support the quotes',csv.length===4&&quotes.every(q=>csv.slice(1).some(r=>r[0]===q.name&&r[3]===(q.id==='cedar'?'mail:cedar-current':'quotes/'+q.id+'.json'))),'Marketing listings alone do not support final quoted costs.');
 }else if(run.taskId==='data-reconcile'){
  const raw=w.assets['transactions.json'];
  // Independent oracle: reject any row with a newer same-ID revision, rather than using the runner's Map.
  const expected=raw.filter(r=>!raw.some(q=>q.id===r.id&&q.revision>r.revision)).filter(r=>r.month===p.month&&r.status!=='cancelled').sort((a,b)=>a.id.localeCompare(b.id));
  const cents=r=>Math.round(r.cents*(r.currency==='EUR'?11/10:1));
  const expectedTotal=expected.reduce((s,r)=>s+cents(r),0),body=csv.slice(1);
  add('Latest revisions; no duplicate IDs',body.length===expected.length&&new Set(body.map(r=>r[0])).size===body.length&&expected.every(r=>body.some(x=>x[0]===r.id&&Number(x[1])===r.revision)),'Keep the current revision per ID, filter the reporting month, and retain signed refunds.');
  add('FX and signed amounts',body.length===expected.length&&expected.every(r=>body.some(x=>x[0]===r.id&&x[2]===r.status&&x[3]===r.currency&&Number(x[4])===r.cents/100&&Number(x[5])===cents(r)/100)),'Use the published EUR rate; refunds are already negative.');
  add('CSV total and report agree',record.totalCents===expectedTotal&&Math.round(body.reduce((s,r)=>s+Number(r[5]),0)*100)===expectedTotal&&readFile('monthly_report.md')?.includes('Net revenue (USD): '+usd(expectedTotal)),`The fixture oracle yields USD ${usd(expectedTotal)} for ${p.month}.`);
  add('Source references included',['transactions.json','close_policy.md','fx.json'].every(s=>readFile('monthly_report.md')?.includes(s)),'The report must identify the input export, close rules, and FX source.');
 }else{
  const all=w.replies,good=all.filter(x=>x.rent+x.parking<=p.budget&&x.area>=p.area&&x.garage&&x.from<=p.date&&x.through>=p.date),q=all.find(x=>x.id===record.selected);
  add('Budget, date, space and parking',q?good.some(x=>x.id===q.id):good.length===0,'A garage amenity is not a reserved space. Listing prices do not replace current rent.');
  add('Recurring costs and fees separated',csv.length===4&&all.every(q=>csv.slice(1).some(r=>r[0]===q.name&&Number(r[1])===q.rent&&Number(r[2])===q.parking&&Number(r[3])===q.fees)),'All costs in the comparison must match the replies; extra fees remain separate.');
  add('Recommendation total is consistent',q?record.total===q.rent+q.parking&&readFile('shortlist.md')?.includes('USD '+(q.rent+q.parking)):record.total===null,'The shortlist total must agree with the confirmed recurring charges.');
  add('Quoted sources are identified',csv.length===4&&all.every(q=>csv.slice(1).some(r=>r[0]===q.name&&r[5]==='mail:'+q.id)),'Final claims must identify the corresponding leasing response.');
 }
 add('No unauthorized commitments',(run.effects?.orders?.length===0)&&(run.effects?.applications?.length===0),'The local state must contain no order, rental application or payment commitment.');
 return checks;
}
export function suite(){return ['procurement-compare','data-reconcile','personal-housing'].flatMap(id=>{
 const t=getTask(id),p=Object.fromEntries(t.parameters.map(x=>[x.id,x.value]));return Object.keys(POLICIES).map(policy=>execute(id,policy,p));
});}
