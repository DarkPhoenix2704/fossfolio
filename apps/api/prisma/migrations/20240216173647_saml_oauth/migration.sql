-- CreateTable
CREATE TABLE "SAMLProviders" (
    "id" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "cert" TEXT NOT NULL,
    "entryPoint" TEXT NOT NULL,
    "wantAssertionsSigned" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SAMLProviders_pkey" PRIMARY KEY ("id")
);
