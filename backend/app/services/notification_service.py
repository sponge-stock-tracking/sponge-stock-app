import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from app.core.config import settings

class NotificationService:
    def __init__(self):
        self.username = settings.MAIL_USERNAME
        self.password = settings.MAIL_PASSWORD
        # DÜZELTME: MAIL_SERVER -> SMTP_SERVER
        self.server = settings.SMTP_SERVER 
        # DÜZELTME: MAIL_PORT -> SMTP_PORT (config dosyasında böyle tanımlı olmalı)
        self.port = settings.SMTP_PORT 
        self.sender = settings.MAIL_FROM

    def send_email(self, to: List[str], subject: str, body: str):
        msg = MIMEMultipart()
        msg["From"] = self.sender
        msg["To"] = ", ".join(to)
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        try:
            # Server ve port ayarlarının boş gelme ihtimaline karşı kontrol
            if not self.server or not self.port:
                print("Mail sunucusu yapılandırılmamış (Test ortamı olabilir).")
                return {"status": "skipped", "detail": "No SMTP config"}

            with smtplib.SMTP(self.server, self.port) as smtp:
                # TLS genelde 587 portunda kullanılır
                smtp.starttls() 
                if self.username and self.password:
                    smtp.login(self.username, self.password)
                smtp.sendmail(self.sender, to, msg.as_string())
            return {"status": "success", "recipients": to}
        except Exception as e:
            return {"status": "error", "detail": str(e)}