/*
  Warnings:

  - You are about to drop the `_EventsToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventsToUser" DROP CONSTRAINT "_EventsToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventsToUser" DROP CONSTRAINT "_EventsToUser_B_fkey";

-- DropTable
DROP TABLE "_EventsToUser";

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "eventsId" TEXT NOT NULL,
    "userUid" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventsId_fkey" FOREIGN KEY ("eventsId") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
