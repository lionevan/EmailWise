'use client';

import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export default function HomePage() {
  return (
    <SidebarInset>
       <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4 md:hidden">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
            <h1 className="text-xl font-bold">Email Assistant</h1>
          </div>
        </header>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Here's a summary of your email activity.</p>
        {/* Dashboard content can go here */}
      </div>
    </SidebarInset>
  );
}
