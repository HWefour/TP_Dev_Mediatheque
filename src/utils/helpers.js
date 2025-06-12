/**
 * Formate une date au format JJ-MM-AAAA
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée
 */
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Calcule la date de retour (14 jours après l'emprunt)
 * @param {Date} dateEmprunt - Date d'emprunt
 * @returns {Date} Date de retour prévue
 */
const calculateReturnDate = (dateEmprunt = new Date()) => {
  const returnDate = new Date(dateEmprunt);
  returnDate.setDate(returnDate.getDate() + 14);
  return returnDate;
};

/**
 * Transforme un objet de base de données en réponse API
 * @param {Object} data - Données de la base
 * @returns {Object} Objet transformé
 */
const transformUserData = (user) => {
  if (!user) return null;
  
  const { id, uuid, created_at, updated_at, ...rest } = user;
  
  return {
    id: uuid,
    ...rest,
  };
};

/**
 * Transforme les données d'une ressource
 * @param {Object} resource - Données de la ressource
 * @returns {Object} Objet transformé
 */
const transformResourceData = (resource) => {
  if (!resource) return null;
  
  const { id, uuid, created_at, updated_at, ...rest } = resource;
  
  return {
    id: uuid,
    ...rest,
  };
};

/**
 * Transforme les données d'un emprunt avec relations
 * @param {Object} borrow - Données de l'emprunt
 * @returns {Object} Objet transformé
 */
const transformBorrowData = (borrow) => {
  if (!borrow) return null;
  
  const {
    id,
    uuid,
    utilisateur_id,
    ressource_id,
    date_emprunt,
    date_retour,
    date_retour_effective,
    created_at,
    updated_at,
    user_uuid,
    nom,
    prenom,
    mail,
    telephone,
    nationalite,
    resource_uuid,
    titre,
    type,
    auteur,
    disponible,
    ...rest
  } = borrow;
  
  const transformedBorrow = {
    id: uuid,
    dateEmprunt: formatDate(date_emprunt),
    dateRetour: formatDate(date_retour),
    dateRetourEffective: formatDate(date_retour_effective),
    ...rest,
  };
  
  // Ajouter les informations de l'utilisateur si disponibles
  if (user_uuid) {
    transformedBorrow.utilisateur = {
      id: user_uuid,
      nom,
      prenom,
      mail,
      telephone,
      nationalite,
    };
  }
  
  // Ajouter les informations de la ressource si disponibles
  if (resource_uuid) {
    transformedBorrow.ressource = {
      id: resource_uuid,
      titre,
      type,
      auteur,
      disponible,
    };
  }
  
  return transformedBorrow;
};

module.exports = {
  formatDate,
  calculateReturnDate,
  transformUserData,
  transformResourceData,
  transformBorrowData,
};