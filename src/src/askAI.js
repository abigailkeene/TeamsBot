import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

const endpoint = process.env.AZURE_OPENAI_ENDPOINT.trim();
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

const pxconnectCheatSheet = loadKnowledge("pxconnect-cheat-sheet.txt");
const pxconnectPortalBestPractices = loadKnowledge("pxconnect-client-portal-best-practices.txt");
const pxconnectRemoteSignature = loadKnowledge("pxconnect-remote-signature-feature.txt");

// Retina Conditions
const acquiredVitelliformLesions = loadKnowledge("acquired-vitelliform-lesions.txt");
const ageRelatedMacularDegeneration = loadKnowledge("age-related-macular-degeneration.txt");
const dryAmdGeographicAtrophy = loadKnowledge("dry-amd-geographic-atrophy.txt");
const wetAmdMacularNeovascularization = loadKnowledge("wet-amd-macular-neovascularization.txt");
const branchRetinalVeinOcclusion = loadKnowledge("branch-retinal-vein-occlusion.txt");
const centralRetinalVeinOcclusion = loadKnowledge("central-retinal-vein-occlusion.txt");
const centralSerousChorioretinopathy = loadKnowledge("central-serous-chorioretinopathy.txt");
const charlesBonnetSyndrome = loadKnowledge("charles-bonnet-syndrome.txt");
const choroidalDetachment = loadKnowledge("choroidal-detachment.txt");
const retinalArteryOcclusion = loadKnowledge("retinal-artery-occlusion.txt");
const choroidalNevus = loadKnowledge("choroidal-nevus.txt");
const complexRetinalDetachment = loadKnowledge("complex-retinal-detachment.txt");
const congenitalXLinkedRetinoschisis = loadKnowledge("congenital-x-linked-retinoschisis.txt");
const diabeticRetinopathy = loadKnowledge("diabetic-retinopathy.txt");
const endophthalmitisGuide = loadKnowledge("endophthalmitis.txt");
const epiretinalMembrane = loadKnowledge("epiretinal-membrane.txt");
const familialExudativeVitreoretinopathy = loadKnowledge("familial-exudative-vitreoretinopathy.txt");
const hydroxychloroquineRetinalToxicity = loadKnowledge("hydroxychloroquine-retinal-toxicity.txt");
const idiopathicJuxtafovealTelangiectasis = loadKnowledge("idiopathic-juxtafoveal-telangiectasis.txt");
const infectiousRetinitis = loadKnowledge("infectious-retinitis.txt");
const intraocularLensDislocation = loadKnowledge("intraocular-lens-dislocation.txt");
const intraocularUvealMelanoma = loadKnowledge("intraocular-uveal-melanoma.txt");
const intravitrealInjections = loadKnowledge("intravitreal-injections.txt");
const latticeDegeneration = loadKnowledge("lattice-degeneration.txt");
const leberCongenitalAmaurosis = loadKnowledge("leber-congenital-amaurosis.txt");
const macularEdema = loadKnowledge("macular-edema.txt");
const macularHole = loadKnowledge("macular-hole.txt");
const persistentFetalVasculature = loadKnowledge("persistent-fetal-vasculature.txt");
const polypoidalChoroidalVasculopathy = loadKnowledge("polypoidal-choroidal-vasculopathy.txt");
const posteriorVitreousDetachment = loadKnowledge("posterior-vitreous-detachment.txt");
const presumedOcularHistoplasmosisSyndrome = loadKnowledge("presumed-ocular-histoplasmosis-syndrome.txt");
const retainedLensFragments = loadKnowledge("retained-lens-fragments.txt");
const retinalDetachment = loadKnowledge("retinal-detachment.txt");
const retinalTears = loadKnowledge("retinal-tears.txt");
const retinitisPigmentosa = loadKnowledge("retinitis-pigmentosa.txt");
const retinoblastoma = loadKnowledge("retinoblastoma.txt");
const retinopathyOfPrematurity = loadKnowledge("retinopathy-of-prematurity.txt");
const riverBlindnessOnchocerciasis = loadKnowledge("river-blindness-onchocerciasis.txt");
const sickleCellRetinopathy = loadKnowledge("sickle-cell-retinopathy.txt");
const vitrectomy = loadKnowledge("vitrectomy.txt");
const retinaGlossary = loadKnowledge("retina-glossary.txt");
const retinaHealthOverview = loadKnowledge("retina-health-overview.txt");
const vitrectomyForFloaters = loadKnowledge("vitrectomy-for-floaters.txt");
const vitreomacularTractionSyndrome = loadKnowledge("vitreomacular-traction-syndrome.txt");

/* ============================
   DOCUMENT REGISTRY WITH ALIASES
============================ */

