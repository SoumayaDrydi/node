// server.js (ou app.js)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes'); // Exemple, si vous avez des routes d'authentification
const bookRoutes = require('./routes/bookRoutes');
const borrowedBooksRoutes = require('./routes/borrowedBooksRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gestion_bibliotheque')
  .then(() => console.log('Connexion à MongoDB réussie sur gestion_bibliotheque'))
  .catch((err) => console.log('Erreur de connexion à MongoDB: ', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrowed-books', borrowedBooksRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
