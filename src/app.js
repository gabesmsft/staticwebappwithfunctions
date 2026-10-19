(async function loadMessage() {
  const message = document.getElementById("message");

  try {
    const response = await fetch("/api/message");
    if (!response.ok) {
      throw new Error(`API request failed (${response.status}).`);
    }

    const data = await response.json();
    if (typeof data.text !== "string" || data.text.length === 0) {
      throw new Error("The API returned an invalid message.");
    }

    message.textContent = data.text;
  } catch (error) {
    console.error("Unable to load the API message.", error);
    message.textContent = "Unable to load the API message. Please try refreshing the page.";
  }
})();
