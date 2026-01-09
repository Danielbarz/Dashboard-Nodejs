
import { ProcessHSIImport } from './src/jobs/ProcessHSIImport.js';
import path from 'path';
import fs from 'fs';

// Mock Job Object
const mockJob = {
  id: 'test-job-' + Date.now(),
  data: {
    filePath: path.resolve('server/test-hsi.csv'),
    fileName: 'test-hsi.csv',
    batchId: 'batch-' + Date.now()
  },
  progress: (p) => console.log(`Job Progress: ${p}%`)
};

// Create a dummy CSV file based on user sample
const csvContent = `NOMOR,ORDER_ID,REGIONAL,WITEL,REGIONAL_OLD,WITEL_OLD,DATEL,STO,UNIT,JENISPSB,TYPE_TRANS,TYPE_LAYANAN,STATUS_RESUME,PROVIDER,ORDER_DATE,LAST_UPDATED_DATE,NCLI,POTS,SPEEDY,CUSTOMER_NAME,LOC_ID,WONUM,FLAG_DEPOSIT,CONTACT_HP,INS_ADDRESS,GPS_LONGITUDE,GPS_LATITUDE,KCONTACT,CHANNEL,STATUS_INET,STATUS_ONU,UPLOAD,DOWNLOAD,LAST_PROGRAM,STATUS_VOICE,CLID,LAST_START,TINDAK_LANJUT,ISI_COMMENT,USER_ID_TL,TGL_COMMENT,TANGGAL_MANJA,KELOMPOK_KENDALA,KELOMPOK_STATUS,HERO,ADDON,TGL_PS,STATUS_MESSAGE,PACKAGE_NAME,GROUP_PAKET,REASON_CANCEL,KETERANGAN_CANCEL,TGL_MANJA,DETAIL_MANJA,SUBERRORCODE,ENGINEERMEMO,DATA PROSES,NO ORDER REVOL,DATA PS REVOKE,UNTUK PS/PI
1,1002140047,3,SOLO JATENG TIMUR,4,KUDUS,KUDUS,KUD,REG,AO,NEW SALES,,WAITING AKTIFASI IHLD,RBS-Regional 3,12/15/2025 9:27,12/15/2025 12:50,69197731,,,Balai Desa Mlatiharjo,,WO040153342,,,1.107.732	-68.961	AMRBS;406740/MUHIBBUDDIN AL MA\`RUF//TREG3/KUDUS/AM/085742300371/ELYAS RAHMADI/085742300371/Permintaan HSI BISNIS 1S 300 MBPS,,,Amex,,,,,,Management Janji,Nama Pic : bp ELYAS RAHMADI No Hp Pic : 085742300371 No alt : - Jam Pemasangan : pagi Tanggal Pemasangan : 13 Desember 2025|AF1585|MYDITA,FCC,12/15/2025 9:39,12/13/2025 0:00,,UNSC,X,NO ADDON,,WAITING : |MYDITA,- 11_11446;Biaya PSB HSI EBIS Tunai di Depan ~ 11[150000] - SP_NOSS;SP_NOSS ~ Internet NOSS Multispeed Network[0] - SP_NOSS;SP_NOSS ~ Internet NOSS Multispeed Network[0] - E23046;E23046 ~ ES23 - Paket HSI Bisnis[0] - E23046~null~E23046_UNL;UNL ~ Inter,INDIBIZ,,,,12/13/2025 0:00,,,UNSC,: |MYDITA,#N/A,#N/A,,,,
`;

fs.writeFileSync('server/test-hsi.csv', csvContent);

async function runTest() {
  console.log('Starting Manual Import Test...');
  try {
    const processor = new ProcessHSIImport(mockJob);
    const result = await processor.handle();
    console.log('Import Result:', result);
  } catch (error) {
    console.error('Import Failed:', error);
  } finally {
    // Cleanup
    if (fs.existsSync('server/test-hsi.csv')) {
      // fs.unlinkSync('server/test-hsi.csv'); // Keep it for inspection if needed
    }
  }
}

runTest();
