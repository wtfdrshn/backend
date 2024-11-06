import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    console.log('Sending OTP email to:', email); // Debug log

    const { data, error } = await resend.emails.send({
      from: 'Your App <onboarding@resend.dev>', // Update this with your verified domain
      to: email,
      subject: 'Login OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p>Your OTP for login is:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    });

    if (error) {
      console.error('Email error:', error);
      return false;
    }

    console.log('Email sent successfully:', data); // Debug log
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export default sendOTP; 