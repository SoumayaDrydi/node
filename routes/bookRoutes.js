const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');  // Importation du modèle Book
const router = express.Router();

// 1. Ajouter un livre
router.post('/', async (req, res) => {
  try {
    const { title, author, category, available } = req.body;

    const newBook = new Book({
      title,
      author,
      category,
      available,
    });

    await newBook.save();  // Sauvegarder le livre dans la base de données
    res.status(201).json(newBook);  // Retourner le livre ajouté
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du livre', error });
  }
});

// 2. Obtenir tous les livres
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();  // Récupérer tous les livres
    res.status(200).json(books);  // Retourner la liste des livres
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des livres', error });
  }
});

// 3. Modifier un livre
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;

  // Validation de l'ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json(updatedBook);  // Retourner le livre mis à jour
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification du livre', error });
  }
});

// 4. Supprimer un livre
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  // Validation de l'ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.status(200).json({ message: 'Livre supprimé avec succès' });  // Message de succès
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du livre', error });
  }
});

// 5. Rechercher des livres
router.get('/search', async (req, res) => {
  const { query } = req.query;  // Le paramètre de recherche unifié

  try {
    const queryFilter = {};
    if (query) {
      // Recherche par titre, auteur ou catégorie
      queryFilter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ];
    }

    const books = await Book.find(queryFilter);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche des livres', error });
  }
});


module.exports = router;
