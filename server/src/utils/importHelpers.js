export const deduplicateRecords = (records, keyField) => {
  const map = new Map()
  const duplicates = []

  records.forEach((record, index) => {
    // Normalisasi key
    const uniqueVal = record[keyField]
    
    if (!uniqueVal) {
      // Jika tidak ada key, anggap unik (atau skip tergantung kebutuhan, disini kita keep)
      map.set(`__no_key_${index}`, record)
      return
    }

    // Selalu timpa dengan data terakhir (Overlay logic in-file)
    // Jika data baris 10 dan baris 100 punya ID sama, kita ambil baris 100.
    map.set(uniqueVal, record)
  })

  return Array.from(map.values())
}
