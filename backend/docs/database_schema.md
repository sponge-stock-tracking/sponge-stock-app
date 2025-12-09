# 🧱 Database Schema Documentation

**Proje:** Sünger Stok Takip Sistemi (FastAPI + PostgreSQL)
**Versiyon:** v1.0.0

---

## 🔍 Amaç

Bu doküman, sistemin veritabanı tasarımını tanımlar: tablolar, alanlar, veri tipleri ve ilişkiler.
Hem backend geliştiricileri hem de frontend tarafı için referans niteliğindedir.

---

## 💡 Tablolar Genel Görünüm

| Tablo              | Amaç                                | Durum                         |
| ------------------ | ----------------------------------- | ----------------------------- |
| **users**          | Kullanıcı hesapları ve rolleri      | Kimlik doğrulama için gerekli |
| **sponges**        | Sünger türleri                      | Ana veri (master data)        |
| **stocks**         | Sünger giriş-çıkış hareketleri      | İşlem tablosu (transactional) |
| **reports**        | Otomatik oluşturulan rapor özetleri | Opsiyonel                     |
| **refresh_tokens** | JWT refresh token yönetimi          | Kimlik doğrulama için gerekli |

---

## 👨‍🔧 USERS TABLOSU

| Alan          | Tip                               | Gereklilik       | Açıklama                       |
| ------------- | --------------------------------- | ---------------- | ------------------------------ |
| id            | INTEGER                           | PK               | Otomatik artan kullanıcı ID    |
| username      | VARCHAR(50)                       | unique, not null | Kullanıcı adı                  |
| password_hash | VARCHAR(255)                      | not null         | Şifre (bcrypt hash)            |
| email         | VARCHAR(100)                      | unique, nullable | E-posta adresi                 |
| role          | ENUM('admin','operator','viewer') | not null         | Yetki türü (default: operator) |
| is_active     | BOOLEAN                           | default true     | Kullanıcı aktif mi?            |
| last_login    | TIMESTAMP WITH TIME ZONE          | nullable         | Son giriş tarihi               |
| created_at    | TIMESTAMP WITH TIME ZONE          | default now()    | Kayıt tarihi                   |
| updated_at    | TIMESTAMP WITH TIME ZONE          | on update        | Güncelleme tarihi              |

**İlişkiler:**

