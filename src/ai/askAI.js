import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logInteraction } from "./logs/logger.js";

/* ============================
   PATH HANDLING (DEPLOY SAFE)
============================ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadKnowledge(file) {
  return fs.readFileSync(
    path.join(__dirname, "knowledge", file),
    "utf8"
  );
}

function loadPrompt(file) {
  return fs.readFileSync(
    path.join(__dirname, "prompts", file),
    "utf8"
  );
}

/* ============================
   ENVIRONMENT VARIABLES
============================ */

const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.trim();
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

console.log("Endpoint:", endpoint);
console.log("Deployment:", deployment);

/* ============================
   LOAD SYSTEM PROMPT
============================ */

const systemPrompt = loadPrompt("systemPrompt.txt");

/* ============================
   LOAD ALL DOCUMENTS
============================ */

// Handbook
const attendancePolicy = loadKnowledge("attendance.txt");
const bereavementPolicy = loadKnowledge("bereavement-leave.txt");
const contactsInfo = loadKnowledge("contacts.txt");
const dressCodePolicy = loadKnowledge("dress-code.txt");
const holidaysPolicy = loadKnowledge("holidays.txt");
const hoursPolicy = loadKnowledge("hours-of-operation.txt");
const juryDutyPolicy = loadKnowledge("jury-duty.txt");
const militaryLeavePolicy = loadKnowledge("military-leave.txt");
const ptoPolicy = loadKnowledge("pto.txt");
const coreValuesPolicy = loadKnowledge("core-values-and-employment.txt");
const conductPolicy = loadKnowledge("workplace-conduct-and-confidentiality.txt");
const compensationPolicy = loadKnowledge("compensation-and-benefits.txt");
const leavePolicy = loadKnowledge("additional-leave-policies.txt");
const operationsPolicy = loadKnowledge("workplace-operations-and-discipline.txt");
const safetyPolicy = loadKnowledge("workplace-safety-and-drug-policy.txt");

// Guides & SOPs
const athenaOneGuide = loadKnowledge("athenaOne-homepage.txt");
const athenaOneUserGuide = loadKnowledge("athenaone-employee-user-guide.txt");
const internalFAQ = loadKnowledge("internal-faq.txt");

const drugItemTransfer = loadKnowledge("drug-item-transfer.txt");
const endophthalmitisSOP = loadKnowledge("sop-endophthalmitis-injections.txt");
const followUpScreeningSOP = loadKnowledge("sop-follow-up-screening.txt");
const injectionPreferencesSOP = loadKnowledge("sop-injection-preferences-per-doctor.txt");
const laserProcedureSOP = loadKnowledge("sop-laser-procedure.txt");
const lotusTrialSOP = loadKnowledge("sop-lotus-trial.txt");
const injectionScreeningSOP = loadKnowledge("sop-injection-screening.txt");
const octProcedureSOP = loadKnowledge("sop-oct-procedure.txt");
const ozurdexInjectionsSOP = loadKnowledge("sop-ozurdex-injections.txt");
const sterileBetadineSOP = loadKnowledge("sop-sterile-betadine-preparation.txt");
const postOpScreeningSOP = loadKnowledge("sop-post-op-screening.txt");
const sterileSubconjSOP = loadKnowledge("sop-sterile-subconj-preparation.txt");
const optosAdvanceEditMergeSOP = loadKnowledge("optos-advance-edit-and-merge.txt");

const retinaOSTrainingGuide = loadKnowledge("retinaos-training-guide.txt");
const sisInventoryUploadGuide = loadKnowledge("how-to-upload-new-items-sis.txt");
const rcopiaSPMTrainingManual = loadKnowledge("rcopia-4-spm-training-manual.txt");

const drfirstSyncGuide = loadKnowledge("drfirst-download-sync-medications-to-icp.txt");
const drfirstPrescriberAgentsGuide = loadKnowledge("drfirst-managing-prescriber-agents.txt");
const drfirstEpcsIdProofingGuide = loadKnowledge("drfirst-epcs-provider-id-proofing-experian.txt");
const providerPrepGuide = loadKnowledge("provider-prep-10-22.txt");
const drfirstEpcsAdminApproval = loadKnowledge("drfirst-epcs-final-step-admin-approval-lac.txt");
const drfirstPharmacyMessagesGuide = loadKnowledge("drfirst-managing-pharmacy-messages.txt");

