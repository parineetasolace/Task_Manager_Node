import sendEmail from "../utils/sendEmail.js";

export const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: "Welcome to Task Manager!",
    text: `Hi ${user.name}, welcome to our platform!`,
    html: `
        <h1>Welcome ${user.name}! </h1>
        <p>Thanks for creating an account. </p>
      `,
  });
};

export const sendAccountDeletionEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: "Sorry to see you go :(",
    text: `Goodbye ${user.name}, your account has been deleted.`,
    html: `
            <h1>Goodbye ${user.name}</h1>
            <p>Your account has been successfully deleted.</p>
            <p>We hope to see you again someday.</p>
          `,
  });
};
