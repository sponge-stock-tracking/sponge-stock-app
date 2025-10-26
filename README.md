# Sünger Stok Takip Sistemi (Sponge Stock Tracking App)

Bu proje, üretim ve fason tedarik süreçlerinde kullanılan süngerlerin stok hareketlerinin takip edilmesi için geliştirilmiştir.  
Yazılım Mühendisliği dersi kapsamında, proje yönetimi süreçlerini gerçek bir senaryo ile deneyimlemek amaçlanmıştır.

---

## 📌 Teknoloji Altyapısı

| Katman | Teknoloji |
|-------|-----------|
| Backend | Python • FastAPI |
| Database | PostgreSQL |
| Frontend | Next.js (React) |
| Auth | JWT tabanlı kimlik doğrulama |
| UI - UX | Responsive Web Arayüzü |
| DevOps | Docker (Sprint 2 sonrası planlı) |

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

| Rol | Sorumluluk |
|---|---|
| Project Manager • Tech Lead | Planlama, mimari, kod rehberliği |
| Scrum Master | Sprint board düzeni, toplantılar |
| Backend Developers | API, veri modeli, iş mantığı |
| Frontend Developers | UI geliştirme |
| Database Designer | ERD, veri bütünlüğü |
| QA / Tester | Test senaryoları ve dokümantasyon |
| Business Analyst | Gereksinim toplama ve Use Case |
| Documentation Owner | Rapor ve wiki yönetimi |

(Ekip listesi Sprint 0 sonunda buraya eklenecektir.)

---

## 📅 Sprint Planı (Özet)

| Sprint | Hedef | Çıktı |
|---|---|---|
| Sprint 0 | Setup & Fizibilite | Repo, Board, Fizibilite raporu |
| Sprint 1 | Sünger veri modeli + CRUD | Veri tabanı + API |
| Sprint 2 | Stok hareketleri + UI | Giriş/çıkış ekranları |
| Sprint 3 | Dashboard & Uyarılar | Grafik ve mail uyarı sistemi |
| Sprint 4 | Test & Final Demo | Sunum + raporlar |

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
◻ Sprint 0 görev atamaları  
◻ Dokümantasyon başlangıcı  
◻ Use Case & ERD taslakları  
◻ Fizibilite raporu tamamlanacak

---

## ✨ Yazarlar & Teşekkür

Bu proje Erciyes Üniversitesi Yazılım Mühendisliği dersi kapsamında geliştirilmiştir.  
Katkı sağlayan tüm takım üyelerine teşekkürler.
