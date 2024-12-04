const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Clé secrète pour JWT (à placer dans un fichier .env dans un vrai projet)
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

// Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Accès refusé, token manquant' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier les rôles
const verifyRole = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: 'Accès interdit' });
  }
  next();
};

// Route d'inscription
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Vérifie si l'utilisateur existe déjà
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "L'utilisateur existe déjà" });
  }

  // Hashage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    password: hashedPassword,
    role: role || 'user', // Par défaut, rôle "user"
  });

  await newUser.save();
  res.status(201).json({ message: "Utilisateur créé avec succès" });
});

// Route de connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Mot de passe incorrect" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, role: user.role });
});

// Route protégée pour les utilisateurs
router.get('/user', verifyToken, (req, res) => {
  if (req.user.role === 'user') {
    res.json({ message: 'Bienvenue utilisateur' });
  } else {
    res.status(403).json({ message: 'Accès interdit' });
  }
});

// Route protégée pour les administrateurs
router.get('/admin', verifyToken, verifyRole('admin'), (req, res) => {
  res.json({ message: 'Bienvenue admin' });
});

module.exports = router;
