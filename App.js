// app.js
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Konfigurimi për dosjet statike - kjo i bën të gjitha fajllat në direktorinë e projektit të disponueshme
app.use(express.static(__dirname));

// Rutë e thjeshtë për faqen kryesore
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Startimi i serverit
app.listen(port, () => {
    console.log(`Serveri është duke punuar në portin ${port}`);
    console.log(`Direktoria e projektit: ${__dirname}`);
});