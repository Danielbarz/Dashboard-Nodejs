
import { getReportAnalysis } from './src/controllers/dashboardController.js';
import prisma from './src/lib/prisma.js';

// Mock request and response objects
const req = {
  query: {
    start_date: '2024-01-01',
    end_date: '2025-12-31'
  }
};

const res = {
  status: (code) => ({
    json: (data) => console.log(`Response Status: ${code}`, JSON.stringify(data, null, 2))
  }),
  json: (data) => {
    // console.log("Response Data (Snippet):", JSON.stringify(data).substring(0, 500));
    
    // Check specific AE Revenue in LEGS
    const legs = data.data.legs;
    const legsAE = legs.map(l => ({ witel: l.witel, ae_rev: l.revenue_ae_ach }));
    console.log("\n--- LEGS AE REVENUE ---");
    console.table(legsAE);

    // Check specific AE Revenue in SME
    const sme = data.data.sme;
    const smeAE = sme.map(s => ({ witel: s.witel, ae_rev: s.revenue_ae_ach }));
    console.log("\n--- SME AE REVENUE ---");
    console.table(smeAE);
  }
};

const next = (err) => console.error("Error:", err);

console.log("--- RUNNING getReportAnalysis SIMULATION ---");
getReportAnalysis(req, res, next).then(() => {
  prisma.$disconnect();
});
