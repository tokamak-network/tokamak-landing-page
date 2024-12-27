import { Resend } from "resend";

const resend = new Resend("re_123456789");

export const handleSubscribe = async (email: string) => {
  try {
    const data = await resend.emails.send({
      from: "hello@tokamak.network",
      to: email,
      subject: "Welcome to Tokamak Network Newsletter",
      html: "<p>Thanks for subscribing!</p>",
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};
