import axios from "axios";

// 웹훅을 통해 메시지 전송
export async function sendWebhook(message) {
  const webhookURL = process.env.MM_WEBHOOK_URL;
  const body = { text: message };

  try {
    const response = await axios.post(webhookURL, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);

    throw new Error(`Failed to send Mattermost webhook: ${reason}`, {
      cause: error,
    });
  }
}
