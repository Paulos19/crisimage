"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import { LogOut, Settings, UserIcon } from "lucide-react";

interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps) {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-white/[0.08] hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all duration-300">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
            <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#111111] border border-white/[0.08] text-white rounded-xl shadow-2xl shadow-black/50" align="end" forceMount>
        <DropdownMenuLabel className="font-normal px-4 py-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-white">{user?.name}</p>
            <p className="text-xs leading-none text-zinc-500">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled className="text-zinc-500 focus:bg-white/[0.04] rounded-lg mx-1 cursor-not-allowed">
            <UserIcon className="w-4 h-4 mr-2" />
            Perfil (Em breve)
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="text-zinc-500 focus:bg-white/[0.04] rounded-lg mx-1 cursor-not-allowed">
            <Settings className="w-4 h-4 mr-2" />
            Configurações (Em breve)
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        <DropdownMenuItem
          className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer rounded-lg mx-1"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}