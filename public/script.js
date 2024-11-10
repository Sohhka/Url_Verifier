document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const checkButton = document.getElementById('checkButton');
    const resultDiv = document.getElementById('result');

    checkButton.addEventListener('click', async () => {
        resultDiv.innerHTML = 'Vérification en cours...';
        const url = urlInput.value;
        if (!url) {
            resultDiv.innerHTML = 'Veuillez entrer une URL';
            return;
        }

        try {
            console.log('Envoi de la requête pour:', url);
            const response = await fetch('http://localhost:3000/check-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();
            
            if (data.response_code === 1) {
                const isUrlSafe = data.positives === 0;
                let resultHTML = '';

                if (isUrlSafe) {
                    resultHTML = `
                        <div class="result-container safe">
                            <h2>Cette URL semble sûre ✅</h2>
                            <p>Analysé le: ${new Date(data.scan_date).toLocaleString()}</p>
                            <p>Total des scanners: ${data.total}</p>
                        </div>
                    `;
                } else {
                    resultHTML = `
                        <div class="result-container unsafe">
                            <h2>⚠️ Cette URL est potentiellement dangereuse ⚠️</h2>
                            <p>Détections: ${data.positives}/${data.total} scanners ont détecté des menaces</p>
                            <p>Analysé le: ${new Date(data.scan_date).toLocaleString()}</p>
                            <h3>Détails des menaces détectées:</h3>
                            <div class="threats-list">
                    `;

                    // Ajouter les détails de chaque scanner ayant détecté une menace
                    for (const [scanner, result] of Object.entries(data.scans)) {
                        if (result.detected) {
                            resultHTML += `
                                <div class="threat-item">
                                    <strong>${scanner}</strong>: ${result.result || 'Menace détectée'}
                                </div>
                            `;
                        }
                    }

                    resultHTML += `
                            </div>
                            <p class="permalink">Pour plus de détails, consultez le rapport complet sur 
                                <a href="${data.permalink}" target="_blank">VirusTotal</a>
                            </p>
                        </div>
                    `;
                }
                
                resultDiv.innerHTML = resultHTML;
            } else {
                resultDiv.innerHTML = 'Impossible de vérifier cette URL';
            }
        } catch (error) {
            console.error('Erreur frontend:', error);
            resultDiv.innerHTML = 'Erreur lors de la vérification';
        }
    });
});
