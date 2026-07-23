import { NextRequest, NextResponse } from 'next/server';
import { sendOTP } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { email, type } = await req.json();

    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type are required' }, { status: 400 });
    }

    if (!['signup', 'password_change', 'forgot_password'].includes(type)) {
      return NextResponse.json({ error: 'Invalid OTP type' }, { status: 400 });
    }

    await sendOTP(email, type);

    return NextResponse.json({ success: true, message: 'OTP sent to your email' });
  } catch (err: any) {
    console.error('send-otp error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send OTP' }, { status: 500 });
  }
}
