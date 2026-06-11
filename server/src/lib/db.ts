import './env.js'; // ensure DATABASE_URL is in process.env before Prisma reads it
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
