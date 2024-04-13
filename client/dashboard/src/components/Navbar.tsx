'use client'
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";
import  LogOut  from "../components/LogOut";
 
// Import React and other necessary modules

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const user = localStorage.getItem("user");

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="QuickLinks">
          <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-10 p-4">
            <ProductItem
              title="LeavePro"
              href="/leave-management"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Efficient leave management system for students and faculty."
            />
            <ProductItem
              title="VenueMaster"
              href="/venue-booking"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Streamlined venue booking system for college events."
            />
            <ProductItem
              title="Resultify"
              href="/results"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Manage and publish exam results effortlessly."
            />
            <ProductItem
              title="HostelEase"
              href="/hostel-management"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Comprehensive hostel management system for students and administrators."
            />
            <ProductItem
              title="LectureLabPro"
              href="/lecture-lab"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Optimize lecture and lab scheduling for better academic efficiency."
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Team">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/pricing">View Team</HoveredLink>
          </div>
        </MenuItem>
        {user ? <LogOut /> : null}
      </Menu>
    </div>
  );
}

export default Navbar;
