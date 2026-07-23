import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, type } = await req.json();

    if (!email || !otp || !type) {
      return NextResponse.json({ error: 'Email, OTP, and type are required' }, { status: 400 });
    }

    const valid = verifyOTP(email, otp, type);

    if (!valid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'OTP verified' });
  } catch (err: any) {
    console.error('verify-otp error:', err);
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}
