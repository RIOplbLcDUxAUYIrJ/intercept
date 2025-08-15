// Configuration with response data
let config = {
    originalUrl: "https://example.com/original-path",
    replacementData: "Hello, this is custom response data!",
    enabled: true,
    contentType: "text/plain"
};

// Load settings from storage
function loadConfig() {
    return browser.storage.local.get(Object.keys(config)).then(result => {
        console.log("Loaded config:", result);
        Object.assign(config, result);
        return config;
    });
}

// Create a response object
function createResponse(data, contentType) {
    return {
        redirectUrl: "data:" + contentType + "," + encodeURIComponent(data)
    };
}

// Intercept and respond with custom data
function interceptRequest(requestDetails) {
    if (!config.enabled) {
        return {};
    }

    if (requestDetails.url === config.originalUrl) {
        console.log(`Intercepting request to: ${config.originalUrl}`);
        console.log(`Responding with custom data`);

        return createResponse(config.replacementData, config.contentType);
    }

    return {};
}

// Initialize the extension
function init() {
    loadConfig().then(() => {
        // Remove existing listener if any
        browser.webRequest.onBeforeRequest.removeListener(interceptRequest);

        // Add the listener
        browser.webRequest.onBeforeRequest.addListener(
            interceptRequest,
            { urls: ["<all_urls>"] },
            ["blocking"]
        );

        console.log("Interceptor active for:", config.originalUrl);
    }).catch(console.error);
}

// Watch for settings changes
browser.storage.onChanged.addListener((changes, area) => {
    console.log("Config changed:", changes);
    if (Object.keys(changes).some(key => key in config)) {
        loadConfig().then(() => {
            console.log("Updated interceptor with new config");
        });
    }
});

// Open options page when browser action is clicked
browser.browserAction.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
});

// Start the extension
init();