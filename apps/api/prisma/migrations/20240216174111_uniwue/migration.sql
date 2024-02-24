/*
  Warnings:

  - A unique constraint covering the columns `[issuer]` on the table `SamlConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SamlConfig_issuer_key" ON "SamlConfig"("issuer");
