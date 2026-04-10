import { Role } from "@/types";
import { appEnv } from "@/lib/env";

export function getAvatarLabel(name: string, email?: string | null) {
  const source = name.trim() || email?.trim() || "WP";

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function resolveUserRole({
  email,
  appRole,
  userRole
}: {
  email?: string | null;
  appRole?: string | null;
  userRole?: string | null;
}): Role {
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedAppRole = appRole?.trim().toLowerCase();
  const normalizedUserRole = userRole?.trim().toLowerCase();

  if (normalizedAppRole === "admin" || normalizedUserRole === "admin" || (normalizedEmail && appEnv.adminEmails.includes(normalizedEmail))) {
    return "admin";
  }

  if (
    normalizedAppRole === "supervisor" ||
    normalizedUserRole === "supervisor" ||
    (normalizedEmail && appEnv.supervisorEmails.includes(normalizedEmail))
  ) {
    return "supervisor";
  }

  if (normalizedAppRole === "technician" || normalizedUserRole === "technician") {
    return "technician";
  }

  return appEnv.defaultRole;
}
