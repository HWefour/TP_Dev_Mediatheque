const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const borrowController = require('../controllers/borrowController');
const { validateUUID, handleValidationErrors } = require('../middleware/validation');

const validateBorrow = [
  body('utilisateurId')
    .isUUID()
    .withMessage('ID utilisateur invalide'),
  body('ressourceId')
    .isUUID()
    .withMessage('ID ressource invalide'),
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Borrow:
 *       type: object
 *       required:
 *         - utilisateurId
 *         - ressourceId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique de l'emprunt
 *         utilisateurId:
 *           type: string
 *           format: uuid
 *           description: Identifiant de l'utilisateur emprunteur
 *         ressourceId:
 *           type: string
 *           format: uuid
 *           description: Identifiant de la ressource empruntée
 *         dateEmprunt:
 *           type: string
 *           format: date
 *           description: Date d'emprunt (format JJ-MM-AAAA)
 *           example: "15-12-2023"
 *         dateRetour:
 *           type: string
 *           format: date
 *           description: Date de retour prévue (format JJ-MM-AAAA)
 *           example: "29-12-2023"
 *         dateRetourEffective:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Date de retour effective (format JJ-MM-AAAA)
 *           example: "28-12-2023"
 *         utilisateur:
 *           $ref: '#/components/schemas/UserInfo'
 *         ressource:
 *           $ref: '#/components/schemas/ResourceInfo'
 *     
 *     UserInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         mail:
 *           type: string
 *         telephone:
 *           type: string
 *         nationalite:
 *           type: string
 *     
 *     ResourceInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         titre:
 *           type: string
 *         type:
 *           type: string
 *           enum: [Livre, Jeu, Film, Autre]
 *         auteur:
 *           type: string
 *         disponible:
 *           type: boolean
 *     
 *     BorrowCreate:
 *       type: object
 *       required:
 *         - utilisateurId
 *         - ressourceId
 *       properties:
 *         utilisateurId:
 *           type: string
 *           format: uuid
 *           description: UUID de l'utilisateur
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         ressourceId:
 *           type: string
 *           format: uuid
 *           description: UUID de la ressource à emprunter
 *           example: "987fcdeb-51a2-43d1-9c4b-123456789abc"
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         count:
 *           type: integer
 *         errors:
 *           type: array
 *           items:
 *             type: object
 */

/**
 * @swagger
 * tags:
 *   name: Borrows
 *   description: Gestion des emprunts de ressources
 */

/**
 * @swagger
 * /api/borrows:
 *   post:
 *     summary: Créer un nouvel emprunt
 *     description: Permet à un utilisateur d'emprunter une ressource disponible
 *     tags: [Borrows]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowCreate'
 *           example:
 *             utilisateurId: "123e4567-e89b-12d3-a456-426614174000"
 *             ressourceId: "987fcdeb-51a2-43d1-9c4b-123456789abc"
 *     responses:
 *       201:
 *         description: Emprunt créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Emprunt créé avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Borrow'
 *       400:
 *         description: Erreur de validation ou ressource non disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Ressource non disponible pour l'emprunt"
 *       404:
 *         description: Utilisateur ou ressource non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', validateBorrow, handleValidationErrors, borrowController.createBorrow);

/**
 * @swagger
 * /api/borrows:
 *   get:
 *     summary: Récupérer tous les emprunts
 *     description: Récupère la liste de tous les emprunts avec possibilité de filtrer
 *     tags: [Borrows]
 *     parameters:
 *       - in: query
 *         name: actif
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrer par statut d'activité (true = non retournés, false = retournés)
 *         example: "true"
 *     responses:
 *       200:
 *         description: Liste des emprunts récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Borrow'
 *                 count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', borrowController.getAllBorrows);

/**
 * @swagger
 * /api/borrows/{id}:
 *   get:
 *     summary: Récupérer un emprunt par ID
 *     description: Récupère les détails d'un emprunt spécifique avec les informations de l'utilisateur et de la ressource
 *     tags: [Borrows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID de l'emprunt
 *         example: "456e7890-e12b-34d5-a678-901234567def"
 *     responses:
 *       200:
 *         description: Emprunt trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Borrow'
 *       404:
 *         description: Emprunt non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Emprunt non trouvé"
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', validateUUID, handleValidationErrors, borrowController.getBorrowById);

/**
 * @swagger
 * /api/borrows/{id}/return:
 *   put:
 *     summary: Retourner une ressource empruntée
 *     description: Marque un emprunt comme retourné et rend la ressource disponible
 *     tags: [Borrows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID de l'emprunt à retourner
 *         example: "456e7890-e12b-34d5-a678-901234567def"
 *     responses:
 *       200:
 *         description: Ressource retournée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ressource retournée avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Borrow'
 *       400:
 *         description: Emprunt déjà retourné ou ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cet emprunt a déjà été retourné"
 *       404:
 *         description: Emprunt non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Emprunt non trouvé"
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id/return', validateUUID, handleValidationErrors, borrowController.returnBorrow);

/**
 * @swagger
 * /api/borrows/{id}:
 *   delete:
 *     summary: Supprimer un emprunt
 *     description: Supprime définitivement un emprunt et libère la ressource si elle n'était pas retournée
 *     tags: [Borrows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID de l'emprunt à supprimer
 *         example: "456e7890-e12b-34d5-a678-901234567def"
 *     responses:
 *       200:
 *         description: Emprunt supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Emprunt supprimé avec succès"
 *       404:
 *         description: Emprunt non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Emprunt non trouvé"
 *       400:
 *         description: ID invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/:id', validateUUID, handleValidationErrors, borrowController.deleteBorrow);

module.exports = router;