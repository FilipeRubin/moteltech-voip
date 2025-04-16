document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("suiteModal");
    const suiteCard = document.getElementById("suiteCard");

    suiteCard.addEventListener("click", () => {
        modal.showModal();
    });

    document.getElementById("closeModal").addEventListener("click", () => {
        modal.close();
    });
});