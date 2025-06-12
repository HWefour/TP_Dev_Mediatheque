const Borrow = require('../models/Borrow');
const User = require('../models/User');
const Resource = require('../models/Resource');
const { transformBorrowData, calculateReturnDate } = require('../utils/helpers');

class BorrowController {
  // Créer un emprunt
  async createBorrow(req, res) {
    try {
      const { utilisateurId, ressourceId } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await User.findByUuid(utilisateurId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      }

      // Vérifier si la ressource existe et est disponible
      const resource = await Resource.findByUuid(ressourceId);
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Ressource non trouvée',
        });
      }

      if (!resource.disponible) {
        return res.status(400).json({
          success: false,
          message: 'Ressource non disponible pour l\'emprunt',
        });
      }

      const dateEmprunt = new Date();
      const dateRetour = calculateReturnDate(dateEmprunt);

      // Obtenir les IDs internes
      const utilisateurInternalId = await Borrow.getUserIdByUuid(utilisateurId);
      const ressourceInternalId = await Borrow.getResourceIdByUuid(ressourceId);

      // Créer l'emprunt
      const borrow = await Borrow.create({
        utilisateur_id: utilisateurInternalId,
        ressource_id: ressourceInternalId,
        date_emprunt: dateEmprunt,
        date_retour: dateRetour,
      });

      // Marquer la ressource comme non disponible
      await Resource.updateAvailability(ressourceId, false);

      res.status(201).json({
        success: true,
        message: 'Emprunt créé avec succès',
        data: transformBorrowData(borrow),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'emprunt',
        error: error.message,
      });
    }
  }

  // Obtenir tous les emprunts
  async getAllBorrows(req, res) {
    try {
      const { actif } = req.query;
      const filters = {};

      if (actif === 'true') {
        filters.actif = true;
      } else if (actif === 'false') {
        filters.actif = false;
      }

      const borrows = await Borrow.findAll(filters);
      const transformedBorrows = borrows.map(borrow => transformBorrowData(borrow));

      res.json({
        success: true,
        data: transformedBorrows,
        count: transformedBorrows.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des emprunts',
        error: error.message,
      });
    }
  }

  // Obtenir un emprunt par UUID
  async getBorrowById(req, res) {
    try {
      const { id } = req.params;
      
      const borrow = await Borrow.findByUuidWithRelations(id);
      
      if (!borrow) {
        return res.status(404).json({
          success: false,
          message: 'Emprunt non trouvé',
        });
      }

      res.json({
        success: true,
        data: transformBorrowData(borrow),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'emprunt',
        error: error.message,
      });
    }
  }

  // Retourner une ressource (restitution)
  async returnBorrow(req, res) {
    try {
      const { id } = req.params;
      
      const borrow = await Borrow.findByUuidWithRelations(id);
      
      if (!borrow) {
        return res.status(404).json({
          success: false,
          message: 'Emprunt non trouvé',
        });
      }

      if (borrow.date_retour_effective) {
        return res.status(400).json({
          success: false,
          message: 'Cet emprunt a déjà été retourné',
        });
      }

      // Marquer l'emprunt comme retourné
      const updatedBorrow = await Borrow.markAsReturned(id);

      // Rendre la ressource disponible
      await Resource.updateAvailability(borrow.resource_uuid, true);

      res.json({
        success: true,
        message: 'Ressource retournée avec succès',
        data: transformBorrowData(updatedBorrow),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du retour de la ressource',
        error: error.message,
      });
    }
  }

  // Supprimer un emprunt
  async deleteBorrow(req, res) {
    try {
      const { id } = req.params;
      
      const borrow = await Borrow.findByUuidWithRelations(id);
      
      if (!borrow) {
        return res.status(404).json({
          success: false,
          message: 'Emprunt non trouvé',
        });
      }

      // Si l'emprunt n'est pas encore retourné, rendre la ressource disponible
      if (!borrow.date_retour_effective) {
        await Resource.updateAvailability(borrow.resource_uuid, true);
      }

      const deleted = await Borrow.deleteByUuid(id);

      if (deleted) {
        res.json({
          success: true,
          message: 'Emprunt supprimé avec succès',
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la suppression',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'emprunt',
        error: error.message,
      });
    }
  }
}

module.exports = new BorrowController();