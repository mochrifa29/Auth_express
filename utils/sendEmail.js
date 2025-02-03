import nodemailer from "nodemailer";
import mailerConfig from "./mailerConfig.js";

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(mailerConfig);

  return transporter.sendMail({
    from: '"Your Boss" <admin@mail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
};

export default sendEmail;
