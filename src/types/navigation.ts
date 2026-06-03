import { LucideIcon } from "lucide-react";

export type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  enabled: boolean;
  adminOnly?: boolean;
};
