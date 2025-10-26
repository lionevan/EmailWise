'use client';

import {
  Bell,
  Briefcase,
  Inbox,
  Mail,
  PenSquare,
  Ticket,
  User,
  Users,
  FileClock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import type { EmailCategory } from '@/lib/types';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

type AppSidebarProps = {
  selectedCategory: EmailCategory | 'All' | 'Unread';
  onSelectCategory: (category: EmailCategory | 'All' | 'Unread') => void;
  unreadCounts: Record<string, number>;
};

const categoryIcons: Record<EmailCategory | 'All' | 'Unread', React.ElementType> = {
  All: Inbox,
  Unread: FileClock,
  Personal: User,
  Work: Briefcase,
  Social: Users,
  Promotions: Ticket,
  Updates: Bell,
  Other: Mail,
};

const categories: (EmailCategory | 'All' | 'Unread')[] = [
  'All',
  'Unread',
  'Personal',
  'Work',
  'Social',
  'Promotions',
  'Updates',
  'Other',
];

export function AppSidebar({
  selectedCategory,
  onSelectCategory,
  unreadCounts,
}: AppSidebarProps) {
  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Icons.logo className="size-8 text-primary" />
          <h2 className="text-xl font-semibold tracking-tight">EmailWise</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="px-2 pb-2">
          <Button className="w-full">
            <PenSquare />
            <span>Compose</span>
          </Button>
        </div>
        <SidebarMenu>
          {categories.slice(0, 2).map((category) => {
            const Icon = categoryIcons[category];
            const unreadCount = unreadCounts[category];
            return (
              <SidebarMenuItem key={category}>
                <SidebarMenuButton
                  onClick={() => onSelectCategory(category)}
                  isActive={selectedCategory === category}
                  className="justify-start"
                >
                  <Icon />
                  <span>{category}</span>
                  {unreadCount > 0 && (
                     <Badge variant="secondary" className="ml-auto">{unreadCount}</Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <Separator className="my-2"/>

        <SidebarMenu>
          <div className="px-4 py-2 text-xs font-medium text-muted-foreground">Categories</div>
          {categories.slice(2).map((category) => {
            const Icon = categoryIcons[category];
            const unreadCount = unreadCounts[category];
            return (
              <SidebarMenuItem key={category}>
                <SidebarMenuButton
                  onClick={() => onSelectCategory(category)}
                  isActive={selectedCategory === category}
                  className="justify-start"
                >
                  <Icon />
                  <span>{category}</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">{unreadCount}</Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} EmailWise
        </p>
      </SidebarFooter>
    </>
  );
}
