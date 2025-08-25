export async function sendToWebhook(url: string, payload: any): Promise<void> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `request failed: ${response.status} ${response.statusText}`
      );
    }

    console.log("App :: Webhook sent successfully", url, payload);
  } catch (error) {
    console.error("App :: Error sending webhook:", error);
  }
}
