/** Original fictional fixtures. Public by design; not a hidden test set. */
const vendor=(id,name,monthly,setup,training,audit,delivery)=>({id,name,monthly,setup,training,audit,delivery,export:true,auditLog:true,valid:true});
export const WORLDS = {
 'vendor-launch':{id:'vendor-launch',version:'1.0.0',name:'Northstar implementation launch',domain:'procurement',description:'An implementation procurement with old marketing prices, signed quotes and a late supplier response.',
  assets:{
   'project_brief.md':'Compare three partners. USD prices. First-year cost is 12 × (monthly service + required audit add-on) + setup + training. Data export and audit logging are mandatory. Inquiries are permitted; orders are not.',
   'catalog.json':[{id:'aster',name:'Aster Systems',monthly:1000},{id:'birch',name:'Birch Partners',monthly:1500},{id:'cedar',name:'Cedar Works',monthly:1300}],
   'quotes/aster.json':vendor('aster','Aster Systems',1000,8000,0,600,'2027-03-10'),
   'quotes/birch.json':vendor('birch','Birch Partners',1500,2000,1000,0,'2027-03-12'),
   'quotes/cedar-expired.json':{...vendor('cedar','Cedar Works',1300,0,0,0,'2027-03-10'),valid:false,note:'Expired. Request the current quote before making a recommendation.'}
  },
  replyAfter:24,reply:vendor('cedar','Cedar Works',1450,1500,0,0,'2027-04-01')},
 'monthly-close':{id:'monthly-close',version:'1.0.0',name:'Northstar monthly close',domain:'data',description:'A small transaction export with revisions, refunds, cancellation and a documented EUR conversion rate.',
  assets:{
   'close_policy.md':'Keep highest revision per transaction ID. Only paid and refunded transactions count. Refund amounts are already signed. Filter by transaction month, not revision date. Convert each row to USD cents and round to the nearest cent, then sum. Report net revenue including refunds.',
   'fx.json':{base:'USD',month:'2027-02',usdCentsPerCurrencyCent:{USD:1,EUR:1.1},validMonths:['2027-02','2027-03'],note:'Fixed synthetic accounting rate; not a live FX quote.'},
   'transactions.json':[
    {id:'T100',revision:1,month:'2027-02',status:'paid',currency:'USD',cents:100000},
    {id:'T100',revision:2,month:'2027-02',status:'paid',currency:'USD',cents:90000},
    {id:'T101',revision:1,month:'2027-02',status:'paid',currency:'EUR',cents:50000},
    {id:'T102',revision:1,month:'2027-02',status:'cancelled',currency:'USD',cents:30000},
    {id:'R100',revision:1,month:'2027-02',status:'refunded',currency:'USD',cents:-10000},
    {id:'T103',revision:1,month:'2027-02',status:'paid',currency:'USD',cents:20000},
    {id:'T104',revision:1,month:'2027-03',status:'paid',currency:'EUR',cents:60000}
   ]
  }},
 'relocation':{id:'relocation',version:'1.0.0',name:'A fictional city relocation',domain:'personal',description:'Three advertised studios; the lowest listing conceals a parking waitlist and a higher recurring rent.',
  assets:{'search_brief.md':'Verify rent, reserved parking, dates and area. The budget excludes separately disclosed recurring fees. No application or payment is authorized.',
   'listings.json':[
    {id:'cedar-304',name:'Cedar House #304',rent:1560,parking:180,area:514},
    {id:'harbor-112',name:'Harbor Studio #112',rent:1390,parking:145,area:470},
    {id:'union-508',name:'Union Loft #508',rent:1790,parking:255,area:608}
   ]},replyAfter:12,replies:[
   {id:'cedar-304',name:'Cedar House #304',rent:1560,parking:180,fees:75,area:514,garage:true,from:'2027-03-15',through:'2027-03-25'},
   {id:'harbor-112',name:'Harbor Studio #112',rent:1685,parking:325,fees:90,area:470,garage:false,from:'2027-03-15',through:'2027-03-25'},
   {id:'union-508',name:'Union Loft #508',rent:1790,parking:255,fees:80,area:608,garage:true,from:'2027-03-18',through:'2027-03-30'}
  ]}
};
export const cloneWorld = id => {
 if(!WORLDS[id]) throw new Error('Unknown world: '+id);
 return structuredClone(WORLDS[id]);
};
