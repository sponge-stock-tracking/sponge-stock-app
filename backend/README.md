# 🧱 Sponge Stock Backend

**FastAPI + PostgreSQL (Supabase)** tabanlı sünger stok takip sistemi API'sidir.
Frontend (Next.js) ile haberleşerek JWT authentication, stok giriş-çıkış, sünger yönetimi ve raporlama işlemlerini sağlar.

---

## 🚀 Teknoloji Yığını

| Katman            | Teknoloji               |
| ----------------- | ----------------------- |
| Backend Framework | FastAPI                 |
| Veritabanı        | PostgreSQL (Supabase)   |
| ORM               | SQLAlchemy 2.0          |
| Doğrulama         | Pydantic V2             |
| Authentication    | JWT (python-jose)       |
| Password Hashing  | Passlib + bcrypt        |
| Migration         | Alembic                 |
| Test              | Pytest                  |
| Sunucu            | Uvicorn                 |
| Container         | Docker + Docker Compose |

---

## 📁 Klasör Yapısı

```
backend/
├── app/
│   ├── core/              # Yapılandırma ve veritabanı
│   │   ├── config.py      # Ortam değişkenleri yönetimi
│   │   └── database.py    # SQLAlchemy engine ve session
│   ├── models/            # SQLAlchemy ORM modelleri
│   │   ├── users.py       # Kullanıcı tablosu
│   │   ├── sponges.py     # Sünger tablosu
│   │   ├── stocks.py      # Stok hareketleri tablosu
│   │   ├── reports.py     # Raporlar tablosu
│   │   └── refresh_tokens.py  # JWT refresh token tablosu
│   ├── schemas/           # Pydantic şemaları (request/response)
│   │   ├── users_schema.py
│   │   ├── sponge_schema.py
│   │   ├── stock_schema.py
│   │   └── report_schema.py
│   ├── repositories/      # Veritabanı CRUD işlemleri
│   │   ├── base_repository.py
│   │   ├── user_repository.py
│   │   ├── sponge_repository.py
│   │   ├── stock_repository.py
│   │   └── report_repository.py
│   ├── services/          # İş mantığı katmanı
│   │   ├── auth_service.py        # Kimlik doğrulama ve token yönetimi
│   │   ├── sponge_service.py
│   │   ├── stock_service.py
│   │   ├── report_service.py
│   │   └── notification_service.py # E-posta bildirimleri
│   ├── routers/           # FastAPI endpoint'leri
│   │   ├── user_router.py    # /users/* endpoints
│   │   ├── sponge_router.py  # /sponges/* endpoints
│   │   ├── stock_router.py   # /stocks/* endpoints
│   │   └── report_router.py  # /reports/* endpoints
│   ├── utils/             # Yardımcı fonksiyonlar
│   │   └── auth.py        # JWT token ve password helpers
│   └── main.py            # FastAPI uygulama başlangıç noktası
├── migrations/            # Alembic veritabanı migration'ları
│   ├── versions/
│   │   ├── df2255221b3c_initial_schema.py
│   │   ├── 38bef5a6dc74_add_refresh_tokens_and_user_fields.py
│   │   └── 776872298027_create_all_tables.py
│   └── env.py
├── tests/                 # Pytest test dosyaları
│   ├── conftest.py        # Test fixtures
│   ├── test_auth.py       # Kimlik doğrulama testleri
│   ├── test_sponges.py
│   ├── test_stocks.py
│   └── test_reports.py
├── docs/                  # API dokümantasyonu
│   ├── api_endpoints.md
│   ├── database_schema.md
│   └── sponge-stock.postman_collection.json
├── Dockerfile
├── docker-compose.yml (root'ta)
├── requirements.txt
├── alembic.ini
├── .env                   # Ortam değişkenleri (Supabase DB)
└── README.md
```

---

## ⚙️ Kurulum

### Gereksinimler

- Python 3.10+
- Docker & Docker Compose (önerilir)
- PostgreSQL (Supabase kullanılıyor)

### Seçenek 1: Docker ile Kurulum (Önerilir)

1. **Projeyi klonlayın:**

```bash
git clone <repo-url>
cd sponge-stock-app
```

2. **Backend .env dosyasını yapılandırın:**

```bash
cd backend
cp env.example .env
```

**`.env` içeriğini düzenleyin:**

```env
# Supabase PostgreSQL
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]

# JWT
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# APP
APP_NAME=Sponge Stock API
APP_ENV=production
LOG_LEVEL=info

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Mail (Opsiyonel)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
MAIL_FROM=your-email@example.com
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-app-password
```

