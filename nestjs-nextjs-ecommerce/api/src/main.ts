import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // project description
  app.setGlobalPrefix('api/v1');

  // After that, every route in this application will start with /api/v1/*

  // set the global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove any properties not defined in DTO, preventing extra data from being processed
      forbidNonWhitelisted: true, // forbid nonwhitelisted properties through frozen errors
      // if the request contains unexpected properties, enforcing strict DTO validation
      transform: true, // automatically converts plain request objects into the corresponding DTO instances
      transformOptions: {
        enableImplicitConversion: true, // allow the automatic conversion pf romitive values
      },
    }),
  );

  app.enableCors({
    // allow the origin from the environment variable or localhost:3000 for develoment
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3000',

    // allow cookies and authentication headers to be sent in the cross-origin requests
    credentials: true,

    // Methods like 'GET' and 'POST' specify which HTTP methods are permitted
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

    // Allowed headers such as 'Content-Type' and 'Authorization specify which headers the frontend can send
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // set up the configuration for the documents
  const config = new DocumentBuilder() // What Swagger UI uses to render the API interface
    .setTitle('E-commerce API') // set the Swagger UI title
    .setDescription('API documentation for this application') // set Swagger UI description
    .setVersion('1.0') // set Swagger UI version
    .addTag('auth', 'Authentication related endpoints') // add the tag for auth endpoint, which makes Swagger UI organized and easier to navigate
    .addTag('users', 'User Management endpoints') // add the tag for user endpoint
    .addTag('products', 'Product Management endpoints') // add the tag for the product endpoint
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    ) // add bearer authentication for access tokens -> test authentication endpoints directly in Swagger by entering a valid token
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT-refresh',
        description: 'Enter refresh JWT token',
        in: 'header',
      },
      'JWT-refresh',
    )
    .addServer(
      `http://localhost:${process.env.PORT ?? 3000}`,
      'Development Server',
    ) // add the available list of servers in Swagger
    .build(); // build the conif file

  // create the document
  const document = SwaggerModule.createDocument(app, config); // set the Swagger UI endpoint

  // expose the swagger UI at /API/docs
  SwaggerModule.setup('api/docs', app, document, {
    // 1st part: the object for UI customization
    swaggerOptions: {
      persistAuthorization: true, // persist the authorization token across page refreshes
      tagsSorter: 'alpha', // sort API tags alphabetically
      operationsSorter: 'alpha', // sort API endpoints alphabetucally
    },
    customSiteTitle: 'E-commerce API Documentation', // set the browser tab title for the Swagger UI
    customfavIcon: 'https://nestjs.com/img/logo-small.svg', // set the custom fav icon
    customCss: `
     .swagger-ui .topbar { display: none; } /* hide the topbar */
     .swagger-ui .info { margin: 50px 0; }
     .swagger-ui .info .title { color: #4A90E2; }
    `, // allows the swagging of custom UI
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  Logger.error('Failed to start the application', error);
  process.exit(1);
});
