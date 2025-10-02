import { readFile } from "fs/promises";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  },
});


export async function sendForgotPasswordEmail(
  to: string,
  name: string,
  token: string
) {
  const templatePath = path.join(__dirname, "../views/sendMail.html");
  let html = await readFile(templatePath, "utf-8");

  html = html.replace("{{name}}", name).replace("{{token}}", token);

  return transporter.sendMail({
    from: `"Support" <${process.env.USER_EMAIL}>`,
    to,
    subject: "Reset your password",
    html,
  });
}
