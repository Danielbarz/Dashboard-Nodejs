import prisma from './src/lib/prisma.js';

// Mock the parsing logic from ProcessHSIImport.js
const normalizeKey = (key) => key.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
const buildKeyMap = (record) => {
  const map = {};
  Object.keys(record).forEach((k) => { map[normalizeKey(k)] = k; });
  return map;
};
const getValue = (record, keyMap, ...candidates) => {
  for (const cand of candidates) {
    const norm = normalizeKey(cand);
    if (keyMap[norm] !== undefined) return record[keyMap[norm]];
  }
  return undefined;
};

const parseDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  
  if (typeof value === 'number') {
    return new Date(Math.round((value - 25569) * 86400 * 1000));
  }

  const str = String(value).trim();
  if (!str) return null;

  const timestamp = Date.parse(str);
  if (!isNaN(timestamp)) {
    return new Date(timestamp);
  }

  const parts = str.split(/[\/\s:-]/);
  if (parts.length >= 3) {
    const p1 = parseInt(parts[0]);
    const p2 = parseInt(parts[1]);
    const p3 = parseInt(parts[2]);
    
    let m, d, y;
    if (p1 > 12) {
       d = p1; m = p2; y = p3;
    } else {
       m = p1; d = p2; y = p3;
    }

    if (y < 100) y += 2000;

    const h = parts.length > 3 ? parseInt(parts[3]) : 0;
    const min = parts.length > 4 ? parseInt(parts[4]) : 0;
    const s = parts.length > 5 ? parseInt(parts[5]) : 0;

    if (!isNaN(m) && !isNaN(d) && !isNaN(y)) {
      return new Date(y, m - 1, d, h, min, s);
    }
  }

  return null;
};

// Sample data from user
const rawData = [
  {
    "NOMOR": "1",
    "ORDER_ID": "1002140047",
    "REGIONAL": "3",
    "WITEL": "SOLO JATENG TIMUR",
    "REGIONAL_OLD": "4",
    "WITEL_OLD": "KUDUS",
    "DATEL": "KUDUS",
    "STO": "KUD",
    "UNIT": "REG",
    "JENISPSB": "AO",
    "TYPE_TRANS": "NEW SALES",
    "TYPE_LAYANAN": "",
    "STATUS_RESUME": "WAITING AKTIFASI IHLD",
    "PROVIDER": "RBS-Regional 3",
    "ORDER_DATE": "12/15/2025 9:27",
    "LAST_UPDATED_DATE": "12/15/2025 12:50",
    "NCLI": "69197731",
    "POTS": "",
    "SPEEDY": "",
    "CUSTOMER_NAME": "Balai Desa Mlatiharjo",
    "LOC_ID": "",
    "WONUM": "WO040153342",
    "FLAG_DEPOSIT": "",
    "CONTACT_HP": "",
    "INS_ADDRESS": "1.107.732\t-68.961\tAMRBS;406740/MUHIBBUDDIN AL MA`RUF//TREG3/KUDUS/AM/085742300371/ELYAS RAHMADI/085742300371/Permintaan HSI BISNIS 1S 300 MBPS",
    "GPS_LONGITUDE": "",
    "GPS_LATITUDE": "",
    "KCONTACT": "Amex",
    "CHANNEL": "",
    "STATUS_INET": "",
    "STATUS_ONU": "",
    "UPLOAD": "",
    "DOWNLOAD": "",
    "LAST_PROGRAM": "Management Janji",
    "STATUS_VOICE": "Nama Pic : bp ELYAS RAHMADI No Hp Pic : 085742300371 No alt : - Jam Pemasangan : pagi Tanggal Pemasangan : 13 Desember 2025|AF1585|MYDITA",
    "CLID": "FCC",
    "LAST_START": "12/15/2025 9:39",
    "TINDAK_LANJUT": "12/13/2025 0:00",
    "ISI_COMMENT": "",
    "USER_ID_TL": "UNSC",
    "TGL_COMMENT": "X",
    "TANGGAL_MANJA": "NO ADDON",
    "KELOMPOK_KENDALA": "",
    "KELOMPOK_STATUS": "WAITING : |MYDITA",
    "HERO": "- 11_11446;Biaya PSB HSI EBIS Tunai di Depan ~ 11[150000] - SP_NOSS;SP_NOSS ~ Internet NOSS Multispeed Network[0] - SP_NOSS;SP_NOSS ~ Internet NOSS Multispeed Network[0] - E23046;E23046 ~ ES23 - Paket HSI Bisnis[0] - E23046~null~E23046_UNL;UNL ~ Inter",
    "ADDON": "INDIBIZ",
    "TGL_PS": "",
    "STATUS_MESSAGE": "",
    "PACKAGE_NAME": "12/13/2025 0:00",
    "GROUP_PAKET": "",
    "REASON_CANCEL": "",
    "KETERANGAN_CANCEL": "UNSC",
    "TGL_MANJA": ": |MYDITA",
    "DETAIL_MANJA": "#N/A",
    "SUBERRORCODE": "#N/A",
    "ENGINEERMEMO": ""
  }
];

