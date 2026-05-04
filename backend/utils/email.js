const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

const emailTemplates = {
  bookingConfirmation: (booking, user) => ({
    subject: `✅ Booking Confirmed - ${booking.bookingId}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">HomeServices</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Your booking is confirmed!</p>
        </div>
        <div style="padding: 30px; background: #f8f9ff; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 18px;">Hi <strong>${user.name}</strong> 👋</p>
          <div style="background: white; border-radius: 10px; padding: 24px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <h3 style="color: #667eea; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; width: 40%;">Booking ID:</td><td style="padding: 8px 0; font-weight: 600; color: #333;">${booking.bookingId}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Service:</td><td style="padding: 8px 0; font-weight: 600; color: #333;">${booking.serviceSnapshot?.name || "Service"}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Date:</td><td style="padding: 8px 0; font-weight: 600; color: #333;">${new Date(booking.scheduledDate).toDateString()}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Time:</td><td style="padding: 8px 0; font-weight: 600; color: #333;">${booking.scheduledTime}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Status:</td><td style="padding: 8px 0;"><span style="background: #e8f5e9; color: #2e7d32; padding: 3px 10px; border-radius: 20px; font-size: 13px; font-weight: 600;">${booking.status}</span></td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Amount:</td><td style="padding: 8px 0; font-weight: 700; color: #667eea; font-size: 18px;">₹${booking.payment?.amount || 0}</td></tr>
            </table>
          </div>
          <p style="color: #888; font-size: 13px; text-align: center; margin-top: 20px;">Thank you for choosing HomeServices. We'll be at your doorstep on time!</p>
        </div>
      </div>
    `,
  }),

  statusUpdate: (booking, user, newStatus, note) => ({
    subject: `🔔 Booking Status Updated - ${booking.bookingId}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">HomeServices</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Booking Status Update</p>
        </div>
        <div style="padding: 30px; background: #f8f9ff; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 18px;">Hi <strong>${user.name}</strong> 👋</p>
          <p style="color: #555;">Your booking <strong>${booking.bookingId}</strong> status has been updated.</p>
          <div style="background: white; border-radius: 10px; padding: 24px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08); text-align: center;">
            <p style="color: #666; margin: 0 0 10px;">Current Status</p>
            <span style="background: #667eea; color: white; padding: 10px 30px; border-radius: 30px; font-size: 18px; font-weight: 700; display: inline-block;">${newStatus}</span>
            ${note ? `<p style="color: #555; margin-top: 15px; font-style: italic;">"${note}"</p>` : ""}
          </div>
          <div style="background: white; border-radius: 10px; padding: 20px; margin: 10px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #666; width: 40%;">Service:</td><td style="padding: 6px 0; font-weight: 600;">${booking.serviceSnapshot?.name}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Date:</td><td style="padding: 6px 0; font-weight: 600;">${new Date(booking.scheduledDate).toDateString()}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Time:</td><td style="padding: 6px 0; font-weight: 600;">${booking.scheduledTime}</td></tr>
            </table>
          </div>
          <p style="color: #888; font-size: 13px; text-align: center; margin-top: 20px;">If you have any questions, please contact our support team.</p>
        </div>
      </div>
    `,
  }),

  welcome: (user) => ({
    subject: "🎉 Welcome to Helpmate !",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px;">Welcome! 🏠</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 18px;">HomeServices is at your service</p>
        </div>
        <div style="padding: 30px; background: #f8f9ff; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="color: #333; font-size: 20px;">Hi <strong>${user.name}</strong>! 👋</p>
          <p style="color: #555; font-size: 16px;">Your account has been created successfully. You're all set to book professional home services!</p>
          <div style="background: white; border-radius: 10px; padding: 24px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <p style="color: #667eea; font-weight: 700; margin: 0 0 5px;">Your Account Details</p>
            <p style="color: #333; margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
            <p style="color: #333; margin: 5px 0;"><strong>Mobile:</strong> ${user.mobile}</p>
          </div>
          <p style="color: #888; font-size: 13px; margin-top: 20px;">Thank you for choosing HomeServices!</p>
        </div>
      </div>
    `,
  }),
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"HomeServices" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    return false;
  }
};

module.exports = { sendEmail, emailTemplates };
