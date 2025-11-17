type GenerateEmailTemplateProps = {
  companyName: string;
  recipientEmail: string;
  invitationLink: string;
  brandColor?: string;
  accentColor?: string;
  logo: string;
};

export const emailTemplate = ({
  companyName,
  recipientEmail,
  invitationLink,
  logo,
  brandColor = '#0066FF',
  accentColor = '#4318FF',
}: GenerateEmailTemplateProps) => {
  // Design tokens
  const colors = {
    primary: brandColor,
    accent: accentColor,
    text: {
      primary: '#2B3674',
      secondary: '#707EAE',
      light: '#A3AED0',
    },
    background: {
      main: '#FFFFFF',
      secondary: '#F4F7FE',
    },
  };

  const features = [
    {
      icon: '🎯',
      title: 'Performance Tracking',
      description: 'Monitor and improve your work progress',
    },
    {
      icon: '📅',
      title: 'Schedule Management',
      description: 'Flexible work hours and attendance tracking',
    },
    {
      icon: '💰',
      title: 'Payroll Access',
      description: 'Secure access to salary and benefits information',
    },
    {
      icon: '📋',
      title: 'Leave Management',
      description: 'Streamlined leave application process',
    },
    {
      icon: '📂',
      title: 'Document Hub',
      description: 'Centralized document management',
    },
    {
      icon: '🔔',
      title: 'Company Updates',
      description: 'Real-time company announcements',
    },
    {
      icon: '🤝',
      title: 'Team Connect',
      description: 'Enhanced collaboration tools',
    },
  ];

  return {
    to: recipientEmail,
    subject: `Welcome to ${companyName} HRMS Portal - Your Digital Workplace`,
    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invitation to ${companyName} HRMS</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              background-color: ${colors.background.main};
              color: ${colors.text.primary};
              font-family: 'Inter', sans-serif;
              line-height: 1.6;
            }

            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 30px;
              background: ${colors.background.main};
              border-radius: 12px;
              box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
              text-align: center;
            }

            .logo img {
              max-width: 150px;
              margin-bottom: 20px;
            }

            .title {
              font-size: 24px;
              font-weight: 700;
              color: ${colors.text.primary};
              margin-bottom: 16px;
            }

            .subtitle {
              font-size: 16px;
              color: ${colors.text.secondary};
              margin-bottom: 24px;
            }

            .features-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              margin: 24px 0;
            }

            .feature-card {
              background: ${colors.background.secondary};
              padding: 16px;
              border-radius: 12px;
              text-align: center;
              transition: transform 0.3s ease;
            }

            .feature-card:hover {
              transform: scale(1.05);
            }

            .feature-icon {
              font-size: 24px;
              margin-bottom: 10px;
            }

            .feature-title {
              font-size: 15px;
              font-weight: 600;
            }

            .feature-description {
              font-size: 13px;
              color: ${colors.text.secondary};
            }

            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);
              color: white;
              padding: 14px 28px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              margin: 30px 0;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              transition: transform 0.3s ease;
            }

            .cta-button:hover {
              transform: translateY(-3px);
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            }

            .footer {
              font-size: 12px;
              color: ${colors.text.light};
              border-top: 1px solid ${colors.background.secondary};
              padding-top: 16px;
              margin-top: 20px;
            }
            
            @media (max-width: 600px) {
              .features-grid {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src=${logo} alt=${companyName} Logo border="0">
            </div>
            
            <h1 class="title">Welcome to ${companyName} HRMS Portal</h1>
            <p class="subtitle">Your all-in-one platform for better work management</p>

            <div class="features-grid">
              ${features
                .map(
                  (feature) => `
                <div class="feature-card">
                  <div class="feature-icon">${feature.icon}</div>
                  <h3 class="feature-title">${feature.title}</h3>
                  <p class="feature-description">${feature.description}</p>
                </div>
              `
                )
                .join('')}
            </div>

            <a href="${invitationLink}" class="cta-button">
              🚀 Get Started Now
              <span class="icon">→</span>
            </a>

            <p style="color: ${colors.text.secondary}; margin-top: 16px;">
              If the button above doesn’t work, <a href="${invitationLink}" style="color: ${colors.primary}; text-decoration: underline;">click here</a>
            </p>

            <div class="footer">
              <p>This invitation was sent to ${recipientEmail}</p>
              <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};
