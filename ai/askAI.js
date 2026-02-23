import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const endpoint = process.env.AZURE_OPENAI_ENDPOINT.trim();
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

console.log("DEBUG endpoint:", endpoint);
console.log("DEBUG deployment:", deployment);
console.log("DEBUG apiVersion:", apiVersion);

// Load system prompt
const systemPrompt = fs.readFileSync("./prompts/systemPrompt.txt", "utf8");

/* ============================
   LOAD ALL DOCUMENTS (UNCHANGED)
============================ */

// Handbook
const attendancePolicy = fs.readFileSync("./knowledge/attendance.txt", "utf8");
const bereavementPolicy = fs.readFileSync("./knowledge/bereavement-leave.txt", "utf8");
const contactsInfo = fs.readFileSync("./knowledge/contacts.txt", "utf8");
const dressCodePolicy = fs.readFileSync("./knowledge/dress-code.txt", "utf8");
const holidaysPolicy = fs.readFileSync("./knowledge/holidays.txt", "utf8");
const hoursPolicy = fs.readFileSync("./knowledge/hours-of-operation.txt", "utf8");
const juryDutyPolicy = fs.readFileSync("./knowledge/jury-duty.txt", "utf8");
const militaryLeavePolicy = fs.readFileSync("./knowledge/military-leave.txt", "utf8");
const ptoPolicy = fs.readFileSync("./knowledge/pto.txt", "utf8");
const coreValuesPolicy = fs.readFileSync("./knowledge/core-values-and-employment.txt", "utf8");
const conductPolicy = fs.readFileSync("./knowledge/workplace-conduct-and-confidentiality.txt", "utf8");
const compensationPolicy = fs.readFileSync("./knowledge/compensation-and-benefits.txt", "utf8");
const leavePolicy = fs.readFileSync("./knowledge/additional-leave-policies.txt", "utf8");
const operationsPolicy = fs.readFileSync("./knowledge/workplace-operations-and-discipline.txt", "utf8");
const safetyPolicy = fs.readFileSync("./knowledge/workplace-safety-and-drug-policy.txt", "utf8");

// Guides & SOPs
const athenaOneGuide = fs.readFileSync("./knowledge/athenaOne-homepage.txt", "utf8");
const athenaOneUserGuide = fs.readFileSync("./knowledge/athenaone-employee-user-guide.txt", "utf8");
const internalFAQ = fs.readFileSync("./knowledge/internal-faq.txt", "utf8");

const drugItemTransfer = fs.readFileSync("./knowledge/drug-item-transfer.txt", "utf8");
const endophthalmitisSOP = fs.readFileSync("./knowledge/sop-endophthalmitis-injections.txt", "utf8");
const followUpScreeningSOP = fs.readFileSync("./knowledge/sop-follow-up-screening.txt", "utf8");
const injectionPreferencesSOP = fs.readFileSync("./knowledge/sop-injection-preferences-per-doctor.txt", "utf8");
const laserProcedureSOP = fs.readFileSync("./knowledge/sop-laser-procedure.txt", "utf8");
const lotusTrialSOP = fs.readFileSync("./knowledge/sop-lotus-trial.txt", "utf8");
const injectionScreeningSOP = fs.readFileSync("./knowledge/sop-injection-screening.txt", "utf8");
const octProcedureSOP = fs.readFileSync("./knowledge/sop-oct-procedure.txt", "utf8");
const ozurdexInjectionsSOP = fs.readFileSync("./knowledge/sop-ozurdex-injections.txt", "utf8");
const sterileBetadineSOP = fs.readFileSync("./knowledge/sop-sterile-betadine-preparation.txt", "utf8");
const postOpScreeningSOP = fs.readFileSync("./knowledge/sop-post-op-screening.txt", "utf8");
const sterileSubconjSOP = fs.readFileSync("./knowledge/sop-sterile-subconj-preparation.txt", "utf8");
const optosAdvanceEditMergeSOP = fs.readFileSync("./knowledge/optos-advance-edit-and-merge.txt", "utf8");

