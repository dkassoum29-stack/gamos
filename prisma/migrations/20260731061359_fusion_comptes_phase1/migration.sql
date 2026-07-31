-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "estAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Locateur" ADD COLUMN     "clientId" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Locateur_clientId_key" ON "Locateur"("clientId");

-- AddForeignKey
ALTER TABLE "Locateur" ADD CONSTRAINT "Locateur_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
