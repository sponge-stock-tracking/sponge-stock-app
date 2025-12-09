# 🧭 API Uç Noktaları Dökümantasyonu

**Proje:** Sünger Stok Takip Sistemi (FastAPI Backend)
**Versiyon:** v1.0.0
**Sunucu:** `http://localhost:8000`

---

## 🔐 Kimlik Doğrulama Gereksinimi

| Rol        | Açıklama                                 |
| ---------- | ---------------------------------------- |
| `admin`    | Tüm işlemler, kullanıcı ve stok yönetimi |
| `operator` | Sünger ve stok işlemleri                 |
| `viewer`   | Sadece görüntüleme ve rapor erişimi      |

JWT Token gerektiren uç noktalar `🔒` simgesiyle işaretlenmiştir.
Swagger arayüzünden (`/docs`) test edilebilir.

---

## 📦 1. Sünger Yönetimi (`/sponges`)

Sistem üzerindeki tüm sünger türlerinin CRUD işlemleri.

### 🔹 `GET /sponges/`

Tüm sünger türlerini listeler.

**Yanıt:**

```json
[
  {
    "id": 1,
    "name": "Yüksek Yoğunluklu Sünger 5cm",
    "density": 30,
    "hardness": "Sert",
    "unit": "m3",
    "critical_stock": 20
  }
]
```

---

### 🔹 `GET /sponges/{id}`

Belirli bir sünger türünü getirir.

**Yanıt:**

```json
{
  "id": 2,
  "name": "Orta Yoğunluklu Sünger",
  "density": 25,
  "hardness": "Standart",
  "unit": "adet",
  "critical_stock": 50
}
```

---

### 🔹 `POST /sponges/` 🔒 _(admin/operator)_

Yeni sünger türü oluşturur.

**İstek Gövdesi:**

```json
{
  "name": "Yumuşak Sünger 10cm",
  "density": 18,
  "hardness": "Yumuşak",
  "unit": "m3",
  "critical_stock": 40
}
```

---

### 🔹 `PUT /sponges/{id}` 🔒 _(admin/operator)_

Var olan sünger türünü günceller.

**İstek Gövdesi:**

```json
{
  "critical_stock": 30
}
```

---

### 🔹 `DELETE /sponges/{id}` 🔒 _(admin)_

Sünger türünü sistemden siler. Silme işlemi loglanır.

---

## 📊 2. Stok Yönetimi (`/stocks`)

Stok giriş-çıkış işlemleri, fiyat takibi ve stok analizi.

> **Not:** Static endpoint'ler (summary, by_date, status, total) her zaman dynamic route'lardan (`/{stock_id}`) önce tanımlanmıştır.

### 🔹 `GET /stocks/summary`

Tüm sünger türleri için toplam stok miktarlarını listeler.

**Yanıt:**

```json
[
  {
    "sponge_id": 1,
    "sponge_name": "Yüksek Yoğunluklu Sünger",
    "total_stock": 45
  }
]
```

---

### 🔹 `GET /stocks/by_date?start=YYYY-MM-DD&end=YYYY-MM-DD`

Belirli tarih aralığındaki stok hareketlerini listeler.

**Parametreler:**

- `start`: Başlangıç tarihi (YYYY-MM-DD, zorunlu)
- `end`: Bitiş tarihi (YYYY-MM-DD, zorunlu)

**Yanıt:**

```json
[
  {
    "id": 1,
    "sponge_id": 2,
    "quantity": 150,
    "type": "in",
    "price_in": 250.5,
    "price_out": null,
    "note": "Yeni tedarik",
    "date": "2025-12-05T10:34:00"
  }
]
```

---

### 🔹 `GET /stocks/{sponge_id}/status`

Belirli bir sünger için stok durumunu ve kritik stok uyarısını döner.

**Yanıt:**

```json
{
  "sponge_id": 1,
  "total": 45,
  "critical": true
}
```

---

### 🔹 `GET /stocks/{sponge_id}/total`

Belirli bir sünger için toplam stok miktarını hesaplar (giriş + iade - çıkış).

**Yanıt:**

```json
{
  "sponge_id": 1,
  "total": 45
}
```

---

### 🔹 `GET /stocks/`

Tüm stok hareketlerini listeler.

**Yanıt:**

