import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS.replace(/\s+/g, ""), // Remove spaces
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

try {
  console.log("Connecting to SMTP...");
  await transporter.verify();
  console.log("✅ SMTP verified successfully!");

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.BUSINESS_EMAIL,
    subject: "RK Traders SMTP Test",
    text: "This is a test email from RK Traders.",
  });

  console.log("✅ Email sent successfully!");
  console.log(info);
} catch (err) {
  console.error("❌ SMTP Error:");
  console.error(err);
}