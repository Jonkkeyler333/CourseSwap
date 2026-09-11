import { AuthService } from "../auth.js";

export const initDashboardView = () => {
    AuthService.checkAuthGuard(true);

    const logoutButton = document.getElementById("logout-button");

    logoutButton.addEventListener("click", () => {
        AuthService.logout();
        window.location.href = "./index.html";
    })

    const userNameElement = document.getElementById("user-name");
    const navBarUserEmailElement = document.getElementById("navbar-user-name");
    const userCodeElement = document.getElementById("user-code");
    AuthService.me().then(userData => {
        console.log(userData)
        console.log('puto')
        userNameElement.textContent = userData.nombre;
        navBarUserEmailElement.textContent = userData.email;
        userCodeElement.textContent = "Código: " + userData.codigo;
    }).catch(error => {
        console.error("Error fetching user data:", error);
    });

}