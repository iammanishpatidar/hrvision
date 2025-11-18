import Env from '#start/env';

const clerkSignupUrl = Env.get('CLERK_SIGNUP_URL');
const invitationRedirectUrl = Env.get('INVITATION_REDIRECT_URL');
const defaultRecipientEmail = Env.get('INVITATION_DEFAULT_EMAIL');

// Helper function to get invitation link (validates when called)
export const getInvitationLink = (): string => {
  if (!clerkSignupUrl || !invitationRedirectUrl || !defaultRecipientEmail) {
    throw new Error(
      'Invitation email configuration is missing. Please set CLERK_SIGNUP_URL, INVITATION_REDIRECT_URL, and INVITATION_DEFAULT_EMAIL.'
    );
  }
  return `${clerkSignupUrl}?email=${encodeURIComponent(
    defaultRecipientEmail
  )}&redirect_url=${encodeURIComponent(invitationRedirectUrl)}`;
};

// Legacy export for backward compatibility (will throw if not configured)
export const invitationLink = clerkSignupUrl && invitationRedirectUrl && defaultRecipientEmail
  ? `${clerkSignupUrl}?email=${encodeURIComponent(
      defaultRecipientEmail
    )}&redirect_url=${encodeURIComponent(invitationRedirectUrl)}`
  : '';

export const companyName = Env.get('COMPANY_NAME') ?? 'Fibonacci Innovations';

export const recipientEmail = defaultRecipientEmail ?? '';
export const brandColor = Env.get('COMPANY_BRAND_COLOR') ?? '#0066FF';
export const accentColor = Env.get('COMPANY_ACCENT_COLOR') ?? '#4318FF';
export const companyLogo = Env.get('COMPANY_LOGO_URL') ?? 'https://your-hrms-portal.com/logo.png';

export enum StatusEnum {
  INVITED = 'INVITED',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
}
