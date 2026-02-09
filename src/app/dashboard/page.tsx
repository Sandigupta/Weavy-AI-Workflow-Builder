"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Plus, Search, LayoutGrid, List, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { WorkflowCard } from "@/components/dashboard/WorkflowCard";
import { FileCard } from "@/components/dashboard/FileCard";
import { useFileSystem } from "@/store/useFileSystem";
import { cn } from "@/lib/utils";
import { WORKFLOW_TEMPLATES } from "@/config/workflowTemplates";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const { files, searchQuery, setSearchQuery, viewMode, setViewMode, fetchFiles } = useFileSystem();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // Get user's display name for workspace
    const userName = user?.firstName ||
        user?.fullName?.split(" ")[0] ||
        user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
        "User";

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    // Filter files based on search query
    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-[1800px] mx-auto min-h-screen bg-[#09090b] text-white">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-medium text-gray-100">
                    {isLoaded ? `${userName}'s Workspace` : "Loading..."}
                </h1>

                <Link href="/editor/new-file" className="bg-[#F2FF9F] hover:opacity-90 text-black font-semibold text-sm py-2 px-4 rounded-lg flex items-center gap-2 transition-transform active:scale-95">
                    <Plus className="w-4 h-4" />
                    Create New File
                </Link>
            </div>

            {/* Workflow Library Section */}
            <div className="mb-12 bg-[#121214] p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-6 mb-6">
                    <button className="px-4 py-1.5 bg-white/10 rounded-full text-white text-xs font-medium">
                        Workflow library
                    </button>
                    <button className="px-4 py-1.5 text-gray-500 hover:text-white text-xs font-medium transition">
                        Tutorials
                    </button>
                </div>

                {/* Horizontal Scroll Container with Arrows */}
                <div className="relative group">
                    {/* Left Arrow */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#1c1c1e]/90 hover:bg-[#2a2a2e] border border-white/10 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Scrollable Cards */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {WORKFLOW_TEMPLATES.map((template) => (
                            <div key={template.id} className="flex-shrink-0 w-48">
                                <WorkflowCard
                                    id={template.id}
                                    title={template.title}
                                    thumbnail={template.thumbnail}
                                    description={template.description}
                                    workflowFile={template.workflowFile}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#1c1c1e]/90 hover:bg-[#2a2a2e] border border-white/10 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* My Files Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">My files</h2>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-[#1c1c1e] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-white/20 outline-none w-64 placeholder:text-gray-600 transition-all focus:w-80"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-[#1c1c1e] rounded-lg p-1 border border-white/10">
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "p-1.5 rounded transition",
                                    viewMode === 'list' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "p-1.5 rounded transition",
                                    viewMode === 'grid' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {viewMode === 'grid' ? (
                    /* Grid View */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredFiles.length > 0 ? (
                            filteredFiles.map((file) => (
                                <FileCard key={file.id} {...file} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 py-12">
                                No files found
                            </div>
                        )}
                    </div>
                ) : (
                    /* List View */
                    <div className="w-full">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-400 border-b border-white/5 mb-2">
                            <div className="col-span-4">Name</div>
                            <div className="col-span-2 text-center">Files</div>
                            <div className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-white">
                                Last modified
                                <ChevronDown className="w-3 h-3" />
                            </div>
                            <div className="col-span-3">Created at</div>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-2">
                            {filteredFiles.map((file) => (
                                <Link key={file.id} href={`/editor/${file.id}`}>
                                    <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-white/5 rounded-lg transition group cursor-pointer">
                                        {/* Name Column */}
                                        <div className="col-span-4 flex items-center gap-4">
                                            {/* Large Icon Box */}
                                            <div className="w-24 h-14 bg-[#1c1c1e] rounded-lg border border-white/5 flex items-center justify-center group-hover:border-white/10 transition-colors">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                                    <rect x="9" y="3" width="6" height="6" rx="1" />
                                                    <rect x="4" y="15" width="6" height="6" rx="1" />
                                                    <rect x="14" y="15" width="6" height="6" rx="1" />
                                                    <path d="M12 9v3" />
                                                    <path d="M7 15v-3h10v3" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-gray-200 group-hover:text-white">{file.name}</span>
                                        </div>

                                        {/* Files Column */}
                                        <div className="col-span-2 text-center text-gray-500 text-sm">-</div>

                                        {/* Last Modified */}
                                        <div className="col-span-3 text-sm text-gray-300">{file.lastEdited}</div>

                                        {/* Created At */}
                                        <div className="col-span-3 text-sm text-gray-300">{file.createdAt || "-"}</div>
                                    </div>
                                </Link>
                            ))}
                            {filteredFiles.length === 0 && (
                                <div className="text-center text-gray-500 py-8">
                                    No files match your search
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>

        </div>
    );
}
