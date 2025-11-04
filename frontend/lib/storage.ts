import type { SungerTuru, StokHareket, StokDurum } from "./types"

// LocalStorage keys
const KEYS = {
  SUNGER_TURLERI: "sunger_turleri",
  STOK_HAREKETLER: "stok_hareketler",
  USER: "current_user",
}

// Initialize with demo data
export function initializeDemoData() {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem(KEYS.SUNGER_TURLERI)
  if (!existing) {
    const demoSungerler: SungerTuru[] = [
      {
        id: "1",
        ad: "Yüksek Yoğunluklu Sünger 5cm",
        sku: "YYS-5CM-001",
        birim: "adet",
        kritikStok: 50,
        dansite: "35 kg/m³",
        sertlik: "Sert",
        olcu: "200x100x5 cm",
      },
      {
        id: "2",
        ad: "Orta Yoğunluklu Sünger 3cm",
        sku: "OYS-3CM-002",
        birim: "adet",
        kritikStok: 100,
        dansite: "25 kg/m³",
        sertlik: "Orta",
        olcu: "200x100x3 cm",
      },
      {
        id: "3",
        ad: "Düşük Yoğunluklu Sünger 2cm",
        sku: "DYS-2CM-003",
        birim: "adet",
        kritikStok: 75,
        dansite: "18 kg/m³",
        sertlik: "Yumuşak",
        olcu: "200x100x2 cm",
      },
      {
        id: "4",
        ad: "Akustik Sünger Panel",
        sku: "ASP-001",
        birim: "adet",
        kritikStok: 30,
        dansite: "30 kg/m³",
        sertlik: "Orta",
        olcu: "50x50x5 cm",
      },
    ]
    localStorage.setItem(KEYS.SUNGER_TURLERI, JSON.stringify(demoSungerler))

    const demoHareketler: StokHareket[] = [
      {
        id: "1",
        sungerId: "1",
        tip: "giris",
        miktar: 200,
        tarih: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        aciklama: "İlk stok girişi",
      },
      {
        id: "2",
        sungerId: "2",
        tip: "giris",
        miktar: 300,
        tarih: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        aciklama: "İlk stok girişi",
      },
      {
        id: "3",
        sungerId: "1",
        tip: "cikis",
        miktar: 50,
        tarih: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        aciklama: "Müşteri siparişi",
        kullanimAmaci: "Müşteri Teslimatı",
      },
      {
        id: "4",
        sungerId: "3",
        tip: "giris",
        miktar: 150,
        tarih: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        aciklama: "Tedarikçi teslimatı",
      },
      {
        id: "5",
        sungerId: "2",
        tip: "cikis",
        miktar: 80,
        tarih: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        aciklama: "Toptan satış",
        kullanimAmaci: "Üretim Hattı A",
      },
    ]
    localStorage.setItem(KEYS.STOK_HAREKETLER, JSON.stringify(demoHareketler))
  }
}

// Sünger Türleri
export function getSungerTurleri(): SungerTuru[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(KEYS.SUNGER_TURLERI)
  return data ? JSON.parse(data) : []
}

export function saveSungerTuru(sunger: SungerTuru) {
  const sungerler = getSungerTurleri()
  const index = sungerler.findIndex((s) => s.id === sunger.id)
  if (index >= 0) {
    sungerler[index] = sunger
  } else {
    sungerler.push(sunger)
  }
  localStorage.setItem(KEYS.SUNGER_TURLERI, JSON.stringify(sungerler))
}

export function deleteSungerTuru(id: string) {
  const sungerler = getSungerTurleri().filter((s) => s.id !== id)
  localStorage.setItem(KEYS.SUNGER_TURLERI, JSON.stringify(sungerler))
}

export function updateSungerTuru(sunger: SungerTuru) {
  const sungerler = getSungerTurleri()
  const index = sungerler.findIndex((s) => s.id === sunger.id)
  if (index >= 0) {
    sungerler[index] = sunger
    localStorage.setItem(KEYS.SUNGER_TURLERI, JSON.stringify(sungerler))
    return true
  }
  return false
}

// Stok Hareketleri
export function getStokHareketler(): StokHareket[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(KEYS.STOK_HAREKETLER)
  return data ? JSON.parse(data) : []
}

export function saveStokHareket(hareket: StokHareket) {
  const hareketler = getStokHareketler()
  hareketler.push(hareket)
  localStorage.setItem(KEYS.STOK_HAREKETLER, JSON.stringify(hareketler))
}

export function updateStokHareket(hareket: StokHareket) {
  const hareketler = getStokHareketler()
  const index = hareketler.findIndex((h) => h.id === hareket.id)
  if (index >= 0) {
    hareketler[index] = hareket
    localStorage.setItem(KEYS.STOK_HAREKETLER, JSON.stringify(hareketler))
    return true
  }
  return false
}

export function deleteStokHareket(id: string) {
  const hareketler = getStokHareketler().filter((h) => h.id !== id)
  localStorage.setItem(KEYS.STOK_HAREKETLER, JSON.stringify(hareketler))
}

export function getSungerHareketleri(sungerId: string): StokHareket[] {
  return getStokHareketler()
    .filter((h) => h.sungerId === sungerId)
    .sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
}

// Stok Durumu Hesaplama
export function getStokDurumlari(): StokDurum[] {
  const sungerler = getSungerTurleri()
  const hareketler = getStokHareketler()

  return sungerler.map((sunger) => {
    const sungerHareketler = hareketler.filter((h) => h.sungerId === sunger.id)
    const mevcutStok = sungerHareketler.reduce((total, h) => {
      return h.tip === "giris" ? total + h.miktar : total - h.miktar
    }, 0)

    const sonHareket = sungerHareketler.sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())[0]

    return {
      sungerId: sunger.id,
      sungerAd: sunger.ad,
      mevcutStok,
      birim: sunger.birim,
      kritikStok: sunger.kritikStok,
      sonGuncelleme: sonHareket?.tarih || new Date().toISOString(),
      sonIslemTipi: sonHareket?.tip,
    }
  })
}

export function getKritikStoklar(): StokDurum[] {
  return getStokDurumlari().filter((stok) => stok.mevcutStok <= stok.kritikStok)
}
