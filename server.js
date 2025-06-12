const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./src/config/database');
const { swaggerUi, specs } = require('./src/config/swagger');

// Import des routes
const userRoutes = require('./src/routes/userRoutes');
const resourceRoutes = require('./src/routes/resourceRoutes');
const borrowRoutes = require('./src/routes/borrowRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité et utilitaires
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/borrows', borrowRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Middleware de gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Fonction de démarrage du serveur
async function startServer() {
  try {
    // Test de connexion à la base de données
    await db.raw('SELECT 1');
    console.log('✅ Connexion à MySQL établie avec succès.');

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Documentation API disponible sur http://localhost:${PORT}/api-docs`);
      console.log(`Health check disponible sur http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
}

// Gestion de l'arrêt gracieux
process.on('SIGINT', async () => {
  console.log(' Arrêt du serveur en cours...');
  await db.destroy();
  console.log('Connexion à la base de données fermée.');
  process.exit(0);
});

// Démarrage du serveur
startServer();