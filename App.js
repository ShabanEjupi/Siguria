// app.js
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Konfigurimi i EJS
app.set('view engine', 'ejs');

// Konfigurimi i dosjeve statike
app.use(express.static(path.join(__dirname, 'public')));

// Definimi i rutave
app.get('/', (req, res) => {
  res.render('pages/index', { 
    title: 'KoreaDrive.ks - Importuesi Juaj i Veturave Koreane në Prishtinë' 
  });
});

app.get('/cars', (req, res) => {
  res.render('pages/cars', { 
    title: 'Veturat Koreane - KoreaDrive.ks | Importuesi i Veturave Koreane në Prishtinë' 
  });
});

app.get('/about', (req, res) => {
  res.render('pages/about', { 
    title: 'Rreth nesh - KoreaDrive.ks | Premium Korean Cars in Pristina' 
  });
});

app.get('/contact', (req, res) => {
  res.render('pages/contact', { 
    title: 'Kontakti - KoreaDrive.ks | Importuesi i Veturave Koreane në Prishtinë' 
  });
});

// Startimi i serverit
app.listen(port, () => {
  console.log(`Serveri është duke punuar në portin ${port}`);
});