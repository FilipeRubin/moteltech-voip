
function listenEvents() {
  const callToReceptionButton = document.querySelector("#btn--call-to-reception");

  callToReceptionButton.addEventListener("click",callTo);
}

document.addEventListener("DOMContentLoaded", listenEvents);

