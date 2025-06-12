const User = require('../models/User');
const { transformUserData } = require('../utils/helpers');

class UserController {
  // Créer un utilisateur
  async createUser(req, res) {
    try {
      const { nom, prenom, mail, telephone, nationalite } = req.body;
      
      const existingUser = await User.findByEmail(mail);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Un utilisateur avec cette adresse email existe déjà',
        });
      }

      const user = await User.create({
        nom,
        prenom,
        mail,
        telephone,
        nationalite,
      });

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: transformUserData(user),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error.message,
      });
    }
  }

  // Obtenir tous les utilisateurs
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      const transformedUsers = users.map(user => transformUserData(user));

      res.json({
        success: true,
        data: transformedUsers,
        count: transformedUsers.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message,
      });
    }
  }

  // Obtenir un utilisateur par UUID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findByUuid(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      }

      res.json({
        success: true,
        data: transformUserData(user),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'utilisateur',
        error: error.message,
      });
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { nom, prenom, mail, telephone, nationalite } = req.body;

      const user = await User.findByUuid(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      }

      // Vérifier si l'email est déjà utilisé par un autre utilisateur
      if (mail && mail !== user.mail) {
        const existingUser = await User.findByEmail(mail);
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: 'Cette adresse email est déjà utilisée',
          });
        }
      }

      const updateData = {};
      if (nom) updateData.nom = nom;
      if (prenom) updateData.prenom = prenom;
      if (mail) updateData.mail = mail;
      if (telephone) updateData.telephone = telephone;
      if (nationalite) updateData.nationalite = nationalite;

      const updatedUser = await User.updateByUuid(id, updateData);

      res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: transformUserData(updatedUser),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'utilisateur',
        error: error.message,
      });
    }
  }

  // Supprimer un utilisateur
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findByUuid(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé',
        });
      }

      const deleted = await User.deleteByUuid(id);

      if (deleted) {
        res.json({
          success: true,
          message: 'Utilisateur supprimé avec succès',
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
        message: 'Erreur lors de la suppression de l\'utilisateur',
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();