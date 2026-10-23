type BroadcastPayload = {
  to: string[];
  subject: string;
  html: string;
};

export async function sendProgressBroadcast(payload: BroadcastPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || payload.to.length === 0) {
    console.info("[resend:dry-run]", {
      subject: payload.subject,
      recipients: payload.to.length,
    });
    return { sent: false, dryRun: true, recipients: payload.to.length };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "WakafTracker <notif@wakaftracker.id>",
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[resend:error]", text);
    return { sent: false, dryRun: false, error: text };
  }

  return { sent: true, dryRun: false, recipients: payload.to.length };
}
