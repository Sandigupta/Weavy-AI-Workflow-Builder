"use client";

import React from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Folder, Users, Layout, Plus, Disc } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: Folder, label: "My Files", active: true },
    { icon: Users, label: "Shared with me", active: false },
    { icon: Layout, label: "Apps", active: false },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-[#09090b] border-r border-white/5 flex flex-col h-screen sticky top-0">
            {/* User / Workspace Dropdown */}
            <div className="p-4 mb-2 relative flex items-center gap-3">
                <UserButton
                    showName
                    appearance={{
                        elements: {
                            userButtonBox: "flex flex-row-reverse w-full justify-between hover:bg-white/5 rounded-lg p-2 transition",
                            userButtonOuterIdentifier: "text-sm font-medium text-gray-200 truncate pl-0",
                            userButtonAvatarBox: "w-8 h-8 rounded-full border border-white/10",
                            userButtonPopoverCard: "bg-[#1c1c1e] border border-white/10 shadow-xl rounded-xl",
                            userButtonPopoverFooter: "hidden",
                            userButtonPopoverActionItem: "hover:bg-white/5 text-gray-200",
                            userButtonPopoverActionItemIcon: "text-gray-400",
                            userButtonPopoverActionItemText: "text-gray-200 font-medium",
                            userButtonPopoverActionButton: "hover:bg-white/5 text-gray-200",
                            userButtonPopoverActionButtonIcon: "text-gray-400",
                            userButtonPopoverActionButtonText: "text-gray-200 font-medium",
                        },
                        variables: {
                            colorBackground: "#1c1c1e",
                            colorText: "white",
                            colorPrimary: "#F2FF9F",
                            colorTextSecondary: "#9CA3AF",
                        }
                    }}
                />
            </div>

            {/* Create Button */}
            <div className="px-4 mb-6">
                <Link href="/editor/new-file" className="w-full bg-[#F2FF9F] hover:opacity-90 text-black font-semibold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                    <Plus className="w-4 h-4" />
                    Create New File
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                            item.active
                                ? "bg-white/10 text-white"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Footer / Discord */}
            <div className="p-4 mt-auto">
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition">
                    <Disc className="w-5 h-5" />
                    <span className="text-sm font-medium">Discord</span>
                </a>
            </div>
        </aside>
    );
}
