"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string;
  avatar?: string;
  avatarUrl?: string;
  className?: string;
  textClassName?: string;
}

export function UserAvatar({ name, avatar, avatarUrl, className, textClassName }: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl bg-primary/10", className)}>
        <Image src={avatarUrl} alt={name ?? "Usuario"} fill sizes="48px" className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary",
        className
      )}
    >
      <span className={textClassName}>{avatar ?? "IB"}</span>
    </div>
  );
}
