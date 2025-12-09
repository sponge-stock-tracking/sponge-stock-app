# Render.com Deployment Rehberi

## 🚀 Hızlı Deployment Adımları

### 1. Ön Gereksinimler

- GitHub repository: `sponge-stock-tracking/sponge-stock-app`
- Supabase hesabı ve PostgreSQL veritabanı ([SUPABASE_KURULUM.md](SUPABASE_KURULUM.md) dosyasına bakın)
- Render.com hesabı (GitHub ile kayıt olun)
- Frontend için Vercel hesabı ([VERCEL_DEPLOYMENT_TR.md](VERCEL_DEPLOYMENT_TR.md) dosyasına bakın)

---

## 📊 Mimari Genel Bakış

```
Frontend (Vercel) → Backend (Render) → Veritabanı (Supabase)
   Next.js            FastAPI            PostgreSQL
   ÜCRETSİZ          ÜCRETSİZ            ÜCRETSİZ
```

---

### 2. Önce Supabase Veritabanını Kurun

⚠️ **Önemli:** Render'a deploy etmeden önce Supabase veritabanını oluşturun!

1. [supabase.com](https://supabase.com) adresine gidin
2. Yeni proje oluşturun (ücretsiz paket)
3. Bağlantı dizgisini alın: Project Settings → Database → Connection string (URI)
4. Render için **Connection Pooler** URL'sini kullanın (port 6543)

**Detaylı rehber:** [SUPABASE_KURULUM.md](SUPABASE_KURULUM.md) dosyasına bakın

---

### 3. Backend'i Render'a Deploy Et

#### Seçenek A: render.yaml Kullanarak (Otomatik) ⭐ ÖNERİLEN

1. [Render Dashboard](https://dashboard.render.com) adresine gidin
2. **New** → **Blueprint** seçeneğine tıklayın
3. GitHub repository'nizi bağlayın: `sponge-stock-tracking/sponge-stock-app`
4. Render otomatik olarak `render.yaml` dosyasını algılayacak
5. **Ortam Değişkenlerini Ekleyin:**
   - `DATABASE_URL` - Supabase bağlantı dizginiz
   - Diğer değişkenler otomatik yapılandırılacak
6. Backend servisini oluşturmak için **Apply** butonuna tıklayın

#### Seçenek B: Manuel Kurulum

1. **Backend Servisi Oluştur**

   - Dashboard → New → Web Service
   - Repository'yi bağla: `sponge-stock-tracking/sponge-stock-app`
   - İsim: `sponge-stock-backend`
   - Bölge: Frankfurt (Türkiye/Avrupa'ya en yakın)
   - Branch: `main` (veya `feature/backend`)
   - Root Directory: `backend`
   - Runtime: Docker
   - Plan: Free

   **Ortam Değişkenleri:**

   ```bash
   # Supabase Veritabanı (ZORUNLU)
   DATABASE_URL=postgresql://postgres.[SİZİN-REF]:[ŞİFRE]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

   # JWT Authentication
   SECRET_KEY=<deploy-prepare.sh'den oluşturulan anahtarı kullan>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7

   # Uygulama
   APP_NAME=Sponge Stock API
   APP_ENV=production
   LOG_LEVEL=INFO
   PYTHONUNBUFFERED=1

   # CORS - Vercel URL'nizle güncelleyin
   CORS_ORIGINS=https://sponge-stock-app.vercel.app,http://localhost:3000
   ```

   - **Create Web Service** butonuna tıklayın

2. **Veritabanı Migration'larını Çalıştır**
   - Deployment tamamlandıktan sonra
   - Backend servisi → **Shell** sekmesine gidin
   - Çalıştırın:
   ```bash
   alembic upgrade head
   ```

---

### 4. Frontend'i Vercel'e Deploy Et

⚠️ **Frontend Vercel'de deploy edilir, Render'da DEĞİL!** (Ücretsiz paket optimizasyonu)

Detaylı rehber: [VERCEL_DEPLOYMENT_TR.md](VERCEL_DEPLOYMENT_TR.md)

**Hızlı adımlar:**

1. [vercel.com](https://vercel.com) adresine gidin
2. New Project → GitHub repo'yu içe aktarın
3. Root Directory: `frontend`
4. Ortam değişkeni ekleyin:
   ```
   NEXT_PUBLIC_API_URL=https://sponge-stock-backend.onrender.com
   ```
5. Deploy edin!

---

### 5. Backend CORS'u Güncelle

Frontend'i Vercel'e deploy ettikten sonra:

1. Vercel URL'nizi alın (örn: `https://sponge-stock-app.vercel.app`)
2. Render backend'de `CORS_ORIGINS`'i güncelleyin:
   ```
   CORS_ORIGINS=https://sponge-stock-app.vercel.app,http://localhost:3000
   ```
3. Gerekirse backend'i yeniden deploy edin

---

### 6. Özel Domain (Opsiyonel)

- Settings → Custom Domain bölümüne gidin
- Domain'inizi ekleyin
- DNS kayıtlarınızı güncelleyin

---

## 🔧 Yapılandırma Dosyaları Hazır

### ✅ Backend Dockerfile

- Konum: `backend/Dockerfile`
- Production için yapılandırılmış

### ✅ Frontend Dockerfile

- Konum: `frontend/Dockerfile`
- pnpm desteği eklenmiş

### ✅ Ortam Değişkenleri

- Backend `.env.example` sağlanmış
- Render dashboard'da değerleri güncelleyin

---

## 📊 Deployment Maliyetleri

### ✅ %100 ÜCRETSİZ Kurulum:

| Servis     | Platform   | Maliyet | Neler Dahil                         |
| ---------- | ---------- | ------- | ----------------------------------- |
| Backend    | Render.com | **0₺**  | 750 saat/ay, Otomatik SSL           |
| Frontend   | Vercel.com | **0₺**  | Sınırsız bant genişliği, Global CDN |
| Veritabanı | Supabase   | **0₺**  | 500MB depolama, 2GB bant genişliği  |

**Toplam Aylık Maliyet: 0₺** 🎉

### Sınırlamalar:

#### Render.com (Backend):

- ⚠️ Servisler 15 dk hareketsizlikten sonra uyur
- ⚠️ Cold start: ~30 saniye
- ⚠️ 512 MB RAM

#### Supabase (Veritabanı):

- ⚠️ 500 MB veritabanı depolama
- ⚠️ 2 GB bant genişliği/ay
- ⚠️ 7 gün log saklama

#### Vercel (Frontend):

- ✅ Bu proje boyutu için önemli bir sınırlama yok!

---

## 🔐 SECRET_KEY Oluştur

Güvenli bir secret key oluşturmak için şunu çalıştırın:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Veya yardımcı scripti kullanın:

```bash
./deploy-prepare.sh
```

Veya önceden oluşturulmuş bu anahtarı kullanın (production'da değiştirin):

```
your-secret-key-here-change-this-in-production-32chars
```

---

## 🧪 Deployment'ı Test Et

Deployment sonrası bu endpoint'leri test edin:

1. **Backend Health Check:**

   ```
   https://sponge-stock-backend.onrender.com/
   ```

2. **API Dokümantasyonu:**

   ```
   https://sponge-stock-backend.onrender.com/docs
   ```

3. **Frontend Uygulaması:**

   ```
   https://sponge-stock-app.vercel.app
   ```

4. **Supabase Veritabanı:**
   - Supabase dashboard'a giriş yapın
   - Migration'lar tarafından oluşturulan tabloları kontrol edin
   - Table Editor'da verileri görüntüleyin

---

## 🐛 Sorun Giderme

### Veritabanı Bağlantı Sorunları

**Problem:** Backend Supabase'e bağlanamıyor

**Çözümler:**

- ✅ DATABASE_URL formatının doğru olduğunu doğrulayın
- ✅ Direkt bağlantı değil **Connection Pooler** URL'sini kullanın (port 6543)
- ✅ Şifrede escape gerektiren özel karakterler olmadığını kontrol edin
- ✅ Supabase projesinin duraklatılmadığından emin olun
- ✅ Bağlantı dizgisine `?sslmode=require` eklemeyi deneyin

**Doğru format örneği:**

```
postgresql://postgres.abcdef:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### Migration Hataları

**Problem:** `alembic upgrade head` başarısız oluyor

**Çözümler:**

- ✅ Migration'lar için **direkt bağlantı** kullanın (port 5432)
- ✅ Supabase'de tabloların zaten var olup olmadığını kontrol edin
- ✅ alembic_version tablosunun var olduğunu doğrulayın
- ✅ Önce migration'ları yerel makineden çalıştırın

### Build Hataları

- Render dashboard'daki logları kontrol edin
- Dockerfile path'lerini doğrulayın
- requirements.txt'deki bağımlılıkları kontrol edin

### Frontend Backend'e Bağlanamıyor

**Problem:** CORS hataları veya API istekleri başarısız

**Çözümler:**

- ✅ Vercel ortam değişkenlerinde `NEXT_PUBLIC_API_URL`'yi kontrol edin
- ✅ Backend CORS_ORIGINS'in Vercel URL'sini içerdiğini doğrulayın
- ✅ Backend'in çalıştığından emin olun (uyumadığından)
- ✅ Tam hatayı görmek için tarayıcı konsolunu kontrol edin
- ✅ Önce backend API'yi direkt test edin (/docs'u ziyaret edin)

### Cold Start Sorunları

**Problem:** Backend yanıt vermesi 30+ saniye sürüyor

**Çözümler:**

- ✅ Bu Render ücretsiz paketi için 15 dk hareketsizlikten sonra normal
- ✅ Her 14 dakikada bir backend'e ping atmak için UptimeRobot kullanın
- ✅ Veya ücretli pakete yükseltin (aylık 7$)

---

## 📝 Deployment Sonrası Kontrol Listesi

- [ ] Supabase projesi oluşturuldu
- [ ] Supabase bağlantı dizgisi alındı
- [ ] Backend Render'a deploy edildi
- [ ] Ortam değişkenleri yapılandırıldı
- [ ] Veritabanı migration'ları başarıyla çalıştırıldı
- [ ] Frontend Vercel'e deploy edildi
- [ ] CORS origins güncellendi
- [ ] Test kullanıcısı giriş yapabiliyor
- [ ] İlk sponge tipleri oluşturuldu
- [ ] Stok hareketleri test edildi

---

## 🔄 Otomatik Deploy Kurulumu

Render, GitHub'a push yaptığınızda otomatik olarak deploy eder:

1. `main` branch'e push production deploy tetikler
2. `feature/backend` branch'e push staging tetikler (yapılandırıldıysa)

Otomatik deploy'u devre dışı bırakmak için:

- Service Settings → Build & Deploy → Auto-Deploy: OFF

---

## 💡 Pro İpuçları

1. **Servisleri aktif tutun**: Her 14 dakikada bir ping atmak için UptimeRobot veya benzeri kullanın
2. **Logları izleyin**: Hatalar için Render loglarını kontrol edin
3. **Staging kullanın**: Main'e merge etmeden önce feature branch'de test edin
4. **Veritabanı yedekleri**: Database ayarlarında etkinleştirin

---

## 🆘 Destek

- [Render Dokümantasyonu](https://render.com/docs)
- [Render Community](https://community.render.com)
- GitHub'da proje issue'larını kontrol edin

---

## 🎯 Sonraki Adımlar

1. `feature/backend` branch'ini `main` branch'e merge edin
2. Yukarıdaki deployment adımlarını takip edin
3. Kapsamlı test yapın
4. URL'yi ekibinizle paylaşın!

Başarılar! 🚀
