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

## 📦 1. Sünger Yönetimi (`/api/v1/sponges`)

Sistem üzerindeki tüm sünger türlerinin CRUD işlemleri.

### 🔹 `GET /api/v1/sponges/`

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

### 🔹 `GET /api/v1/sponges/{id}`

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

### 🔹 `POST /api/v1/sponges/` 🔒 _(admin/operator)_

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

### 🔹 `PUT /api/v1/sponges/{id}` 🔒 _(admin/operator)_

Var olan sünger türünü günceller.

**İstek Gövdesi:**

```json
{
  "critical_stock": 30
}
```

---

### 🔹 `DELETE /api/v1/sponges/{id}` 🔒 _(admin)_

Sünger türünü sistemden siler. Silme işlemi loglanır.

---

### 🔹 `GET /api/v1/sponges/{id}/summary`

Tek bir sünger türü için genel özet döner.

**Yanıt:**

```json
{
  "sponge": { "id": 1, "name": "Yumuşak 10cm" },
  "total_in": 400,
  "total_out": 350,
  "available": 50,
  "last_transaction": "2025-12-03T18:00:00"
}
```

---

## 📊 2. Stok Yönetimi (`/api/v1/stocks`)

Stok giriş-çıkış işlemleri, fiyat takibi ve stok analizi.

### 🔹 `GET /api/v1/stocks/`

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

### 🔹 `POST /api/v1/stocks/` 🔒 _(operator)_

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

### 🔹 `GET /api/v1/stocks/summary`

Tüm sünger türleri için toplam stok miktarlarını listeler.

---

### 🔹 `GET /api/v1/stocks/critical?limit=20`

Kritik stok seviyesinin altına düşen ürünleri getirir (opsiyonel limit parametresiyle).

---

### 🔹 `GET /api/v1/stocks/by_date?start=YYYY-MM-DD&end=YYYY-MM-DD&sort=asc|desc`

Belirli tarih aralığındaki stok hareketlerini listeler.

---

## 👥 3. Kullanıcı Yönetimi (`/api/v1/users`)

### 🔹 `POST /api/v1/users/register`

Yeni kullanıcı oluşturur. Sadece admin tarafından çağrılabilir.

### 🔹 `POST /api/v1/users/login`

JWT token üretir.

### 🔹 `GET /api/v1/users/me` 🔒

Aktif kullanıcı bilgisini döner.

### 🔹 `PUT /api/v1/users/{id}/role` 🔒 _(admin)_

Kullanıcının rolünü günceller.

### 🔹 `DELETE /api/v1/users/{id}` 🔒 _(admin)_

Kullanıcıyı sistemden siler.

---

## 📈 4. Raporlama (`/api/v1/reports`)

### 🔹 `GET /api/v1/reports/weekly?start=2025-12-01&end=2025-12-07`

Son 7 güne ait stok değişim raporu döner.

### 🔹 `GET /api/v1/reports/monthly`

Aylık stok hareketi.

### 🔹 `GET /api/v1/reports/critical`

Kritik stokta olan ürünlerin uyarı raporu.

### 🔹 `POST /api/v1/reports/export` 🔒 _(admin)_

Raporları PDF veya CSV formatında dışa aktarır.

---

## 📨 5. Bildirim Sistemi (`/api/v1/notifications`)

### 🔹 `POST /api/v1/notifications/send` 🔒 _(admin)_

Kritik stok için e-posta bildirimi gönderir.

**İstek Gövdesi:**

```json
{
  "email": "admin@factory.com",
  "subject": "Kritik Stok Uyarısı",
  "message": "A18-Yumuşak stok seviyesi 5 m³ altında.",
  "mode": "auto",
  "threshold": 10
}
```

---

## 🧩 6. Sistem & Sağlık Durumu (`/api/v1/system`)

### 🔹 `GET /api/v1/health`

Sistemin genel durumunu döner.

```json
{
  "status": "ok",
  "db": "connected"
}
```

### 🔹 `GET /api/v1/logs?limit=50`

Son işlemleri listeler (sadece admin).

---

## ⚙️ Genel API Standartları

| Özellik              | Açıklama                         |
| -------------------- | -------------------------------- |
| **Kimlik Doğrulama** | Bearer Token (JWT)               |
| **Yanıt Formatı**    | JSON                             |
| **Hata Durumları**   | 400, 401, 404, 500               |
| **Zaman Formatı**    | ISO 8601 (`YYYY-MM-DDTHH:mm:ss`) |
| **Pagination**       | `?page=1&limit=50` desteklenir   |

---

## 🧪 Test Edilebilir Endpoint Listesi (Postman / Swagger)

| Modül         | Endpoint                     | Test Durumu   |
| ------------- | ---------------------------- | ------------- |
| Sponge        | `/api/v1/sponges/`           | ✅            |
| Stock         | `/api/v1/stocks/summary`     | ✅            |
| Reports       | `/api/v1/reports/weekly`     | 🔄 geliştirme |
| Users         | `/api/v1/users/login`        | ✅            |
| Notifications | `/api/v1/notifications/send` | 🔄 geliştirme |
| System        | `/api/v1/health`             | ✅            |

---

## 🧾 Versiyonlama Notu

Tüm endpointler `v1` altında toplanmıştır.
Örneğin:

```
/api/v1/sponges/
/api/v1/stocks/
```

Bu yapı, ileride `v2` sürümüne geçildiğinde geriye dönük uyumluluk sağlar.
