import { initLoginView } from './views/loginView.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('login-form')) {
        initLoginView();
    }
});