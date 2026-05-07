import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // create a new instance of the class
    //  -> initialize an adapter so that it can be connected to postgreSQL
    const adapter = new PrismaPg({
      // a psotgreSQL adapter for Prisma
      // -> parameters: connectionString (Database URL)
      connectionString: process.env.DATABASE_URL,
    });

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  async onModuleInit() {
     // It is a NestJS lifecycle hook that runs automatically when the module containing this service starts
     // purpose: establish the connection with the database before the app starts handling requests
     //          ensure all database operations work immediately
     await this.$connect();
     console.log('Database connected successfully!');
  }

  async onModuleDestroy() {
    // It is a NestJS lifecycle hook that runs automatically when the module containing this service or the app is shutting down
    await this.$disconnect();
    console.log('Database disconnected successfully!');
  }

  async cleanDatabase() {
     // purpose: clean the data in the database that is typically used for testing or development
     // It only works at the development environment rather than the production environment
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'I cannot clean the database in the production environment!',
      );
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_'),
    );

    // returns a promise that runs deletion in parallel for speed
    return Promise.all(
       models.map((modelKey) => {
        if (typeof modelKey === 'string') {
          return this[modelKey].deleteMany();
        }
      }),
    );
  }

  
}