- `stocks` → 1:N ilişki (User, birden fazla stok hareketi oluşturabilir)
- `reports` → 1:N ilişki (User, birden fazla rapor oluşturabilir)
- `refresh_tokens` → 1:N ilişki (User, birden fazla refresh token'a sahip olabilir)

---

## 🦊 SPONGES TABLOSU

| Alan           | Tip                      | Gereklilik    | Açıklama              |
| -------------- | ------------------------ | ------------- | --------------------- |
| id             | INTEGER                  | PK            | Sünger ID             |
| name           | VARCHAR(100)             | not null      | Sünger türü adı       |
| density        | FLOAT (DOUBLE PRECISION) | not null      | Dansite değeri        |
| hardness       | VARCHAR(20)              | not null      | Sertlik kategorisi    |
| width          | FLOAT (DOUBLE PRECISION) | nullable      | En (cm)               |
| height         | FLOAT (DOUBLE PRECISION) | nullable      | Boy (cm)              |
| thickness      | FLOAT (DOUBLE PRECISION) | nullable      | Kalınlık (cm)         |
| unit           | VARCHAR(10)              | not null      | Ölçü birimi (m3/adet) |
| critical_stock | FLOAT (DOUBLE PRECISION) | default 5     | Minimum stok seviyesi |
| created_at     | TIMESTAMP WITH TIME ZONE | default now() | Oluşturulma tarihi    |
| updated_at     | TIMESTAMP WITH TIME ZONE | on update     | Güncelleme tarihi     |

**Constraints:**

- `UNIQUE (density, hardness, thickness)` - Aynı özellikli sünger tekrar oluşturulamaz

**İlişkiler:**

- `stocks` → 1:N ilişki (Sponge, birden fazla stok hareketine sahip olabilir)

---

## 🛋️ STOCKS TABLOSU

| Alan       | Tip                       | Gereklilik      | Açıklama                 |
| ---------- | ------------------------- | --------------- | ------------------------ |
| id         | INTEGER                   | PK              | Stok hareket ID          |
| sponge_id  | INTEGER                   | FK → sponges.id | Bağlı sünger türü        |
| created_by | INTEGER                   | FK → users.id   | İşlemi yapan kullanıcı   |
| quantity   | FLOAT (DOUBLE PRECISION)  | not null        | Miktar (m³ veya adet)    |
| type       | ENUM('in','out','return') | not null        | Giriş / çıkış / iade     |
| price      | FLOAT (DOUBLE PRECISION)  | nullable        | Opsiyonel fiyat bilgisi  |
| note       | TEXT                      | nullable        | Açıklama                 |
| date       | TIMESTAMP WITH TIME ZONE  | default now()   | İşlem tarihi             |
| created_at | TIMESTAMP WITH TIME ZONE  | default now()   | Kayıt oluşturulma zamanı |
| updated_at | TIMESTAMP WITH TIME ZONE  | on update       | Kayıt güncellenme zamanı |

**Constraints:**

- `CHECK (quantity >= 0)` - Miktar negatif olamaz
- `INDEX (sponge_id, date)` - Performans için composite index

**Foreign Key Davranışları:**

- `sponge_id → sponges.id` ON DELETE CASCADE (sünger silinirse tüm hareketler de silinir)
- `created_by → users.id` ON DELETE SET NULL (kullanıcı silinirse NULL olur)

**İlişkiler:**

- `sponge` → N:1 ilişki (Stock, bir Sponge'a ait)
- `user` → N:1 ilişki (Stock, bir User tarafından oluşturuldu)

---

## 🔢 REPORTS TABLOSU _(Opsiyonel)_

| Alan               | Tip                      | Gereklilik    | Açıklama                    |
| ------------------ | ------------------------ | ------------- | --------------------------- |
| id                 | INTEGER                  | PK            | Rapor ID                    |
| report_type        | ENUM('weekly','monthly') | not null      | Rapor türü                  |
| summary_json       | JSON/JSONB               | not null      | Rapor özet verisi           |
| file_path          | VARCHAR(512)             | nullable      | PDF veya CSV dosya yolu     |
| generated_duration | FLOAT                    | nullable      | Rapor oluşturma süresi (sn) |
| created_by         | INTEGER                  | FK → users.id | Raporu oluşturan kullanıcı  |
| generated_at       | TIMESTAMP WITH TIME ZONE | default now() | Raporun oluşturulma zamanı  |

**Foreign Key Davranışları:**

- `created_by → users.id` ON DELETE SET NULL

**İlişkiler:**

- `user` → N:1 ilişki (Report, bir User tarafından oluşturuldu)

---

## 🔗 İlişki Haritası

- **users → stocks** : 1:N (bir kullanıcı birden fazla stok hareketi oluşturabilir)
- **users → reports** : 1:N (bir kullanıcı birden fazla rapor oluşturabilir)
- **users → refresh_tokens** : 1:N (bir kullanıcının birden fazla refresh token'ı olabilir)
- **sponges → stocks** : 1:N (bir sünger birden fazla harekete konu olabilir)

```
                    users
                      |
         +------------+------------+-------------+
         |            |            |             |
         v            v            v             v
      stocks      reports   refresh_tokens   (cascade delete)
         |
         v
      sponges
```

**Cascade Davranışlar:**

- `User` silindiğinde → `stocks.created_by = NULL`, `reports.created_by = NULL`, `refresh_tokens` tamamen silinir
- `Sponge` silindiğinde → ilgili tüm `stocks` kayıtları silinir

---

## 🤖 Veri Tipi Standartları

| Veri Tipi                | Açıklama                  | Önerilen Kullanım           |
| ------------------------ | ------------------------- | --------------------------- |
| INTEGER                  | Tam sayı (auto-increment) | ID alanları (PK)            |
| FLOAT / DOUBLE PRECISION | Ondalıklı sayı            | miktar, dansite, fiyat      |
| VARCHAR(n)               | Sabit uzunluklu metin     | isim, kod, kategori         |
| TEXT                     | Sınırsız uzun metin       | not, açıklama               |
| BOOLEAN                  | True/False                | is_active, revoked          |
| TIMESTAMP WITH TIME ZONE | Zaman damgası (timezone)  | işlem, oluşturma tarihi     |
| JSON / JSONB             | JSON veri yapısı          | rapor özetleri (JSONB öner) |
| ENUM                     | Sabit seçenekler          | rol, hareket türü, rapor    |

---

## 📊 Frontend Kullanım Notları

| Alan                       | Görünürlük  | Açıklama                                  |
| -------------------------- | ----------- | ----------------------------------------- |
| users.password_hash        | ❌ gizli    | Asla UI'da gösterilmez                    |
| users.is_active            | ✅ admin    | Admin panelinde kullanıcı durumu için     |
| refresh_tokens.jti         | ❌ gizli    | Backend tarafında token yönetimi için     |
| sponges.critical_stock     | ✅          | Kritik stok limiti grafiklerde gösterilir |
| stocks.price               | ⚙ opsiyonel | Sadece yönetici rolü görür                |
| reports.summary_json       | ✅          | Dashboard grafikleri buradan üretilir     |
| reports.generated_duration | ⚙ opsiyonel | Performans metrikleri için                |
| stocks.date                | ✅          | Tarih filtreleri için kullanılır          |

---

## 📘 Gelecek Tablo Önerileri (v2)

| Tablo         | Amaç                                           | Öncelik |
| ------------- | ---------------------------------------------- | ------- |
| logs          | Sistem olay kayıtları (CRUD, hata, login)      | Orta    |
| notifications | Gönderilen e-postalar / uyarı geçmişi          | Düşük   |
| suppliers     | Tedarikçi bilgileri ve stok tedarik planlaması | Düşük   |
| audit_trail   | Tüm değişikliklerin detaylı kaydı (compliance) | Yüksek  |

---

## 🔧 Migration Yönetimi

Veritabanı şeması değişiklikleri **Alembic** ile yönetilir:

```bash
# Yeni migration oluştur (otomatik tespit)
alembic revision --autogenerate -m "description"

# Migration'ları uygula
alembic upgrade head

# Geri al (bir adım)
alembic downgrade -1

# Geçerli migration durumunu kontrol et
alembic current
```

**Mevcut Migration'lar:**

- `df2255221b3c_initial_schema.py` - İlk tablo yapısı
- `38bef5a6dc74_add_refresh_tokens_and_user_fields.py` - Refresh token + user alanları
- `776872298027_create_all_tables.py` - Supabase deployment için tüm tabloları oluştur

```
+---------------+
|     users     |
+---------------+          +----------------+
| id (PK)       |1--------N| stocks         |
| username      |          +----------------+
| password_hash |          | id (PK)        |
| email         |          | sponge_id (FK) |----+
| role          |          | created_by(FK) |    |
| is_active     |          | quantity       |    |
+-------+-------+          | type           |    |
        |                  | price          |    |
        |1                 +----------------+    |
        |                                        |
        |                                        |N
        |N                                       |
+-------+--------+                      +--------+-------+
| refresh_tokens |                      |    sponges     |
+----------------+                      +----------------+
| id (PK)        |                      | id (PK)        |
| jti (UNIQUE)   |                      | name           |
| user_id (FK)   |                      | density        |
| expires_at     |                      | hardness       |
| revoked        |                      | unit           |
+----------------+                      | critical_stock |
                                        +----------------+
        |1
        |
        |N
+-------+-------+
|    reports    |
+---------------+
| id (PK)       |
| report_type   |
| summary_json  |
| created_by(FK)|
+---------------+
```

---

## 📘 Gelecek Tablo Önerileri (v2)

| Tablo         | Amaç                                           | Öncelik |
| ------------- | ---------------------------------------------- | ------- |
| logs          | Sistem olay kayıtları (CRUD, hata, login)      | Orta    |
| notifications | Gönderilen e-postalar / uyarı geçmişi          | Düşük   |
| suppliers     | Tedarikçi bilgileri ve stok tedarik planlaması | Düşük   |
| audit_trail   | Tüm değişikliklerin detaylı kaydı (compliance) | Yüksek  |

---

## 🔧 Migration Yönetimi

Veritabanı şeması değişiklikleri **Alembic** ile yönetilir:

```bash
# Yeni migration oluştur (otomatik tespit)
alembic revision --autogenerate -m "description"

# Migration'ları uygula
alembic upgrade head

# Geri al (bir adım)
alembic downgrade -1

# Geçerli migration durumunu kontrol et
alembic current
```

**Mevcut Migration'lar:**

- `df2255221b3c_initial_schema.py` - İlk tablo yapısı
- `38bef5a6dc74_add_refresh_tokens_and_user_fields.py` - Refresh token + user alanları
- `776872298027_create_all_tables.py` - Supabase deployment için tüm tabloları oluştur
