document.addEventListener('DOMContentLoaded', function () {
    const originalInput = document.getElementById('original');
    const replacementInput = document.getElementById('replacementData');
    const contentTypeSelect = document.getElementById('contentType');
    const saveBtn = document.getElementById('save');

    // Load saved settings
    browser.storage.local.get(['originalUrl', 'replacementData', 'contentType'])
        .then(function (result) {
            if (result.originalUrl) {
                originalInput.value = result.originalUrl;
            }
            if (result.replacementData) {
                replacementInput.value = result.replacementData;
            }
            if (result.contentType) {
                contentTypeSelect.value = result.contentType;
            }
        });

    // Save settings
    saveBtn.addEventListener('click', function () {
        browser.storage.local.set({
            originalUrl: originalInput.value,
            replacementData: replacementInput.value,
            contentType: contentTypeSelect.value
        }).then(function () {
            saveBtn.textContent = 'Saved';
            saveBtn.style.background = 'linear-gradient(135deg, #28a745, #218838, #1e7e34)';
            setTimeout(function () {
                saveBtn.textContent = 'Save Settings';
                saveBtn.style.background = 'linear-gradient(135deg, #4ea1ff, #0078d7, #00b4d8)';
            }, 2000);
        });
    });
});