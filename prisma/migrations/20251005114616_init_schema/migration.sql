/*
  Warnings:

  - You are about to drop the column `category_image` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `product_image` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `proof` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `Users` table. All the data in the column will be lost.
  - Made the column `address` on table `Transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `post_code` on table `Transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Carts" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "category_image",
ADD COLUMN     "image_public_id" TEXT,
ADD COLUMN     "image_url" TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "public"."Products" DROP COLUMN "product_image",
ADD COLUMN     "image_public_id" TEXT,
ADD COLUMN     "image_url" TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "public"."Transaction_Details" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "public"."Transactions" DROP COLUMN "proof",
ADD COLUMN     "proof_public_id" TEXT,
ADD COLUMN     "proof_url" TEXT,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "post_code" SET NOT NULL,
ALTER COLUMN "post_code" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "public"."Users" DROP COLUMN "profile_image",
ADD COLUMN     "image_public_id" TEXT,
ADD COLUMN     "image_url" TEXT,
ALTER COLUMN "post_code" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);
