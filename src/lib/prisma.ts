import { PrismaClient } from "@prisma/client";

// Next.js hot-reloads modules during development, which can create
// many PrismaClient instances. We attach a single instance to the
// global object so the same client is reused across reloads.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
