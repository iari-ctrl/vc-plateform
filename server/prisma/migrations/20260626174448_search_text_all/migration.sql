-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "searchText" TEXT NOT NULL DEFAULT '',
    "data" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Course" ("data", "id", "level", "order", "pathId", "slug", "title", "updatedAt") SELECT "data", "id", "level", "order", "pathId", "slug", "title", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
CREATE TABLE "new_LearningPath" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "searchText" TEXT NOT NULL DEFAULT '',
    "data" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_LearningPath" ("data", "id", "level", "order", "slug", "title", "updatedAt") SELECT "data", "id", "level", "order", "slug", "title", "updatedAt" FROM "LearningPath";
DROP TABLE "LearningPath";
ALTER TABLE "new_LearningPath" RENAME TO "LearningPath";
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");
CREATE TABLE "new_Simulator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "searchText" TEXT NOT NULL DEFAULT '',
    "data" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Simulator" ("category", "data", "id", "slug", "title", "updatedAt") SELECT "category", "data", "id", "slug", "title", "updatedAt" FROM "Simulator";
DROP TABLE "Simulator";
ALTER TABLE "new_Simulator" RENAME TO "Simulator";
CREATE UNIQUE INDEX "Simulator_slug_key" ON "Simulator"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
