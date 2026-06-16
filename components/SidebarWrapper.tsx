"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const AUTH_PATHS = ["/login", "/signup"];

export default function SidebarWrapper() {
  const pathname = usePathname();
  if (AUTH_PATHS.includes(pathname)) return null;
  return <Sidebar />;
}
