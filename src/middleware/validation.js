const { body, param, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors.array(),
    });
  }
  next();
};

// Validations pour les utilisateurs
const validateUser = [
  body('nom')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('prenom')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('mail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Adresse email invalide'),
  body('telephone')
    .matches(/^[\+]?[\d\s\-\(\)]{8,15}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('nationalite')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La nationalité doit contenir entre 2 et 50 caractères'),
];

// Validations pour les ressources
const validateResource = [
  body('titre')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Le titre doit contenir entre 1 et 200 caractères'),
  body('type')
    .isIn(['Livre', 'Jeu', 'Film', 'Autre'])
    .withMessage('Type invalide (Livre, Jeu, Film, Autre)'),
  body('auteur')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('L\'auteur doit contenir entre 1 et 100 caractères'),
];

// Validation pour UUID
const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('ID invalide'),
];

// Validations pour les emprunts
const validateBorrow = [
  body('utilisateurId')
    .isUUID()
    .withMessage('ID utilisateur invalide'),
  body('ressourceId')
    .isUUID()
    .withMessage('ID ressource invalide'),
];

module.exports = {
  handleValidationErrors,
  validateUser,
  validateResource,
  validateUUID,
  validateBorrow,
};