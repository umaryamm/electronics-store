/*
  Warnings:

  - You are about to drop the column `productName` on the `OrderItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,productId,itemType]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cartId,projectId,itemType]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CartItemType" AS ENUM ('PRODUCT', 'PROJECT');

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "itemType" "CartItemType" NOT NULL DEFAULT 'PRODUCT',
ADD COLUMN     "projectId" INTEGER,
ALTER COLUMN "productId" DROP NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "productName",
ADD COLUMN     "itemName" TEXT NOT NULL,
ADD COLUMN     "itemType" "CartItemType" NOT NULL DEFAULT 'PRODUCT',
ADD COLUMN     "projectId" INTEGER,
ALTER COLUMN "productId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_itemType_key" ON "CartItem"("cartId", "productId", "itemType");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_projectId_itemType_key" ON "CartItem"("cartId", "projectId", "itemType");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
