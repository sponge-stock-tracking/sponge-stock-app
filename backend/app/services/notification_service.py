import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from app.core.config import settings

class NotificationService:
    def __init__(self):
        self.username = settings.MAIL_USERNAME
        self.password = settings.MAIL_PASSWORD
        self.server = settings.MAIL_SERVER
        self.port = settings.MAIL_PORT
        self.sender = settings.MAIL_FROM

    def send_email(self, to: List[str], subject: str, body: str):
        msg = MIMEMultipart()
        msg["From"] = self.sender
        msg["To"] = ", ".join(to)
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        try:
            with smtplib.SMTP(self.server, self.port) as smtp:
                if settings.MAIL_TLS:
                    smtp.starttls()
                smtp.login(self.username, self.password)
                smtp.sendmail(self.sender, to, msg.as_string())
            return {"status": "success", "recipients": to}
        except Exception as e:
            return {"status": "error", "detail": str(e)}
