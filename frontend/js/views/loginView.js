import { AuthService } from "../auth.js";

export const initLoginView = () => {
    AuthService.checkAuthGuard(false);

    const loginForm = document.getElementById("login-form");
    const alertMessage = document.getElementById("alert-message");
    const registerForm = document.getElementById("register-form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideAlert();
        
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        try {
            await AuthService.login(email, password)
            window.location.href = './dashboard.html'
        } catch (error) {
            showAlert(error.message || 'Error al iniciar sesion', 'danger')
        }
    })

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideAlert();

        const newUserData = {
            nombre: document.getElementById("reg-nombre").value.trim(),
            apellido: document.getElementById("reg-apellido").value.trim(),
            codigo: document.getElementById("reg-codigo").value.trim(),
            email: document.getElementById("reg-email").value.trim(),
            password: document.getElementById("reg-password").value.trim()
        }

        try {
            await AuthService.register(newUserData);
            showAlert('Cuenta creada exitosamente', 'success');
            registerForm.reset();
            const loginTab = new bootstrap.Tab(document.getElementById('login-tab'));
            loginTab.show();
        } catch (error) {
            showAlert(error.message || 'Error al crear cuenta', 'danger');
        }
    })

    function showAlert(msg, type = 'danger') {
        alertMessage.textContent = msg;
        alertMessage.className = `alert alert-${type} mt-3`; 
    }

    function hideAlert() {
        alertMessage.textContent = '';
        alertMessage.className = 'alert d-none';
    }

}