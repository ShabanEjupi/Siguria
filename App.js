// app.js
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Konfigurimi për dosjet statike
app.use(express.static(path.join(__dirname)));

// Definimi i rutave për fajlla HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cars', (req, res) => {
  res.sendFile(path.join(__dirname, 'cars.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// Startimi i serverit
app.listen(port, () => {
  console.log(`Serveri është duke punuar në portin ${port}`);
});