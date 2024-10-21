document.addEventListener("DOMContentLoaded", () => {
  const startForm = document.getElementById("startForm");

  // Mapping each link to a billboard location
  const linkNames = {
    link1: "Yaba",
    link2: "Ojuelegba",
    link3: "Falomo (static)",
    link4: "Ibeju Lekki",
    link5: "Eko bridge",
  };

  // Start page logic (index.html)
  if (startForm) {
    startForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      localStorage.setItem("username", username);

      // Generate random sequence of links (link1 to link5)
      const links = Object.keys(linkNames); // ["link1", "link2", "link3", "link4", "link5"]
      const randomizedLinks = links.sort(() => 0.5 - Math.random());
      localStorage.setItem("linkSequence", JSON.stringify(randomizedLinks));
      localStorage.setItem("progress", 0); // Set initial progress to 0

      // Redirect to the first link in the sequence after inputting name
      window.location.href = `${randomizedLinks[0]}.html`;
    });
  }

  // Link page logic (link1.html, link2.html, etc.)
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");

  // Ensure we're not checking sequence on index.html, error.html, or prize.html
  if (
    currentPage !== "index" &&
    currentPage !== "error" &&
    currentPage !== "prize"
  ) {
    const progress = parseInt(localStorage.getItem("progress"), 10);
    const sequence = JSON.parse(localStorage.getItem("linkSequence"));

    if (!sequence || progress >= sequence.length) {
      // If no sequence is found or progress is corrupted, go to error page
      window.location.href = "error.html";
    } else if (sequence[progress] !== currentPage) {
      // If the user tries to access a page out of order, redirect to error page
      window.location.href = "error.html";
    } else {
      // Display the progress bar and the next link they should copy and paste
      updateProgressBar(progress, sequence.length); // Update progress bar

      const nextPageIndex = progress + 1;

      if (nextPageIndex < sequence.length) {
        // Show the name of the next link in the sequence using linkNames
        const messageContainer = document.createElement("section");
        messageContainer.innerHTML = `<div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      >
        <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
              class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
            >
              You've completed this step!
            </h1>
            <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          To proceed, scan the QR code on our ad at this location:</p>
          <p class="dark:text-white"><code>${linkNames[sequence[nextPageIndex]]}</code></p>
          </div>
        </div>
      </div>
          
        `;
        document.body.appendChild(messageContainer);

        // Update progress in local storage
        localStorage.setItem("progress", nextPageIndex);
      } else {
        // If this is the final link, redirect them to the prize page
        // Update progress in local storage to ensure it reflects completion
        localStorage.setItem("progress", nextPageIndex);
        window.location.href = "prize.html";
      }
    }
  }
});

// Function to update the progress bar
function updateProgressBar(progress, totalSteps) {
  const progressBarContainer = document.createElement("div");
  progressBarContainer.className =
    "w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700";

  const progressBar = document.createElement("div");
  progressBar.className = "bg-[#86c226] h-2.5 rounded-full";
  progressBar.style.width = `${((progress + 1) / totalSteps) * 100}%`;

  const progressText = document.createElement("p");
  progressText.className =
    "text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white";
  progressText.innerText = `Progress: ${
    progress + 1
  }/${totalSteps} steps completed`;
  progressText.style.textAlign = "center";
  progressText.style.margin = "0";
  progressText.style.color = "#000";

  progressBarContainer.appendChild(progressBar);
  document.body.appendChild(progressBarContainer);
  document.body.appendChild(progressText);
}