async function run() {
  console.log('Processing records...');
  const dataToCreate = rawData.map(record => {
    const keyMap = buildKeyMap(record);
    
    const orderId = getValue(record, keyMap, 'order_id', 'orderid', 'no_order', 'noorder');
    const noorder = getValue(record, keyMap, 'no_order', 'noorder');
    const finalOrderId = orderId || noorder || `hsi_${Date.now()}_${Math.random()}`;

    // Debug log for one record
    if (record.NOMOR === '1') {
        console.log('DEBUG: order_id found:', orderId);
        console.log('DEBUG: finalOrderId:', finalOrderId);
        console.log('DEBUG: order_date raw:', getValue(record, keyMap, 'order_date', 'orderdate'));
        console.log('DEBUG: order_date parsed:', parseDate(getValue(record, keyMap, 'order_date', 'orderdate')));
    }

    return {
      nomor: getValue(record, keyMap, 'nomor', 'no'),
      orderId: finalOrderId,
      regional: getValue(record, keyMap, 'regional', 'reg'),
      witel: getValue(record, keyMap, 'witel'),
      regionalOld: getValue(record, keyMap, 'regional_old', 'regionalold'),
      witelOld: getValue(record, keyMap, 'witel_old', 'witelold'),
      datel: getValue(record, keyMap, 'datel'),
      sto: getValue(record, keyMap, 'sto'),
      unit: getValue(record, keyMap, 'unit'),
      jenisPsb: getValue(record, keyMap, 'jenis_psb', 'jenispsb'),
      typeTrans: getValue(record, keyMap, 'type_trans', 'typetrans'),
      typeLayanan: getValue(record, keyMap, 'type_layanan', 'typelayanan'),
      statusResume: getValue(record, keyMap, 'status_resume', 'statusresume', 'status'),
      provider: getValue(record, keyMap, 'provider'),
      orderDate: parseDate(getValue(record, keyMap, 'order_date', 'orderdate')),
      lastUpdatedDate: parseDate(getValue(record, keyMap, 'last_updated_date', 'lastupdateddate')),
      ncli: getValue(record, keyMap, 'ncli'),
      pots: getValue(record, keyMap, 'pots'),
      speedy: getValue(record, keyMap, 'speedy'),
      customerName: getValue(record, keyMap, 'customer_name', 'customername', 'nama_customer'),
      locId: getValue(record, keyMap, 'loc_id', 'locid'),
      wonum: getValue(record, keyMap, 'wonum'),
      flagDeposit: getValue(record, keyMap, 'flag_deposit', 'flagdeposit'),
      contactHp: getValue(record, keyMap, 'contact_hp', 'contacthp', 'nohp'),
      insAddress: getValue(record, keyMap, 'ins_address', 'insaddress', 'alamat'),
      gpsLongitude: getValue(record, keyMap, 'gps_longitude', 'gpslongitude'),
      gpsLatitude: getValue(record, keyMap, 'gps_latitude', 'gpslatitude'),
      kcontact: getValue(record, keyMap, 'kcontact'),
      channel: getValue(record, keyMap, 'channel'),
      statusInet: getValue(record, keyMap, 'status_inet', 'statusinet'),
      statusOnu: getValue(record, keyMap, 'status_onu', 'statusonu'),
      upload: getValue(record, keyMap, 'upload'),
      download: getValue(record, keyMap, 'download'),
      lastProgram: getValue(record, keyMap, 'last_program', 'lastprogram'),
      statusVoice: getValue(record, keyMap, 'status_voice', 'statusvoice'),
      clid: getValue(record, keyMap, 'clid'),
      lastStart: getValue(record, keyMap, 'last_start', 'laststart'),
      tindakLanjut: getValue(record, keyMap, 'tindak_lanjut', 'tindaklanjut'),
      isiComment: getValue(record, keyMap, 'isi_comment', 'isicomment'),
      userIdTl: getValue(record, keyMap, 'user_id_tl', 'useridtl'),
      tglComment: parseDate(getValue(record, keyMap, 'tgl_comment', 'tglcomment')),
      tanggalManja: parseDate(getValue(record, keyMap, 'tanggal_manja', 'tanggalmanja')),
      kelompokKendala: getValue(record, keyMap, 'kelompok_kendala', 'kelompokkendala'),
      kelompokStatus: getValue(record, keyMap, 'kelompok_status', 'kelompokstatus'),
      hero: getValue(record, keyMap, 'hero'),
      addon: getValue(record, keyMap, 'addon'),
      tglPs: parseDate(getValue(record, keyMap, 'tgl_ps', 'tglps')),
      statusMessage: getValue(record, keyMap, 'status_message', 'statusmessage'),
      packageName: getValue(record, keyMap, 'package_name', 'packagename'),
      groupPaket: getValue(record, keyMap, 'group_paket', 'grouppaket'),
      reasonCancel: getValue(record, keyMap, 'reason_cancel', 'reasoncancel'),
      keteranganCancel: getValue(record, keyMap, 'keterangan_cancel', 'keterangancancel'),
      tglManja: parseDate(getValue(record, keyMap, 'tgl_manja', 'tglmanja')),
      detailManja: getValue(record, keyMap, 'detail_manja', 'detailmanja'),
      suberrorcode: getValue(record, keyMap, 'suberrorcode'),
      engineermemo: getValue(record, keyMap, 'engineermemo'),
      dataProses: getValue(record, keyMap, 'data_proses', 'dataproses'),
      noOrderRevoke: getValue(record, keyMap, 'no_order_rev', 'noorderrev', 'no_order_revol'),
      datasPsRevoke: getValue(record, keyMap, 'data_ps_rev', 'datapsrev', 'data_ps_revoke'),
      untukPsPi: getValue(record, keyMap, 'untuk_ps_pi', 'untukpspi')
    };
  });

  console.log('Mapped Data:', dataToCreate);

  try {
    const result = await prisma.hsiData.createMany({
      data: dataToCreate,
      skipDuplicates: true
    });
    console.log('Insert Result:', result);
  } catch (error) {
    console.error('Insert Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();