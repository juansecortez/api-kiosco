import { error } from "console";
import nodemailer from "nodemailer";
/**
 * Función para envio de correos hacia un servidor de SMTP
 */
const sendEmail = async (
  to: string,
  title:string,
  txt: string
  
) => {
  const SENDER_EMAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;
  const SMTP_HOST = `${process.env.SMTP_HOST}`;
  var transport = nodemailer.createTransport({
    host: `${SMTP_HOST}`,
    port: 2525,
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mailOptions = {
    from: SENDER_EMAIL,
    to: to,
    subject: txt,
    cc:`elara@pcolorada.com`,
    html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">${title}</h2>
      <p style="text-align:center">${txt}</p>
      <div style="display: flex; justify-content: center; align-items: center;">
      
      </div>
      </div>
      `,
  };

  await transport.sendMail(mailOptions);
};

export default sendEmail;