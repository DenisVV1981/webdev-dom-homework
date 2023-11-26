export function renderLogout({ logoutContainerElement, callback }) {
    const template = `
    <button id="logout-button" class="add-form-button"> Выйти </button>
    `;
    logoutContainerElement.innerHTML = template;
    document.getElementById("logout-button").addEventListener("click", () => {
        console.log("Вите надо выйти!!!!");
        logoutContainerElement.innerHTML = null;
        callback();
    });
}