const retinaOSTrainingGuide = fs.readFileSync("./knowledge/retinaos-training-guide.txt", "utf8");
const sisInventoryUploadGuide = fs.readFileSync("./knowledge/how-to-upload-new-items-sis.txt", "utf8");
const rcopiaSPMTrainingManual = fs.readFileSync("./knowledge/rcopia-4-spm-training-manual.txt", "utf8");

const drfirstSyncGuide = fs.readFileSync("./knowledge/drfirst-download-sync-medications-to-icp.txt", "utf8");
const drfirstPrescriberAgentsGuide = fs.readFileSync("./knowledge/drfirst-managing-prescriber-agents.txt", "utf8");
const drfirstEpcsIdProofingGuide = fs.readFileSync("./knowledge/drfirst-epcs-provider-id-proofing-experian.txt", "utf8");
const providerPrepGuide = fs.readFileSync("./knowledge/provider-prep-10-22.txt", "utf8");
const drfirstEpcsAdminApproval = fs.readFileSync("./knowledge/drfirst-epcs-final-step-admin-approval-lac.txt", "utf8");
const drfirstPharmacyMessagesGuide = fs.readFileSync("./knowledge/drfirst-managing-pharmacy-messages.txt", "utf8");

const customerPortalSetupGuide = fs.readFileSync("./knowledge/customer-portal-setup-support.txt", "utf8");
const itInfrastructureGuide = fs.readFileSync("./knowledge/retina-associates-it-infrastructure.txt", "utf8");
const practiceOverviewGuide = fs.readFileSync("./knowledge/retina-associates-practice-overview-and-ai-guidance.txt", "utf8");

const outlookUserGuide = fs.readFileSync("./knowledge/outlook-employee-user-guide.txt", "utf8");
const itGlueUserGuide = fs.readFileSync("./knowledge/it-glue-employee-user-guide.txt", "utf8");
const dattoUserGuide = fs.readFileSync("./knowledge/datto-employee-user-guide.txt", "utf8");
const autotaskUserGuide = fs.readFileSync("./knowledge/autotask-employee-user-guide.txt", "utf8");
const entraUserGuide = fs.readFileSync("./knowledge/microsoft-entra-employee-user-guide.txt", "utf8");
const pxTechnologyUserGuide = fs.readFileSync("./knowledge/px-technology-employee-user-guide.txt", "utf8");
const mdiUserGuide = fs.readFileSync("./knowledge/nextech-intellechart-mdi-employee-user-guide.txt", "utf8");
const iMonnitUserGuide = fs.readFileSync("./knowledge/imonitt-temperature-sensors-employee-user-guide.txt", "utf8");
const gotoUserGuide = fs.readFileSync("./knowledge/goto-phone-system-employee-user-guide.txt", "utf8");
const heyexUserGuide = fs.readFileSync("./knowledge/heidelberg-heyex-employee-user-guide.txt", "utf8");
const optosCloudUserGuide = fs.readFileSync("./knowledge/optoscloud-employee-user-guide.txt", "utf8");
const retinaScreeningAbbreviationsGuide = fs.readFileSync("./knowledge/retina-screening-abbreviations-drugs-and-clinical-workflows.txt", "utf8");


/* ============================
   HOLIDAY LOGIC
============================ */

