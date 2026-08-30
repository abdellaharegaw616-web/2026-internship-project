const nodemailer = require('nodemailer');

// Check if email credentials are configured
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

const transporter = isEmailConfigured ? nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}) : null;

const sendEmail = async (to, subject, html) => {
  if (!isEmailConfigured) {
    console.log('⚠️ Email not configured - skipping email send');
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

const sendTaskAssignedEmail = async (userEmail, taskTitle, projectName, dueDate) => {
  const subject = `New Task Assigned: ${taskTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Task Assigned</h2>
      <p>You have been assigned a new task:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        <p><strong>Task:</strong> ${taskTitle}</p>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      </div>
      <p>Please log in to the Task Flow system to view the task details.</p>
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;
  await sendEmail(userEmail, subject, html);
};

const sendProjectCreatedEmail = async (userEmail, projectName, projectDescription) => {
  const subject = `New Project Created: ${projectName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Project Created</h2>
      <p>A new project has been created:</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Description:</strong> ${projectDescription || 'No description'}</p>
      </div>
      <p>Please log in to the Task Flow system to view the project details.</p>
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;
  await sendEmail(userEmail, subject, html);
};

const sendDueDateReminderEmail = async (userEmail, taskTitle, projectName, dueDate) => {
  const subject = `Task Due Soon: ${taskTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d32f2f;">Task Due Soon</h2>
      <p>The following task is due soon:</p>
      <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #ffc107;">
        <p><strong>Task:</strong> ${taskTitle}</p>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      </div>
      <p>Please complete the task before the due date.</p>
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;
  await sendEmail(userEmail, subject, html);
};

module.exports = {
  sendEmail,
  sendTaskAssignedEmail,
  sendProjectCreatedEmail,
  sendDueDateReminderEmail,
};
