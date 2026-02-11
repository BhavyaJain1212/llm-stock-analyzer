// check openAI api connection
document.getElementById("checkConnectionBtn").addEventListener("click", async () => {
  const status = document.getElementById("apiStatus");
  status.textContent = "Testing...";

  try {
    const response = await fetch("/check-api", {
      method: "POST"
    });

    const data = await response.json();

    if (data.success) {
      status.textContent = "✅ OpenAI API connected successfully";
    } else {
      status.textContent = "❌ API Error: " + data.error;
    }
  } catch (err) {
    status.textContent = "❌ Server error";
  }
});