function normalizeHolidayName(name) {
  return name.toLowerCase().replace(/day/g, "").replace(/'/g, "").trim();
}

function extractHoliday(question) {
  const knownHolidays = [
    "new year",
    "new year's day",
    "martin luther king",
    "mlk",
    "presidents day",
    "washingtons birthday",
    "memorial day",
    "juneteenth",
    "independence day",
    "fourth of july",
    "labor day",
    "columbus day",
    "veterans day",
    "thanksgiving",
    "christmas",
    "christmas day"
  ];

  const q = question.toLowerCase();
  return knownHolidays.find(h => q.includes(h));
}

function checkHolidayLogic(question) {
  const holiday = extractHoliday(question);
  if (!holiday) return null;

  const normalizedHoliday = normalizeHolidayName(holiday);
  const holidayDoc = holidaysPolicy.toLowerCase();

  const isClosed = holidayDoc.includes(normalizedHoliday);

  if (isClosed) {
    return `According to the holiday policy, the practice is closed on ${holiday}.`;
  } else {
    return `According to the holiday policy, ${holiday} is not listed as a closure day, so the practice remains open.`;
  }
}


/* ============================
   DOCUMENT REGISTRY
============================ */

const sections = [
  {
    name: "Handbook Policies",
    keywords: ["holiday", "christmas", "hours", "pto", "attendance", "dress", "leave", "jury", "military", "benefits", "pay", "conduct", "safety"],
    content: [
      attendancePolicy,
      bereavementPolicy,
      contactsInfo,
      dressCodePolicy,
      holidaysPolicy,
      hoursPolicy,
      juryDutyPolicy,
      militaryLeavePolicy,
      ptoPolicy,
      coreValuesPolicy,
      conductPolicy,
      compensationPolicy,
      leavePolicy,
      operationsPolicy,
      safetyPolicy
    ]
  },
  {
    name: "AthenaOne",
    keywords: ["athena", "athenaone", "patient", "chart", "schedule"],
    content: [athenaOneGuide, athenaOneUserGuide]
  },
  {
    name: "SOPs",
    keywords: [
      "sop", "procedure", "injection", "laser", "oct", "ozurdex", "betadine",
      "subconj", "screening", "trial", "abbreviation", "drug", "medication",
      "workflow", "retina"
    ],
    content: [
      drugItemTransfer,
      endophthalmitisSOP,
      followUpScreeningSOP,
      injectionPreferencesSOP,
      laserProcedureSOP,
      lotusTrialSOP,
      injectionScreeningSOP,
      octProcedureSOP,
      ozurdexInjectionsSOP,
      sterileBetadineSOP,
      postOpScreeningSOP,
      sterileSubconjSOP,
      optosAdvanceEditMergeSOP,
      retinaScreeningAbbreviationsGuide  
    ]
  },
  {
    name: "IT & Systems",
    keywords: ["email", "outlook", "login", "password", "vpn", "datto", "autotask", "entra", "it glue", "px", "nextech", "mdi", "imonnit", "goto", "heyex", "optos"],
    content: [
      outlookUserGuide,
      itGlueUserGuide,
      dattoUserGuide,
      autotaskUserGuide,
      entraUserGuide,
      pxTechnologyUserGuide,
      mdiUserGuide,
      iMonnitUserGuide,
      gotoUserGuide,
      heyexUserGuide,
      optosCloudUserGuide,
      itInfrastructureGuide
    ]
  },
  {
    name: "Training & Practice",
    keywords: ["training", "retinaos", "sis", "inventory", "rcopia", "drfirst", "provider", "portal", "practice"],
    content: [
      retinaOSTrainingGuide,
      sisInventoryUploadGuide,
      rcopiaSPMTrainingManual,
      drfirstSyncGuide,
      drfirstPrescriberAgentsGuide,
      drfirstEpcsIdProofingGuide,
      providerPrepGuide,
      drfirstEpcsAdminApproval,
      drfirstPharmacyMessagesGuide,
      customerPortalSetupGuide,
      practiceOverviewGuide,
      internalFAQ
    ]
  }
];


/* ============================
   SEARCH ENGINE
============================ */

function findRelevantSections(question) {
  const q = question.toLowerCase();
  const matched = [];

  for (const section of sections) {
    if (section.keywords.some(keyword => q.includes(keyword))) {
      matched.push(section);
    }
  }

  if (matched.length === 0) {
    matched.push(sections[0]);
  }

  return matched;
}


/* ============================
   MAIN AI FUNCTION
============================ */

export async function askAI(question) {
  const holidayAnswer = checkHolidayLogic(question);
  if (holidayAnswer) {
    return holidayAnswer;
  }

  const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const matchedSections = findRelevantSections(question);

  const context = matchedSections
    .map(section => `SECTION: ${section.name}\n\n${section.content.join("\n\n")}`)
    .join("\n\n");

  console.log("Matched sections:", matchedSections.map(s => s.name));
  console.log("Context size:", context.length);

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "system", content: context },
    { role: "user", content: question }
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey
    },
    body: JSON.stringify({
      messages,
      temperature: 0.2
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Azure OpenAI error: ${JSON.stringify(data)}`);
  }

  return data.choices[0].message.content;
}
