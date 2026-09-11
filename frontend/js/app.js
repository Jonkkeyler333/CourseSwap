import { initLoginView } from './views/loginView.js';
import { initDashboardView } from './views/dashboardView.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('login-form')) {
        initLoginView();
    } else if (document.getElementById('dashboard-home')) {
        console.log('dashboard')
        initDashboardView();
    }
});