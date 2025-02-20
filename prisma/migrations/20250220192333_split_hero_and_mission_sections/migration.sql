/*
  Warnings:

  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_ru` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_uz` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ru` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_uz` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `SiteSettings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "MissionSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleUz" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "textRu" TEXT NOT NULL,
    "textUz" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_uz" TEXT NOT NULL,
    "description" TEXT,
    "description_ru" TEXT,
    "description_uz" TEXT,
    "price" REAL NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "category_ru" TEXT NOT NULL,
    "category_uz" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "description", "id", "imageUrl", "name", "price", "updatedAt") SELECT "createdAt", "description", "id", "imageUrl", "name", "price", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "logo" TEXT,
    "companyName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("createdAt", "id", "logo", "updatedAt") SELECT "createdAt", "id", "logo", "updatedAt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
