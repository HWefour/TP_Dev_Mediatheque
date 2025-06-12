const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { validateUUID, validateBorrow, handleValidationErrors } = require('../middleware/validation');

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
 *         utilisateurId:
 *           type: string
 *           format: uuid
 *         ressourceId:
 *           type: string
 *           format: uuid
 *         dateEmprunt:
 *           type: string
 *           format: date
 *         dateRetour:
 *           type: string
 *           format: date
 *         dateRetourEffective:
 *           type: string
 *           format: date
 */

router.post('/', validateBorrow, handleValidationErrors, borrowController.createBorrow);
router.get('/', borrowController.getAllBorrows);
router.get('/:id', validateUUID, handleValidationErrors, borrowController.getBorrowById);
router.put('/:id/return', validateUUID, handleValidationErrors, borrowController.returnBorrow);
router.delete('/:id', validateUUID, handleValidationErrors, borrowController.deleteBorrow);

module.exports = router;