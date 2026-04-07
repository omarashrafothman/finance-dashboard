import { Home, List, Plus } from "lucide-react";

export const navLinks = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: List,
  },
  {
    title: "Add Transaction",
    href: "/transactions/new",
    icon: Plus,
  },
];
