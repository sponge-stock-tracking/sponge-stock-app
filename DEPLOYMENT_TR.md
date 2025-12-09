# 🚀 Deployment Rehberi - Hızlı Başvuru

## 📊 Önerilen Mimari (%100 ÜCRETSİZ)

```
┌─────────────────────────────────────────────────────────┐
│                    DEPLOYMENT STACK                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Frontend (Next.js)  →  Backend (FastAPI)  →  Veritabanı│
│     VERCEL.COM           RENDER.COM          SUPABASE    │
│       ÜCRETSİZ            ÜCRETSİZ           ÜCRETSİZ    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Deployment Sırası

Bu adımları sırasıyla takip edin:

### 1️⃣ Veritabanı Kurulumu (Supabase)

📖 **Rehber:** [SUPABASE_KURULUM.md](SUPABASE_KURULUM.md)

```bash
✅ Supabase projesi oluştur
✅ Bağlantı dizesi al (pooler URL kullan)
✅ Şifreyi güvenli kaydet
```

**Süre:** 5 dakika

---

### 2️⃣ Backend Deployment (Render)

📖 **Rehber:** [DEPLOYMENT.md](DEPLOYMENT.md)

```bash
✅ GitHub'ı Render'a bağla
✅ Web Servisi oluştur (Docker)
✅ Ortam değişkenlerini ekle (özellikle DATABASE_URL)
✅ Backend'i deploy et
✅ Migration'ları çalıştır: alembic upgrade head
```

**Süre:** 10 dakika

---

### 3️⃣ Frontend Deployment (Vercel)

📖 **Rehber:** [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

```bash
✅ GitHub'ı Vercel'e bağla
✅ Root dizinini ayarla: frontend
✅ NEXT_PUBLIC_API_URL ortam değişkeni ekle
✅ Frontend'i deploy et
```

**Süre:** 5 dakika

---

### 4️⃣ Son Yapılandırma

```bash
✅ Backend CORS'a Vercel URL'sini ekle
✅ Tüm endpoint'leri test et
✅ İlk kullanıcıyı oluştur
✅ Tamamlandı! 🎉
```

---

## 🔑 Gerekli Ortam Değişkenleri

### Backend (Render.com)

```bash
DATABASE_URL=postgresql://postgres.[ref]:[sifre]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
SECRET_KEY=<oluştur: python -c "import secrets; print(secrets.token_urlsafe(32))">
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
APP_NAME=Sponge Stock API
APP_ENV=production
LOG_LEVEL=INFO
PYTHONUNBUFFERED=1
CORS_ORIGINS=https://sizin-uygulama.vercel.app,http://localhost:3000
```

### Frontend (Vercel.com)

```bash
NEXT_PUBLIC_API_URL=https://sponge-stock-backend.onrender.com
```

---

## 🛠️ Yardımcı Scriptler

### Ortam Değişkenlerini Oluştur

```bash
./deploy-prepare.sh
```

Bu komut:

- SECRET_KEY oluşturur
- Docker dosyalarını kontrol eder
- Tüm gerekli ortam değişkenlerini gösterir
- Deployment kontrol listesini gösterir

---

## 📚 Detaylı Rehberler

| Bileşen    | Platform | Rehber                                       | Durum    |
| ---------- | -------- | -------------------------------------------- | -------- |
| Veritabanı | Supabase | [SUPABASE_KURULUM.md](SUPABASE_KURULUM.md)   | ✅ Hazır |
| Backend    | Render   | [DEPLOYMENT.md](DEPLOYMENT.md)               | ✅ Hazır |
| Frontend   | Vercel   | [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) | ✅ Hazır |

---

## 💰 Maliyet Dökümü

| Servis       | Ücretsiz Paket      | Limitler                     |
| ------------ | ------------------- | ---------------------------- |
| **Supabase** | ✅ Süresiz Ücretsiz | 500MB DB, 2GB bant genişliği |
| **Render**   | ✅ 750s/ay Ücretsiz | 512MB RAM, 15dk sonra uyur   |
| **Vercel**   | ✅ Süresiz Ücretsiz | Hobi projeleri için sınırsız |

**Toplam Aylık Maliyet: 0₺** 🎉

---

## 🧪 Deployment Testi

Tüm bileşenleri deploy ettikten sonra:

1. **Backend Sağlık Kontrolü:**

   ```
   https://sponge-stock-backend.onrender.com/
   Beklenen: {"message": "Welcome to the Sponge Stock Management API!"}
   ```

2. **API Dokümantasyonu:**

   ```
   https://sponge-stock-backend.onrender.com/docs
   Beklenen: Interaktif Swagger UI
   ```

3. **Frontend:**

   ```
   https://sponge-stock-app.vercel.app
   Beklenen: Login sayfası yüklenir
   ```

4. **Veritabanı (Supabase Dashboard üzerinden):**
   - Supabase'e giriş yap
   - Tabloların oluştuğunu kontrol et (users, sponges, stocks, vb.)
   - Table Editor'de şemayı görmelisin

---

## 🐛 Yaygın Sorunlar ve Çözümler

### 1. Backend veritabanına bağlanamıyor

```
❌ Hata: could not connect to server
✅ Çözüm: DATABASE_URL'nin pooler portunu (6543) kullandığını kontrol et
✅ Supabase projesinin aktif olduğunu doğrula
```

### 2. Frontend boş sayfa gösteriyor

```
❌ Hata: Ağ hatası veya CORS sorunu
✅ Çözüm: Vercel'de NEXT_PUBLIC_API_URL'yi kontrol et
✅ Render'da CORS_ORIGINS'e Vercel URL'sini ekle
```

### 3. Backend çok yavaş yanıt veriyor

```
❌ Hata: Timeout veya çok yavaş yanıt
✅ Çözüm: Render ücretsiz paket 15dk aktivitesizlikten sonra uyur
✅ İlk istek uykudan sonra ~30 saniye sürer (cold start)
✅ UptimeRobot kullanarak uyanık tut
```

### 4. Migration'lar başarısız oluyor

```
❌ Hata: alembic upgrade head başarısız
✅ Çözüm: Migration için direkt bağlantı (port 5432) kullan
✅ Tabloların zaten var olup olmadığını kontrol et
```

---

## 📞 Yardım Alma

1. **Logları kontrol et:**

   - Render: Servis → Logs sekmesi
   - Vercel: Deployment → Function Logs
   - Supabase: Dashboard → Database → Logs

2. **Dokümantasyon:**

   - Her platformun detaylı dökümanları rehberlerde linkli
   - Proje README.md'yi kontrol et

3. **GitHub Issues:**
   - Hata bildir: [github.com/sponge-stock-tracking/sponge-stock-app/issues](https://github.com/sponge-stock-tracking/sponge-stock-app/issues)

---

## ✅ Deployment Kontrol Listesi

Bu listeyi kopyalayıp ilerledikçe işaretle:

```
HAZIRLIK:
[ ] Kod GitHub'a push edildi
[ ] ./deploy-prepare.sh çalıştırıldı
[ ] Oluşturulan SECRET_KEY kaydedildi

