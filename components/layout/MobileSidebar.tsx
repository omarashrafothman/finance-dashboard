"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Sidebar from "@/components/layout/Sidebar";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Button type="button" size="icon-sm" variant="outline" onClick={() => setOpen(true)}>
          <Menu className="size-4" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="top-0 left-0 h-screen w-[18rem] max-w-[85vw] translate-x-0 translate-y-0 rounded-none border-r border-border p-0"
          showCloseButton
        >
          <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
          <Sidebar className="h-full w-full border-r-0" onNavigate={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