const allDocuments = [
  { name: "attendance policy", aliases: ["miss work", "call out", "no call no show", "without notice", "absent", "didnt show up", "attendance violation"], content: attendancePolicy },
  { name: "pto policy", aliases: ["vacation days", "paid time off", "how much pto", "pto balance", "request time off"], content: ptoPolicy },
  { name: "office hours", aliases: ["closing time", "open time", "staff leave", "clinic hours", "when do we close", "when do we open"], content: hoursPolicy },
  { name: "holidays", aliases: ["holiday schedule", "holiday hours", "close early", "office closed holiday"], content: holidaysPolicy },
  { name: "pxconnect cheat sheet", aliases: ["px connect cheat sheet", "pxconnect quick reference", "px connect quick guide"], content: pxconnectCheatSheet },
  { name: "pxconnect client portal best practices", aliases: ["px connect portal", "patient portal pxconnect", "pxconnect portal workflow"], content: pxconnectPortalBestPractices },
  { name: "pxconnect remote signature feature", aliases: ["remote signature", "send signature request", "pxconnect signature", "patient signature request"], content: pxconnectRemoteSignature },
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
  { name: "retina screening abbreviations drugs workflows", content: retinaScreeningAbbreviationsGuide },
  { name: "acquired vitelliform lesions", aliases: ["vitelliform lesion", "vitelliform maculopathy", "adult onset vitelliform", "yellow macular deposits"], content: acquiredVitelliformLesions },
  { name: "age related macular degeneration", aliases: ["amd", "macular degeneration", "vision loss macula", "drusen"], content: ageRelatedMacularDegeneration },
  { name: "dry amd geographic atrophy", aliases: ["dry amd", "geographic atrophy", "ga retina", "reticular drusen"], content: dryAmdGeographicAtrophy },
  { name: "wet amd macular neovascularization", aliases: ["wet amd", "macular neovascularization", "mnv", "choroidal neovascularization"], content: wetAmdMacularNeovascularization },
  { name: "branch retinal vein occlusion", aliases: ["brvo", "retinal vein occlusion", "vein blockage retina", "macular edema vein occlusion"], content: branchRetinalVeinOcclusion },
  { name: "central retinal vein occlusion", aliases: ["crvo", "retinal vein blockage", "vein occlusion retina", "central vein occlusion"], content: centralRetinalVeinOcclusion },
  { name: "central serous chorioretinopathy", aliases: ["csc", "serous chorioretinopathy", "fluid under retina", "central serous retina"], content: centralSerousChorioretinopathy },
  { name: "charles bonnet syndrome", aliases: ["cbs", "visual hallucinations vision loss", "hallucinations vision impairment"], content: charlesBonnetSyndrome },
  { name: "choroidal detachment", aliases: ["choroid detachment", "fluid behind retina", "hemorrhagic choroidal detachment", "serous choroidal detachment"], content: choroidalDetachment },
  { name: "retinal artery occlusion", aliases: ["crao", "brao", "artery blockage retina", "retinal artery blockage"], content: retinalArteryOcclusion },
  { name: "choroidal nevus", aliases: ["eye freckle", "choroidal mole", "nevus retina", "pigmented lesion eye"], content: choroidalNevus },
  { name: "complex retinal detachment", aliases: ["pvr retinal detachment", "proliferative vitreoretinopathy", "giant retinal tear", "complex detachment"], content: complexRetinalDetachment },
  { name: "congenital x linked retinoschisis", aliases: ["cxlrs", "retinoschisis", "x linked retinoschisis", "retinal layer splitting"], content: congenitalXLinkedRetinoschisis },
  { name: "diabetic retinopathy", aliases: ["diabetic eye disease", "dme", "proliferative diabetic retinopathy", "diabetes retina damage"], content: diabeticRetinopathy },
  { name: "endophthalmitis", aliases: ["eye infection after surgery", "intraocular infection", "post surgical eye infection", "hypopyon infection"], content: endophthalmitisGuide },
  { name: "epiretinal membrane", aliases: ["macular pucker", "cellophane maculopathy", "erm retina", "wrinkled retina"], content: epiretinalMembrane },
  { name: "familial exudative vitreoretinopathy", aliases: ["fevr", "genetic retinal vascular disease", "retinal vessel development disorder"], content: familialExudativeVitreoretinopathy },
  { name: "hydroxychloroquine retinal toxicity", aliases: ["plaquenil toxicity", "hcq eye toxicity", "hydroxychloroquine eye damage", "bulls eye maculopathy"], content: hydroxychloroquineRetinalToxicity },
  { name: "idiopathic juxtafoveal telangiectasis", aliases: ["macular telangiectasia", "mactel", "juxtafoveal telangiectasia", "retinal telangiectasia"], content: idiopathicJuxtafovealTelangiectasis },
  { name: "infectious retinitis", aliases: ["retinal infection", "viral retinitis", "cmv retinitis", "herpes retinitis", "toxoplasmosis retinitis"], content: infectiousRetinitis },
  { name: "intraocular lens dislocation", aliases: ["iol dislocation", "dislocated lens implant", "lens implant movement", "iol displacement"], content: intraocularLensDislocation },
  { name: "intraocular uveal melanoma", aliases: ["uveal melanoma", "ocular melanoma", "eye melanoma", "choroidal melanoma"], content: intraocularUvealMelanoma },
  { name: "intravitreal injections", aliases: ["eye injections", "anti vegf injection", "avastin injection", "lucentis injection", "eylea injection", "retina injection"], content: intravitrealInjections },
  { name: "lattice degeneration", aliases: ["retinal lattice", "thin retina lattice", "peripheral retina thinning"], content: latticeDegeneration },
  { name: "leber congenital amaurosis", aliases: ["lca", "genetic blindness infancy", "rpe65 mutation", "luxturna treatment"], content: leberCongenitalAmaurosis },
  { name: "macular edema", aliases: ["retina swelling", "fluid in macula", "cystoid macular edema", "macular swelling"], content: macularEdema },
  { name: "macular hole", aliases: ["hole in macula", "central retinal hole", "vitreous traction macula"], content: macularHole },
  { name: "persistent fetal vasculature", aliases: ["pfv", "phpv", "persistent hyperplastic primary vitreous", "leukocoria pfv"], content: persistentFetalVasculature },
  { name: "polypoidal choroidal vasculopathy", aliases: ["pcv", "polypoidal choroid disease", "pcv retina", "pcv eye disease"], content: polypoidalChoroidalVasculopathy },
  { name: "posterior vitreous detachment", aliases: ["pvd", "vitreous detachment", "eye floaters flashes", "vitreous separating retina"], content: posteriorVitreousDetachment },
  { name: "presumed ocular histoplasmosis syndrome", aliases: ["pohs", "ocular histoplasmosis", "histo spots retina", "histoplasmosis eye disease"], content: presumedOcularHistoplasmosisSyndrome },
  { name: "retained lens fragments", aliases: ["lens fragments after cataract surgery", "retained cataract fragments", "lens material vitreous", "post cataract retained lens"], content: retainedLensFragments },
  { name: "retinal detachment", aliases: ["detached retina", "retina separation", "curtain vision retina", "flashes floaters retinal detachment"], content: retinalDetachment },
  { name: "retinal tears", aliases: ["retina tear", "retinal hole", "flashes and floaters tear", "vitreous traction tear"], content: retinalTears },
  { name: "retinitis pigmentosa", aliases: ["rp", "retinal degeneration genetic", "tunnel vision disease", "rod cone dystrophy"], content: retinitisPigmentosa },
  { name: "retinoblastoma", aliases: ["retina cancer", "eye cancer child", "pediatric retinal tumor", "white pupil cancer"], content: retinoblastoma },
  { name: "retinopathy of prematurity", aliases: ["rop", "premature baby retina disease", "premature infant retina", "retinopathy premature infant"], content: retinopathyOfPrematurity },
  { name: "river blindness onchocerciasis", aliases: ["river blindness", "onchocerciasis", "blackfly parasite eye disease", "parasitic eye infection"], content: riverBlindnessOnchocerciasis },
  { name: "sickle cell retinopathy", aliases: ["sickle cell eye disease", "sickle retinopathy", "sea fan vessels retina", "sickle cell retina"], content: sickleCellRetinopathy },
  { name: "vitrectomy", aliases: ["vitrectomy surgery", "vitreous surgery", "pars plana vitrectomy", "vitreous removal surgery"], content: vitrectomy },
  { name: "retina glossary", aliases: ["retina terms", "eye glossary", "retina definitions", "medical eye terms"], content: retinaGlossary },
  { name: "retina health overview", aliases: ["how retina works", "how we see", "what is retina", "retina health information", "dilated eye exam"], content: retinaHealthOverview },
  { name: "vitrectomy for floaters", aliases: ["floater surgery", "remove floaters surgery", "vitrectomy floaters treatment"], content: vitrectomyForFloaters },
  { name: "vitreomacular traction syndrome", aliases: ["vmt", "vitreomacular traction", "macula traction", "vitreous pulling macula"], content: vitreomacularTractionSyndrome },
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
  return scored.slice(0, 10);
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
    aiOutput = "I am sorry, that information is not available in the current internal documentation.";
  }

  return aiOutput;
}