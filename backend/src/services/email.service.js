require('dotenv').config();
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // Redirect URI configured in Google Cloud
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Create the Gmail API client
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

// Helper to construct a RFC 2822 MIME email string and encode it to base64url
function createRawEmail({ to, from, subject, text, html }) {
  const boundary = '____boundary____';
  
  const emailLines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    text || '',
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    html || '',
    '',
    `--${boundary}--`,
  ];

  return Buffer.from(emailLines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}


async function sendVerificationOtpEmail(to, subject, text, html) {
  try {
    const raw = createRawEmail({
      from: `"InterviewGennie-AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
      },
    });

    console.log('Email sent successfully via Gmail API. Message ID:', res.data.id);
    return res.data;
  } catch (error) {
    console.error('Error sending email via Gmail API:', error?.response?.data || error.message);
    throw error;
  }
}

module.exports = { sendVerificationOtpEmail };