const customerPortalSetupGuide = loadKnowledge("customer-portal-setup-support.txt");
const itInfrastructureGuide = loadKnowledge("retina-associates-it-infrastructure.txt");
const practiceOverviewGuide = loadKnowledge("retina-associates-practice-overview-and-ai-guidance.txt");

const outlookUserGuide = loadKnowledge("outlook-employee-user-guide.txt");
const itGlueUserGuide = loadKnowledge("it-glue-employee-user-guide.txt");
const dattoUserGuide = loadKnowledge("datto-employee-user-guide.txt");
const autotaskUserGuide = loadKnowledge("autotask-employee-user-guide.txt");
const entraUserGuide = loadKnowledge("microsoft-entra-employee-user-guide.txt");
const pxTechnologyUserGuide = loadKnowledge("px-technology-employee-user-guide.txt");
const mdiUserGuide = loadKnowledge("nextech-intellechart-mdi-employee-user-guide.txt");
const iMonnitUserGuide = loadKnowledge("imonitt-temperature-sensors-employee-user-guide.txt");
const gotoUserGuide = loadKnowledge("goto-phone-system-employee-user-guide.txt");
const heyexUserGuide = loadKnowledge("heidelberg-heyex-employee-user-guide.txt");
const optosCloudUserGuide = loadKnowledge("optoscloud-employee-user-guide.txt");
const retinaScreeningAbbreviationsGuide = loadKnowledge("retina-screening-abbreviations-drugs-and-clinical-workflows.txt");

/* ============================
   DOCUMENT REGISTRY WITH ALIASES
============================ */

const allDocuments = [
  {
    name: "attendance policy",
    aliases: [
      "miss work",
      "call out",
      "no call no show",
      "without notice",
      "absent",
      "didnt show up",
      "attendance violation"
    ],
    content: attendancePolicy
  },
  {
    name: "pto policy",
    aliases: [
      "vacation days",
      "paid time off",
      "how much pto",
      "pto balance",
      "request time off"
    ],
    content: ptoPolicy
  },
  {
    name: "office hours",
    aliases: [
      "closing time",
      "open time",
      "staff leave",
      "clinic hours",
      "when do we close",
      "when do we open"
    ],
    content: hoursPolicy
  },
  {
    name: "holidays",
    aliases: [
      "holiday schedule",
      "holiday hours",
      "close early",
      "office closed holiday"
    ],
    content: holidaysPolicy
  },

  { name: "dress code", aliases: ["what can we wear", "uniform policy"], content: dressCodePolicy },
  { name: "bereavement leave", aliases: ["funeral leave", "death in family"], content: bereavementPolicy },
  { name: "jury duty", aliases: ["jury summons"], content: juryDutyPolicy },
  { name: "military leave", aliases: ["reserve duty", "national guard"], content: militaryLeavePolicy },
  { name: "compensation benefits", aliases: ["pay schedule", "benefits overview"], content: compensationPolicy },
  { name: "workplace conduct", aliases: ["harassment policy", "confidentiality rules"], content: conductPolicy },
  { name: "workplace safety", aliases: ["drug testing", "workplace injury"], content: safetyPolicy },
  { name: "oct procedure sop", aliases: ["oct workflow", "oct imaging"], content: octProcedureSOP },
  { name: "laser procedure sop", aliases: ["laser workflow"], content: laserProcedureSOP },
  { name: "injection screening sop", aliases: ["injection checklist"], content: injectionScreeningSOP },
  { name: "datto user guide", aliases: ["datto backup"], content: dattoUserGuide },
  { name: "outlook user guide", aliases: ["email setup", "outlook login"], content: outlookUserGuide },
  { name: "goto phone system", aliases: ["phone system setup"], content: gotoUserGuide },
  { name: "it glue user guide", aliases: ["password documentation system"], content: itGlueUserGuide },

  { name: "core values employment", content: coreValuesPolicy },
  { name: "operations discipline", content: operationsPolicy },
  { name: "additional leave policies", content: leavePolicy },
  { name: "athenaone homepage", content: athenaOneGuide },
  { name: "athenaone user guide", content: athenaOneUserGuide },
  { name: "internal faq", content: internalFAQ },
  { name: "drug item transfer", content: drugItemTransfer },
  { name: "endophthalmitis injections sop", content: endophthalmitisSOP },
  { name: "follow up screening sop", content: followUpScreeningSOP },
  { name: "injection preferences sop", content: injectionPreferencesSOP },
  { name: "lotus trial sop", content: lotusTrialSOP },
  { name: "ozurdex injections sop", content: ozurdexInjectionsSOP },
  { name: "sterile betadine preparation sop", content: sterileBetadineSOP },
  { name: "post op screening sop", content: postOpScreeningSOP },
  { name: "sterile subconj preparation sop", content: sterileSubconjSOP },
  { name: "optos advance edit merge", content: optosAdvanceEditMergeSOP },
  { name: "retinaos training guide", content: retinaOSTrainingGuide },
  { name: "sis inventory upload", content: sisInventoryUploadGuide },
  { name: "rcopia spm training manual", content: rcopiaSPMTrainingManual },
  { name: "drfirst sync medications", content: drfirstSyncGuide },
  { name: "drfirst prescriber agents", content: drfirstPrescriberAgentsGuide },
  { name: "drfirst epcs id proofing", content: drfirstEpcsIdProofingGuide },
  { name: "provider prep", content: providerPrepGuide },
  { name: "drfirst epcs admin approval", content: drfirstEpcsAdminApproval },
  { name: "drfirst pharmacy messages", content: drfirstPharmacyMessagesGuide },
  { name: "customer portal setup", content: customerPortalSetupGuide },
  { name: "it infrastructure", content: itInfrastructureGuide },
  { name: "practice overview ai guidance", content: practiceOverviewGuide },
  { name: "px technology user guide", content: pxTechnologyUserGuide },
  { name: "mdi intellechart", content: mdiUserGuide },
  { name: "imonitt temperature sensors", content: iMonnitUserGuide },
  { name: "heidelberg heyex", content: heyexUserGuide },
  { name: "optoscloud user guide", content: optosCloudUserGuide },
  { name: "retina screening abbreviations drugs workflows", content: retinaScreeningAbbreviationsGuide }
];

