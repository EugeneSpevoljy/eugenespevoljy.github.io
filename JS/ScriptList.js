(() => {
    const scripts = [
        {
            src : "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
            integrity : "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
            crossorigin : "anonymous",
        },
        {
            src : "/JS/Navigation.js"
        }
    ]

    const body = document.body;

    scripts.forEach( script => {
        const scriptElement = document.createElement("script");
        for(const [key,value] of Object.entries(script)){
            scriptElement.setAttribute(key,value);
        }
        body.appendChild(scriptElement);
    });

})();