3. **Docker container'larını başlatın:**

```bash
cd ..  # sponge-stock-app dizinine dönün
docker compose up -d
```

4. **Migration'ları çalıştırın:**

```bash
cd backend
alembic upgrade head
```

5. **API hazır:**
   - Backend: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Frontend: [http://localhost:3000](http://localhost:3000)

### Seçenek 2: Lokal Kurulum (Geliştirme)

1. **Dizine girin:**

```bash
cd backend
```

2. **Virtual environment oluşturun:**

```bash
python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# veya
.venv\Scripts\activate  # Windows
```

3. **Bağımlılıkları yükleyin:**

```bash
pip install -r requirements.txt
```

4. **Bcrypt versiyonunu düzeltin (önemli):**

```bash
pip install 'bcrypt<4.1'
```

5. **.env dosyasını oluşturun:**

```bash
cp env.example .env
# .env dosyasını düzenleyin
```

6. **Migration'ları çalıştırın:**

```bash
alembic upgrade head
```

7. **Geliştirme sunucusunu başlatın:**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 📊 Veritabanı Mimarisi

### Tablolar

1. **users** - Kullanıcı yönetimi

   - Kimlik doğrulama (JWT)
   - Rol tabanlı yetkilendirme (admin, operator, viewer)
   - Bcrypt ile şifrelenmiş parolalar

2. **sponges** - Sünger ürün bilgileri

   - Yoğunluk, sertlik, boyutlar
   - Kritik stok seviyesi

3. **stocks** - Stok hareketleri

   - Giriş (in) ve Çıkış (out) kayıtları
   - Fiyat takibi
   - Kullanıcı bazlı kayıt

4. **reports** - Raporlama sistemi

   - Kritik stok raporları
   - E-posta bildirimleri

5. **refresh_tokens** - JWT token yönetimi
   - Token rotation
   - Güvenli oturum yönetimi

### Migration Yönetimi

Yeni bir migration oluşturmak için:

```bash
alembic revision --autogenerate -m "açıklama"
```

Migration'ı uygulamak için:

```bash
alembic upgrade head
```

Geri almak için:

```bash
alembic downgrade -1
```

---

## 🔐 Kimlik Doğrulama (Authentication)

API, JWT (JSON Web Token) tabanlı kimlik doğrulama kullanır.

### Kullanıcı Kaydı

```bash
POST /users/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "operator"  # admin, operator, viewer
}
```

### Giriş (Login)

```bash
POST /users/login
Content-Type: application/x-www-form-urlencoded

username=john_doe&password=SecurePassword123
```

**Yanıt:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Korumalı Endpoint'lere Erişim

Her istekte `Authorization` header'ı ekleyin:

```bash
GET /users/me
Authorization: Bearer {access_token}
```

### Token Yenileme

```bash
POST /users/refresh
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Çıkış (Logout)

```bash
POST /users/logout
Authorization: Bearer {access_token}
```

---

## 🧪 Test Çalıştırma

### Tüm testleri çalıştır

```bash
pytest -v
```

### Belirli bir test dosyası

```bash
pytest tests/test_auth.py -v
```

### Coverage raporu

```bash
pytest --cov=app --cov-report=html
```

### Test Durumu

- ✅ 18 test başarılı
- ⚠️ 6 test (test_auth.py) - test veritabanı kurulumu gerekiyor

### Test Fixtures

`conftest.py` dosyası:

- SQLite in-memory test veritabanı
- FastAPI test client
- Dependency override mekanizması
- Otomatik tablo oluşturma/temizleme

---

## 🧠 Branch Yönetimi

Backend geliştirme `feature/backend` branch’inde yürütülür.

Yeni bir değiklik yaparken:

```bash
git checkout feature/backend
git pull origin feature/backend
git add .
git commit -m "Yeni model eklendi"
git push origin feature/backend
```

---

## 🛠️ API Örnekleri

### Sünger Yönetimi

**Tüm sünger listesini getir:**

```bash
GET /sponges/
Authorization: Bearer {token}
```

**Belirli bir sünger detayı:**

```bash
GET /sponges/{id}
Authorization: Bearer {token}
```

**Yeni sünger ekle:**

```bash
POST /sponges/
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Yüksek Yoğunluklu Sünger 5cm",
  "density": 30,
  "hardness": "Sert",
  "width": 200,
  "height": 100,
  "thickness": 5,
  "unit": "adet",
  "critical_stock": 50
}
```

**Sünger güncelle:**

```bash
PUT /sponges/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "critical_stock": 100
}
```

**Sünger sil:**

```bash
DELETE /sponges/{id}
Authorization: Bearer {token}
```

### Stok Yönetimi

**Stok girişi:**

```bash
POST /stocks/
Authorization: Bearer {token}
Content-Type: application/json

