import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.username = settings.MAIL_USERNAME
        self.password = settings.MAIL_PASSWORD
        self.server = settings.SMTP_SERVER 
        self.port = settings.SMTP_PORT 
        self.sender = settings.MAIL_FROM or "noreply@sponge-stock.com"

    def send_email(self, to: List[str], subject: str, body: str):
        """
        E-posta gönderir. SMTP yapılandırılmamışsa konsola yazdırır.
        """
        msg = MIMEMultipart()
        msg["From"] = self.sender
        msg["To"] = ", ".join(to)
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        # SMTP yapılandırılmamışsa konsola yazdır (development mode)
        if not self.server or not self.port:
            logger.info("=" * 80)
            logger.info("📧 E-POSTA BİLDİRİMİ (KONSOL - SMTP yapılandırılmamış)")
            logger.info("=" * 80)
            logger.info(f"Gönderen: {self.sender}")
            logger.info(f"Alıcılar: {', '.join(to)}")
            logger.info(f"Konu: {subject}")
            logger.info(f"İçerik:\n{body}")
            logger.info("=" * 80)
            return {"status": "console", "recipients": to, "subject": subject}

        # SMTP yapılandırılmışsa gerçek e-posta gönder
        try:
            with smtplib.SMTP(self.server, self.port) as smtp:
                smtp.starttls() 
                if self.username and self.password:
                    smtp.login(self.username, self.password)
                smtp.sendmail(self.sender, to, msg.as_string())
            logger.info(f"✅ E-posta gönderildi: {subject} -> {to}")
            return {"status": "sent", "recipients": to, "subject": subject}
        except Exception as e:
            logger.error(f"❌ E-posta gönderimi başarısız: {e}")
            return {"status": "error", "detail": str(e)}