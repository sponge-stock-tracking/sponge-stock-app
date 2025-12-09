from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # Database
    POSTGRES_USER: str = Field(..., env="POSTGRES_USER")
    POSTGRES_PASSWORD: str = Field(..., env="POSTGRES_PASSWORD")
    POSTGRES_DB: str = Field(..., env="POSTGRES_DB")
    POSTGRES_HOST: str = Field(..., env="POSTGRES_HOST")
    POSTGRES_PORT: str = Field(..., env="POSTGRES_PORT")

    DATABASE_URL: str = Field(..., env="DATABASE_URL")

    # Auth
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = Field(..., env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(..., env="ACCESS_TOKEN_EXPIRE_MINUTES")

    # App
    APP_NAME: str = Field(..., env="APP_NAME")
    APP_ENV: str = Field(..., env="APP_ENV")
    LOG_LEVEL: str = Field(..., env="LOG_LEVEL")

    # CORS
    CORS_ORIGINS: str = Field(..., env="CORS_ORIGINS")

    # Mail (optional)
    MAIL_USERNAME: str | None = Field(None, env="MAIL_USERNAME")
    MAIL_PASSWORD: str | None = Field(None, env="MAIL_PASSWORD")
    MAIL_FROM: str | None = Field(None, env="MAIL_FROM")
    SMTP_SERVER: str | None = Field(None, env="SMTP_SERVER")
    SMTP_PORT: int | None = Field(None, env="SMTP_PORT")
    SMTP_USER: str | None = Field(None, env="SMTP_USER")
    SMTP_PASSWORD: str | None = Field(None, env="SMTP_PASSWORD")

    class Config:
        env_file = ".env"
        extra = "allow"  # <<< BU SATIR KRİTİK — fazla key'ler hata vermesin

settings = Settings()
