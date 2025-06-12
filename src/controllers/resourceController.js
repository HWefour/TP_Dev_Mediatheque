const Resource = require('../models/Resource');
const { transformResourceData } = require('../utils/helpers');

class ResourceController {
  // Créer une ressource
  async createResource(req, res) {
    try {
      const { titre, type, auteur } = req.body;

      const resource = await Resource.create({
        titre,
        type,
        auteur,
      });

      res.status(201).json({
        success: true,
        message: 'Ressource créée avec succès',
        data: transformResourceData(resource),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la ressource',
        error: error.message,
      });
    }
  }

  // Obtenir toutes les ressources
  async getAllResources(req, res) {
    try {
      const { disponible, type } = req.query;
      const filters = {};

      if (disponible !== undefined) {
        filters.disponible = disponible === 'true';
      }

      if (type) {
        filters.type = type;
      }

      const resources = await Resource.findAll(filters);
      const transformedResources = resources.map(resource => transformResourceData(resource));

      res.json({
        success: true,
        data: transformedResources,
        count: transformedResources.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des ressources',
        error: error.message,
      });
    }
  }

  // Obtenir une ressource par UUID
  async getResourceById(req, res) {
    try {
      const { id } = req.params;
      
      const resource = await Resource.findByUuid(id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Ressource non trouvée',
        });
      }

      res.json({
        success: true,
        data: transformResourceData(resource),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la ressource',
        error: error.message,
      });
    }
  }

  // Mettre à jour une ressource
  async updateResource(req, res) {
    try {
      const { id } = req.params;
      const { titre, type, auteur, disponible } = req.body;

      const resource = await Resource.findByUuid(id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Ressource non trouvée',
        });
      }

      const updateData = {};
      if (titre) updateData.titre = titre;
      if (type) updateData.type = type;
      if (auteur) updateData.auteur = auteur;
      if (disponible !== undefined) updateData.disponible = disponible;

      const updatedResource = await Resource.updateByUuid(id, updateData);

      res.json({
        success: true,
        message: 'Ressource mise à jour avec succès',
        data: transformResourceData(updatedResource),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la ressource',
        error: error.message,
      });
    }
  }

  // Supprimer une ressource
  async deleteResource(req, res) {
    try {
      const { id } = req.params;
      
      const resource = await Resource.findByUuid(id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Ressource non trouvée',
        });
      }

      const deleted = await Resource.deleteByUuid(id);

      if (deleted) {
        res.json({
          success: true,
          message: 'Ressource supprimée avec succès',
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
        message: 'Erreur lors de la suppression de la ressource',
        error: error.message,
      });
    }
  }
}

module.exports = new ResourceController();