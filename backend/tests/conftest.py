# conftest.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.core.config import settings

# Tüm ORM modellerini import ediyoruz ki, Base.metadata
# create_all çağrıldığında tüm tabloları (users, sponges, stocks vb.) tanısın.
import app.models.users
import app.models.sponges 
import app.models.stocks
import app.models.reports
import app.models.refresh_tokens # Auth için gerekli

# ===============================================
# 1. TEST AYARLARI (Settings Fixture)
# ===============================================

@pytest.fixture(scope="session", autouse=True)
def adjust_settings_for_tests():
    """
    Testler başlamadan önce Access Token süresi ve Mail ayarları gibi 
    çevresel değişkenleri ayarlar.
    """
    # Kimlik Doğrulama Hatalarını gidermek için token süresini uzatıyoruz (30 dk).
    settings.ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    # Rapor testlerindeki (MAIL_SERVER vb.) AttributeError'ı gidermek için
    # bildirim ayarlarını test ortamında mock'luyoruz (gerçek mail göndermeyecek).
    settings.SMTP_SERVER = "smtp.test.com"
    settings.SMTP_PORT = 587
    settings.MAIL_FROM = "test@example.com"
    settings.MAIL_USERNAME = "test_user"
    settings.MAIL_PASSWORD = "test_password"
    
    yield
    # Burası bittikten sonra ayarlar varsayılan değerlerine döner (eğer BaseSettings kullanıyorsanız).


# ===============================================
# 2. TEST VERİTABANI TANIMLAMA
# ===============================================

# SQLite Memory kullanarak izole veritabanı.
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)

# ===============================================
# 3. DB OTURUMU VE İZOLASYON FİXTURE'I
# ===============================================

@pytest.fixture(scope="function")
def db_session():
    """
    Her test fonksiyonu için yeni bir veritabanı oluşturur, oturum başlatır
    ve test sonunda tüm tabloları siler (izolasyon).
    """
    # Tabloları oluştur
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    
    yield session
    
    # Kapat ve temizle
    session.close()
    Base.metadata.drop_all(bind=engine)


# ===============================================
# 4. TEST CLIENT'I VE BAĞIMLILIK GEÇERSİZ KILMA
# ===============================================

@pytest.fixture(scope="function")
def client(db_session):
    """
    FastAPI uygulamasını izole test oturumu ile çalıştıran TestClient sağlar.
    app.core.database.get_db bağımlılığını geçersiz kılar.
    """
    
    # get_db'yi bizim test oturumumuzla değiştir
    def override_get_db():
        try:
            yield db_session
        finally:
            # session kapatma işlemi db_session fixture'ında zaten yapıldığı için pass
            pass

    app.dependency_overrides[get_db] = override_get_db

    test_client = TestClient(app)
    
    # Test Client'ı test fonksiyonuna sunar
    yield test_client
    
    # Test bittikten sonra bağımlılığı temizle (iyi bir pratik)
    app.dependency_overrides.clear()