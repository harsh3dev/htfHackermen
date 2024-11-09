function findEthereumAddresses() {
    const regex = /0x[a-fA-F0-9]{40}/g;
    const bodyText = document.body.text;
    console.log("called again",bodyText)
    return bodyText.match(regex);
}

function extractAddressFromUrl(){
    const url = window.location.href;
    const ethAddressRegex = /0x[a-fA-F0-9]{40}/; 
    const match = url.match(ethAddressRegex);
    console.log("called again",match)
    if (match) {
        return match[0]; 
    }
    return null; 
}

function createRiskScorePopup(riskScore) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000001';

    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = '#fff';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1000002';
    popup.style.width = '300px';
    popup.style.textAlign = 'center';

    const riskScoreText = document.createElement('p');
    riskScoreText.textContent = `Risk Score: ${riskScore}`;
    riskScoreText.style.fontSize = '18px';
    riskScoreText.style.fontWeight = 'bold';
    riskScoreText.style.marginBottom = '20px';

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    popup.appendChild(closeButton);
    popup.appendChild(riskScoreText);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

function createCheckRiskScoreButton(address) {
    if (document.querySelector(`#risk-button-${address}`)) {
        return; 
    }

    const button = document.createElement('button');
    button.id = `risk-button-${address}`;
    button.textContent = 'Check Risk Score';
    button.style.position = 'fixed';
    button.style.top = '120px';
    button.style.right = '20px';
    button.style.padding = '12px 18px'; 
    button.style.backgroundColor = 'black';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; 
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px'; 
    button.style.fontWeight = 'bold'; 
    button.style.zIndex = '1000000';
    button.style.transition = 'all 0.3s ease';

    const spinner = document.createElement('div');
    spinner.style.border = '3px solid #f3f3f3'; 
    spinner.style.borderTop = '3px solid #3498db'; 
    spinner.style.borderRadius = '50%';
    spinner.style.width = '14px';
    spinner.style.height = '14px';
    spinner.style.animation = 'spin 1s linear infinite';
    spinner.style.marginLeft = '10px';
    spinner.style.display = 'none';

    button.appendChild(spinner);

    button.addEventListener('click', () => {
        button.textContent = 'Checking...';
        spinner.style.display = 'inline-block';
        button.disabled = true;

        chrome.runtime.sendMessage({ action: 'fetchRiskScore', address }, (response) => {
            button.disabled = false;
            button.textContent = 'Check Risk Score';
            spinner.style.display = 'none';

            createRiskScorePopup(response.riskScore || 'Unknown');
        });
    });

    document.body.appendChild(button);
}

// Ensure the spinner CSS is added only once
if (!document.querySelector('#spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    `;
 document.head.appendChild(style);
}


const addresses = findEthereumAddresses();
if (addresses && addresses.length > 0) {
    createCheckRiskScoreButton(addresses[0]); 
}

const addressFromUrl = extractAddressFromUrl();
if (addressFromUrl) {
    createCheckRiskScoreButton(addressFromUrl); 
}

