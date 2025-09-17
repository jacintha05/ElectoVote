import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || process.env.SMTP_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.SMTP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@electvote.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendVoteNotification(candidateName: string, candidateEmail: string, voterName: string): Promise<boolean> {
  const subject = 'New Vote Received - ElectVote Platform';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(to right, #1565C0, #0D47A1); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .vote-info { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #2E7D32; }
        .footer { text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🗳️ ElectVote Platform</h1>
          <p>Secure Digital Voting</p>
        </div>
        
        <div class="content">
          <h2>Congratulations! You've received a new vote</h2>
          
          <div class="vote-info">
            <h3>Vote Details:</h3>
            <p><strong>Candidate:</strong> ${candidateName}</p>
            <p><strong>Voter:</strong> ${voterName}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>A voter has successfully cast their vote for you in the General Election 2024. This notification confirms that your vote count has been updated in real-time.</p>
          
          <p>You can view your updated statistics and vote count by logging into your candidate portal.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from the ElectVote platform.</p>
          <p>🔒 Secure • ✅ Verified • 📱 Accessible</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    ElectVote Platform - New Vote Received
    
    Congratulations! You've received a new vote.
    
    Vote Details:
    - Candidate: ${candidateName}
    - Voter: ${voterName}
    - Time: ${new Date().toLocaleString()}
    
    A voter has successfully cast their vote for you in the General Election 2024. 
    You can view your updated statistics by logging into your candidate portal.
    
    This is an automated notification from the ElectVote platform.
  `;

  return await sendEmail({
    to: candidateEmail,
    subject,
    html,
    text,
  });
}
