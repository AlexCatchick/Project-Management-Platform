import Mailgen from 'mailgen';
import Nodemail from 'nodemailer';

const sendEmail = async (options) => {
    const mailGen = new Mailgen({
        theme: "default",
        product: {
            name: "Project Camp",
            link: "https://projectcamp.com"
        }
    });

    const emailTextual = mailGen.generatePlaintext(options.mailgenContent);
    const emailHtml = mailGen.generate(options.mailgenContent);

    const emailTransporter = Nodemail.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    });

    const email = {
        from: "mail.projectcamp@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    };

    try {
        await emailTransporter.sendMail(email);
    } catch (error) {
        console.error("Email service failed silently. Make sure you have set MailTrap credentials properly", error);
    }
};

const emailVerify = (username, verifiedURL) => {
    return {
        body: {
            name: username,
            intro: "Welcome to Project Camp! We're excited to have you onboard.",
            action: {
                instructions: "To verify your email, click on the button below",
                button: {
                    color: "#22B634",
                    text: "Verify your email",
                    link: verifiedURL
                },
            },
            outro: "If you have any questions, feel free to reply to this email."
        }
    };
};

const forgotPasswordEmail = (username, verifiedURL) => {
    return {
        body: {
            name: username,
            intro: "We received a request to reset your password.",
            action: {
                instructions: "To reset your password, click on the button below",
                button: {
                    color: "#0d3511ff",
                    text: "Reset Password",
                    link: verifiedURL
                },
            },
            outro: "If you didn't request this, you can safely ignore this email."
        }
    };
};

export default { sendEmail, emailVerify, forgotPasswordEmail };