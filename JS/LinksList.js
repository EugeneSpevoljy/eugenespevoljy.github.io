(() => {
    const links = [
        {
            rel: "stylesheet",
            href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
            integrity: "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
            crossorigin: "anonymous"
        },
        {
            rel: "stylesheet",
            href: "/CSS/Global.css"
        },
        {
            rel: "preconnect",
            href: "https://fonts.googleapis.com"
        },
        {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: ""
        },
        {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap"
        }
    ];

    const head = document.head;

    links.forEach(link => {
        const linkElement = document.createElement("link");
        for (const [key, value] of Object.entries(link)) {
            linkElement.setAttribute(key, value);
        }
        head.appendChild(linkElement);
    });
})();