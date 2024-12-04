const mongoose = require('mongoose');

// Définition du schéma pour un livre
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },  // Titre du livre
  author: { type: String, required: true },  // Auteur du livre
  category: { type: String, required: true },  // Catégorie du livre
  available: { type: Boolean, default: true },  // Si le livre est disponible ou non
});

// Création du modèle Book basé sur le schéma
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
