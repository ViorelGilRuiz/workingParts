import { Role } from "@/types";

export const rolePermissions: Record<Role, string[]> = {
  technician: ["reports:create", "reports:read:own", "reports:update:own", "clients:read"],
  supervisor: ["reports:read:all", "reports:validate", "reports:export", "analytics:read", "clients:read"],
  admin: ["reports:read:all", "reports:export", "analytics:read", "clients:manage", "users:manage", "settings:manage"]
};

export function hasPermission(role: Role, permission: string) {
  return rolePermissions[role].includes(permission);
}