```json
[
  {
    "id": 1,
    "sponge_id": 2,
    "quantity": 150,
    "type": "in",
    "price_in": 250.5,
    "price_out": null,
    "note": "Yeni tedarik",
    "date": "2025-12-05T10:34:00"
  }
]
```

---

### 🔹 `GET /stocks/{stock_id}`

Belirli bir stok hareketini getirir.

**Yanıt:**

```json
{
  "id": 1,
  "sponge_id": 2,
  "quantity": 150,
  "type": "in",
  "price_in": 250.5,
  "price_out": null,
  "note": "Yeni tedarik",
  "date": "2025-12-05T10:34:00"
}
```

---

### 🔹 `POST /stocks/` 🔒 _(operator)_

Yeni stok hareketi ekler (giriş, çıkış veya iade).

**İstek Gövdesi:**

```json
{
  "sponge_id": 2,
  "quantity": 100,
  "type": "out",
  "note": "Üretim hattına verildi",
  "price_in": 250.5,
  "price_out": 300.0
}
```

---

### 🔹 `DELETE /stocks/{stock_id}` 🔒 _(admin)_

Belirli bir stok kaydını siler.

**Yanıt:**

```json
{
  "message": "Stock record deleted successfully"
}
```

---

## 👥 3. Kullanıcı Yönetimi (`/users`)

### 🔹 `POST /users/register`

Yeni kullanıcı oluşturur.

**İstek Gövdesi:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "operator"
}
```

**Yanıt:**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "operator"
}
```

---

### 🔹 `POST /users/login`

JWT token üretir.

**İstek Gövdesi (form-data):**

```
grant_type=
username=john_doe
password=SecurePassword123
```

**Yanıt:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### 🔹 `POST /users/refresh`

Refresh token kullanarak yeni access token üretir.

**İstek Gövdesi:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🔹 `POST /users/logout` 🔒

Kullanıcının tüm refresh token'larını iptal eder.

---

### 🔹 `GET /users/me` 🔒

Aktif kullanıcı bilgisini döner.

**Yanıt:**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "operator"
}
```

---

## 📈 4. Raporlama (`/reports`)

### 🔹 `GET /reports/weekly`

Son 7 güne ait stok değişim raporu döner.

**Yanıt:**

```json
{
  "period": "weekly",
  "data": [...]
}
```

---

### 🔹 `GET /reports/monthly`

İçinde bulunulan aya ait stok hareketleri.

**Yanıt:**

```json
{
  "period": "monthly",
  "data": [...]
}
```

---

### 🔹 `GET /reports/critical?notify=false`

Kritik stokta olan ürünlerin uyarı raporu.

**Parametreler:**

- `notify`: E-posta bildirimi gönderilsin mi? (default: false)

**Yanıt:**

```json
[
  {
    "sponge_id": 1,
    "name": "Yumuşak Sünger 10cm",
    "current_stock": 15,
    "critical_stock": 50,
    "status": "critical"
  }
]
```

---

## ⚙️ Genel API Standartları

| Özellik              | Açıklama                         |
| -------------------- | -------------------------------- |
| **Kimlik Doğrulama** | Bearer Token (JWT)               |
| **Yanıt Formatı**    | JSON                             |
| **Hata Durumları**   | 400, 401, 404, 409, 500          |
| **Zaman Formatı**    | ISO 8601 (`YYYY-MM-DDTHH:mm:ss`) |
| **Base URL**         | `http://localhost:8000`          |

---

## 🧪 Test Edilebilir Endpoint Listesi (Postman / Swagger)

| Modül   | Endpoint              | Test Durumu |
| ------- | --------------------- | ----------- |
| Sponge  | `/sponges/`           | ✅          |
| Stock   | `/stocks/summary`     | ✅          |
| Stock   | `/stocks/{id}/status` | ✅          |
| Reports | `/reports/weekly`     | ✅          |
| Reports | `/reports/critical`   | ✅          |
| Users   | `/users/login`        | ✅          |
| Users   | `/users/register`     | ✅          |
| Users   | `/users/refresh`      | ✅          |

---

## 🧾 API Erişimi

Tüm endpoint'ler doğrudan root path altındadır:

```
http://localhost:8000/sponges/
http://localhost:8000/stocks/
http://localhost:8000/users/login
http://localhost:8000/reports/critical
```

**Swagger UI:** `http://localhost:8000/docs`  
**ReDoc:** `http://localhost:8000/redoc`

İleride versiyonlama gerekirse `/api/v1` prefix'i eklenebilir.
