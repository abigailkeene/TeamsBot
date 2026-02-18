async function askAI() {
  const question = document.getElementById("question").value;
  const answerDiv = document.getElementById("answer");

  if (!question.trim()) {
    answerDiv.innerText = "Please enter a question.";
    return;
  }

  answerDiv.innerText = "Thinking...";

  try {
    const response = await fetch("https://staff-ai.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await response.json();
    answerDiv.innerText = data.answer || "No response received.";
  } catch (error) {
    answerDiv.innerText = "Unable to connect to the Staff AI service. Please try again later.";
  }
}


/* Floating chatbot toggle logic */

const chatbotButton = document.getElementById("chatbot-button");
const chatbotFrame = document.getElementById("chatbot-frame");

if (chatbotButton && chatbotFrame) {
  chatbotButton.addEventListener("click", () => {
    if (chatbotFrame.style.display === "block") {
      chatbotFrame.style.display = "none";
    } else {
      chatbotFrame.style.display = "block";
    }
  });
}
