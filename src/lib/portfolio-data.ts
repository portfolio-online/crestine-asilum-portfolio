/**
 * ============================================================
 *  PORTFOLIO CONTENT — edit everything in this one file.
 *  Replace `portrait` (src/assets/portrait.jpg) with a real
 *  photo using the same file name and the whole site updates.
 * ============================================================
 */
import portrait from "@/assets/portrait.jpg";

export const profile = {
  name: "Crestine L. Asilum",
  title: "Customer Service Specialist",
  subtitle: "Retail Operations & Customer Support",
  headline: "17 years of customer-facing experience. 10+ years leading retail teams.",
  summary:
    "Customer-focused and highly organized professional with 17 years of experience in customer-facing roles and over 10 years in retail operations and leadership. Skilled in customer communication, complaint resolution, order processing, after-sales support, team coordination, and maintaining accurate operational records.",
  email: "asilumcrestine@gmail.com",
  phone: "+63 991 528 1485",
  phoneHref: "+639915281485",
  location: "Camalig, Albay, Philippines",
  portrait,
  // Swap this URL for a real photo (e.g. a public/images/... path) at any time.
};

export const capabilities = [
  "Customer Service & Complaint Resolution",
  "Order & After-Sales Support",
  "Customer Inquiry & Product Assistance",
  "Issue Resolution & Escalation",
  "Data Entry & Record Accuracy",
  "Customer / Tenant Communication",
  "Cross-Functional Team Coordination",
  "Product, Delivery & Warranty Coordination",
  "Process Compliance & Documentation",
];

export const experience = [
  {
    company: "Homeworld Shopping Corp.",
    role: "Department Manager",
    period: "July 2018 – July 2026",
    details: [
      "Handled customer support, SAP/POS order processing, and warranty concerns.",
      "Coordinated logistics and maintained accurate operational records.",
      "Led and developed teams of up to 60 employees.",
    ],
  },
  {
    company: "California Clothing Inc. (GUESS)",
    role: "Cluster Manager",
    period: "Aug 2016 – Jun 2018",
    details: [
      "Managed multi-branch reporting across four locations.",
      "Drove operational coordination and monitored branch performance.",
    ],
  },
  {
    company: "Liberty Commercial Center (LCC)",
    role: "Store Head",
    period: "Mar 2012 – Aug 2016",
    details: [
      "Oversaw day-to-day store operations and inventory records.",
      "Managed workflows and team scheduling.",
    ],
  },
  {
    company: "Suyen Corporation (BENCH)",
    role: "Store Supervisor",
    period: "Apr 2009 – Feb 2012",
    details: [
      "Tracked sales performance and maintained data entry and reporting.",
      "Coordinated daily team activities.",
    ],
  },
  {
    company: "SM Hypermarket",
    role: "Cashier / Telephone Operator",
    period: "Jan 2008 – Mar 2009",
    details: [
      "Assisted customers with inquiries and telephone requests.",
      "Documented service requests accurately.",
    ],
  },
];

export const services = [
  {
    title: "Customer Service & Email Support",
    description: "Clear, timely, and courteous responses that resolve concerns fast.",
  },
  {
    title: "Order Processing & Tracking",
    description: "Accurate order entry, status monitoring, and follow-through.",
  },
  {
    title: "After-Sales & Warranty Coordination",
    description: "Warranty claims, returns, and delivery coordination handled end to end.",
  },
  {
    title: "Data Entry & Administrative Support",
    description: "Reliable, detail-accurate records and documentation.",
  },
  {
    title: "Inventory & Operational Reporting",
    description: "Organized reports that keep teams and management informed.",
  },
  {
    title: "Customer Inquiry & Issue Resolution",
    description: "From first question to final resolution, with calm professionalism.",
  },
  {
    title: "Spreadsheet & Record Management",
    description: "Clean, structured spreadsheets with validated data.",
  },
  {
    title: "Team and Workflow Coordination",
    description: "Keeping people, processes, and schedules aligned.",
  },
];

export const toolCategories = [
  {
    label: "Spreadsheets",
    items: ["Microsoft Excel", "Google Sheets", "VLOOKUP", "Data Validation"],
  },
  {
    label: "Business Systems",
    items: ["SAP", "POS", "S4DECS", "IVS / Invoicing"],
  },
  {
    label: "Communication",
    items: ["Gmail", "Outlook", "Calendar Management"],
  },
  {
    label: "Productivity",
    items: ["Google Drive", "Google Docs", "Microsoft Office"],
  },
  {
    label: "Reporting",
    items: ["Business Intelligence", "Operational Reporting Tools"],
  },
];

export const education = {
  school: "Bicol University",
  degree: "Bachelor in Agricultural Science",
  major: "Major in Crop Science",
  period: "2003 – 2007",
};

export const trainings = [
  { name: "Office System Application Course", year: "2007" },
  { name: "Occupational Health and Safety — Safety Officer 1 (DOLE)", year: "2019" },
  { name: "Integrated Training: Food & Beverage and Housekeeping", year: "2010" },
  { name: "Data Privacy Act of 2012 (RA 10173)", year: "" },
  { name: "AXA Licensed Financial Advisor (Traditional & VUL)", year: "" },
];

export const strengths = [
  { title: "Communication", note: "Speaks and writes with clarity and warmth." },
  { title: "Organization", note: "Systems and records kept consistently in order." },
  { title: "Problem-Solving", note: "Resolves issues before they escalate." },
  { title: "Attention to Detail", note: "Accurate entries, clean documentation." },
  { title: "Leadership", note: "Leads teams of up to 60 with care and structure." },
  { title: "Multitasking", note: "Balances customers, systems, and teams at once." },
  { title: "Customer Satisfaction", note: "The outcome every task is measured by." },
];
