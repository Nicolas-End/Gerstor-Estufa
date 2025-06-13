import smtplib
import uuid #cria um token unico
from email.message import EmailMessage
from controllers.token_controller import ControllerToken
import os
from dotenv import load_dotenv

load_dotenv()
class EmailController :
    def __init__(self):
        self.msg = EmailMessage()
        self.email_system = os.getenv("EMAIL_SYSTEM")
        self.password = os.getenv("APP_PASSWORD")
        
    def send_recuperation_email (self,user_email,new_password):
        try: 
            unique_token_acess = str(uuid.uuid4())
            ControllerToken().new_recuperation_token(unique_token_acess,user_email,new_password)
            email_to_user =f"""
                <html>
                    <body>
                        <p>Para mudar sua senha, acesse o link:</p>
                        <a href="http://localhost:3000/password-forget/{unique_token_acess}&{user_email}">
                            Mudar Senha
                        </a>
                        <p color="red">Este link será válido apenas por 3 minutos.</p>
                        <h4> NÃO COMPARTILHE ESTE EMAIL </h4>
                    </body>
                </html>
            """
            self.msg["Subject"] = "Recupere sua senha"
            #email do sistema
            self.msg["From"] = "Controle Verde"
            #email destinatario
            self.msg["To"] = user_email
            #conteudo do email
            self.msg.set_content(email_to_user)
            self.msg.add_alternative(email_to_user, subtype='html')    
            #envio do email ao usuario
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as stmp:  
                stmp.login(self.email_system,self.password)
                stmp.send_message(self.msg)
                stmp.quit()
                return True
            
        except Exception as e:
            print("Error: ",e)
            return False