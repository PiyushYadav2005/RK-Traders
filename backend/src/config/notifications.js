export const notifyConfig = {
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
  },
  businessEmail: process.env.BUSINESS_EMAIL, // where order/enquiry notifications land
  businessWhatsapp: process.env.BUSINESS_WHATSAPP, // digits only, e.g. 919335912637
  // Twilio WhatsApp API — optional. Leave unset to skip automatic WhatsApp
  // sending (see src/utils/whatsapp.js for why this can't be faked).
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromWhatsApp: process.env.TWILIO_WHATSAPP_FROM, // e.g. "whatsapp:+14155238886"
  },
};

export const isEmailConfigured = Boolean(
  notifyConfig.smtp.host && notifyConfig.smtp.user && notifyConfig.smtp.pass
);

export const isWhatsappConfigured = Boolean(
  notifyConfig.twilio.accountSid && notifyConfig.twilio.authToken && notifyConfig.twilio.fromWhatsApp
);
