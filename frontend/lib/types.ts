export interface User {
  id: string
  username: string
  name: string
}

export interface SungerTuru {
  id: string
  ad: string
  sku: string
  birim: string
  kritikStok: number
  dansite?: string
  sertlik?: string
  olcu?: string
}

export interface StokHareket {
  id: string
  sungerId: string
  tip: "giris" | "cikis"
  miktar: number
  tarih: string
  aciklama?: string
  kullanimAmaci?: string
}

export interface StokDurum {
  sungerId: string
  sungerAd: string
  mevcutStok: number
  birim: string
  kritikStok: number
  sonGuncelleme: string
  sonIslemTipi?: "giris" | "cikis"
}
