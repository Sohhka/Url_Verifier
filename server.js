const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Ajoutez cette ligne pour servir les fichiers statiques

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

// Route pour vérifier l'URL
app.post('/check-url', async (req, res) => {
    try {
        const { url } = req.body;
        const apiKey = process.env.API_KEY;
        
        // Première requête pour soumettre l'URL
        const submitResponse = await axios.post('https://www.virustotal.com/vtapi/v2/url/scan', null, {
            params: {
                apikey: apiKey,
                url: url
            }
        });

        // Attendre quelques secondes pour que l'analyse soit effectuée
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Deuxième requête pour obtenir le rapport
        const reportResponse = await axios.get('https://www.virustotal.com/vtapi/v2/url/report', {
            params: {
                apikey: apiKey,
                resource: url
            }
        });

        res.json(reportResponse.data);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            error: 'Une erreur est survenue',
            details: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
}); 