# Vercel Frontend Deployment Rehberi

## 🚀 Frontend'i Vercel'e Deploy Et (Ücretsiz)

### Neden Frontend için Vercel?

- ✅ **%100 Ücretsiz** kişisel projeler için
- ✅ **Next.js için Mükemmel** (Vercel tarafından yapıldı)
- ✅ **Otomatik deployment** GitHub'dan
- ✅ **Global CDN** - süper hızlı
- ✅ **Cold start yok**
- ✅ **Sınırsız bant genişliği**

---

## 📋 Deployment Adımları

### 1. Vercel Hesabı Oluştur

1. [vercel.com](https://vercel.com) adresine git
2. GitHub hesabıyla kayıt ol
3. Vercel'in repository'lerinize erişimini yetkilendir

### 2. Projeyi İçe Aktar

1. **"Add New Project"** (Yeni Proje Ekle) butonuna tıkla
2. Repository'yi seç: `sponge-stock-tracking/sponge-stock-app`
3. Yapılandır:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`

### 3. Ortam Değişkenleri

Vercel dashboard'da ekle:

```
NEXT_PUBLIC_API_URL=https://sponge-stock-backend.onrender.com
```

**Önemli:** Bu değer Render backend URL'niz ile eşleşmeli!

### 4. Deploy Et

1. **"Deploy"** butonuna tıkla
2. ~2-3 dakika bekle
3. Uygulamanız şu adreste yayında olacak: `https://sizin-proje.vercel.app`

---

## 🔧 Özel Domain (Opsiyonel)

1. Project Settings → Domains bölümüne git
2. Domain'inizi ekleyin
3. DNS kayıtlarını güncelleyin:
   ```
   Tip: CNAME
   İsim: www
   Değer: cname.vercel-dns.com
   ```

---

## 🔄 Otomatik Deployment

Vercel otomatik olarak deploy eder:

- **Production:** `main` branch'e push yaptığınızda
- **Preview:** Feature branch'lere push yaptığınızda

---

## 📊 Önerilen Kurulum

### Backend (Render.com - Ücretsiz)

- FastAPI API
- PostgreSQL Veritabanı
- URL: `https://sponge-stock-backend.onrender.com`

### Frontend (Vercel - Ücretsiz)

- Next.js Uygulaması
- URL: `https://sponge-stock-app.vercel.app`

**Toplam Maliyet: 0₺** 🎉

---

## ⚙️ Deployment Sonrası

### Backend CORS'u Güncelle

Vercel'e deploy ettikten sonra, Render'daki backend `.env` dosyasını güncelle:

```
CORS_ORIGINS=https://sponge-stock-app.vercel.app,http://localhost:3000
```

### Test Et

1. Ziyaret et: `https://sponge-stock-app.vercel.app`
2. Test kullanıcı bilgileriyle giriş yap
3. API bağlantısının çalıştığını doğrula

---

## 🐛 Sorun Giderme

### Build Hataları

- Vercel dashboard'daki build loglarını kontrol et
- `pnpm-lock.yaml` dosyasının commit edildiğini doğrula
- `package.json`'da tüm bağımlılıkların olduğundan emin ol

### API Bağlantısı Başarısız

- Vercel ortam değişkenlerinde `NEXT_PUBLIC_API_URL`'yi doğrula
- Backend CORS ayarlarını kontrol et
- Backend'in Render'da çalıştığından emin ol

### Ortam Değişkenleri Çalışmıyor

- Ortam değişkenleri tarayıcıda erişilebilir olması için `NEXT_PUBLIC_` ile başlamalı
- Yeni env var'lar ekledikten sonra yeniden deploy et

---

## 💡 Pro İpuçları

1. **Production Branch Kullan:**

   - `main` → Production deployment
   - `feature/*` → Preview deployment'lar

2. **Preview Deployment'lar:**

   - Her PR için benzersiz bir preview URL'si
   - Merge etmeden önce test için mükemmel

3. **Analytics:**

   - Dashboard'da Vercel Analytics'i etkinleştir
   - Hobi projeleri için ücretsiz

4. **Performans:**
   - Vercel otomatik olarak resimleri optimize eder
   - Global olarak CDN önbellekleme

---

## 📝 Kontrol Listesi

- [ ] Vercel hesabı oluşturuldu
- [ ] Repository bağlandı
- [ ] Root dizin `frontend` olarak ayarlandı
- [ ] Ortam değişkeni eklendi
- [ ] Başarıyla deploy edildi
- [ ] Backend CORS güncellendi
- [ ] Login testi çalışıyor
- [ ] Özel domain eklendi (opsiyonel)

---

## 🎯 Deployment Sonrası Sonraki Adımlar

1. URL'yi ekibinle paylaş
2. Tüm özellikleri test et
3. Vercel dashboard'da logları izle
4. Özel domain ayarla (opsiyonel)
5. Analytics'i etkinleştir (opsiyonel)

Başarılar! 🚀
