"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { navLinks } from "@/data/constants/navLinks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col gap-4 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground",
        className,
      )}
    >
      <h2 className="text-xl font-bold text-sidebar-primary">Finance App</h2>

      <nav className="flex flex-col gap-2">
        {navLinks.map((link, index) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={index}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded-lg p-2.5 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/90"
              }`}
            >
              <Icon size={18} />
              {link.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-2">
        <p className="px-1 text-xs font-medium text-sidebar-foreground/70">Appearance</p>
        <div className="grid grid-cols-3 gap-1">
          <Button
            size="sm"
            variant={mounted && theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            size="sm"
            variant={mounted && theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
          <Button
            size="sm"
            variant={mounted && theme === "system" ? "default" : "outline"}
            onClick={() => setTheme("system")}
          >
            Auto
          </Button>
        </div>
      </div>
    </aside>
  );
}
