const TOTAL_BUDGET_BN_BASE = 110.9;
const BASE_ALLOCATED_BN = 105.4;
const REVERSAL_PENALTY_M = 100;

let TOTAL_BUDGET_BN = TOTAL_BUDGET_BN_BASE;
let taxRevenueChangeBn = 0;
let taxScoreEffects = { economy: 0, social: 0, housing: 0, approval: 0 };

const SECTORS = [
  {
    id: 'social-protection', label: 'Social Protection', emoji: '🛡️', color: '#4a90d9', baseBn: 26.9,
    subcategories: [
      { name: 'State Pension', amount: 9.5 }, { name: 'Pensions (Other)', amount: 1.0 },
      { name: 'Administration', amount: 0.6 }, { name: 'Working Age Income Supports', amount: 5.4 },
      { name: 'Children', amount: 3.9 }, { name: 'Illness, Disability & Carers', amount: 5.6 },
      { name: 'Employment Supports', amount: 0.5 }, { name: 'Supplementary Payments & Misc', amount: 0.4 },
    ],
    policies: [
      { id:'sp-1', title:"Increase weekly Jobseeker's Allowance to \u20ac250", costM:150, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Raise the weekly Jobseeker's Allowance to \u20ac250. Helps job seekers but some economists warn it may reduce incentive to take lower-paid work.", consequence:{ positive:"Food bank visits down 8% in high-unemployment areas.", negative:"Entry-level vacancies rise 12% as employers struggle to fill roles." }},
      { id:'sp-2', title:'Raise Child Benefit by \u20ac20/month', costM:2200, economyEffect:0, socialEffect:2, housingEffect:0, approvalEffect:3, economyNeg:-1, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Increase universal Child Benefit by \u20ac20/month. Very popular but at \u20ac2.2Bn this is the most expensive single policy.", consequence:{ positive:"1.2 million children benefit from higher monthly payments.", negative:"At \u20ac2.2Bn, this single policy used 40% of your discretionary budget." }},
      { id:'sp-5', title:'Hot School Meals programme', costM:300, economyEffect:0, socialEffect:3, housingEffect:0, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Extend Hot School Meals to all primary schools. Strong evidence of improved concentration and reduced food poverty.", consequence:{ positive:"440,000 school children now receive hot meals daily.", negative:null }},
      { id:'sp-3', title:'Increase State Pension by \u20ac15/week', costM:300, economyEffect:0, socialEffect:2, housingEffect:0, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Raise State Pension rates by \u20ac15/week. Widely supported but adds to long-term pension bill.", consequence:{ positive:"790,000 pensioners receive \u20ac15/week more.", negative:null }},
      { id:'sp-4', title:'Expand Fuel Allowance', costM:120, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Broaden eligibility for Fuel Allowance, enabling more low-income households to receive heating support.", consequence:{ positive:"40,000 more households receive fuel allowance.", negative:null }},
      { id:'sp-6', title:'Extend Fuel Allowance to Working Family Payment recipients', costM:80, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Extend the Fuel Allowance to ~50,000 Working Family Payment recipients to help alleviate energy poverty among working families.", consequence:{ positive:"50,000 working families receive fuel support for the first time.", negative:null }},
      { id:'sp-7', title:'Increase Domiciliary Care Allowance', costM:30, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Increase the monthly Domiciliary Care Allowance rate for families caring for children with severe disabilities at home.", consequence:{ positive:"Families caring for children with disabilities receive higher monthly payments.", negative:null }},
      { id:'sp-8', title:'Roll out My Future Fund (Auto-Enrolment Pensions)', costM:56, economyEffect:1, socialEffect:1, housingEffect:0, approvalEffect:0, economyNeg:-1, socialNeg:0, housingNeg:0, approvalNeg:-1, details:"Launch the new auto-enrolment retirement savings scheme for 750,000 private sector workers without pension cover.", consequence:{ positive:"750,000 private sector workers begin saving for retirement.", negative:"Small businesses face increased admin. Low-paid workers feel mandatory deductions." }},
    ]
  },
  {
    id: 'health', label: 'Health', emoji: '❤️', color: '#e05555', baseBn: 25.8,
    subcategories: [
      { name: 'Acute Hospitals', amount: 8.0 }, { name: 'Primary Care', amount: 4.0 },
      { name: 'Mental Health', amount: 1.2 }, { name: 'Disability Services', amount: 4.7 },
      { name: 'Older Persons', amount: 3.6 }, { name: 'Other Health', amount: 4.3 },
    ],
    policies: [
      { id:'h-1', title:'Recruit 3,000 additional nurses', costM:270, economyEffect:0, socialEffect:3, housingEffect:0, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:-1, approvalNeg:0, details:"Fund 3,000 new nursing posts. Will reduce waiting times but 3,000 new workers need housing in already-strained areas.", consequence:{ positive:"A&E waiting times fall 14% within six months.", negative:"3,000 new workers increase rental pressure near hospitals." }},
      { id:'h-2', title:'Extend free GP care to under 12s', costM:90, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Expand free GP visit card to all children under 12.", consequence:{ positive:"All children under 12 now have free GP access.", negative:null }},
      { id:'h-3', title:'Increase mental health funding by 10%', costM:130, economyEffect:0, socialEffect:2, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Ring-fence additional investment in mental health services.", consequence:{ positive:"Community mental health waiting lists drop 22%.", negative:null }},
      { id:'h-4', title:'Build 3 new primary care centres', costM:250, economyEffect:1, socialEffect:1, housingEffect:0, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:-1, details:"Capital investment in three new centres. Benefits are real but take 2-3 years.", consequence:{ positive:"Three new primary care centres begin construction.", negative:"Centres won't open for 2-3 years." }},
      { id:'h-5', title:'220 additional acute hospital beds', costM:150, economyEffect:0, socialEffect:2, housingEffect:0, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Fund 220 additional acute hospital beds across public hospitals to reduce overcrowding and trolley numbers.", consequence:{ positive:"Hospital trolley numbers drop 15%.", negative:null }},
      { id:'h-6', title:'1.7 million additional Home Support Hours', costM:100, economyEffect:0, socialEffect:2, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Fund 1.7 million additional home support hours to enable older people and people with disabilities to remain living at home.", consequence:{ positive:"1.7M extra hours keep older people living at home longer.", negative:null }},
    ]
  },
  {
    id: 'housing', label: 'Housing', emoji: '🏠', color: '#f0a030', baseBn: 7.9,
    subcategories: [
      { name: 'Social Housing', amount: 3.1 }, { name: 'Housing Assistance', amount: 2.0 },
      { name: 'Homelessness', amount: 0.4 }, { name: 'Private Rental Supports', amount: 0.8 },
      { name: 'Land & Infrastructure', amount: 1.6 },
    ],
    policies: [
      { id:'ho-1', title:'Build 10,000 new social homes', costM:350, economyEffect:2, socialEffect:1, housingEffect:4, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Accelerate social housing to deliver 10,000 units. Environmental groups oppose greenfield development.", consequence:{ positive:"10,000 social homes under construction. 4,000 jobs created.", negative:"Green belt rezoning draws environmental protests." }},
      { id:'ho-2', title:'Increase HAP limits by 15%', costM:80, economyEffect:0, socialEffect:1, housingEffect:1, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Raise HAP limits to reflect market rents. Critics say it inflates rents.", consequence:{ positive:"2,300 more households qualify for HAP rental support.", negative:"Landlords raise rents to match new HAP limits." }},
      { id:'ho-3', title:'Tax relief for first-time buyers', costM:100, economyEffect:0, socialEffect:0, housingEffect:1, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Enhanced tax credits for first-time buyers. Popular but regressive.", consequence:{ positive:"First-time buyers use relief to bridge deposit gap.", negative:"Benefits middle earners only." }},
      { id:'ho-4', title:'Fund emergency homelessness shelters', costM:60, economyEffect:0, socialEffect:2, housingEffect:1, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Capital and current funding for emergency accommodation and wrap-around services.", consequence:{ positive:"150 new emergency beds open before winter.", negative:null }},
      { id:'ho-5', title:'Fund 15,000 affordable/starter homes', costM:300, economyEffect:2, socialEffect:0, housingEffect:3, approvalEffect:2, economyNeg:0, socialNeg:-1, housingNeg:0, approvalNeg:0, details:"Support delivery of 15,000 starter homes through First Home Scheme, Affordable Purchase, Cost Rental and Help to Buy.", consequence:{ positive:"15,000 starter homes supported through multiple schemes.", negative:"Benefits middle-income buyers, not those on social housing lists." }},
      { id:'ho-6', title:'Retrofit 2,500 social homes', costM:140, economyEffect:1, socialEffect:1, housingEffect:1, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Fund the energy retrofitting of 2,500 social homes to improve energy efficiency.", consequence:{ positive:"2,500 social homes retrofitted — tenant energy bills drop 30%.", negative:null }},
      { id:'ho-7', title:'Urban Regeneration & housing infrastructure', costM:200, economyEffect:2, socialEffect:0, housingEffect:2, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:-1, details:"Invest in the Urban Regeneration and Development Fund and Housing Activation Office.", consequence:{ positive:"Stalled housing sites in Dublin and Cork unlocked.", negative:"Results take 2-3 years. Critics say it benefits developers." }},
    ]
  },
  {
    id: 'education', label: 'Education', emoji: '🎓', color: '#888ea0', baseBn: 11.8,
    subcategories: [
      { name: 'Primary Education', amount: 3.6 }, { name: 'Secondary Education', amount: 3.4 },
      { name: 'Higher Education', amount: 2.9 }, { name: 'Special Education', amount: 1.4 },
      { name: 'Admin & Other', amount: 0.5 },
    ],
    policies: [
      { id:'ed-1', title:'Reduce class sizes by 2 students', costM:160, economyEffect:0, socialEffect:2, housingEffect:0, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Fund additional teaching posts to reduce class size by 2 at primary level.", consequence:{ positive:"Class sizes reduced by 2 at primary level.", negative:null }},
      { id:'ed-2', title:'Free school books for all', costM:50, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Extend free school books to all primary and secondary students.", consequence:{ positive:"Parents save ~\u20ac150 per child per year.", negative:null }},
      { id:'ed-3', title:'Increase SUSI grant by 10%', costM:70, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Raise SUSI grant rates across all bands by 10%.", consequence:{ positive:"SUSI grants increase 10% for all eligible students.", negative:null }},
      { id:'ed-4', title:'Invest in school building programme', costM:200, economyEffect:1, socialEffect:0, housingEffect:0, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:-1, details:"Capital spending on new school builds. Necessary but takes years.", consequence:{ positive:"12 new school builds commence.", negative:"New schools won't open for 3+ years." }},
      { id:'ed-5', title:'1,717 additional SNAs for special needs students', costM:100, economyEffect:0, socialEffect:2, housingEffect:0, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Fund 1,717 additional Special Needs Assistants to support students with special educational needs.", consequence:{ positive:"1,717 additional SNAs deployed to schools.", negative:null }},
      { id:'ed-6', title:'\u20ac500 cut to student contribution fee', costM:54, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Permanent \u20ac500 reduction in the student contribution fee, benefitting 108,000 students.", consequence:{ positive:"108,000 students save \u20ac500 on contribution fees.", negative:null }},
      { id:'ed-7', title:'New DEIS Plus scheme for disadvantaged schools', costM:40, economyEffect:0, socialEffect:2, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Launch DEIS Plus, providing enhanced supports for the most disadvantaged schools.", consequence:{ positive:"Most disadvantaged schools receive enhanced DEIS Plus supports.", negative:null }},
    ]
  },
  {
    id: 'transport', label: 'Transport', emoji: '🚌', color: '#d94a8a', baseBn: 3.9,
    subcategories: [
      { name: 'Public Transport', amount: 1.7 }, { name: 'Roads', amount: 1.2 },
      { name: 'Active Travel', amount: 0.5 }, { name: 'Aviation & Maritime', amount: 0.5 },
    ],
    policies: [
      { id:'tr-1', title:'Reduce public transport fares 20%', costM:80, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Further reduce bus, rail, and Luas fares. Very popular with commuters.", consequence:{ positive:"Public transport usage up 11%. Commuters save \u20ac40/month.", negative:null }},
      { id:'tr-2', title:'Expand rural bus services', costM:40, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Increase Local Link and regional bus coverage.", consequence:{ positive:"Three new rural bus routes connect isolated communities.", negative:null }},
      { id:'tr-3', title:'Fund new cycling infrastructure', costM:60, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:-1, details:"Build protected cycle lanes. Popular in cities but removes car parking and road space.", consequence:{ positive:"Cycling commuters up 15% along new protected lanes.", negative:"Motorists lose parking. Local businesses complain." }},
      { id:'tr-4', title:'Accelerate BusConnects rollout', costM:120, economyEffect:1, socialEffect:1, housingEffect:0, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:-1, details:"Fast-track Dublin bus network redesign. Disrupts existing routes during transition.", consequence:{ positive:"Journey times fall for 60% of Dublin bus commuters.", negative:"Route changes confuse elderly and infrequent passengers." }},
      { id:'tr-5', title:'Progress DART+ expansion programme', costM:200, economyEffect:2, socialEffect:0, housingEffect:1, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:-1, details:"Accelerate the DART+ programme to extend electrified rail services.", consequence:{ positive:"DART+ West construction hits key milestones.", negative:"Years of construction disruption along the rail corridor." }},
      { id:'tr-6', title:'Active Travel & Greenway expansion', costM:80, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Expand the national greenway network and fund Safe Routes to School programme.", consequence:{ positive:"New greenways open. Safe Routes to School expands to 200 more schools.", negative:"Rural TDs question greenway spending over road repairs." }},
    ]
  },
  {
    id: 'justice', label: 'Justice', emoji: '⚖️', color: '#6c5ce7', baseBn: 3.9,
    subcategories: [
      { name: 'An Garda Siochana', amount: 1.6 }, { name: 'Prisons', amount: 0.6 },
      { name: 'Courts', amount: 0.4 }, { name: 'Legal Aid', amount: 0.2 },
      { name: 'Other Justice', amount: 1.1 },
    ],
    policies: [
      { id:'ju-1', title:'Recruit 1,000 new Gardai', costM:90, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:2, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Accelerated Garda recruitment to bring numbers above 15,000.", consequence:{ positive:"Garda numbers rise above 15,000. Visible presence increases.", negative:null }},
      { id:'ju-2', title:'Expand community policing', costM:30, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Increase dedicated community policing units.", consequence:{ positive:"Anti-social behaviour drops in community policing areas.", negative:null }},
      { id:'ju-3', title:'Invest in domestic violence services', costM:50, economyEffect:0, socialEffect:2, housingEffect:1, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Fund additional refuge spaces and support services.", consequence:{ positive:"80 new refuge beds. Women's Aid capacity up 25%.", negative:null }},
      { id:'ju-4', title:'Modernise Courts Service IT', costM:40, economyEffect:1, socialEffect:0, housingEffect:0, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Digital transformation to reduce case backlogs.", consequence:{ positive:"Court case processing times drop 20%.", negative:null }},
      { id:'ju-5', title:'Domestic & Gender-Based Violence initiatives', costM:12, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Fund new DSGBV initiatives including refuge accommodation, awareness campaigns, and support services.", consequence:{ positive:"New DSGBV supports launch in three counties.", negative:null }},
    ]
  },
  {
    id: 'debt', label: 'Debt & EU Payments', emoji: '💶', color: '#50c878', baseBn: 14.9,
    subcategories: [
      { name: 'National Debt Interest', amount: 5.8 }, { name: 'EU Budget Contribution', amount: 3.6 },
      { name: 'Debt Redemption', amount: 5.5 },
    ],
    policies: [
      { id:'de-1', title:'Refinance debt at lower rates', costM:50, economyEffect:1, socialEffect:0, housingEffect:0, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Refinance maturing bonds at lower interest rates. Saves ~\u20ac200M annually.", consequence:{ positive:"NTMA saves ~\u20ac200M/year through bond refinancing.", negative:null }},
      { id:'de-2', title:'Negotiate EU contribution rebate', costM:30, economyEffect:1, socialEffect:0, housingEffect:0, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Diplomatic effort to negotiate a temporary rebate on Ireland's EU budget contribution.", consequence:{ positive:"EU agrees a modest contribution rebate.", negative:null }},
    ]
  },
  {
    id: 'additional', label: 'Other Departments', emoji: '➕', color: '#3ac5c9', baseBn: 10.3,
    subcategories: [
      { name: 'Defence', amount: 0.9 }, { name: 'Agriculture', amount: 2.1 },
      { name: 'Environment & Climate', amount: 1.8 }, { name: 'Enterprise & Trade', amount: 1.4 },
      { name: 'Foreign Affairs & Aid', amount: 0.6 }, { name: 'Public Expenditure', amount: 2.3 },
      { name: 'Other Departments', amount: 1.2 },
    ],
    policies: [
      { id:'ad-1', title:'Double overseas development aid', costM:400, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:-2, details:"Progress toward 0.7% GNI target. Morally important but voters question it.", consequence:{ positive:"Ireland moves closer to 0.7% GNI aid target.", negative:"Public backlash: 'Why send money abroad when we can't house our own?'" }},
      { id:'ad-2', title:'Green retrofit grants for SMEs', costM:100, economyEffect:2, socialEffect:0, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Grant scheme for small businesses to improve energy efficiency.", consequence:{ positive:"3,200 SMEs apply for retrofit grants. Energy costs drop 30%.", negative:null }},
      { id:'ad-3', title:'Increase Defence Forces pay', costM:80, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Raise pay and allowances to address recruitment and retention.", consequence:{ positive:"Defence Forces recruitment applications up 35%.", negative:null }},
      { id:'ad-4', title:'Expand farm sustainability scheme', costM:60, economyEffect:1, socialEffect:0, housingEffect:0, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Fund additional places on agri-environment schemes.", consequence:{ positive:"4,500 farmers join sustainability scheme. Nitrate levels decline.", negative:null }},
      { id:'ad-5', title:'Bovine TB Action Plan', costM:85, economyEffect:1, socialEffect:0, housingEffect:0, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Fund the rollout of the Bovine TB Action Plan to protect the national herd.", consequence:{ positive:"Bovine TB testing capacity increases nationwide.", negative:null }},
      { id:'ad-6', title:'Residential energy retrofit grants (from carbon tax)', costM:200, economyEffect:1, socialEffect:1, housingEffect:1, approvalEffect:1, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:0, details:"Use carbon tax revenue for residential and community energy upgrade schemes.", consequence:{ positive:"Thousands of homes retrofitted with insulation and heat pumps.", negative:null }},
      { id:'ad-7', title:'Basic Income for the Arts (successor scheme)', costM:25, economyEffect:0, socialEffect:1, housingEffect:0, approvalEffect:0, economyNeg:0, socialNeg:0, housingNeg:0, approvalNeg:-1, details:"Launch a successor to the pilot Basic Income Scheme for the Arts. Controversial.", consequence:{ positive:"Professional artists receive guaranteed basic income.", negative:"Public questions why artists get basic income but other workers don't." }},
    ]
  },
];

const LEVELS = {
  1: { name:"The Basics — Allocate the Budget", targetEconomy:14, targetSocial:13, targetHousing:10, targetApproval:0, showNegativeEffects:false, hasEvents:false, hasTaxPhase:false, goals:[
    { label:"Economy >= 14", type:"economy", target:14 }, { label:"Social >= 13", type:"social", target:13 },
    { label:"Housing >= 10", type:"housing", target:10 }, { label:"Stay within budget", type:"budget" },
  ]},
  2: { name:"Competing Demands", targetEconomy:16, targetSocial:15, targetHousing:12, targetApproval:17, showNegativeEffects:true, hasEvents:true, hasTaxPhase:false, eventTriggerCount:5, goals:[
    { label:"Economy >= 16", type:"economy", target:16 }, { label:"Social >= 15", type:"social", target:15 },
    { label:"Housing >= 12", type:"housing", target:12 }, { label:"Approval >= 17", type:"approval", target:17 },
    { label:"Stay within budget", type:"budget" },
  ]},
  3: { name:"Budget Day — Full Challenge", targetEconomy:18, targetSocial:17, targetHousing:14, targetApproval:18, showNegativeEffects:true, hasEvents:true, hasTaxPhase:true, eventTriggerCount:6, goals:[
    { label:"Economy >= 18", type:"economy", target:18 }, { label:"Social >= 17", type:"social", target:17 },
    { label:"Housing >= 14", type:"housing", target:14 }, { label:"Approval >= 18", type:"approval", target:18 },
    { label:"Stay within budget", type:"budget" },
  ]},
};

const TAX_LEVERS = [
  { id:'income-standard', name:'Income Tax (Standard)', current:20, options:[
    { label:'18%', value:18, revenueBn:-1.2, economy:2, social:-1, approval:2 },
    { label:'20% (current)', value:20, revenueBn:0, economy:0, social:0, approval:0 },
    { label:'22%', value:22, revenueBn:1.1, economy:-2, social:1, approval:-2 },
  ]},
  { id:'income-higher', name:'Income Tax (Higher)', current:40, options:[
    { label:'38%', value:38, revenueBn:-0.7, economy:1, social:0, approval:1 },
    { label:'40% (current)', value:40, revenueBn:0, economy:0, social:0, approval:0 },
    { label:'42%', value:42, revenueBn:0.7, economy:-1, social:0, approval:-2 },
  ]},
  { id:'corporation', name:'Corporation Tax', current:12.5, options:[
    { label:'10%', value:10, revenueBn:-2.0, economy:3, social:0, approval:1 },
    { label:'12.5% (current)', value:12.5, revenueBn:0, economy:0, social:0, approval:0 },
    { label:'15%', value:15, revenueBn:1.5, economy:-3, social:0, approval:0 },
  ]},
  { id:'carbon', name:'Carbon Tax', current:71, options:[
    { label:'\u20ac56/t (cut)', value:56, revenueBn:-0.3, economy:0, social:1, approval:1 },
    { label:'\u20ac71/t (current)', value:71, revenueBn:0, economy:0, social:0, approval:0 },
    { label:'\u20ac85/t', value:85, revenueBn:0.3, economy:0, social:-1, approval:-2 },
  ]},
  { id:'vat', name:'VAT (Standard Rate)', current:23, options:[
    { label:'21%', value:21, revenueBn:-1.2, economy:1, social:1, approval:2 },
    { label:'23% (current)', value:23, revenueBn:0, economy:0, social:0, approval:0 },
    { label:'25%', value:25, revenueBn:1.1, economy:-1, social:-2, approval:-3 },
  ]},
];

const EVENTS = {
  2: [{ title:"Hospital Overcrowding Crisis", desc:"Emergency departments at 140% capacity. The HSE needs \u20ac200M immediately. Where does it come from?", choices:[
    { label:"Redirect \u20ac200M from Housing", consequence:"Housing programmes delayed 6 months.", budgetCostM:0, effects:{housing:-3,social:1,approval:-1} },
    { label:"Redirect \u20ac200M from Education", consequence:"4 planned schools postponed.", budgetCostM:0, effects:{economy:-1,social:-1,approval:-1} },
    { label:"Split: \u20ac100M each from Housing & Education", consequence:"Both sectors take a hit.", budgetCostM:0, effects:{housing:-1,economy:-1,approval:0} },
    { label:"Ignore the crisis", consequence:"Patients die on trolleys. National outrage.", budgetCostM:0, effects:{social:-5,approval:-8} },
  ]}],
  3: [{ title:"Global Tech Downturn", desc:"Three major tech firms announce 8,000 Irish layoffs. Corporation tax receipts projected to fall \u20ac1.2Bn.", choices:[
    { label:"Cut spending by \u20ac1.2Bn across all sectors", consequence:"Every department takes a cut. Ministers furious.", budgetCostM:1200, effects:{economy:-1,social:-2,housing:-1,approval:-3} },
    { label:"Raise income tax 1% to cover it", consequence:"Workers feel the pinch.", budgetCostM:0, effects:{economy:-2,approval:-4} },
    { label:"Raid the rainy day fund", consequence:"National Reserve depleted. No buffer if another crisis hits.", budgetCostM:0, effects:{} },
  ]}],
};

const LEVEL_INTROS = {
  1: { badge:"Level 1", title:"Allocate Ireland's Budget", sections:[
    { heading:"Your Role", body:"You are Ireland's Minister for Finance. Total budget: <strong>\u20ac110.9Bn</strong>, of which <strong>\u20ac105.4Bn</strong> is committed. You have <strong>\u20ac5.5Bn</strong> for new policy decisions." },
    { heading:"How to Play", body:"Click a sector in the <strong>donut chart</strong> or the sector grid to see available policies. Toggle policies on to fund them. Watch the goals panel on the right." },
    { heading:"Outcome Scores", body:"Each policy contributes to <strong>Economy</strong>, <strong>Social</strong>, and <strong>Housing</strong> scores. Meet all targets to submit." },
    { heading:"Be Deliberate", body:"<strong>Deselecting a policy costs \u20ac100M</strong> in administrative reversal costs. Think before you commit.", tag:true },
    { heading:"Consequences", body:"After submitting, you'll see what happened <strong>six months later</strong> as a result of your choices.", tag:true },
  ], warning:null },
  2: { badge:"Level 2", title:"Balance Harder Trade-offs", sections:[
    { heading:"Negative Effects", body:"Policies now have <strong>downsides</strong>. Building homes may draw environmental protests. Recruiting nurses strains the housing market.", tag:true },
    { heading:"Public Approval", body:"A new <strong>Approval</strong> score tracks public reaction. You need Approval >= 17.", tag:true },
    { heading:"Crisis Events", body:"A <strong>crisis will strike</strong> mid-budget. Good budgets leave headroom for the unexpected.", tag:true },
  ], warning:{ heading:"Think Carefully", body:"The reversal penalty still applies. With negative effects, a bad choice is costly to undo." }},
  3: { badge:"Level 3", title:"Present Your Full Budget", sections:[
    { heading:"Tax Phase", body:"Before spending, set <strong>tax policy</strong> — income tax, corporation tax, carbon tax, VAT. Your tax choices determine your budget size.", tag:true },
    { heading:"Revenue Trade-offs", body:"Raising taxes = more spending money but economic and approval costs. Cutting taxes = popular but smaller budget." },
    { heading:"Economic Shock", body:"A <strong>major economic event</strong> will hit mid-budget. Ireland's reliance on corporation tax is a real fiscal risk.", tag:true },
  ], warning:{ heading:"The Real Challenge", body:"There is no perfect answer — only trade-offs." }},
};

const levelEverCompleted = {1:false, 2:false, 3:false};
const levelCompleted = {1:false, 2:false, 3:false};
const bestTimes = {1:null, 2:null, 3:null};
const bestBudget = {1:null, 2:null, 3:null};
let currentLevel = null, currentConfig = null;
let policyState = {}, policyEverSelected = {};
let reversalCount = 0, totalChanges = 0;
let gameTimer = 0, timerInterval = null, gamePaused = false;
let charts = { spend: null, bar: null };
let currentSectorView = null, eventFired = false, taxLeverSelections = {};

document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("start-screen"), gameScreen = document.getElementById("game-screen");
  const welcomeFlash = document.getElementById("welcome-flash"), levelSelectContainer = document.getElementById("level-select-container");
  const levelScreen = document.getElementById("level-screen"), levelButtons = document.querySelectorAll(".level-btn");
  const nameForm = document.getElementById("name-form"), nameInput = document.getElementById("player-name");
  const timerEl = document.getElementById("timer");
  const levelCompleteOverlay = document.getElementById("level-complete-overlay");
  const levelCompleteTitle = document.getElementById("level-complete-title"), levelCompleteBody = document.getElementById("level-complete-body");
  const closeLevelCompleteBtn = document.getElementById("close-level-complete-btn");
  const redoBtn = document.getElementById("redo-btn"), viewLevelBtn = document.getElementById("view-level-btn");
  const sectorGrid = document.getElementById("sector-grid"), submitBtn = document.getElementById("submit-level-btn");
  const centerSectorView = document.getElementById("center-sector-view"), centerPolicyView = document.getElementById("center-policy-view");
  const backBtn = document.getElementById("back-btn");

  function getAllSelectedPolicies() { const sel=[]; SECTORS.forEach(s=>s.policies.forEach(p=>{if(policyState[p.id])sel.push(p);})); return sel; }
  function getReversalCostBn() { return (reversalCount*REVERSAL_PENALTY_M)/1000; }
  function getTotalPolicyCostBn() { return getAllSelectedPolicies().reduce((s,p)=>s+p.costM,0)/1000+getReversalCostBn(); }
  function getTotalAllocatedBn() { return BASE_ALLOCATED_BN+getTotalPolicyCostBn(); }
  function getRemainingBn() { return parseFloat((TOTAL_BUDGET_BN-getTotalAllocatedBn()).toFixed(3)); }
  function isWithinBudget() { return getRemainingBn()>=-0.001; }

  function computeScores() {
    const selected=getAllSelectedPolicies(), showNeg=currentConfig&&currentConfig.showNegativeEffects;
    let econ=6,soc=3,hous=3,appr=15;
    selected.forEach(p=>{econ+=p.economyEffect;soc+=p.socialEffect;hous+=p.housingEffect;appr+=(p.approvalEffect||0);if(showNeg){econ+=(p.economyNeg||0);soc+=(p.socialNeg||0);hous+=(p.housingNeg||0);appr+=(p.approvalNeg||0);}});
    econ+=taxScoreEffects.economy;soc+=taxScoreEffects.social;hous+=taxScoreEffects.housing;appr+=taxScoreEffects.approval;
    return{economy:Math.max(0,Math.min(100,econ)),social:Math.max(0,Math.min(100,soc)),housing:Math.max(0,Math.min(100,hous)),approval:Math.max(0,Math.min(100,appr))};
  }

  function checkGoalsMet(){const sc=computeScores(),cfg=currentConfig;return sc.economy>=cfg.targetEconomy&&sc.social>=cfg.targetSocial&&sc.housing>=cfg.targetHousing&&sc.approval>=(cfg.targetApproval||0)&&isWithinBudget();}
  function getSectorPolicyCount(sec){return sec.policies.filter(p=>policyState[p.id]).length;}
  function getSectorPolicyCostBn(sec){return sec.policies.filter(p=>policyState[p.id]).reduce((s,p)=>s+p.costM,0)/1000;}

  function saveProgress(name){localStorage.setItem(`ibm_${name}`,JSON.stringify({bestTimes,bestBudget,levelEverCompleted,levelCompleted,savedAt:Date.now()}));}
  function loadProgress(name){const raw=localStorage.getItem(`ibm_${name}`);if(!raw)return false;const d=JSON.parse(raw);if(d.savedAt&&Date.now()-d.savedAt>3*3600000){localStorage.removeItem(`ibm_${name}`);return false;}if(d.bestTimes)Object.assign(bestTimes,d.bestTimes);if(d.bestBudget)Object.assign(bestBudget,d.bestBudget);if(d.levelEverCompleted)Object.assign(levelEverCompleted,d.levelEverCompleted);if(d.levelCompleted)Object.assign(levelCompleted,d.levelCompleted);return true;}

  function loadLevel(levelNum){
    currentLevel=levelNum;currentConfig=LEVELS[levelNum];gamePaused=false;policyState={};policyEverSelected={};
    reversalCount=0;totalChanges=0;currentSectorView=null;eventFired=false;
    TOTAL_BUDGET_BN=TOTAL_BUDGET_BN_BASE;taxRevenueChangeBn=0;taxScoreEffects={economy:0,social:0,housing:0,approval:0};
    taxLeverSelections={};TAX_LEVERS.forEach(l=>{taxLeverSelections[l.id]=1;});
    document.getElementById("level-title").textContent=`Level ${levelNum} — ${currentConfig.name}`;
    document.getElementById("budget-total-label").textContent=`\u20ac${TOTAL_BUDGET_BN.toFixed(1)}Bn`;
    document.getElementById("goals-panel-title").textContent=`Level ${levelNum} Goals`;
    document.getElementById("gps-approval").style.display=currentConfig.targetApproval>0?"":"none";
    document.getElementById("gp-penalty-note").style.display="";
    levelSelectContainer.style.display="none";levelScreen.style.display="flex";closeSectorPolicies();
    if(currentConfig.hasTaxPhase){showTaxPhase(()=>{finishLevelLoad();});}else{finishLevelLoad();}
  }
  function finishLevelLoad(){renderSectorGrid();recomputeAll();startFreshTimer();setTimeout(()=>{initCharts();recomputeAll();},100);}

  function showTaxPhase(callback){
    const overlay=document.getElementById("tax-phase-overlay"),slidersDiv=document.getElementById("tax-sliders");slidersDiv.innerHTML="";
    TAX_LEVERS.forEach(lever=>{
      const g=document.createElement("div");g.className="tax-slider-group";
      g.innerHTML=`<div class="tax-slider-header"><span class="tax-slider-name">${lever.name}</span><span class="tax-slider-value" id="tax-val-${lever.id}">${lever.options[1].label}</span></div><div class="tax-slider-impact" id="tax-impact-${lever.id}">No change</div><input type="range" class="tax-slider-input" id="tax-range-${lever.id}" min="0" max="2" value="1" step="1"><div class="tax-slider-labels">${lever.options.map(o=>`<span>${o.label}</span>`).join('')}</div>`;
      slidersDiv.appendChild(g);
      g.querySelector(`#tax-range-${lever.id}`).addEventListener("input",()=>{taxLeverSelections[lever.id]=parseInt(g.querySelector(`#tax-range-${lever.id}`).value);updateTaxSummary();});
    });
    updateTaxSummary();overlay.style.display="flex";
    document.getElementById("tax-confirm-btn").onclick=()=>{
      let rev=0,fx={economy:0,social:0,housing:0,approval:0};
      TAX_LEVERS.forEach(l=>{const o=l.options[taxLeverSelections[l.id]];rev+=o.revenueBn;fx.economy+=o.economy||0;fx.social+=o.social||0;fx.approval+=o.approval||0;});
      taxRevenueChangeBn=rev;taxScoreEffects=fx;TOTAL_BUDGET_BN=parseFloat((TOTAL_BUDGET_BN_BASE+rev).toFixed(1));
      document.getElementById("budget-total-label").textContent=`\u20ac${TOTAL_BUDGET_BN.toFixed(1)}Bn`;overlay.style.display="none";callback();
    };
  }

  function updateTaxSummary(){
    let rev=0,fx={economy:0,social:0,approval:0};
    TAX_LEVERS.forEach(l=>{const idx=taxLeverSelections[l.id],o=l.options[idx];document.getElementById(`tax-val-${l.id}`).textContent=o.label;let t="No change";if(o.revenueBn>0)t=`+\u20ac${o.revenueBn.toFixed(1)}Bn`;else if(o.revenueBn<0)t=`\u2212\u20ac${Math.abs(o.revenueBn).toFixed(1)}Bn`;document.getElementById(`tax-impact-${l.id}`).textContent=t;rev+=o.revenueBn;fx.economy+=o.economy||0;fx.social+=o.social||0;fx.approval+=o.approval||0;});
    const s=rev>=0?"+":"\u2212";document.getElementById("tax-revenue-val").textContent=`${s}\u20ac${Math.abs(rev).toFixed(1)}Bn`;
    document.getElementById("tax-total-val").textContent=`\u20ac${(TOTAL_BUDGET_BN_BASE+rev).toFixed(1)}Bn`;
    const prev=document.getElementById("tax-effects-preview");let tags="";
    if(fx.economy>0)tags+=`<span class="ptag ptag--economy">📈 +${fx.economy}</span>`;if(fx.economy<0)tags+=`<span class="ptag ptag--neg">📈 ${fx.economy}</span>`;
    if(fx.social>0)tags+=`<span class="ptag ptag--social">🤝 +${fx.social}</span>`;if(fx.social<0)tags+=`<span class="ptag ptag--neg">🤝 ${fx.social}</span>`;
    if(fx.approval>0)tags+=`<span class="ptag ptag--approval">👥 +${fx.approval}</span>`;if(fx.approval<0)tags+=`<span class="ptag ptag--neg">👥 ${fx.approval}</span>`;
    prev.innerHTML=tags||'<span style="font-size:0.75rem;opacity:0.5;">No effects at current rates</span>';
  }

  function checkForEvent(){if(!currentConfig||!currentConfig.hasEvents||eventFired)return;if(getAllSelectedPolicies().length>=currentConfig.eventTriggerCount){eventFired=true;triggerEvent();}}
  function triggerEvent(){
    const evts=EVENTS[currentLevel];if(!evts||!evts.length)return;const ev=evts[0];gamePaused=true;
    const overlay=document.getElementById("event-overlay");document.getElementById("event-title").textContent=ev.title;document.getElementById("event-desc").textContent=ev.desc;
    const cd=document.getElementById("event-choices");cd.innerHTML="";
    ev.choices.forEach(ch=>{const btn=document.createElement("button");btn.className="event-choice-btn";btn.innerHTML=`${ch.label}<span class="choice-consequence">${ch.consequence}</span>`;
      btn.addEventListener("click",()=>{if(ch.budgetCostM>0){TOTAL_BUDGET_BN=parseFloat((TOTAL_BUDGET_BN-ch.budgetCostM/1000).toFixed(1));document.getElementById("budget-total-label").textContent=`\u20ac${TOTAL_BUDGET_BN.toFixed(1)}Bn`;}if(ch.effects){const f=ch.effects;taxScoreEffects.economy+=(f.economy||0);taxScoreEffects.social+=(f.social||0);taxScoreEffects.housing+=(f.housing||0);taxScoreEffects.approval+=(f.approval||0);}overlay.style.display="none";gamePaused=false;recomputeAll();});cd.appendChild(btn);});
    overlay.style.display="flex";
  }

  function renderSectorGrid(){
    sectorGrid.innerHTML="";
    SECTORS.forEach(sec=>{const pct=((sec.baseBn/TOTAL_BUDGET_BN)*100).toFixed(1);const card=document.createElement("div");card.className="sector-card";card.dataset.sectorId=sec.id;
      card.innerHTML=`<div class="sector-card__icon" style="background:${sec.color}22;color:${sec.color};">${sec.emoji}</div><div class="sector-card__name">${sec.label}</div><div class="sector-card__amount" style="color:${sec.color};">\u20ac${sec.baseBn}B</div><div class="sector-card__pct">${pct}%</div><div class="sector-card__policies-count" id="sc-count-${sec.id}"></div>`;
      card.addEventListener("click",()=>openSectorPolicies(sec));sectorGrid.appendChild(card);});
  }
  function updateSectorCards(){SECTORS.forEach(sec=>{const el=document.getElementById(`sc-count-${sec.id}`);if(!el)return;const n=getSectorPolicyCount(sec),c=getSectorPolicyCostBn(sec);el.textContent=n>0?`${n} polic${n===1?'y':'ies'} · +\u20ac${(c*1000).toFixed(0)}M`:'';});}

  function openSectorPolicies(sector){
    currentSectorView=sector;centerSectorView.style.display="none";centerPolicyView.style.display="block";
    document.getElementById("pv-icon").textContent=sector.emoji;document.getElementById("pv-icon").style.background=sector.color+"22";
    document.getElementById("pv-title").textContent=sector.label;const total=sector.baseBn+getSectorPolicyCostBn(sector);
    document.getElementById("pv-subtitle").textContent=`Base: \u20ac${sector.baseBn}B · Total: \u20ac${total.toFixed(1)}B`;renderPolicyCards(sector);
  }
  function closeSectorPolicies(){currentSectorView=null;centerPolicyView.style.display="none";centerSectorView.style.display="block";updateSectorCards();}
  backBtn.addEventListener("click",closeSectorPolicies);

  function renderPolicyCards(sector){
    const grid=document.getElementById("policy-grid");grid.innerHTML="";
    const showNeg=currentConfig&&currentConfig.showNegativeEffects;
    const showApproval=currentConfig&&currentConfig.targetApproval>0;
    sector.policies.forEach(policy=>{
      const isSel=!!policyState[policy.id];const card=document.createElement("div");card.className="policy-card"+(isSel?" selected":"");
      let tags="";
      if(policy.economyEffect>0)tags+=`<span class="ptag ptag--economy">📈 +${policy.economyEffect}</span>`;
      if(policy.socialEffect>0)tags+=`<span class="ptag ptag--social">🤝 +${policy.socialEffect}</span>`;
      if(policy.housingEffect>0)tags+=`<span class="ptag ptag--housing">🏠 +${policy.housingEffect}</span>`;
      if(showApproval&&policy.approvalEffect>0)tags+=`<span class="ptag ptag--approval">👥 +${policy.approvalEffect}</span>`;
      if(showNeg){
        if(policy.economyNeg<0)tags+=`<span class="ptag ptag--neg">📈 ${policy.economyNeg}</span>`;
        if(policy.socialNeg<0)tags+=`<span class="ptag ptag--neg">🤝 ${policy.socialNeg}</span>`;
        if(policy.housingNeg<0)tags+=`<span class="ptag ptag--neg">🏠 ${policy.housingNeg}</span>`;
        if(showApproval&&policy.approvalNeg<0)tags+=`<span class="ptag ptag--neg">👥 ${policy.approvalNeg}</span>`;
      }
      const penaltyNote=isSel&&policyEverSelected[policy.id]?`<span class="policy-card__penalty">Reversal: -\u20ac${REVERSAL_PENALTY_M}M</span>`:"";
      card.innerHTML=`<div class="policy-card__check">${isSel?'\u2713':''}</div><div class="policy-card__title">${policy.title}</div><div class="policy-card__cost">Cost: \u20ac${policy.costM}M</div><div class="policy-card__tags">${tags}</div><button class="policy-card__toggle" data-pid="${policy.id}">Show details</button><div class="policy-card__details" data-pid="${policy.id}"><div class="policy-card__details-inner">${policy.details}</div></div><div class="policy-card__confirm-bar" data-pid="${policy.id}">${penaltyNote}<button class="policy-card__confirm-btn">${isSel?'Remove':'Enact'} Policy</button></div>`;
      card.addEventListener("click",(e)=>{if(e.target.closest(".policy-card__toggle")||e.target.closest(".policy-card__confirm-btn"))return;const bar=card.querySelector(".policy-card__confirm-bar");const isOpen=bar.classList.contains("visible");grid.querySelectorAll(".policy-card__confirm-bar.visible").forEach(b=>b.classList.remove("visible"));grid.querySelectorAll(".policy-card.confirming").forEach(c=>c.classList.remove("confirming"));if(!isOpen){bar.classList.add("visible");card.classList.add("confirming");}});
      card.querySelector(".policy-card__confirm-btn").addEventListener("click",(e)=>{e.stopPropagation();const wasSelected=!!policyState[policy.id];policyState[policy.id]=!wasSelected;totalChanges++;if(wasSelected&&policyEverSelected[policy.id]){reversalCount++;}if(!wasSelected){policyEverSelected[policy.id]=true;}renderPolicyCards(sector);recomputeAll();checkForEvent();const total=sector.baseBn+getSectorPolicyCostBn(sector);document.getElementById("pv-subtitle").textContent=`Base: \u20ac${sector.baseBn}B · Total: \u20ac${total.toFixed(1)}B`;});
      grid.appendChild(card);
    });
    grid.querySelectorAll(".policy-card__toggle").forEach(btn=>{btn.addEventListener("click",(e)=>{e.stopPropagation();const pid=btn.dataset.pid;const det=grid.querySelector(`.policy-card__details[data-pid="${pid}"]`);det.classList.toggle("open");btn.textContent=det.classList.contains("open")?"Hide details":"Show details";});});
  }

  function initCharts(){
    if(charts.spend){charts.spend.destroy();charts.spend=null;}if(charts.bar){charts.bar.destroy();charts.bar=null;}
    const spendCtx=document.getElementById("spendChart").getContext("2d");
    charts.spend=new Chart(spendCtx,{type:"doughnut",data:{labels:SECTORS.map(s=>s.label),datasets:[{data:SECTORS.map(s=>s.baseBn+getSectorPolicyCostBn(s)),backgroundColor:SECTORS.map(s=>s.color),borderColor:"rgba(10,22,40,0.8)",borderWidth:2}]},options:{responsive:true,maintainAspectRatio:true,onClick:(evt,elements)=>{if(elements.length>0){openSectorPolicies(SECTORS[elements[0].index]);}},plugins:{legend:{display:true,position:"bottom",labels:{color:"#fff",font:{size:9},padding:6,boxWidth:10}}}}});
    const barCtx=document.getElementById("barChart").getContext("2d");
    charts.bar=new Chart(barCtx,{type:"bar",data:{labels:SECTORS.map(s=>s.label.length>12?s.label.substring(0,10)+"...":s.label),datasets:[{label:"Base",data:SECTORS.map(s=>s.baseBn),backgroundColor:SECTORS.map(s=>s.color+"99"),borderRadius:3},{label:"New",data:SECTORS.map(s=>getSectorPolicyCostBn(s)),backgroundColor:SECTORS.map(s=>s.color),borderRadius:3}]},options:{responsive:true,maintainAspectRatio:true,scales:{y:{stacked:true,ticks:{color:"#fff",callback:v=>`\u20ac${v}B`,font:{size:9}},grid:{color:"rgba(255,255,255,0.06)"}},x:{stacked:true,ticks:{color:"rgba(255,255,255,0.5)",font:{size:7},maxRotation:45},grid:{display:false}}},plugins:{legend:{labels:{color:"#fff",font:{size:9}}}}}});
  }
  function updateCharts(){if(!charts.spend||!charts.bar)return;charts.spend.data.datasets[0].data=SECTORS.map(s=>s.baseBn+getSectorPolicyCostBn(s));charts.spend.update("none");charts.bar.data.datasets[1].data=SECTORS.map(s=>getSectorPolicyCostBn(s));charts.bar.update("none");}

  function recomputeAll(){
    const sc=computeScores(),cfg=currentConfig;const allocated=getTotalAllocatedBn(),remaining=getRemainingBn(),withinBudget=isWithinBudget();
    const pct=Math.min(100,(allocated/TOTAL_BUDGET_BN)*100);const fillEl=document.getElementById("budget-bar-fill");
    fillEl.style.width=pct+"%";fillEl.classList.toggle("over",!withinBudget);
    const remEl=document.getElementById("budget-bar-remaining");const reversalCost=getReversalCostBn();
    let remText=`\u20ac${remaining.toFixed(1)}Bn left`;if(reversalCount>0)remText+=` (incl. \u20ac${(reversalCost*1000).toFixed(0)}M penalties)`;
    remEl.textContent=remText;remEl.classList.toggle("over",!withinBudget);
    document.getElementById("gpv-economy").textContent=Math.round(sc.economy);document.getElementById("gpv-social").textContent=Math.round(sc.social);
    document.getElementById("gpv-housing").textContent=Math.round(sc.housing);document.getElementById("gpv-approval").textContent=Math.round(sc.approval);
    function colorRow(id,val,target){const row=document.getElementById(id);row.className="gp-score-row"+(val>=target?" met":val<target*0.5?" critical":" pressure");}
    colorRow("gps-economy",sc.economy,cfg.targetEconomy);colorRow("gps-social",sc.social,cfg.targetSocial);colorRow("gps-housing",sc.housing,cfg.targetHousing);
    if(cfg.targetApproval>0)colorRow("gps-approval",sc.approval,cfg.targetApproval);
    const goalsDiv=document.getElementById("goals-panel-items");
    goalsDiv.innerHTML=cfg.goals.map(g=>{let met=false,valText="";if(g.type==="economy"){met=sc.economy>=g.target;valText=`${Math.round(sc.economy)} / ${g.target}`;}if(g.type==="social"){met=sc.social>=g.target;valText=`${Math.round(sc.social)} / ${g.target}`;}if(g.type==="housing"){met=sc.housing>=g.target;valText=`${Math.round(sc.housing)} / ${g.target}`;}if(g.type==="approval"){met=sc.approval>=g.target;valText=`${Math.round(sc.approval)} / ${g.target}`;}if(g.type==="budget"){met=withinBudget;valText=`\u20ac${remaining.toFixed(1)}Bn left`;}return`<div class="gp-goal-item ${met?'met':''}"><span class="gp-goal-label">${g.label}</span><span class="gp-goal-val">${valText}</span><span class="gp-goal-status ${met?'':'fail'}">${met?'\u2713':'\u2717'}</span></div>`;}).join("");
    document.getElementById("gp-changes-count").textContent=totalChanges;
    const allMet=checkGoalsMet();submitBtn.disabled=!allMet;submitBtn.classList.toggle("ready",allMet);updateSectorCards();updateCharts();
  }

  submitBtn.addEventListener("click",()=>{if(!checkGoalsMet())return;showConsequenceReport();});

  function showConsequenceReport(){
    gamePaused=true;if(timerInterval){clearInterval(timerInterval);timerInterval=null;}
    const selected=getAllSelectedPolicies();const body=document.getElementById("consequence-body");let html="";
    const positives=selected.filter(p=>p.consequence&&p.consequence.positive);
    if(positives.length>0){html+=`<h3 style="color:#52b788;font-size:0.82rem;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.1em;">What Went Well</h3>`;positives.forEach(p=>{html+=`<div class="consequence-item positive"><strong>${p.title}</strong> — ${p.consequence.positive}</div>`;});}
    const negatives=selected.filter(p=>p.consequence&&p.consequence.negative);
    if(negatives.length>0){html+=`<h3 style="color:#ff6b6b;font-size:0.82rem;margin:16px 0 10px;text-transform:uppercase;letter-spacing:0.1em;">Trade-offs</h3>`;negatives.forEach(p=>{html+=`<div class="consequence-item negative"><strong>${p.title}</strong> — ${p.consequence.negative}</div>`;});}
    const missed=[];SECTORS.forEach(sec=>{if(sec.policies.every(p=>!policyState[p.id])&&['housing','health','social-protection'].includes(sec.id))missed.push(sec.label);});
    if(missed.length>0){html+=`<h3 style="color:rgba(255,255,255,0.5);font-size:0.82rem;margin:16px 0 10px;text-transform:uppercase;letter-spacing:0.1em;">Neglected</h3>`;html+=`<div class="consequence-item neutral"><strong>${missed.join(', ')}</strong> — no new investment. Services stretched thinner.</div>`;}
    if(!html)html='<div class="consequence-item neutral">No significant policy changes made.</div>';body.innerHTML=html;document.getElementById("consequence-overlay").style.display="flex";
  }

  document.getElementById("consequence-continue-btn").addEventListener("click",()=>{document.getElementById("consequence-overlay").style.display="none";checkLevelCompletion();});

  function checkLevelCompletion(){
    if(levelCompleted[currentLevel])return;levelCompleted[currentLevel]=true;levelEverCompleted[currentLevel]=true;
    if(bestTimes[currentLevel]===null||gameTimer<bestTimes[currentLevel])bestTimes[currentLevel]=gameTimer;
    const remM=Math.round(getRemainingBn()*1000);if(bestBudget[currentLevel]===null||remM>bestBudget[currentLevel])bestBudget[currentLevel]=remM;
    const next=currentLevel+1,hasNext=next<=3,sc=computeScores();
    levelCompleteTitle.textContent=`Level ${currentLevel} Complete! 🎉`;
    levelCompleteBody.innerHTML=`Time: <strong>${formatTime(gameTimer)}</strong><br>Budget remaining: <strong>\u20ac${getRemainingBn().toFixed(1)}Bn</strong><br>Policies: <strong>${getAllSelectedPolicies().length}</strong> · Reversals: <strong>${reversalCount}</strong><br>Economy: <strong>${Math.round(sc.economy)}</strong> · Social: <strong>${Math.round(sc.social)}</strong> · Housing: <strong>${Math.round(sc.housing)}</strong><br><br>${hasNext?`Level ${next} is now unlocked!`:"Outstanding! You've presented Ireland's Budget to Dail Eireann!"}`;
    if(hasNext)unlockLevel(next);levelCompleteOverlay.style.display="flex";refreshLevelButtons();saveProgress(localStorage.getItem("ibm_playerName")||"player");
  }

  function unlockLevel(n){const b=document.querySelector(`.level-btn[data-level="${n}"]`);if(b){b.disabled=false;b.classList.remove("locked");}}
  function refreshLevelButtons(){document.querySelectorAll(".level-btn").forEach(b=>{const l=Number(b.dataset.level);if(levelCompleted[l])b.classList.add("completed");const t=b.querySelector(".btn-best-time");if(t&&bestTimes[l]!==null)t.textContent=`Best: ${formatTime(bestTimes[l])}`;});document.querySelectorAll(".redo-level-btn").forEach(b=>{b.style.display=levelEverCompleted[Number(b.dataset.level)]?"inline-block":"none";});}
  function startFreshTimer(){gameTimer=0;updateTimerDisplay();if(timerInterval)clearInterval(timerInterval);timerInterval=setInterval(()=>{if(!gamePaused){gameTimer++;updateTimerDisplay();}},1000);}
  function updateTimerDisplay(){timerEl.textContent=`${String(Math.floor(gameTimer/60)).padStart(2,'0')}:${String(gameTimer%60).padStart(2,'0')}`;}
  function formatTime(s){if(s===null)return"--:--";return`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}

  document.getElementById("header-reset-btn").addEventListener("click",()=>{if(confirm("Reset this level? All your policy selections will be lost.")){levelCompleted[currentLevel]=false;loadLevel(currentLevel);}});
  document.getElementById("header-home-btn").addEventListener("click",()=>{if(confirm("Exit to level select? Your progress on this level will be lost.")){if(timerInterval){clearInterval(timerInterval);timerInterval=null;}levelScreen.style.display="none";levelSelectContainer.style.display="flex";currentLevel=null;refreshLevelButtons();}});
  redoBtn.addEventListener("click",()=>{levelCompleteOverlay.style.display="none";levelCompleted[currentLevel]=false;loadLevel(currentLevel);});
  viewLevelBtn.addEventListener("click",()=>{levelCompleteOverlay.style.display="none";});
  closeLevelCompleteBtn.addEventListener("click",()=>{levelCompleteOverlay.style.display="none";levelScreen.style.display="none";if(timerInterval){clearInterval(timerInterval);timerInterval=null;}levelSelectContainer.style.display="flex";currentLevel=null;refreshLevelButtons();});

  document.getElementById("results-summary-btn").addEventListener("click",()=>{
    const name=localStorage.getItem("ibm_playerName")||"Unknown";const ln={1:"The Basics",2:"Competing Demands",3:"Budget Day"};
    const rows=[1,2,3].map(l=>{const c=levelEverCompleted[l],t=bestTimes[l]!==null?formatTime(bestTimes[l]):"\u2014",b=bestBudget[l]!==null?`\u20ac${(bestBudget[l]/1000).toFixed(1)}Bn`:"\u2014";return`<div style="margin-bottom:14px;padding:12px;background:rgba(255,255,255,0.07);border-radius:8px;"><div style="font-weight:bold;margin-bottom:6px;">Level ${l} — ${ln[l]}</div><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Status</span>${c?'<span style="color:#52b788;font-weight:bold;">Done</span>':'<span style="color:#aaa;">\u2014</span>'}</div><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Best Time</span><span>${t}</span></div><div style="display:flex;justify-content:space-between;"><span>Best Budget</span><span>${b}</span></div></div>`;}).join("");
    document.getElementById("results-body").innerHTML=`<p style="text-align:center;opacity:0.8;margin-bottom:16px;">Player: <strong>${name}</strong></p>${rows}`;document.getElementById("results-overlay").style.display="flex";
  });
  document.getElementById("results-close-btn").addEventListener("click",()=>{document.getElementById("results-overlay").style.display="none";});

  function buildIntroHTML(level){const d=LEVEL_INTROS[level];let h=`<div class="intro-badge">${d.badge}</div><h2>${d.title}</h2><hr class="intro-divider">`;d.sections.forEach(s=>{h+=`<div class="intro-section"><div class="intro-section-heading">${s.heading}${s.tag?'<span class="intro-new">New</span>':''}</div>${s.body?`<p>${s.body}</p>`:''}</div>`;});if(d.warning)h+=`<div class="intro-warning"><div class="intro-section-heading">${d.warning.heading}</div><p>${d.warning.body}</p></div>`;h+=`<button class="intro-start-btn" id="intro-start-btn">Let's Go</button>`;return h;}
  function showLevelIntro(lvl,cb){const ov=document.getElementById("level-intro-overlay"),card=document.getElementById("intro-card-content");card.innerHTML=buildIntroHTML(lvl);card.scrollTop=0;ov.style.display="flex";document.getElementById("intro-start-btn").addEventListener("click",()=>{ov.style.display="none";cb();});}

  levelButtons.forEach(b=>{b.addEventListener("click",()=>{const l=Number(b.dataset.level);if(levelEverCompleted[l])return;showLevelIntro(l,()=>loadLevel(l));});});
  document.querySelectorAll(".redo-level-btn").forEach(b=>{b.addEventListener("click",e=>{e.stopPropagation();showLevelIntro(Number(b.dataset.level),()=>loadLevel(Number(b.dataset.level)));});});

  const savedName=localStorage.getItem("ibm_playerName");if(savedName)nameInput.value=savedName;
  nameForm.addEventListener("submit",e=>{e.preventDefault();const name=nameInput.value.trim();if(!name)return;localStorage.setItem("ibm_playerName",name);loadProgress(name);[2,3].forEach(l=>{if(levelEverCompleted[l-1])unlockLevel(l);});refreshLevelButtons();startScreen.style.display="none";gameScreen.style.display="flex";welcomeFlash.style.display="flex";setTimeout(()=>{welcomeFlash.style.display="none";levelSelectContainer.style.display="flex";},2000);});
});
