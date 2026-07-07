/*
  Warnings:

  - You are about to drop the column `discountAmount` on the `Order` table. All the data in the column will be lost.
  - Added the required column `billingAddress` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "discountAmount",
ADD COLUMN     "billingAddress" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "paymentMethod" SET DEFAULT 'COD',
ALTER COLUMN "status" SET DEFAULT 'pending';
