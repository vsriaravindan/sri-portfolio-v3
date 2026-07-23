import nodemailer from 'nodemailer';

// ── In-memory OTP store (expires after 5 min) ──
const otpStore = new Map<string, { otp: string; expires: number; type: string }>();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

export async function sendOTP(email: string, type: 'signup' | 'password_change' | 'forgot_password'): Promise<string> {
  const otp = generateOTP();
  const expires = Date.now() + 5 * 60 * 1000; // 5 min

  // Store OTP
  otpStore.set(email, { otp, expires, type });

  const subject =
    type === 'signup' ? 'Verify your email — Sri Aravindan' :
    type === 'password_change' ? 'Confirm password change — Sri Aravindan' :
    'Reset your password — Sri Aravindan';

  const body =
    type === 'signup' ? `Your verification code is: ${otp}\n\nEnter this code to activate your account. It expires in 5 minutes.` :
    type === 'password_change' ? `Your verification code is: ${otp}\n\nEnter this code to change your password. It expires in 5 minutes.` :
    `Your password reset code is: ${otp}\n\nEnter this code to reset your password. It expires in 5 minutes.`;

  const transporter = getTransporter();
  if (transporter) {
    await transporter.sendMail({
      from: `"Sri Aravindan" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      text: body,
    });
  } else {
    console.log(`[OTP] SMTP not configured — would send to ${email}: ${otp}`);
  }

  return otp; // return so tests can verify
}

export function verifyOTP(email: string, otp: string, type: string): boolean {
  const entry = otpStore.get(email);
  if (!entry) return false;
  if (entry.type !== type) return false;
  if (Date.now() > entry.expires) {
    otpStore.delete(email);
    return false;
  }
  if (entry.otp !== otp) return false;
  otpStore.delete(email);
  return true;
}

/** For clean-up / testing */
export function _clearOTP(email: string) {
  otpStore.delete(email);
}
