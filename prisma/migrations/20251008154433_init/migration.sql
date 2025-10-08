-- CreateTable
CREATE TABLE "assignment" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "issued_by" TEXT NOT NULL,
    "issued_at" BIGINT NOT NULL,
    "updated_at" BIGINT NOT NULL,
    "issued_status" TEXT NOT NULL,

    CONSTRAINT "assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assignment_username_key" ON "assignment"("username");
