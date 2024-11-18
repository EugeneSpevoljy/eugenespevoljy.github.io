// Navigation.js
(function () {
    
    const navItems = [
        { title: "Home", url: "/index.html" },
        { title: "About", url: "/HTML/about.html" },
        { title: "Services", url: "/HTML/services.html" },
    ];

    const navigationContainer = document.querySelector('.Navigation');

    if (navigationContainer) {
        const navElement = document.createElement('nav');
        navElement.className = 'navbar navbar-expand-lg navbar-light bg-light';

        navElement.innerHTML = `
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Eugene's Website</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        ${navItems.map(item => `
                            <li class="nav-item">
                                <a class="nav-link" href="${item.url}">${item.title}</a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;

        navigationContainer.appendChild(navElement);

        // Add 'active' class to the current page link
        const currentPage = window.location.pathname.split('/').pop();
        const links = navElement.querySelectorAll('.nav-link');
        links.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
})();