{
  "sponge_id": 1,
  "quantity": 100,
  "type": "in",
  "price": 15.50,
  "note": "Tedarikçiden alım",
  "date": "2025-12-09"
}
```

**Stok çıkışı:**

```bash
POST /stocks/
Authorization: Bearer {token}
Content-Type: application/json

{
  "sponge_id": 1,
  "quantity": 50,
  "type": "out",
  "note": "Müşteri siparişi",
  "date": "2025-12-09"
}
```

**Tüm stok hareketleri:**

```bash
GET /stocks/
Authorization: Bearer {token}
```

**Belirli süngerin stok geçmişi:**

```bash
GET /stocks/by-sponge/{sponge_id}
Authorization: Bearer {token}
```

### Raporlama

**Kritik stok raporu oluştur:**

```bash
POST /reports/critical-stock
Authorization: Bearer {token}
```

**Tüm raporları listele:**

```bash
GET /reports/
Authorization: Bearer {token}
```

---

## API Testing (Postman)

Postman koleksiyonunu yükleyerek API'yi test edebilirsiniz:

`docs/sponge-stock.postman_collection.json`

---

## 🐛 Sorun Giderme

### Veritabanı Bağlantı Hatası

**Hata:** `SQLALCHEMY_DATABASE_URL connection failed`

**Çözüm:**

- `.env` dosyasındaki `DATABASE_URL` değişkenini kontrol edin
- Supabase bağlantı bilgilerinin doğru olduğundan emin olun
- Supabase projesinin aktif olduğunu doğrulayın

### Tablo Bulunamadı Hatası

**Hata:** `relation "sponges" does not exist`

**Çözüm:**

```bash
cd /home/alfonso/sponge-stock-app/backend
alembic upgrade head
```

### Import Hataları

**Hata:** `ImportError: cannot import name 'JWTClaimsError'`

**Çözüm:**

- `python-jose` kütüphanesi sadece `JWTError` ve `ExpiredSignatureError` export eder
- `JWTClaimsError` kullanımı kaldırılmalıdır

### Bcrypt Uyumluluk Hatası

**Hata:** `ValueError: bcrypt password length`

**Çözüm:**

```bash
pip install 'bcrypt<4.1'
```

### Pydantic Deprecation Uyarıları

**Uyarı:** `PydanticDeprecatedSince20: .dict() is deprecated`

**Çözüm:**

- Pydantic V2'de `.dict()` yerine `.model_dump()` kullanılmalıdır
- Schema'larda `Config` yerine `model_config = ConfigDict()` kullanılmalıdır

### Test Hatası: Database Setup

**Hata:** Test'ler çalışıyor ama 6 test başarısız

**Çözüm:**

- `conftest.py` içinde `db_session` fixture'ında tabloların oluşturulduğundan emin olun
- Test izolasyonu için her testten sonra veritabanı temizlenmelidir

---

## 🚀 Production Deployment

### Docker ile Production

1. **Production .env dosyası hazırlayın:**

```bash
cp env.example .env
# Production değerlerini düzenleyin
```

2. **Docker Compose ile başlatın:**

```bash
docker compose up -d
```

3. **Veritabanı migration'larını uygulayın:**

```bash
docker compose exec backend alembic upgrade head
```

4. **Logları kontrol edin:**

```bash
docker compose logs -f backend
```

### Environment Variables (Production)

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=güçlü_üretim_anahtarı_en_az_32_karakter
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Health Check

```bash
curl http://localhost:8000/
# Yanıt: {"message": "Sponge Stock API"}
```

### API Documentation

Production ortamında API dokümantasyonuna şu adresten ulaşabilirsiniz:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 📚 Ek Kaynaklar

- [FastAPI Dokümantasyonu](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Dokümantasyonu](https://docs.sqlalchemy.org/)
- [Alembic Migrations](https://alembic.sqlalchemy.org/)
- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [Pydantic V2 Migration Guide](https://docs.pydantic.dev/latest/migration/)

---

## 👥 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
