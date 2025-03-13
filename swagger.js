const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GitGood",
      version: "1.0.0",
      description: "The public API for GitGood",
    },
  },
  apis: ["./src/app/api/**/route.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const outputPath = path.join(__dirname, "./src/lib/swagger.json");
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`Swagger spec written to ${outputPath}\n`);
