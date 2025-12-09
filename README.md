# Sünger Stok Takip Sistemi (Sponge Stock Tracking App)

Bu proje, üretim ve fason tedarik süreçlerinde kullanılan süngerlerin stok hareketlerinin takip edilmesi için geliştirilmiştir.  
Yazılım Mühendisliği dersi kapsamında, proje yönetimi süreçlerini gerçek bir senaryo ile deneyimlemek amaçlanmıştır.

---

## 📌 Teknoloji Altyapısı

| Katman   | Teknoloji                        |
| -------- | -------------------------------- |
| Backend  | Python • FastAPI                 |
| Database | PostgreSQL                       |
| Frontend | Next.js (React)                  |
| Auth     | JWT tabanlı kimlik doğrulama     |
| UI - UX  | Responsive Web Arayüzü           |
| DevOps   | Docker (Sprint 2 sonrası planlı) |

---

## 🎯 Projenin Amacı

- Sünger stoklarının güvenilir ve anlık takibini sağlamak
- Vardiya bazlı giriş/çıkış işlemlerini hızlandırmak
- Kritik stok seviyeleri için uyarı mekanizması
- Haftalık raporlama ve trend takibi
- Manuel Excel takip sürecinin hatalarını azaltmak

---

## 🧩 Temel Özellikler (MVP)

- Sünger türü tanımlama (dansite, sertlik, boyut vb.)
- Tedarik giriş kayıtları (batch input)
- Üretim/fason çıkış kayıtları
- m³ ve adet bazlı stok takibi
- Kritik stok uyarıları (dashboard + e-posta)
- Haftalık raporlama • trend grafikleri

---

## 🚫 Kapsam Dışı

- Maliyet ve ticari belge yönetimi (fatura, irsaliye vb.)
- ERP entegrasyonu
- Depo içi lokasyon takibi
- Çoklu dil desteği

---

## 👥 Takım ve Roller

| Rol                         | Sorumluluk                        |
| --------------------------- | --------------------------------- |
| Project Manager • Tech Lead | Planlama, mimari, kod rehberliği  |
| Scrum Master                | Sprint board düzeni, toplantılar  |
| Backend Developers          | API, veri modeli, iş mantığı      |
| Frontend Developers         | UI geliştirme                     |
| Database Designer           | ERD, veri bütünlüğü               |
| QA / Tester                 | Test senaryoları ve dokümantasyon |
| Business Analyst            | Gereksinim toplama ve Use Case    |
| Documentation Owner         | Rapor ve wiki yönetimi            |

(Ekip listesi Sprint 0 sonunda buraya eklenecektir.)

---

## 📅 Sprint Planı (Özet)

| Sprint   | Hedef                     | Çıktı                          |
| -------- | ------------------------- | ------------------------------ |
| Sprint 0 | Setup & Fizibilite        | Repo, Board, Fizibilite raporu |
| Sprint 1 | Sünger veri modeli + CRUD | Veri tabanı + API              |
| Sprint 2 | Stok hareketleri + UI     | Giriş/çıkış ekranları          |
| Sprint 3 | Dashboard & Uyarılar      | Grafik ve mail uyarı sistemi   |
| Sprint 4 | Test & Final Demo         | Sunum + raporlar               |

---

## 📁 Depo Yapısı (Planlanan)

/backend
/frontend
/docs
/tests
.github/workflows

> Kod geliştirmeleri Sprint 1 ile başlayacaktır.

---

## 🔐 Kimlik Doğrulama

- JWT tabanlı login mekanizması
- Yetki yönetimi çoklu kullanıcıya hazır altyapı ile

---

## 📌 Proje Yönetimi

- Kanban Board → GitHub Projects
- İş takip → Issues + Milestones
- Dokümantasyon → Wiki

Tüm süreç çıktıları **dönem değerlendirmesi için kayıt altında tutulacaktır**.

---

## ✅ Durum

✔ Repo oluşturuldu  
✔ Backend ve Frontend geliştirmeleri tamamlandı  
✔ Docker yapılandırmaları hazır  
✔ Test senaryoları yazıldı  
✔ Deployment konfigürasyonları hazırlandı

---

## 🚀 Deployment (Dağıtım)

Bu proje **tamamen ücretsiz** bulut servisleri kullanılarak canlıya alınabilir:

### Mimari

```
Frontend (Vercel) → Backend (Render) → Veritabanı (Supabase)
   Next.js            FastAPI            PostgreSQL
   ÜCRETSİZ          ÜCRETSİZ            ÜCRETSİZ
```

### Toplam Maliyet: **0₺/ay** 🎉

### Deployment Rehberleri (Türkçe)

1. **[DEPLOYMENT_TR.md](DEPLOYMENT_TR.md)** - Hızlı deployment referansı
2. **[SUPABASE_KURULUM.md](SUPABASE_KURULUM.md)** - Veritabanı kurulumu
3. **[RENDER_DEPLOYMENT_TR.md](RENDER_DEPLOYMENT_TR.md)** - Backend deployment
4. **[VERCEL_DEPLOYMENT_TR.md](VERCEL_DEPLOYMENT_TR.md)** - Frontend deployment

### Önemli Dosyalar

- `render.yaml` - Render.com otomatik deployment yapılandırması
- `backend/Dockerfile` - Production backend container
- `frontend/Dockerfile` - Production frontend container
- `backend/.env.example` - Ortam değişkenleri şablonu
- `deploy-prepare.sh` - SECRET_KEY oluşturma yardımcı script

### Deployment Sırası

1. **Supabase** - PostgreSQL veritabanı oluştur
2. **Render** - Backend API'yi deploy et
3. **Vercel** - Frontend'i deploy et
4. Migration'ları çalıştır ve test et

Detaylı adımlar için deployment rehberlerine bakın.

---

## ✨ Yazarlar & Teşekkür

Bu proje Erciyes Üniversitesi Yazılım Mühendisliği dersi kapsamında geliştirilmiştir.  
Katkı sağlayan tüm takım üyelerine teşekkürler.
