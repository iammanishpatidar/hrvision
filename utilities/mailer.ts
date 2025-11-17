import Env from '#start/env';
import SibApiV3Sdk from '@getbrevo/brevo';

const BREVO_API = Env.get('BREVO_API_KEY');
const EMAIL_FROM = Env.get('BREVO_FROM_EMAIL');

// Validation check for API key
if (!BREVO_API) {
  console.error('❌ BREVO_API_KEY is not set in environment variables');
  throw new Error('BREVO_API_KEY is required for email functionality');
}

if (!EMAIL_FROM) {
  console.error('❌ BREVO_FROM_EMAIL is not set in environment variables');
  throw new Error('BREVO_FROM_EMAIL is required for email functionality');
}

if (BREVO_API.startsWith('xkeysib-') && BREVO_API.length < 50) {
  console.warn('⚠️  Using potentially invalid Brevo API key');
}

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const apiKey = (apiInstance as any).authentications['apiKey'];

if (apiKey) {
  apiKey.apiKey = BREVO_API;
  console.log('✅ Brevo API configured successfully');
}

interface EmailParams {
  to: string;
  subject: string;
  htmlContent: string;
}

export const sendEmail = async ({
  to,
  subject,
  htmlContent,
}: EmailParams): Promise<void> => {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📋 Subject: ${subject}`);
  console.log(`🔑 API Key configured: ${BREVO_API ? 'Yes' : 'No'}`);
  console.log(`📤 From email: ${EMAIL_FROM}`);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { email: EMAIL_FROM };
    sendSmtpEmail.to = [{ email: to }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully:', response);
  } catch (error: unknown) {
    console.error('❌ Error sending email:');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    console.error('Full error:', error);
    throw error;
  }
};
