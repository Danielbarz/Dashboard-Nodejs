export const RSO2_WITELS = ['JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'BALI', 'NUSA TENGGARA']

export const cleanWitelName = (witel) => (witel || '').toUpperCase().replace('WITEL ', '').trim()

export const WITEL_HIERARCHY = {
  'BALI': ['BALI', 'DENPASAR', 'SINGARAJA'],
  'JATIM BARAT': ['JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG'],
  'JATIM TIMUR': ['JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO'],
  'NUSA TENGGARA': ['NUSA TENGGARA', 'NTT', 'NTB'],
  'SURAMADU': ['SURAMADU', 'SURABAYA UTARA', 'SURABAYA SELATAN', 'MADURA']
}

export const findParent = (w) => {
  for (const [p, children] of Object.entries(WITEL_HIERARCHY)) {
    if (children.includes(w)) return p
  }
  return w
}

export const fixCoordinate = (val, isLat) => {
  if (!val) return null
  const c = val.toString().replace(/[^0-9\-.]/g, '')
  if (isNaN(c) || c === '') return null

  let f = parseFloat(c)
  if (f === 0) return null

  let loop = 0
  if (isLat) {
    while ((f < -12 || f > 10) && loop < 15) {
      f /= 10
      loop++
    }
  } else {
    while (Math.abs(f) > 142 && loop < 15) {
      f /= 10
      loop++
    }
  }
  return f
}
