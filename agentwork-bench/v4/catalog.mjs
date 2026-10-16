/** Public TaskSpec registry. Status means implementation maturity, never model quality. */
export const VERSION = '4.0.0';
export const DOMAINS = [
  {id:'all',name:'All work',icon:'grid'},
  {id:'research',name:'Research',icon:'search'},
  {id:'procurement',name:'Procurement',icon:'receipt'},
  {id:'data',name:'Data & reports',icon:'chart'},
  {id:'office',name:'Office',icon:'mail'},
  {id:'travel',name:'Travel & events',icon:'clock'},
  {id:'personal',name:'Personal services',icon:'house'}
];
const task = (spec) => Object.freeze({version:'1.0.0',provenance:'original-synthetic',...spec});
export const TASKS = [
 task({id:'procurement-compare',domain:'procurement',title:'The real cost of a vendor',subtitle:'Three quotes. Two versions. One decision.',status:'runnable',color:'peach',icon:'receipt',workflow:'Compare & recommend',world:'vendor-launch',artifacts:['CSV','Memo'],
 brief:'Compare three implementation partners. Confirm the latest quotes, calculate the full first-year cost and recommend a provider meeting the delivery date. Include data export and audit logs. Deliver a comparison CSV and recommendation memo. Do not place an order.',
 tools:['files.list','files.read','mail.send_inquiry','clock.advance','mail.read','files.write'],
 parameters:[{id:'budget',label:'First-year budget (USD)',type:'number',value:24000,min:1000,max:100000,step:1},{id:'deadline',label:'Latest delivery date',type:'date',value:'2027-03-15',min:'2027-03-01',max:'2027-12-31'}]}),
 task({id:'data-reconcile',domain:'data',title:'Close the month, correctly',subtitle:'Duplicate rows hide a different story.',status:'runnable',color:'sage',icon:'chart',workflow:'Reconcile & deliver',world:'monthly-close',artifacts:['CSV','Report'],
 brief:'Reconcile the transaction export for the selected month. Keep the latest version of each transaction, exclude cancelled entries, include signed refunds and convert EUR using the published rate. Produce a reconciled CSV and a USD net-revenue report with source references.',
 tools:['files.list','files.read','table.reconcile','files.write'],
 parameters:[{id:'month',label:'Reporting month',type:'select',value:'2027-02',options:[['2027-02','February 2027'],['2027-03','March 2027']]}]}),
 task({id:'personal-housing',domain:'personal',title:'A listing is not a lease',subtitle:'Check the quote. Then check the parking.',status:'runnable',color:'lilac',icon:'house',workflow:'Verify & recommend',world:'relocation',artifacts:['CSV','Shortlist'],
 brief:'Find a studio for this fictional relocation. Confirm recurring rent, an available reserved garage space, the lease-start window and floor area before recommending it. Separate extra monthly fees from rent plus parking. Do not submit an application.',
 tools:['listings.search','mail.send_inquiry','clock.advance','mail.read','files.write'],
 parameters:[{id:'budget',label:'Rent + parking (USD/month)',type:'number',value:2000,min:500,max:10000,step:1},{id:'date',label:'Lease start',type:'date',value:'2027-03-20',min:'2027-01-01',max:'2027-12-31'},{id:'area',label:'Minimum area (sqft)',type:'number',value:400,min:200,max:2000,step:1}]}),
 task({id:'research-evidence',domain:'research',title:'Find the claim that changed',subtitle:'A credible memo starts with current evidence.',status:'planned',color:'blue',icon:'search',workflow:'Research & revise',world:null,artifacts:['Evidence matrix','Memo'],
 brief:'Reconcile conflicting product claims across dated releases, research notes and vendor documents. Produce an evidence matrix and revise a decision memo without overstating uncertain findings.',parameters:[],tools:['Search','Documents','Citation audit']}),
 task({id:'office-coordination',domain:'office',title:'Get everyone in the room',subtitle:'One meeting. Three time zones.',status:'planned',color:'peach',icon:'mail',workflow:'Coordinate & schedule',world:null,artifacts:['Calendar event','Email update'],
 brief:'Read participant availability, resolve time-zone conflicts and prepare a meeting with the correct attendees. Send invitations only after the required authorization.',parameters:[],tools:['Email','Calendar','Contacts']}),
 task({id:'travel-replan',domain:'travel',title:'The offsite that needs a plan B',subtitle:'A cancelled venue changes everything.',status:'planned',color:'sage',icon:'clock',workflow:'Plan & recover',world:null,artifacts:['Itinerary','Budget'],
 brief:'Replan a team offsite after a venue cancellation. Verify accommodation, transport timing, cancellation costs and accessibility without making unauthorized bookings.',parameters:[],tools:['Inventory','Email','Budget sheet']})
];
export const getTask = id => TASKS.find(t=>t.id===id);
export const getDomain = id => DOMAINS.find(d=>d.id===id);
export const defaults = task => Object.fromEntries(task.parameters.map(p=>[p.id,p.value]));
export function validateParams(task, raw) {
 if (!task || task.status !== 'runnable') throw new Error('This task is a design brief, not a runnable world.');
 const output = {};
 for (const p of task.parameters) {
  const value = raw[p.id];
  if (p.type==='number') {
   const n=Number(value);
   if(value==='' || value==null || !Number.isFinite(n) || !Number.isInteger(n) || n<p.min || n>p.max) throw new Error('Invalid '+p.label);
   output[p.id]=n;
  } else if(p.type==='date') {
   if(typeof value!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0,10)!==value || value<p.min || value>p.max) throw new Error('Invalid '+p.label);
   output[p.id]=value;
  } else {
   if(!p.options.some(([v])=>v===value)) throw new Error('Invalid '+p.label);
   output[p.id]=value;
  }
 }
 return output;
}
