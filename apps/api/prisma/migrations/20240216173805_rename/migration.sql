/*
  Warnings:

  - You are about to drop the `SAMLProviders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SAMLProviders";

-- CreateTable
CREATE TABLE "SamlConfig" (
    "id" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "cert" TEXT NOT NULL,
    "entryPoint" TEXT NOT NULL,
    "wantAssertionsSigned" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SamlConfig_pkey" PRIMARY KEY ("id")
);
