const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Médiathèque',
      version: '1.0.0',
      description: 'API REST pour la gestion d\'une médiathèque développée avec Node.js, Express et Knex.js',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Chemins vers les fichiers contenant les annotations Swagger
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};