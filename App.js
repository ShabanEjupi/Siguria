// app.js
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Konfigurimi për dosjet statike
app.use(express.static(path.join(__dirname)));

// Definimi i rutave për fajlla HTML
app.get('/', (req, res) => {
    res.sendFile('c:/xampp/htdocs/KoreaPremium/KoreaDrive.ks/index.html');
});

app.get('/cars', (req, res) => {
    res.sendFile('c:/xampp/htdocs/KoreaPremium/KoreaDrive.ks/cars.html');
});

app.get('/cars.html', (req, res) => { // Shtuar rrugë alternative
    res.sendFile('c:/xampp/htdocs/KoreaPremium/KoreaDrive.ks/cars.html');
});

app.get('/about', (req, res) => {
    res.sendFile('c:/xampp/htdocs/KoreaPremium/KoreaDrive.ks/about.html');
});

app.get('/about.html', (req, res) => { // Shtuar rrugë alternative
    res.sendFile('c:/xampp/htdocs/KoreaPremium/KoreaDrive.ks/about.html');

});

app.get('/contact', (req, res) => {
    res.sendFile('c:/xampp/htdocs/KoreaPremium/KoreaDrive.ks/contact.html');
});

app.get('/contact.html', (req, res) => { // Shtuar rrugë alternative
    res.sendFile('c:/xampp/htdocs/KoreaPremium/KoreaDrive.ks/contact.html');
});

// Gjithashtu, shtoni një route për header.html dhe footer.html nëse i ngarkoni me AJAX
app.get('/header.html', (req, res) => {
    res.sendFile('c:/xampp/htdocs/KoreaPremium/KoreaDrive.ks/header.html');
});

app.get('/footer.html', (req, res) => {
    res.sendFile('c:/xampp/htdocs/KoreaPremium/KoreaDrive.ks/footer.html');
});

// Raportoni 404 për rrugët e tjera
app.use((req, res) => {
  console.log(`404 për rrugën: ${req.path}`);
  res.status(404).send('Faqja nuk u gjet');
});

// Startimi i serverit
app.listen(port, () => {
  console.log(`Serveri është duke punuar në portin ${port}`);
  console.log(`Direktoria e projektit: ${__dirname}`);
});