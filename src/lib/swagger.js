import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GitGood',
      version: '1.0.0',
    },
  },
  apis: ["./src/app/api/**/route*.js"], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
export default openapiSpecification;
