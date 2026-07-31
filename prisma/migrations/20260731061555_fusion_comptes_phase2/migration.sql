-- DropIndex
DROP INDEX "Locateur_email_key";

-- AlterTable
ALTER TABLE "Locateur" DROP COLUMN "email",
DROP COLUMN "motDePasse",
ALTER COLUMN "clientId" SET NOT NULL;

-- DropTable
DROP TABLE "Admin";
