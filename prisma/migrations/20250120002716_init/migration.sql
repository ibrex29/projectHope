-- AlterTable
ALTER TABLE "_RolePermissions" ADD CONSTRAINT "_RolePermissions_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_RolePermissions_AB_unique";

-- AlterTable
ALTER TABLE "_UserRoles" ADD CONSTRAINT "_UserRoles_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserRoles_AB_unique";
