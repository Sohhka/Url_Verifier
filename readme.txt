projet/
  ├── index.html
  ├── styles.css
  ├── script.js
  ├── server/
      ├── server.js
      └── config.js


index.html :

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérificateur d'URL</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Vérificateur de Sécurité URL</h1>
        <div class="url-checker">
            <input type="url" id="urlInput" placeholder="Collez votre URL ici">
            <button id="checkButton">Vérifier</button>
        </div>
        <div id="result" class="result-container">
            <!-- Les résultats seront affichés ici -->
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>

styles.css :

.container {
    max-width: 800px;
    margin: 50px auto;
    text-align: center;
    padding: 20px;
}

.url-checker {
    margin: 30px 0;
}

#urlInput {
    width: 70%;
    padding: 12px;
    font-size: 16px;
    border: 2px solid #ddd;
    border-radius: 4px;
}

#checkButton {
    padding: 12px 24px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.result-container {
    margin-top: 20px;
    padding: 20px;
    border-radius: 4px;
}

.safe {
    background-color: #dff0d8;
    color: #3c763d;
}

.unsafe {
    background-color: #f2dede;
    color: #a94442;
}

server.js :

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY; // Votre clé API

app.post('/check-url', async (req, res) => {
    try {
        const { url } = req.body;
        // Logique de vérification avec l'API choisie
        // Exemple avec VirusTotal
        const response = await axios.post('https://www.virustotal.com/vtapi/v2/url/report', null, {
            params: {
                apikey: API_KEY,
                resource: url
            }
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la vérification' });
    }
});

app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});


bash : 

npm install express cors axios dotenv