VERİTABANI (Supabase):
[ ] Hesap oluşturuldu
[ ] Proje oluşturuldu
[ ] Bağlantı dizesi kaydedildi
[ ] Pooler URL kullanılıyor (port 6543)

BACKEND (Render):
[ ] Hesap oluşturuldu
[ ] Web servisi oluşturuldu
[ ] Tüm ortam değişkenleri eklendi
[ ] Deployment başarılı
[ ] Migration'lar çalıştırıldı (alembic upgrade head)
[ ] /docs endpoint çalışıyor

FRONTEND (Vercel):
[ ] Hesap oluşturuldu
[ ] Proje import edildi
[ ] Root dizin 'frontend' olarak ayarlandı
[ ] NEXT_PUBLIC_API_URL yapılandırıldı
[ ] Deployment başarılı
[ ] Site tarayıcıda yükleniyor

SON:
[ ] Login uçtan uca çalışıyor
[ ] Sünger türleri oluşturulabiliyor
[ ] Stok hareketleri eklenebiliyor
[ ] Backend CORS'da Vercel URL'si var
[ ] Tüm özellikler test edildi
[ ] 🎉 TAMAMLANDI!
```

---

## 🎯 Sırada Ne Var?

Başarılı deployment'tan sonra:

1. **Admin Kullanıcısı Oluştur** (API veya Supabase dashboard'dan)
2. **İlk Verileri Ekle** (sünger türleri, vb.)
3. **URL'yi Paylaş** ekibinle
4. **Logları İzle** ve performansı takip et
5. **Özel Domain Ayarla** (opsiyonel)
6. **Yedekleri Aktifleştir** Supabase'de

---

## 📖 Ek Kaynaklar

- [Render Dokümantasyonu](https://render.com/docs)
- [Vercel Dokümantasyonu](https://vercel.com/docs)
- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [FastAPI Dokümantasyonu](https://fastapi.tiangolo.com)
- [Next.js Dokümantasyonu](https://nextjs.org/docs)

---

**Deployment'iniz için başarılar! 🚀**

_Son güncelleme: Aralık 2025_
