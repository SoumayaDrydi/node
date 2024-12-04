const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const BorrowedBook = require('../models/BorrowedBook');
const User = require('../models/User');  // Assurez-vous que vous avez un modèle pour l'utilisateur

const router = express.Router();

// Emprunter un livre
router.post('/borrow/:bookId', async (req, res) => {
  try {
    console.log(`Corps de la requête reçu : ${JSON.stringify(req.body)}`);
    const { bookId } = req.params;
    const { userId } = req.body;

    // Vérifiez si l'ID utilisateur est valide
    console.log(`ID utilisateur reçu : ${userId}`);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    // Vérifiez si l'utilisateur existe dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      console.log(`Utilisateur non trouvé pour ID: ${userId}`);
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifiez si le livre existe et est disponible
    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      console.log(`Livre non disponible ou introuvable, ID du livre: ${bookId}`);
      return res.status(400).json({ message: 'Livre indisponible ou introuvable' });
    }

    // Créez l'entrée BorrowedBook
    const borrowedBook = new BorrowedBook({
      userId,
      bookId,
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 jours
    });
    await borrowedBook.save();

    // Marquez le livre comme indisponible
    book.available = false;
    await book.save();

    res.status(200).json({ message: 'Livre emprunté avec succès', borrowedBook });
  } catch (err) {
    console.error('Erreur lors de l\'emprunt du livre', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
}
// Récupérer les livres empruntés pour un utilisateur
router.get('/borrowed-books/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Vérifiez si l'ID utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    // Récupérer les livres empruntés pour cet utilisateur
    const borrowedBooks = await BorrowedBook.find({ userId }).populate('bookId');
    
    if (borrowedBooks.length === 0) {
      return res.status(404).json({ message: 'Aucun livre emprunté trouvé pour cet utilisateur' });
    }

    res.status(200).json(borrowedBooks);
  } catch (err) {
    console.error('Erreur lors de la récupération des livres empruntés', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});
);

module.exports = router;
