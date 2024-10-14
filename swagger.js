const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Attendance Register System',
      version: '1.0.0',
      description: 'API documentation for the Attendance Register System',
      contact: {
        name: 'Sharon Sebastian',
        email: 'sharonsebastian81@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
