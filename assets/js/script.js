const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeBtn = document.getElementById("closeBtn");

/* Open Menu */
menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("active");
});

/* Close Menu */
closeBtn.addEventListener("click", () => {
    sideMenu.classList.remove("active");
});

//=============================================================

function openInfo() {
    document.getElementById("infoBox").classList.add("active");
}

function closeInfo() {
    document.getElementById("infoBox").classList.remove("active");
}

//=============================================================









// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registered: ', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed: ', error);
            });
    });
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function () {
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Set default active section
    document.querySelector('#about').classList.add('active');

    // Navigation click handler
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            // Hide all sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // Show target section
            document.getElementById(targetId).classList.add('active');

            // Update active nav item (optional visual feedback)
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Install prompt functionality
    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');
    const cancelInstall = document.getElementById('cancelInstall');
    let deferredPrompt;

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the install prompt
        installPrompt.classList.add('show');
    });

    // Install button click handler
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            installPrompt.classList.remove('show');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the saved prompt since it can't be used again
        deferredPrompt = null;
    });

    // Cancel install button
    cancelInstall.addEventListener('click', () => {
        installPrompt.classList.remove('show');
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installPrompt.classList.remove('show');
        deferredPrompt = null;
    });

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is running in standalone mode');
    }
});