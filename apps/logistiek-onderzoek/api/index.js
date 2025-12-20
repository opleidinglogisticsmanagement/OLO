/**
 * Vercel Serverless Handler voor App
 * 
 * Dit bestand fungeert als entry point voor Vercel serverless deployment.
 * Het importeert de Express app uit packages/core/api/index.js
 * 
 * Vercel verwacht dat serverless functions in een api/ directory staan
 * in de root van het project (of app root als root directory is ingesteld).
 */

// Importeer de core API handler
// Deze staat in packages/core/api/index.js
// We gebruiken een relatief pad dat werkt vanuit de app directory
const path = require('path');

// Bepaal het pad naar de core API
// Vanuit apps/logistiek-onderzoek/api/index.js naar packages/core/api/index.js
const coreApiPath = path.resolve(__dirname, '../../packages/core/api/index.js');

// Importeer en exporteer de core API
module.exports = require(coreApiPath);

