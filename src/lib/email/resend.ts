import Resend from "resend";

if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
  console.warn("Missing Resend configuration");
}

export async function sendMatchNotification({
  to,
  lostTitle,
  foundTitle,
  confidence,
}: {
  to: string;
  lostTitle: string;
  foundTitle: string;
  confidence: number;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return { success: false, error: "Resend not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject: `We found a ${confidence}% match for your lost item`,
      html: `
        <h1>Potential Match Found</h1>
        <p>We found a potential match for your lost item <strong>${lostTitle}</strong>.</p>
        <p>The found item is <strong>${foundTitle}</strong> with a confidence of <strong>${confidence}%</strong>.</p>
        <p>Log in to Sherlock AI to view details and connect with the finder.</p>
      `,
    });

    if (error) {
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function sendVerificationEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return { success: false, error: "Resend not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject: "Verify your Sherlock AI account",
      html: `
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyUrl}">Verify Email</a>
      `,
    });

    if (error) {
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
