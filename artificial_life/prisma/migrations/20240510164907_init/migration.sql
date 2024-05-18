-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(255) NOT NULL,
    "d1" DOUBLE PRECISION NOT NULL,
    "d2" DOUBLE PRECISION NOT NULL,
    "b1" DOUBLE PRECISION NOT NULL,
    "b2" DOUBLE PRECISION NOT NULL,
    "ra" DOUBLE PRECISION NOT NULL,
    "ri" DOUBLE PRECISION NOT NULL,
    "alphaM" DOUBLE PRECISION NOT NULL,
    "alphaN" DOUBLE PRECISION NOT NULL,
    "color" DOUBLE PRECISION NOT NULL,
    "seed" DOUBLE PRECISION NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userID_key" ON "Settings"("userID");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
