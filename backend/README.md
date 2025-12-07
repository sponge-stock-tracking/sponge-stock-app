# 🧱 Sponge Stock Backend

**FastAPI + PostgreSQL** tabanlı sünger stok takip sistemi API’sidir.
Frontend (Next.js) ile haberleşerek stok giriş-çıkış, sünger yönetimi ve raporlama işlemlerini sağlar.

---

## 🚀 Teknoloji Yığını

| Katman            | Teknoloji     |
| ----------------- | ------------- |
| Backend Framework | FastAPI       |
| Veritabanı        | PostgreSQL    |
| ORM               | SQLAlchemy    |
| Doğrulama         | Pydantic      |
| Ortam Yönetimi    | Python Dotenv |
| Test              | Pytest        |
| Migration         | Alembic       |
| Sunucu            | Uvicorn       |

---

## 📁 Klasör Yapısı

```
backend/
├── app/
│   ├── core/          # config, database, güvenlik
│   ├── models/        # veritabanı tabloları
│   ├── schemas/       # Pydantic modelleri
│   ├── repositories/  # CRUD işlemleri
│   ├── services/      # iş mantığı
│   ├── routers/       # API uç noktaları
│   ├── utils/         # yardımcı araçlar
│   └── main.py        # uygulama başlangıç noktası
├── tests/             # birim testler
├── requirements.txt
└── README.md
```

---

## ⚙️ Kurulum (Linux / WSL)

1. **Dizine girin:**

```bash
cd backend
```

2. **Sanal ortam oluşturun:**

```bash
python3 -m venv venv
source venv/bin/activate
```

3. **Bağımlılıkları yükleyin:**

```bash
pip install -r requirements.txt
```

4. **.env dosyasını oluşturun:**

```bash
cp .env.example .env
```

**İçeriği:**

```
DATABASE_URL=postgresql://postgres:------@localhost/sponge_stock_db
```

---

## 📄 Veritabanı Kurulumu

1. PostgreSQL çalıştığından emin olun:

```bash
sudo service postgresql start
```

2. Veritabanını oluşturun:

```bash
createdb sponge_stock_db
```

3. Migration çalıştırın:

```bash
alembic upgrade head
```

---

## 🧩 API’yi Başlatma

```bash
uvicorn app.main:app --reload
```

Tarayıcıda:
👉 [http://localhost:8000/docs](http://localhost:8000/docs)

(OpenAPI arayüzü)

---

## 🧪 Test Çalıştırma

```bash
pytest -v
```

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

### Sünger Listeleme

```
GET /sponges/
```

### Yeni Sünger Ekleme

```
POST /sponges/
{
  "name": "Yüksek Yoğunluklu Sünger 5cm",
  "density": 30,
  "hardness": "Sert",
  "unit": "adet",
  "critical_stock": 50
}
```

### Stok Girişi

```
POST /stocks/
{
  "sponge_id": 1,
  "quantity": 100,
  "type": "in",
  "note": "Tedarik teslimatı"
}
```

---

## API Testing (Postman)

Postman koleksiyonunu yükleyerek API'yi test edebilirsiniz:

`docs/sponge-stock.postman_collection.json`
