/* AgentWork v3. Public synthetic fixtures and deterministic reference policies.
   No model API, real email, backend or hidden evaluation data is used here. */
'use strict';
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const dollars = n => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const SOURCE = 'Synthetic fixture / not a real rental listing';
const DEFAULTS = {budget:2000,date:'2026-11-20',area:400,parking:true};
function unit(id, name, ad, rent, parking, sqft, options={}) {
  return {id,name,ad,rent,parking,sqft,advertisedParking:parking,fees:75,parkingAvailable:true,mfte:false,from:'2026-11-15',through:'2026-11-25',replyAfter:12,side:'Courtyard-facing',...options};
}
const SCENARIOS = [
 {id:'apartment',number:'001',title:'The apartment hunt',short:'Seattle apartment search',group:'verification',art:'buildings',color:'sage',type:'FULL WORKFLOW',desc:'A good-looking listing is not a verified place to live.',tags:'Search · Email · Decide',brief:'Find a quiet Seattle studio for November 20, with a reserved parking space, for no more than $2,000 a month.',eligible:true,units:[
 unit('cedar-304','Cedar House · #304',1560,1560,180,514),
 unit('harbor-112','Harbor Studio · #112',1390,1685,325,470,{advertisedParking:145,mfte:true,fees:90}),
 unit('union-508','Union Loft · #508',1790,1790,255,608)
 ]},
 {id:'price',number:'002',title:'The hidden parking fee',short:'Conflicting prices',group:'verification',art:'receipt',color:'peach',type:'PRICE VERIFICATION',desc:'Separate a promotional price from what you actually pay.',tags:'Compare sources · Check costs',brief:'Compare the real recurring rent and reserved parking costs. Do not use temporary rent concessions to satisfy my $2,000 monthly cap.',eligible:true,units:[
 unit('aster-207','Aster Court · #207',1390,1890,235,486,{advertisedParking:175,fees:95}),
 unit('birch-402','Birch Apartments · #402',1650,1650,170,525),
 unit('park-108','Park Residence · #108',1750,1750,210,448)
 ]},
 {id:'delay',number:'003',title:'The reply that came late',short:'Delayed leasing replies',group:'recovery',art:'mail',color:'lilac',type:'ASYNCHRONOUS WORK',desc:'A missing reply is not permission to invent an answer.',tags:'Wait · Recover · Verify',brief:'Confirm the rental price and reserved parking before recommending a unit. Handle a delivery error and delayed replies without duplicate outreach.',eligible:true,deliveryError:true,units:[
 unit('willow-204','Willow House · #204',1450,1730,310,508,{advertisedParking:150,replyAfter:36}),
 unit('grove-318','Grove Apartments · #318',1630,1630,160,537,{replyAfter:36}),
 unit('elm-509','Elm Studios · #509',1840,1840,240,456,{replyAfter:36})
 ]},
 {id:'parking',number:'004',title:'A garage. But no space.',short:'Parking availability',group:'recovery',art:'parking',color:'blue',type:'CONSTRAINT CHECK',desc:'The building has a garage. Does it have a spot for you?',tags:'Read replies · Check inventory',brief:'I need an available reserved parking spot at move-in. A waitlist or a garage mentioned in the amenities is not enough.',eligible:true,units:[
 unit('oak-316','Oak Corner · #316',1500,1500,200,450,{parkingAvailable:false,side:'Garage entrance'}),
 unit('stone-422','Stone House · #422',1650,1650,180,518),
 unit('ivy-104','Ivy Place · #104',1700,1700,220,470,{parkingAvailable:false})
 ]},
 {id:'eligibility',number:'005',title:'The qualification gap',short:'MFTE eligibility',group:'verification',art:'eligibility',color:'sage',type:'ELIGIBILITY CHECK',desc:'A subsidized rate means nothing if the applicant cannot qualify.',tags:'Check requirements · Decide',brief:'Find a unit for this fictional applicant, who does not qualify for MFTE in this scenario. Verify eligibility instead of selecting the cheapest subsidized rate.',eligible:false,units:[
 unit('fern-210','Fern House · #210',1395,1395,175,507,{mfte:true}),
 unit('alder-302','Alder Apartments · #302',1745,1745,180,530),
 unit('bloom-113','Bloom Court · #113',1510,1510,190,460,{mfte:true})
 ]}
];
const policyNames = {'evidence':'Evidence-led','listing':'Listing-led'};
const policyDescriptions = {'evidence':'Waits for official replies and checks all requirements.','listing':'Selects from advertised prices without confirming the details.'};
function feasible(u, r, scenario) {
 return u.rent+u.parking<=r.budget && (!r.parking||u.parkingAvailable) && u.sqft>=r.area && u.from<=r.date && r.date<=u.through && (!u.mfte||scenario.eligible);
}
function verify(run, scenario, requirements) {
 if (!run.selected) return [
  {name:'No feasible units',pass:!scenario.units.some(u=>feasible(u,requirements,scenario)),reason:'Check whether any fixture unit meets all five housing constraints.'},
  {name:'Complete evidence',pass:run.replies.length===scenario.units.length,reason:`${run.replies.length} of ${scenario.units.length} official replies examined.`}
 ];
 const u=scenario.units.find(x=>x.id===run.selected.id), r=requirements;
 return [
  {name:'Recurring budget',pass:u.rent+u.parking<=r.budget,reason:`${dollars(u.rent)} rent + ${dollars(u.parking)} parking = ${dollars(u.rent+u.parking)}; cap ${dollars(r.budget)}. Fees are separate.`},
  {name:'Reserved parking',pass:!r.parking||u.parkingAvailable,reason:r.parking?(u.parkingAvailable?'A reserved space is available.':'Parking is waitlisted, not available.'):'Reserved parking is not required for this run.'},
  {name:'Floor area',pass:u.sqft>=r.area,reason:`${u.sqft} sqft; minimum ${r.area} sqft.`},
  {name:'Lease-start window',pass:u.from<=r.date&&r.date<=u.through,reason:`${r.date} must fall between ${u.from} and ${u.through}.`},
  {name:'Fixture eligibility',pass:!u.mfte||scenario.eligible,reason:u.mfte?(scenario.eligible?'Fictional applicant qualifies for this MFTE fixture.':'Fictional applicant does not qualify for MFTE.'):'This is a market-rate unit; no MFTE qualification required.'},
  {name:'Evidence-backed quote',pass:run.replies.includes(u.id)&&run.selected.rent===u.rent&&run.selected.parking===u.parking,reason:run.replies.includes(u.id)?'Price checked against the official synthetic reply.':'No official reply was read; a listing is not a confirmed quote.'}
 ];
}
function execute(policy, scenario, requirements) {
 const events=[],replies=[]; let clock=0;
 const add=(tool,label,input,output)=>events.push({step:events.length+1,virtualHour:clock,tool,label,input,output});
 add('read_requirements','Read the task constraints',{}, {...requirements,applicantMFTEEligible:scenario.eligible,source:SOURCE});
 const listings=scenario.units.map(u=>({id:u.id,name:u.name,advertisedRent:u.ad,advertisedParking:u.advertisedParking,sqft:u.sqft,garageAmenity:true}));
 add('search_listings','Compare the public listings',{location:'Synthetic Seattle',minSqft:requirements.area},{listings,source:'Fictional marketing website'});
 let selected=null;
 if(policy==='evidence') {
  const request={unitIds:scenario.units.map(u=>u.id),questions:['base rent','parking price and availability','lease dates','qualification'],idempotencyKey:scenario.id+'-batch-1'};
  if(scenario.deliveryError) add('send_inquiry','Handle a delivery error',request,{status:'temporary_failure',accepted:false,retryable:true,source:'Local mail simulator'});
  add('send_inquiry',scenario.deliveryError?'Retry with the same request ID':'Ask for official quotes',request,{status:'accepted',messageIds:scenario.units.map(u=>'mail-'+u.id),realEmailsSent:0});
  clock=12;add('advance_time','Wait for leasing replies',{hours:12},{virtualHour:clock});
  const read=()=>{
   const inbox=scenario.units.filter(u=>u.replyAfter<=clock).map(u=>({...u,source:'Official synthetic leasing reply',messageId:'reply-'+u.id}));
   inbox.forEach(u=>{if(!replies.includes(u.id))replies.push(u.id)});
   add('read_inbox',inbox.length?'Read the confirmed details':'Check for delayed replies',{}, {replies:inbox,pending:scenario.units.length-inbox.length});
  };
  read();
  if(replies.length<scenario.units.length){clock=48;add('advance_time','Wait without duplicate outreach',{hours:36},{virtualHour:clock});read()}
  const choices=scenario.units.filter(u=>replies.includes(u.id)&&feasible(u,requirements,scenario)).sort((a,b)=>(a.rent+a.parking)-(b.rent+b.parking)||b.sqft-a.sqft);
  if(choices.length){const u=choices[0];selected={id:u.id,name:u.name,rent:u.rent,parking:u.parking,sqft:u.sqft,fees:u.fees,source:'Leasing reply',note:`${u.side}. ${u.mfte?'MFTE eligibility checked.':'Market-rate home.'}`}}
 } else {
  const choices=listings.filter(u=>u.sqft>=requirements.area&&u.advertisedRent+u.advertisedParking<=requirements.budget).sort((a,b)=>(a.advertisedRent+a.advertisedParking)-(b.advertisedRent+b.advertisedParking));
  if(choices.length){const u=choices[0];add('open_listing','Open the lowest advertised offer',{unitId:u.id},{...u,source:'Fictional marketing website'});selected={id:u.id,name:u.name,rent:u.advertisedRent,parking:u.advertisedParking,sqft:u.sqft,fees:null,source:'Marketing listing',note:'Selected for its advertised price and listed garage amenity.'}}
 }
 add('submit_recommendation',selected?'Recommend a home':'Report no qualifying recommendation',{}, {selected,claim:selected?'This unit meets the brief.':'No qualifying unit found.'});
 const run={policy,selected,events,replies,virtualHours:clock};run.checks=verify(run,scenario,requirements);run.passed=run.checks.every(c=>c.pass);return run;
}
// Illustrations are original decorative SVGs. They are not source evidence.
let illustrationId=0;
function illustration(type){
 const s='aw-shadow-'+(++illustrationId),head=`<svg class="illustration" viewBox="0 0 260 145" aria-hidden="true"><defs><filter id="${s}" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#68593e" flood-opacity=".10"/></filter></defs>`,tail='</svg>';
 if(type==='buildings')return head+`<ellipse cx="135" cy="126" rx="75" ry="9" fill="#d9e1d4" opacity=".55"/><g filter="url(#${s})"><path d="m97 34 39-16 46 22-40 17Z" fill="#fffef7"/><path d="m97 34 45 23v69l-45-22Z" fill="#deddd0"/><path d="m142 57 40-17v69l-40 17Z" fill="#e8e8dd"/><path d="m97 34 39-16v7l-32 14Z" fill="#f7f5ed"/><g fill="#a6b4a1"><path d="m151 63 8-4v12l-8 4Zm15-7 8-4v12l-8 4Zm-15 25 8-4v12l-8 4Zm15-7 8-4v12l-8 4Z"/></g><path d="m109 53 9 4v13l-9-4Zm16 8 9 4v13l-9-4Zm-16 14 9 4v13l-9-4Zm16 8 9 4v13l-9-4Z" fill="#c1bb9f"/><path d="m63 81 29-13 34 16-29 13Z" fill="#fffaf0"/><path d="m63 81 34 16v32l-34-16Z" fill="#ccb894"/><path d="m97 97 29-13v31l-29 14Z" fill="#e6d7bb"/><path d="m73 96 7 3v11l-7-3Zm12 6 7 3v11l-7-3Z" fill="#f7f2e4"/><path d="m104 103 8-4v12l-8 4Z" fill="#a29c7d"/></g><path d="M185 109V84" stroke="#a0ac8c" stroke-width="2"/><circle cx="185" cy="80" r="12" fill="#c5d1b5"/><path d="M55 111V93" stroke="#a0ac8c" stroke-width="2"/><circle cx="55" cy="89" r="8" fill="#d3dcc8"/><circle cx="199" cy="44" r="3" fill="#c5d0ba"/>`+tail;
 if(type==='receipt')return head+`<g transform="rotate(-8 113 73)" filter="url(#${s})"><path d="M71 20h90v109l-8-4-7 4-8-4-7 4-8-4-7 4-8-4-7 4-8-4-7 4-8-4-7 4V20Z" fill="#fffdf6" stroke="#e6d5c2"/><path d="M87 37h41m-41 8h56" stroke="#dbd0bd" stroke-width="2"/><text x="87" y="65" fill="#be9880" font-size="8" font-family="sans-serif">ADVERTISED RENT</text><text x="87" y="84" fill="#796b53" font-size="20" font-family="serif">$1,390</text><path d="m85 78 62-6" stroke="#da8a66" stroke-width="1.5"/><path d="M87 96h57m-57 8h32" stroke="#e1d8c6" stroke-width="2"/></g><g transform="rotate(5 182 98)" filter="url(#${s})"><rect x="137" y="79" width="95" height="39" rx="7" fill="#e7bea2"/><circle cx="152" cy="94" r="3" fill="#b87852"/><text x="161" y="96" fill="#825739" font-size="7" font-family="sans-serif">PARKING IS EXTRA</text><text x="149" y="110" fill="#87583a" font-size="10" font-family="sans-serif">Check the full quote</text></g>`+tail;
 if(type==='mail')return head+`<g transform="rotate(-6 125 54)" filter="url(#${s})"><rect x="37" y="29" width="165" height="60" rx="9" fill="#fdfcff" stroke="#dbd5e9"/><rect x="49" y="42" width="24" height="22" rx="5" fill="#eee9f5"/><path d="M54 48h14v10h-14Zm0 0 7 6 7-6" fill="none" stroke="#afa1c6" stroke-width="1"/><path d="M83 46h63m-63 9h96m-96 9h75" stroke="#ddd5e6" stroke-width="2"/></g><g transform="rotate(4 161 97)" filter="url(#${s})"><rect x="69" y="76" width="167" height="48" rx="8" fill="#fffdfc" stroke="#e2dbed"/><circle cx="88" cy="98" r="9" fill="#e5ebda"/><path d="m84 98 3 3 5-6" stroke="#8a9c70" fill="none" stroke-width="1.5"/><text x="104" y="96" fill="#8e829e" font-size="8" font-family="sans-serif">LEASING OFFICE</text><text x="104" y="110" fill="#b0a6b7" font-size="8" font-family="sans-serif">Your confirmed quote is ready.</text></g><rect x="176" y="19" width="45" height="21" rx="10" fill="#ded6ef"/><text x="187" y="33" fill="#9c8bb4" font-size="9" font-family="sans-serif">+36h</text>`+tail;
 if(type==='parking')return head+`<g filter="url(#${s})"><rect x="77" y="19" width="87" height="105" rx="11" fill="#fefefd" stroke="#d3dbdf"/><rect x="92" y="30" width="57" height="51" rx="7" fill="#d4e0e3"/><text x="110" y="69" font-size="36" font-family="sans-serif" fill="#819ca3">P</text><path d="M95 94h51m-45 8h39" stroke="#d0d8da" stroke-width="3"/></g><g transform="rotate(-7 174 106)"><rect x="128" y="85" width="99" height="30" rx="6" fill="#e9d9c6"/><text x="140" y="104" fill="#a48965" font-size="10" font-family="sans-serif">WAITLIST ONLY</text></g>`+tail;
 return head+`<g transform="rotate(-6 129 72)" filter="url(#${s})"><rect x="70" y="24" width="120" height="95" rx="9" fill="#fffdf6" stroke="#d9ddcc"/><rect x="84" y="40" width="26" height="28" rx="5" fill="#dce4d2"/><circle cx="97" cy="49" r="5" fill="#a8b597"/><path d="M90 62q7-13 14 0" fill="#a8b597"/><path d="M121 45h51m-51 9h39M85 83h85m-85 10h65" stroke="#d9ddce" stroke-width="3"/></g><circle cx="181" cy="109" r="21" fill="#eac4aa"/><text x="174" y="118" font-size="27" fill="#aa7852" font-family="serif">?</text>`+tail;
}
function card(s){return `<button class="scenario-card" data-scenario="${s.id}" aria-label="Try ${escapeHTML(s.title)}"><div class="scenario-art ${s.color}"><span class="art-label">SCENARIO / ${s.number}</span>${illustration(s.art)}</div><div class="card-body"><div class="card-meta"><span>${s.type}</span><span>6 checks</span></div><h3>${s.title}</h3><p>${s.desc}</p><div class="card-footer"><span>${s.tags}</span>${icon('arrow')}</div></div></button>`}
const STORE='agentwork-v3-comparisons';
let history=[];try{const data=JSON.parse(localStorage.getItem(STORE)||'[]');if(Array.isArray(data))history=data.filter(r=>r&&r.version===3&&SCENARIOS.some(s=>s.id===r.scenario)&&Array.isArray(r.agents)&&r.agents.length===2&&r.agents.every(a=>a&&Array.isArray(a.events)&&Array.isArray(a.checks)&&a.events.every(e=>e&&typeof e.tool==='string'))).slice(0,30)}catch(_){history=[]}
let current=null,timer=null,tick=0,activeFilter='all',traceRun=null,traceIndex=0,traceTab='output',suite=null;
function toast(message){$('toast').textContent=message;$('toast').classList.add('on');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('on'),2800)}
function saveHistory(){try{localStorage.setItem(STORE,JSON.stringify(history));return true}catch(_){toast('Browser storage is unavailable. This run remains in memory only.');return false}}
function closeNav(){const wasOpen=$('sidebar').classList.contains('open');$('sidebar').classList.remove('open');$('sidebar').inert=matchMedia('(max-width:640px)').matches;$('scrim').hidden=true;$('mobile-menu').setAttribute('aria-expanded','false');if(wasOpen)$('mobile-menu').focus()}
function route(){let id=location.hash.slice(1)||'arena';id=({overview:'arena',tasks:'scenarios',traces:'runs'})[id]||id;if(!['arena','compare','scenarios','runs','leaderboard'].includes(id))id='arena';if(id==='compare'&&!current)id='arena';document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==id);document.querySelectorAll('[data-route]').forEach(n=>{const active=n.dataset.route===(id==='compare'?'arena':id);n.classList.toggle('active',active);active?n.setAttribute('aria-current','page'):n.removeAttribute('aria-current')});$('breadcrumb').textContent=({arena:'Arena',compare:'Comparison',scenarios:'Scenarios',runs:'My runs',leaderboard:'Leaderboard'})[id];if(id==='runs')renderHistory();if(id==='scenarios')renderLibrary();closeNav();window.scrollTo(0,0)}
function go(id){if(location.hash==='#'+id)route();else location.hash=id}
function newComparison(){clearInterval(timer);timer=null;current=null;go('arena');setTimeout(()=>$('brief').focus({preventScroll:true}),30)}
function selectScenario(id){const s=SCENARIOS.find(x=>x.id===id);if(!s)return;clearInterval(timer);timer=null;current=null;$('scenario-select').value=id;$('brief').value=s.brief;go('arena')}
function renderLibrary(){const query=$('scenario-search').value.trim().toLowerCase();const found=SCENARIOS.filter(s=>(activeFilter==='all'||s.group===activeFilter)&&(s.title+' '+s.desc+' '+s.tags).toLowerCase().includes(query));$('scenario-library').innerHTML=found.length?found.map(card).join(''):'<p class="page-footnote">No scenarios match this search.</p>'}
function validRequirements(){return {budget:Number($('budget').value),date:$('move-in').value,area:Number($('area').value),parking:$('parking').checked}}
function startComparison(event){if(event)event.preventDefault();if(!$('comparison-form').reportValidity())return;clearInterval(timer);const scenario=SCENARIOS.find(s=>s.id===$('scenario-select').value),requirements=validRequirements();const order=Math.random()<.5?['evidence','listing']:['listing','evidence'];current={version:3,id:crypto.randomUUID?crypto.randomUUID():'run-'+Date.now(),scenario:scenario.id,brief:$('brief').value.trim(),requirements,created:new Date().toISOString(),agents:order.map(p=>execute(p,scenario,requirements)),vote:null,completed:false};tick=0;buildComparison();go('compare');timer=setInterval(advanceReplay,340);advanceReplay()}
function buildComparison(){const s=SCENARIOS.find(s=>s.id===current.scenario);$('run-brief').textContent=current.brief;$('comparison-grid').innerHTML=current.agents.map((a,i)=>`<article class="agent-card agent-${i?'b':'a'}"><header class="agent-heading"><div class="agent-avatar">${icon('spark')}</div><div><strong id="agent-name-${i}">Agent ${i?'B':'A'}</strong><small id="agent-sub-${i}">Identity hidden until you vote</small></div><span class="subtle-badge">${s.number} / ${i?'B':'A'}</span></header><div class="agent-steps" id="steps-${i}" aria-label="Agent ${i?'B':'A'} execution steps"></div><div class="recommendation" id="rec-${i}"><span class="tiny-label">RECOMMENDATION</span><h3>Following the evidence…</h3><p>The reference policy is running in the local fixture.</p></div><div class="agent-footer"><span id="meta-${i}">Preparing the workflow</span><button class="text-button" data-inspect="${i}" disabled>Inspect evidence ${icon('external')}</button></div><div class="verification" id="checks-${i}" hidden></div></article>`).join('');$('replay-progress').innerHTML=Array.from({length:Math.max(...current.agents.map(a=>a.events.length))},()=>'<span></span>').join('');$('replay-status').textContent='Replaying local policies';$('replay-dot').classList.remove('done');$('skip-replay').hidden=false;$('vote-panel').hidden=true;$('reveal-panel').hidden=true;if(current.completed){tick=100;paintReplay();finishReplay(false)}}
function toolIcon(tool){return ({read_requirements:'book',search_listings:'search',open_listing:'house',send_inquiry:'mail',advance_time:'clock',read_inbox:'mail',submit_recommendation:'check'})[tool]||'grid'}
function paintReplay(){if(!current)return;current.agents.forEach((a,i)=>{const shown=a.events.slice(0,tick),el=$('steps-'+i);el.innerHTML=shown.map((e,k)=>`<div class="step-line ${k===shown.length-1?'latest':''}">${icon(toolIcon(e.tool))}<span>${escapeHTML(e.label)}</span><time>+${e.virtualHour}h</time></div>`).join('');el.scrollTop=el.scrollHeight;$('meta-'+i).textContent=`${shown.length} actions · ${shown.length?shown[shown.length-1].virtualHour:0}h virtual time`;if(tick>=a.events.length){const u=a.selected;$('rec-'+i).innerHTML=u?`<span class="tiny-label">${escapeHTML(u.source.toUpperCase())}</span><h3>${escapeHTML(u.name)}</h3><div class="rec-cost"><span>${u.sqft} sqft · Rent + parking</span><strong>${dollars(u.rent+u.parking)}<b> /mo</b></strong></div><p>${dollars(u.rent)} rent + ${dollars(u.parking)} parking.${u.fees===null?' Other fees not verified.':' + '+dollars(u.fees)+' known fees.'}</p>`:'<span class="tiny-label">NO RECOMMENDATION</span><h3>No qualifying home found.</h3><p>The verifier will check whether abstaining is justified.</p>';document.querySelector(`[data-inspect="${i}"]`).disabled=false}});[...$('replay-progress').children].forEach((el,i)=>el.classList.toggle('filled',i<tick))}
function advanceReplay(){tick++;paintReplay();if(current&&tick>=Math.max(...current.agents.map(a=>a.events.length)))finishReplay(true)}
function finishReplay(persist){clearInterval(timer);timer=null;if(!current)return;current.completed=true;$('replay-status').textContent='Replay complete';$('replay-dot').classList.add('done');$('skip-replay').hidden=true;$('vote-panel').hidden=!!current.vote;if(current.vote)reveal();if(persist&&!history.some(r=>r.id===current.id)){history.unshift(current);history=history.slice(0,30);saveHistory();$('run-count').textContent=history.length}}
function vote(choice){if(!current?.completed||current.vote)return;current.vote=choice;saveHistory();reveal();toast('Preference saved on this device. Identities revealed.')}
function reveal(){$('vote-panel').hidden=true;$('reveal-panel').hidden=false;current.agents.forEach((a,i)=>{$('agent-name-'+i).textContent=policyNames[a.policy];$('agent-sub-'+i).textContent='Scripted reference policy';$('checks-'+i).hidden=false;$('checks-'+i).innerHTML=`<h4>${a.passed?'VERIFIED OUTCOME':'VERIFICATION FAILED'} · ${a.checks.filter(c=>c.pass).length}/${a.checks.length} checks</h4>`+a.checks.map(c=>`<div class="check-row ${c.pass?'':'fail'}">${icon(c.pass?'check':'close')}<span><strong>${escapeHTML(c.name)}</strong> — ${escapeHTML(c.reason)}</span></div>`).join('')});const choice=({a:'You preferred Agent A.',b:'You preferred Agent B.',tie:'You called it a tie.',neither:'Neither outcome earned your trust.'})[current.vote];$('reveal-panel').innerHTML=`<h2>${choice}</h2><p>A was <strong>${policyNames[current.agents[0].policy]}</strong>. B was <strong>${policyNames[current.agents[1].policy]}</strong>. Your preference and the independent fixture checks are recorded separately.</p><button class="text-button" data-new style="margin-top:14px">Try another scenario ${icon('arrow')}</button>`}
function renderHistory(){$('run-count').textContent=history.length;$('export-runs').disabled=!history.length;$('runs-list').innerHTML=history.length?history.map(r=>{const s=SCENARIOS.find(s=>s.id===r.scenario);return `<article class="run-row">${icon('arena')}<div><h3>${s.title}</h3><p>${escapeHTML(new Date(r.created).toLocaleString())} · ${dollars(r.requirements.budget)} budget · ${r.vote?'Preference recorded':'Not voted yet'}</p></div><button class="secondary" data-reopen="${escapeHTML(r.id)}">Open replay ${icon('arrow')}</button></article>`}).join(''):`<div class="empty-state">${icon('clock')}<h2>Your first run starts here.</h2><p>Compare two reference agents and inspect the steps behind their decisions. Your runs stay in this browser.</p><button class="primary" data-new>Start a comparison ${icon('arrow')}</button></div>`}
function openRun(id){const r=history.find(x=>x.id===id);if(!r)return;clearInterval(timer);current=r;buildComparison();go('compare')}
function downloadJSON(data,filename){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
function inspect(index){if(!current)return;traceRun=current.agents[index];traceIndex=0;traceTab='output';$('trace-title').textContent=(current.vote?policyNames[traceRun.policy]:'Agent '+(index?'B':'A'))+' / Evidence';renderTrace();$('trace-dialog').showModal()}
function renderTrace(){$('trace-list').innerHTML=traceRun.events.map((e,i)=>`<button class="trace-event ${i===traceIndex?'selected':''}" data-event="${i}"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${escapeHTML(e.tool)}</strong><small>Virtual hour ${e.virtualHour}</small></div></button>`).join('');const e=traceRun.events[traceIndex];$('trace-inspector').innerHTML=`<h3>${escapeHTML(e.tool)}</h3><p>${escapeHTML(e.label)}</p><div class="segmented"><button class="${traceTab==='input'?'selected':''}" data-trace-tab="input">Tool input</button><button class="${traceTab==='output'?'selected':''}" data-trace-tab="output">Tool output</button></div><pre>${escapeHTML(JSON.stringify(e[traceTab],null,2))}</pre>`}
function showLeaderboard(kind){$('verified-tab').classList.toggle('selected',kind==='verified');$('demo-tab').classList.toggle('selected',kind==='demo');if(kind==='verified'){$('leader-content').innerHTML=`<div class="empty-state">${icon('chart')}<h2>Evidence before rankings.</h2><p>No verified model submissions yet. We will not turn scripted demo results into a leaderboard of real AI models.</p><button class="secondary" id="open-baselines">Explore reference policies ${icon('arrow')}</button></div>`;return}
 if(!suite){$('leader-content').innerHTML=`<div class="empty-state">${icon('arena')}<h2>Meet the reference policies.</h2><p>Run both deterministic scripts across all five scenarios. Completion and check counts are computed locally from the fixtures.</p><button class="primary" id="run-suite">Run the local suite ${icon('arrow')}</button></div>`;return}
 const rows=['evidence','listing'].map(policy=>{const runs=suite.filter(r=>r.policy===policy);return {policy,passed:runs.filter(r=>r.passed).length,checks:runs.flatMap(r=>r.checks).filter(c=>c.pass).length,total:runs.flatMap(r=>r.checks).length,actions:runs.reduce((a,r)=>a+r.events.length,0)}}).sort((a,b)=>b.passed-a.passed||b.checks-a.checks);
 $('leader-content').innerHTML=`<div class="table-wrap"><table class="leader-table"><thead><tr><th>#</th><th>REFERENCE POLICY</th><th>SUCCESSFUL TASKS</th><th>CHECKS PASSED</th><th>ACTIONS</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td class="rank-number">${i+1}</td><td><strong>${policyNames[r.policy]}</strong><small>${policyDescriptions[r.policy]}</small></td><td>${r.passed} / ${SCENARIOS.length}</td><td>${r.checks} / ${r.total}</td><td>${r.actions}</td></tr>`).join('')}</tbody></table></div><div class="leader-toolbar"><p>Computed in this browser on 5 public fixtures with default constraints.<br>No commercial model claims, global votes, or hidden test-set results.</p><button class="secondary" id="export-suite">Export results ${icon('download')}</button></div>`;
}
function runSuite(){suite=SCENARIOS.flatMap(s=>['evidence','listing'].map(p=>({scenario:s.id,...execute(p,s,DEFAULTS)})));showLeaderboard('demo')}
// Central event delegation keeps navigation and generated cards keyboard accessible.
document.addEventListener('click',event=>{const el=event.target.closest('button,a');if(!el)return;
 if(el.hasAttribute('data-scenario'))selectScenario(el.dataset.scenario);
 if(el.hasAttribute('data-new')||el.id==='new-comparison')newComparison();
 if(el.hasAttribute('data-method'))$('method-dialog').showModal();
 if(el.hasAttribute('data-close'))$(el.dataset.close).close();
 if(el.hasAttribute('data-vote'))vote(el.dataset.vote);
 if(el.hasAttribute('data-inspect'))inspect(Number(el.dataset.inspect));
 if(el.hasAttribute('data-event')){traceIndex=Number(el.dataset.event);renderTrace()}
 if(el.hasAttribute('data-trace-tab')){traceTab=el.dataset.traceTab;renderTrace()}
 if(el.hasAttribute('data-reopen'))openRun(el.dataset.reopen);
 if(el.hasAttribute('data-filter')){activeFilter=el.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('selected',b.dataset.filter===activeFilter));renderLibrary()}
 if(el.id==='open-baselines')showLeaderboard('demo');if(el.id==='run-suite')runSuite();
 if(el.id==='export-suite')downloadJSON({version:3,provenance:SOURCE,requirements:DEFAULTS,runs:suite},'agentwork-reference-results.json');
});
$('comparison-form').addEventListener('submit',startComparison);
$('brief').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();$('comparison-form').requestSubmit()}});
$('scenario-select').addEventListener('change',e=>selectScenario(e.target.value));
$('scenario-search').addEventListener('input',renderLibrary);
$('skip-replay').addEventListener('click',()=>{tick=100;paintReplay();finishReplay(true)});
$('verified-tab').addEventListener('click',()=>showLeaderboard('verified'));
$('demo-tab').addEventListener('click',()=>showLeaderboard('demo'));
$('export-runs').addEventListener('click',()=>downloadJSON({version:3,provenance:SOURCE,comparisons:history},'agentwork-local-runs.json'));
$('export-trace').addEventListener('click',()=>{const record={provenance:SOURCE,scenario:current.scenario,requirements:current.requirements,events:traceRun.events};if(current.vote){record.policy=traceRun.policy;record.checks=traceRun.checks}downloadJSON(record,'agentwork-evidence.json')});
$('mobile-menu').addEventListener('click',()=>{const open=!$('sidebar').classList.contains('open');$('sidebar').classList.toggle('open',open);$('sidebar').inert=!open;$('scrim').hidden=!open;$('mobile-menu').setAttribute('aria-expanded',String(open))});
$('scrim').addEventListener('click',closeNav);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
window.addEventListener('hashchange',route);
window.addEventListener('resize',()=>{$('sidebar').inert=matchMedia('(max-width:640px)').matches&&!$('sidebar').classList.contains('open')});
$('scenario-select').innerHTML=SCENARIOS.map(s=>`<option value="${s.id}">${s.short}</option>`).join('');
$('featured-scenarios').innerHTML=SCENARIOS.slice(0,3).map(card).join('');
renderLibrary();renderHistory();showLeaderboard('verified');route();
// Exposed for reproducible browser tests, not for private or authoritative scoring.
window.AgentWorkDemo={scenarios:SCENARIOS,execute,verify,defaults:DEFAULTS};
