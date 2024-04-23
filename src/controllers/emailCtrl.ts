import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, cc: string, title: string, txt: string, url: string) => {
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
    cc: cc,
    html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      <h2 style="text-align: center; text-transform: uppercase;color: teal;">${title}</h2>
      <p style="text-align:center">${txt}</p>
      <div style="display: flex; justify-content: center; align-items: center;">
      <a href="${url}" >Kiosco TI</a>
      </div>
      </div>
      `,
  };

  await transport.sendMail(mailOptions);
};
export const sendEmailV2 = async (
  to: string, 
  cc: string, 
  title: string, 
  txt: string, 
  urlAceptacion: string,
  urlRechazo: string, 
  solicitante: string, 
  solicitud: string
) => {
  const SENDER_EMAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;
  const SMTP_HOST = `${process.env.SMTP_HOST}`;
  
  var transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 2525,
    tls: {
      rejectUnauthorized: false,
    },
  });
  
  const mailOptions = {
    from: SENDER_EMAIL,
    to: to,
    subject: txt,
    cc: cc,
    html: `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">${title} ${solicitante}</h2>             
        <p style="text-align:center">${txt}</p>
        <p style="text-align:center"><strong> ${solicitud}</strong></p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <a href="${urlAceptacion}" style="background-color: #4CAF50; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">Aceptar</a>
          <a href="${urlRechazo}" style="background-color: #f44336; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">Rechazar</a>
        </div>
      </div>
    `,
  };

  await transport.sendMail(mailOptions);
};

export const emailCtrl = {
  enviar: async (req: Request, res: Response) => {
    try {
      const { to, cc, title, txt, url } = req.body;
      await sendEmail(to,cc, title, txt, url);
      res.status(200).json({ message: 'Notificación enviada exitosamente' });
    } catch (error) {
      console.error('Solicitud escalada al sistema:', error);
      res.status(500).json({ error: 'Solicitud escalada al sistema' });
    }
  },
  enviar2: async (req: Request, res: Response) => {
    try {
      const { to, cc, title, txt, urlAceptacion, urlRechazo, solicitante, solicitud } = req.body;
      await sendEmailV2(to, cc, title, txt, urlAceptacion, urlRechazo, solicitante, solicitud); // Modificamos la función a sendEmailV2
      res.status(200).json({ message: 'Notificación enviada exitosamente' });
    } catch (error) {
      console.error('Solicitud escalada al sistema:', error);
      res.status(500).json({ error: 'Solicitud escalada al sistema' });
    }
  },
};
