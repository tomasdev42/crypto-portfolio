import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { EMAIL_USER, EMAIL_PASS } = process.env;

// if (!EMAIL_USER || !EMAIL_PASS) {
//   throw new Error(
//     "Email User/Email Pass have not been defined in the environment variables"
//   );
// }

export const transporter =
  EMAIL_USER && EMAIL_PASS
    ? nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      })
    : null;
