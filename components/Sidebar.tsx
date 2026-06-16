"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
  LogIn,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const displayName = user?.user_metadata?.full_name
    ?? user?.user_metadata?.username
    ?? user?.email?.split("@")[0]
    ?? "Guest";

  const avatarUrl = user?.user_metadata?.avatar_url ?? null;
  const initials = displayName.slice(0, 2).toUpperCase();
  const plan = user ? "Free Plan" : null;

  return (
    <aside
      className={cn(
        "relative shrink-0 flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-300 ease-in-out",
        collapsed ? "w-[64px]" : "w-[220px]"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-[52px] z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 hover:shadow-md transition-all"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed
          ? <ChevronRight size={13} className="text-gray-500" />
          : <ChevronLeft size={13} className="text-gray-500" />}
      </button>

      {/* Logo */}
      <div className={cn(
        "flex items-center border-b border-gray-100 h-[60px] shrink-0 transition-all duration-300",
        collapsed ? "justify-center px-0" : "justify-between px-4"
      )}>
        <div className={cn("flex items-center", collapsed ? "gap-0" : "gap-2.5")}>
          <div className="w-8 h-8 bg-[#4a7c3f] rounded-lg flex items-center justify-center shrink-0">
            <svg viewBox="0 0 80 96" style={{ width: 18, height: 18 }}>
              <ellipse cx="44" cy="30" rx="30" ry="25" fill="white" />
              <ellipse cx="44" cy="30" rx="20" ry="17" fill="#4a7c3f" />
              <rect x="18" y="44" width="13" height="40" rx="4" fill="white" />
            </svg>
          </div>
          {!collapsed && (
            <span className="font-bold text-[15px] tracking-tight text-gray-900 whitespace-nowrap">
              MyPlattr
            </span>
          )}
        </div>
        {!collapsed && (
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50">
            <Bell size={17} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 py-3 space-y-0.5 overflow-hidden", collapsed ? "px-2" : "px-3")}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                active
                  ? "bg-[#3d6b32] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.2 : 1.8}
                className={cn("shrink-0", active ? "text-white" : "text-gray-500")}
              />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={cn(
        "pb-4 pt-3 border-t border-gray-100 space-y-0.5",
        collapsed ? "px-2" : "px-3"
      )}>
        <button
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors w-full py-2.5",
            collapsed ? "justify-center px-0" : "gap-3 px-3"
          )}
        >
          <Settings size={17} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Settings</span>}
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={cn(
              "flex items-center rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-colors w-full py-2.5",
              collapsed ? "justify-center px-0" : "gap-3 px-3"
            )}
          >
            <LogOut size={17} strokeWidth={1.8} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Logout</span>}
          </button>
        ) : (
          <Link
            href="/login"
            title={collapsed ? "Sign in" : undefined}
            className={cn(
              "flex items-center rounded-lg text-sm font-medium text-[#4a7c3f] hover:bg-[#e8f5e3] transition-colors w-full py-2.5",
              collapsed ? "justify-center px-0" : "gap-3 px-3"
            )}
          >
            <LogIn size={17} strokeWidth={1.8} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Sign in</span>}
          </Link>
        )}

        {/* User row */}
        {user ? (
          <div
            title={collapsed ? displayName : undefined}
            className={cn(
              "flex items-center mt-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors py-2",
              collapsed ? "justify-center px-0" : "gap-2.5 px-2"
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={avatarUrl ?? undefined} />
              <AvatarFallback className="bg-[#4a7c3f] text-white text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 truncate">{displayName}</p>
                <p className="text-[10px] text-gray-400 truncate">{plan}</p>
              </div>
            )}
          </div>
        ) : (
          !collapsed && (
            <p className="px-2 py-2 text-[10px] text-gray-400">Not signed in</p>
          )
        )}
      </div>
    </aside>
  );
}
