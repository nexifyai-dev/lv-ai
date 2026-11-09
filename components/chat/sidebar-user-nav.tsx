"use client";

import { ChevronUp, LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import type { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LoaderIcon } from "./icons";
import { toast } from "./toast";

function emailToHue(email: string): number {
  let hash = 0;
  for (const char of email) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function SidebarUserNav({ user }: { user: User }) {
  const { status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {status === "loading" ? (
              <SidebarMenuButton className="text-sidebar-foreground/50 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10 justify-between rounded-lg bg-transparent transition-colors duration-150">
                <div className="flex flex-row items-center gap-2">
                  <div className="bg-sidebar-foreground/10 size-6 animate-pulse rounded-full" />
                  <span className="bg-sidebar-foreground/10 animate-pulse rounded-md text-[13px] text-transparent">
                    Laden...
                  </span>
                </div>
                <div className="text-sidebar-foreground/50 animate-spin">
                  <LoaderIcon />
                </div>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-8 rounded-lg bg-transparent px-2 transition-colors duration-150"
                data-testid="user-nav-button"
              >
                <div
                  className="ring-sidebar-border/50 size-5 shrink-0 rounded-full ring-1"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.35 0.08 ${emailToHue(user.email ?? "")}), oklch(0.25 0.05 ${emailToHue(user.email ?? "") + 40}))`,
                  }}
                />
                <span className="truncate text-[13px]" data-testid="user-email">
                  {user?.email || "LV.AI Nutzer"}
                </span>
                <ChevronUp className="text-sidebar-foreground/50 ml-auto size-3.5" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border-border/60 bg-card/95 w-(--radix-popper-anchor-width) rounded-lg border shadow-[var(--shadow-float)] backdrop-blur-xl"
            data-testid="user-nav-menu"
            side="top"
          >
            <DropdownMenuItem
              className="cursor-pointer text-[13px]"
              data-testid="user-nav-item-theme"
              onSelect={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "light" ? (
                <>
                  <MoonIcon className="mr-2 size-4" />
                  Dunkelmodus
                </>
              ) : (
                <>
                  <SunIcon className="mr-2 size-4" />
                  Hellmodus
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild data-testid="user-nav-item-auth">
              <button
                className="w-full cursor-pointer text-[13px]"
                onClick={() => {
                  if (status === "loading") {
                    toast({
                      description:
                        "Authentifizierung wird geprüft, bitte erneut versuchen!",
                      type: "error",
                    });
                    return;
                  }

                  signOut({
                    redirectTo: "/login",
                  });
                }}
                type="button"
              >
                <LogOutIcon className="mr-2 size-4" />
                Abmelden
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
