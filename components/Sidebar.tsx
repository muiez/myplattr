"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Users,
  Trophy,
  Calendar,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/community", label: "Community", icon: Users },
  { href: "/rewards", label: "Rewards & Challenges", icon: Trophy },
  { href: "/meal-plan", label: "Meal Plan", icon: Calendar },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-full bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          {/* Plattr P icon — green rounded square */}
          <div className="w-8 h-8 bg-[#4a7c3f] rounded-lg flex items-center justify-center shrink-0">
            <svg viewBox="0 0 80 96" className="w-4.5 h-4.5" style={{ width: 18, height: 18 }}>
              <ellipse cx="44" cy="30" rx="30" ry="25" fill="white" />
              <ellipse cx="44" cy="30" rx="20" ry="17" fill="#4a7c3f" />
              <rect x="18" y="44" width="13" height="40" rx="4" fill="white" />
            </svg>
          </div>
          <span className="font-bold text-[15px] tracking-tight text-gray-900">MyPlattr</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50">
          <Bell size={17} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-[#3d6b32] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} className={active ? "text-white" : "text-gray-500"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-3 border-t border-gray-100 space-y-0.5">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors w-full">
          <Settings size={17} strokeWidth={1.8} />
          Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors w-full">
          <LogOut size={17} strokeWidth={1.8} />
          Logout
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 px-2 py-2.5 mt-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face" />
            <AvatarFallback className="bg-[#4a7c3f] text-white text-xs font-semibold">EC</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-800 truncate">Elena Carter</p>
            <p className="text-[10px] text-gray-400 truncate">Premium Plan</p>
          </div>
          <ChevronDown size={14} className="text-gray-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
