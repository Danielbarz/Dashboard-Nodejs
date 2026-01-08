// Mapping of City (billCity) to Account Officer (PO Name)
// Used in Datin Summary Report (Galaksi Chart)

const CITY_MAPPING = {
    // BALI (Existing)
    'DENPASAR': 'Diastanto',
    'BADUNG': 'Diastanto',
    'GIANYAR': 'Diastanto',
    'TABANAN': 'Diastanto',
    'KLUNGKUNG': 'Diastanto',
    'BANGLI': 'Diastanto',
    'JEMBRANA': 'Diastanto',
    'BULELENG': 'Diastanto',
    'KARANGASEM': 'Diastanto',
    'BALI': 'Diastanto',

    // --- JATIM TIMUR ---
    
    // I Wayan Krisna
    'PASURUAN': 'I Wayan Krisna',
    'PROBOLINGGO': 'I Wayan Krisna',
    'LUMAJANG': 'I Wayan Krisna',

    // Ibrahim Muhammad
    'GRESIK': 'Ibrahim Muhammad',
    'MOJOKERTO': 'Ibrahim Muhammad',
    'SIDOARJO': 'Ibrahim Muhammad',
    'JOMBANG': 'Ibrahim Muhammad',

    // Ilham Miftahul
    'JEMBER': 'Ilham Miftahul',
    'BANYUWANGI': 'Ilham Miftahul',
    'BONDOWOSO': 'Ilham Miftahul',
    'SITUBONDO': 'Ilham Miftahul',

    // --- JATIM BARAT ---

    // Alfonsus
    'MADIUN': 'Alfonsus',
    'NGAWI': 'Alfonsus',
    'BOJONEGORO': 'Alfonsus',
    'TUBAN': 'Alfonsus',
    'MAGETAN': 'Alfonsus',
    'PONOROGO': 'Alfonsus',

    // Luqman Kurniawan
    'KEDIRI': 'Luqman Kurniawan',
    'NGANJUK': 'Luqman Kurniawan',
    'BLITAR': 'Luqman Kurniawan',
    'TRENGGALEK': 'Luqman Kurniawan',
    'TULUNGAGUNG': 'Luqman Kurniawan',

    // Nurtria Iman
    'MALANG': 'Nurtria Iman',
    'BATU': 'Nurtria Iman',
    'KEPANJEN': 'Nurtria Iman',

    // --- NUSA TENGGARA ---

    // Maria Fransiska
    'ATAMBUA': 'Maria Fransiska',
    'ENDE': 'Maria Fransiska',
    'KUPANG': 'Maria Fransiska',
    'LABUAN BAJO': 'Maria Fransiska',
    'LABOAN BAJO': 'Maria Fransiska', // Variant
    'MAUMERE': 'Maria Fransiska',
    'WAIKABUBAK': 'Maria Fransiska',
    'WAINGAPU': 'Maria Fransiska',
    'SIKKA': 'Maria Fransiska',
    'NTT': 'Maria Fransiska',
    'KEFAMENANU': 'Maria Fransiska',
    'SABU RAIJUA': 'Maria Fransiska',
    'NAGEKEO': 'Maria Fransiska',

    // Andre Yana
    'BIMA': 'Andre Yana',
    'SUMBAWA': 'Andre Yana',
    'LOMBOK': 'Andre Yana',
    'MATARAM': 'Andre Yana',
    'DOMPU': 'Andre Yana',
    'NUSA TENGGARA BARAT': 'Andre Yana',
    'NTB': 'Andre Yana',

    // --- SURAMADU (Others) ---
    // Note: Gresik moved to Ibrahim Muhammad per request
    'SURABAYA': 'Dwieka',
    'BANGKALAN': 'Dwieka',
    'SAMPANG': 'Dwieka',
    'PAMEKASAN': 'Dwieka',
    'SUMENEP': 'Dwieka',
    'MADURA': 'Dwieka',
    
    // JAKARTA (Override for Enterprise)
    'JAKARTA': 'Ferizka Paramita', 
}

export default CITY_MAPPING