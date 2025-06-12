const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { validateResource, validateUUID, handleValidationErrors } = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       required:
 *         - titre
 *         - type
 *         - auteur
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique de la ressource
 *         titre:
 *           type: string
 *           description: Titre de la ressource
 *         type:
 *           type: string
 *           enum: [Livre, Jeu, Film, Autre]
 *           description: Type de ressource
 *         auteur:
 *           type: string
 *           description: Auteur/créateur/réalisateur
 *         disponible:
 *           type: boolean
 *           description: Disponibilité de la ressource
 */

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: Créer une nouvelle ressource
 *     tags: [Resources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Resource'
 *     responses:
 *       201:
 *         description: Ressource créée avec succès
 */
router.post('/', validateResource, handleValidationErrors, resourceController.createResource);

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: Récupérer toutes les ressources
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: disponible
 *         schema:
 *           type: boolean
 *         description: Filtrer par disponibilité
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Livre, Jeu, Film, Autre]
 *         description: Filtrer par type
 *     responses:
 *       200:
 *         description: Liste des ressources
 */
router.get('/', resourceController.getAllResources);

router.get('/:id', validateUUID, handleValidationErrors, resourceController.getResourceById);
router.put('/:id', validateUUID, validateResource, handleValidationErrors, resourceController.updateResource);
router.delete('/:id', validateUUID, handleValidationErrors, resourceController.deleteResource);

module.exports = router;