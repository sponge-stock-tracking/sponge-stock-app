# Supabase PostgreSQL Kurulum Rehberi

## 🐘 Supabase Veritabanı Yapılandırması

### 1. Supabase Projesi Oluştur

1. [supabase.com](https://supabase.com) adresine git
2. GitHub ile kayıt ol/giriş yap
3. Yeni Proje Oluştur:
   - **İsim:** sponge-stock-db
   - **Veritabanı Şifresi:** (Güçlü şifre oluştur)
   - **Bölge:** Europe (Central EU) - size en yakın
   - **Fiyatlandırma Planı:** Ücretsiz paket

### 2. Veritabanı Bağlantı Dizesini Al

1. **Proje Ayarları** (⚙️ ikonu) bölümüne git
2. **Database** bölümüne tıkla
3. **Connection string** kısmına inin
4. **URI** sekmesini seç
5. Bağlantı dizesini kopyala (şu şekilde görünür):

```
postgresql://postgres.[PROJE-REF]:[SİFRENİZ]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Önemli:** `[SİFRENİZ]` kısmını proje oluştururken belirlediğiniz gerçek şifre ile değiştirin!

### 3. Connection Pooler vs Direkt Bağlantı

Supabase iki bağlantı yöntemi sunar:

#### 🔹 Connection Pooler (Serverless için Önerilir)

```
Host: aws-0-[bolge].pooler.supabase.com
Port: 6543
Mod: Transaction
```

**Kullanım:** Render, Vercel, Lambda, serverless ortamlar

#### 🔹 Direkt Bağlantı

```
Host: db.[proje-ref].supabase.co
Port: 5432
Mod: Session
```

**Kullanım:** Uzun süreli serverlar, migration'lar

### 4. Örnek Bağlantı Dizeleri

**Render Backend için (Pooler Kullan):**

```
postgresql://postgres.abcdefghijklmnop:sizin-sifreniz@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Lokal Migration'lar için (Direkt Kullan):**

```
postgresql://postgres.abcdefghijklmnop:sizin-sifreniz@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## 🔧 Render'da Backend Yapılandırması

### Render Dashboard'da Ortam Değişkenleri:

```bash
DATABASE_URL=postgresql://postgres.[PROJE-REF]:[ŞİFRE]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
SECRET_KEY=<Render tarafından otomatik oluşturulacak>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
APP_NAME=Sponge Stock API
APP_ENV=production
LOG_LEVEL=INFO
PYTHONUNBUFFERED=1
CORS_ORIGINS=https://sponge-stock-app.vercel.app,http://localhost:3000
```

---

## 🚀 Veritabanı Migration'larını Çalıştır

### Seçenek 1: Lokal Makineden

```bash
# Ortam değişkenini ayarla
export DATABASE_URL="postgresql://postgres.[REF]:[ŞİFRE]@db.[REF].supabase.co:5432/postgres"

# Migration'ları çalıştır
cd backend
alembic upgrade head
```

### Seçenek 2: Render Shell'den

1. Render servisinize gidin
2. **Shell** sekmesine tıklayın
3. Çalıştırın:

```bash
alembic upgrade head
```

---

## 🔐 Supabase'de Güvenlik Ayarları

### 1. Connection Pooling'i Etkinleştir

Varsayılan olarak zaten etkin ✅

### 2. IP Kısıtlamalarını Yapılandır (Opsiyonel)

Supabase Dashboard'da:

- Settings → Database → Connection Pooling
- Gerekirse Render IP aralıklarını ekle (genellikle gerekmez)

### 3. SSL Modu

Supabase varsayılan olarak SSL zorunlu kılar ✅

---

## 📊 Veritabanı Yönetimi

### Supabase Dashboard Özellikleri:

1. **Table Editor** - Verileri görsel olarak görüntüle/düzenle
2. **SQL Editor** - Özel sorgular çalıştır
3. **Database** - Şemaları, trigger'ları, fonksiyonları yönet
4. **API** - Otomatik oluşturulan REST & GraphQL API'leri (opsiyonel)
5. **Logs** - Sorgu performans izleme

---

## 🧪 Bağlantıyı Test Et

### Backend Shell'den (Render):

```bash
python -c "from app.core.database import engine; print(engine.connect())"
```

Beklenen çıktı: `<Connection object>`

### Lokal'den:

```bash
cd backend
python -c "from app.core.database import engine; engine.connect(); print('✅ Bağlantı başarılı!')"
```

---

## 📝 Veritabanı Şeması

Alembic migration'larınız şu tabloları oluşturacak:

- `users` - Kullanıcı hesapları
- `sponges` - Sünger türleri
- `stocks` - Stok hareketleri
- `reports` - Oluşturulan raporlar
- `notifications` - Kullanıcı bildirimleri
- `refresh_tokens` - JWT refresh token'ları

---

## 💡 Supabase Ücretsiz Paket Limitleri

✅ **Ücretsiz Pakete Dahil:**

- 500 MB veritabanı alanı
- 1 GB dosya depolama
- Ayda 2 GB bant genişliği
- Sınırsız API istekleri
- 50,000 aylık aktif kullanıcı
- 7 günlük log saklama

**Projeniz için mükemmel!** 🎉

---

## 🐛 Sorun Giderme

### Bağlantı Reddedildi

- ✅ Şifrenin doğru olduğunu kontrol et
- ✅ Render için **pooler** URL kullan
- ✅ Projenin duraklatılmadığını doğrula

### SSL Gerekli Hatası

Bağlantı dizesine `?sslmode=require` ekle:

```
postgresql://...postgres?sslmode=require
```

### Çok Fazla Bağlantı

- **Connection pooler** URL'sine geç (port 6543)
- Transaction modu kullan

### Migration'lar Başarısız

- Migration'lar için **direkt bağlantı** kullan (port 5432)
- Tabloların zaten var olup olmadığını kontrol et

---

## 🔄 Yedekleme & Geri Yükleme

### Otomatik Yedeklemeler

Supabase ücretsiz paket içerir:

- Günlük yedeklemeler (7 günlük saklama)
- Zaman içinde geri yükleme (point-in-time recovery)

### Manuel Yedekleme

```bash
pg_dump "postgresql://postgres.[REF]:[ŞİFRE]@db.[REF].supabase.co:5432/postgres" > yedek.sql
```

### Geri Yükleme

```bash
psql "postgresql://postgres.[REF]:[ŞİFRE]@db.[REF].supabase.co:5432/postgres" < yedek.sql
```

---

## 📋 Deployment Kontrol Listesi

- [ ] Supabase projesi oluşturuldu
- [ ] Veritabanı şifresi güvenli kaydedildi
- [ ] Bağlantı dizesi (pooler) kopyalandı
- [ ] Render'a DATABASE_URL eklendi
- [ ] Migration'lar başarıyla çalıştırıldı
- [ ] Bağlantı testi çalışıyor
- [ ] CORS_ORIGINS Vercel URL'sini içeriyor
- [ ] Backend Render'da deploy edildi
- [ ] Frontend Vercel'de deploy edildi
- [ ] Uçtan uca test başarılı

---

## 🎯 Son Mimari

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │
│  Next.js        │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Render         │
│  (Backend)      │
│  FastAPI        │
└────────┬────────┘
         │ PostgreSQL
         │ Connection Pool
         ▼
┌─────────────────┐
│  Supabase       │
│  (Veritabanı)   │
│  PostgreSQL     │
└─────────────────┘
```

**Hepsi ÜCRETSİZ!** 🎉

---

## 🆘 Destek

- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/sponge-stock-tracking/sponge-stock-app/issues)

Başarılar! 🚀