/* ============================
   TOKENIZER
============================ */

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 3);
}

/* ============================
   SCORING ENGINE
============================ */

function scoreDocuments(question) {
  const questionLower = question.toLowerCase();
  const questionTokens = tokenize(question);
  const scored = [];

  for (const doc of allDocuments) {
    let score = 0;

    for (const token of questionTokens) {
      const regex = new RegExp(`\\b${token}\\b`, "gi");
      const matches = doc.content.match(regex);
      if (matches) score += matches.length;
    }

    const titleTokens = tokenize(doc.name);
    for (const token of questionTokens) {
      if (titleTokens.includes(token)) {
        score += 10;
      }
    }

    if (doc.aliases) {
      for (const alias of doc.aliases) {
        if (questionLower.includes(alias)) {
          score += 25;
        }
      }
    }

    if (score > 0) {
      scored.push({ name: doc.name, content: doc.content, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5);
}

/* ============================
   MAIN AI FUNCTION
============================ */

export async function askAI(question) {
  const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const topDocs = scoreDocuments(question);

  let context = "";
  if (topDocs.length > 0) {
    context = topDocs.map(doc => doc.content).join("\n\n");
  }

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Documentation:\n${context}\n\nQuestion:\n${question}` }
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey
    },
    body: JSON.stringify({
      messages,
      temperature: 0.2
    }),
    signal: controller.signal
  });

  clearTimeout(timeout);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Azure OpenAI error: ${JSON.stringify(data)}`);
  }

  let aiOutput = data.choices[0].message.content;

  const unsafePatterns = [
    "as an ai language model",
    "based on general knowledge",
    "outside the provided documentation",
    "i do not have access"
  ];

  if (unsafePatterns.some(pattern =>
    aiOutput.toLowerCase().includes(pattern)
  )) {
    aiOutput = "I’m sorry, that information is not available in the current internal documentation.";
  }

  // 🔹 DATABASE LOGGING (ADDED — NOTHING REMOVED)

  try {
    await logInteraction({
      userId: "unknown",
      question: question,
      topDocs: topDocs.map(d => d.name),
      answer: aiOutput
    });
  } catch (err) {
    console.error("Logging failed:", err.message);
  }

  return aiOutput;
}