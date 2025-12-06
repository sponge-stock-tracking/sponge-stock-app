# 🧱 Database Schema Documentation

**Proje:** Sünger Stok Takip Sistemi (FastAPI + PostgreSQL)
**Versiyon:** v1.0.0

---

## 🔍 Amaç

Bu doküman, sistemin veritabanı tasarımını tanımlar: tablolar, alanlar, veri tipleri ve ilişkiler.
Hem backend geliştiricileri hem de frontend tarafı için referans niteliğindedir.

---

## 💡 Tablolar Genel Görünüm

| Tablo       | Amaç                                | Durum                         |
| ----------- | ----------------------------------- | ----------------------------- |
| **users**   | Kullanıcı hesapları ve rolleri      | Kimlik doğrulama için gerekli |
| **sponges** | Sünger türleri                      | Ana veri (master data)        |
| **stocks**  | Sünger giriş-çıkış hareketleri      | İşlem tablosu (transactional) |
| **reports** | Otomatik oluşturulan rapor özetleri | İsteğe bağlı ama önerilir     |

---

## 👨‍🔧 USERS TABLOSU

| Alan          | Tip                               | Gereklilik       | Açıklama                    |
| ------------- | --------------------------------- | ---------------- | --------------------------- |
| id            | SERIAL                            | PK               | Otomatik artan kullanıcı ID |
| username      | VARCHAR(50)                       | unique, not null | Kullanıcı adı               |
| password_hash | VARCHAR(255)                      | not null         | Şifre (bcrypt hash)         |
| role          | ENUM('admin','operator','viewer') | not null         | Yetki türü                  |
| email         | VARCHAR(100)                      | optional         | Bildirim gönderimi için     |
| created_at    | TIMESTAMP WITH TIME ZONE          | default now      | Kayıt tarihi                |

---

## 🦊 SPONGES TABLOSU

| Alan           | Tip                      | Gereklilik       | Açıklama              |
| -------------- | ------------------------ | ---------------- | --------------------- |
| id             | SERIAL                   | PK               | Sünger ID             |
| name           | VARCHAR(100)             | unique, not null | Sünger türü adı       |
| density        | DOUBLE PRECISION         | not null         | Dansite değeri        |
| hardness       | VARCHAR(20)              | not null         | Sertlik kategorisi    |
| width          | DOUBLE PRECISION         | optional         | En (cm)               |
| height         | DOUBLE PRECISION         | optional         | Boy (cm)              |
| thickness      | DOUBLE PRECISION         | optional         | Kalınlık (cm)         |
| unit           | VARCHAR(10)              | not null         | Ölçü birimi (m³/adet) |
| critical_stock | DOUBLE PRECISION         | default 0        | Minimum stok seviyesi |
| created_at     | TIMESTAMP WITH TIME ZONE | default now      | Oluşturulma tarihi    |

---

## 🛋️ STOCKS TABLOSU

| Alan       | Tip                       | Gereklilik      | Açıklama                |
| ---------- | ------------------------- | --------------- | ----------------------- |
| id         | SERIAL                    | PK              | Stok hareket ID         |
| sponge_id  | INT                       | FK → sponges.id | Bağlı sünger türü       |
| quantity   | DOUBLE PRECISION          | not null        | Miktar (m³ veya adet)   |
| type       | ENUM('in','out','return') | not null        | Giriş / çıkış / iade    |
| note       | TEXT                      | optional        | Açıklama                |
| price      | DOUBLE PRECISION          | optional        | Opsiyonel fiyat bilgisi |
| date       | TIMESTAMP WITH TIME ZONE  | default now     | İşlem tarihi            |
| created_by | INT                       | FK → users.id   | İşlemi yapan kullanıcı  |

---

## 🔢 REPORTS TABLOSU _(Opsiyonel)_

| Alan         | Tip                      | Gereklilik    | Açıklama                   |
| ------------ | ------------------------ | ------------- | -------------------------- |
| id           | SERIAL                   | PK            | Rapor ID                   |
| report_type  | VARCHAR(20)              | not null      | Tür: weekly / monthly      |
| generated_at | TIMESTAMP WITH TIME ZONE | default now   | Raporun oluşturulma zamanı |
| summary_json | JSONB                    | not null      | Rapor özet verisi          |
| file_path    | VARCHAR(255)             | optional      | PDF veya CSV dosya yolu    |
| created_by   | INT                      | FK → users.id | Raporu oluşturan kullanıcı |

---

## 🔗 İlişki Haritası

- **users → stocks** : 1:N (bir kullanıcı birden fazla stok hareketi oluşturabilir)
- **sponges → stocks** : 1:N (bir sünger birden fazla harekete konu olabilir)
- **users → reports** : 1:N (bir kullanıcı birden fazla rapor oluşturabilir)

```
users ───┬───< stocks >───┬─── sponges
         │                 │
         └───< reports >───┘
```

---

## 🤖 Veri Tipi Standartları

| Veri Tipi                | Açıklama               | Önerilen Kullanım       |
| ------------------------ | ---------------------- | ----------------------- |
| SERIAL                   | Otomatik artan tamsayı | ID alanları             |
| DOUBLE PRECISION         | Ondalıklı sayı         | miktar, dansite         |
| VARCHAR                  | Metin                  | isim, kod, kategori     |
| TEXT                     | Uzun metin             | not, açıklama           |
| TIMESTAMP WITH TIME ZONE | Tarih-saat             | işlem, oluşturma tarihi |
| JSONB                    | JSON veri yapısı       | rapor özetleri          |
| ENUM                     | Sabit seçenekler       | rol, hareket türü       |

---

## 📊 Frontend Kullanım Notları

| Alan                   | Görünürlük  | Açıklama                               |
| ---------------------- | ----------- | -------------------------------------- |
| users.password_hash    | ❌ gizli    | UI’da gösterilmez                      |
| sponges.critical_stock | ✅          | Kritik stok limiti grafikte gösterilir |
| stocks.price           | ⚙ opsiyonel | Sadece yönetici rolü görür             |
| reports.summary_json   | ✅          | Dashboard grafikleri buradan üretilir  |
| stocks.date            | ✅          | Tarih filtreleri için kullanılır       |

---

## 📘 Gelecek Tablo Önerileri (v2)

| Tablo         | Amaç                                           |
| ------------- | ---------------------------------------------- |
| logs          | Sistem olay kayıtları (CRUD, hata, login)      |
| notifications | Gönderilen e-postalar / uyarı geçmişi          |
| suppliers     | Tedarikçi bilgileri ve stok tedarik planlaması |

---

## 🎨 ERD Diyagramı (Basitleştirilmiş)

```
+----------+          +-----------+          +----------+
|  users   |1        N|  stocks   |N        1| sponges  |
+----------+----------+-----------+----------+----------+
| id (PK)  |          | id (PK)   |          | id (PK)  |
| username |          | sponge_id |          | name     |
| role     |          | quantity  |          | density  |
+----------+          +-----------+          +----------+
```

---

## 🔖 Wiki Linki

Wiki sayfasında bu doküman aşağıdaki gibi linklenir:

```md
### Backend Database Yapısı

🔗 [Database Schema](../tree/feature/backend/backend/docs/database_schema.md)
```
