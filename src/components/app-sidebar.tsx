"use client";

import * as React from "react";
import {
  MessageSquare,
  Users,
  UserPlus,
  UsersRound,
  Globe,
  BarChart3,
  CreditCard,
  Share2,
  Bot,
  Contact,
  Search,
  Shield,
  FileText,
  UserCheck,
  FileUp,
  Mail,
  Phone,
  Tag,
  Cake,
  DoorOpen,
  Link as LinkIcon2,
  ScanSearch,
  Link2,
  LogOut,
  Compass,
  SmartphoneNfc,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavChild {
  title: string;
  icon: LucideIcon;
  href: string;
}

interface NavItem {
  title: string;
  icon: LucideIcon;
  href?: string;
  badge?: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  {
    title: "Tài khoản Zalo",
    icon: SmartphoneNfc,
    href: "/zalo-accounts",
  },
  {
    title: "Nhắn tin",
    icon: MessageSquare,
    children: [
      { title: "Nhắn tin bạn bè", icon: Users, href: "/messaging/friends-msg" },
      { title: "Nhắn tin cho nhóm", icon: UsersRound, href: "/messaging/groups-msg" },
      { title: "Nhắn tin theo tệp", icon: FileUp, href: "/messaging/file-msg" },
      { title: "Nhắn tin SĐT", icon: Phone, href: "/messaging/phone-msg" },
      { title: "Nhắn tin theo nhãn", icon: Tag, href: "/messaging/label-msg" },
      { title: "Nhắn tin sinh nhật", icon: Cake, href: "/messaging/birthday-msg" },
    ],
  },
  {
    title: "Bạn bè",
    icon: UserPlus,
    children: [
      { title: "Gợi ý kết bạn", icon: UserCheck, href: "/friends/recommendations" },
      { title: "Quản lý bạn bè", icon: Users, href: "/friends/manage" },
      { title: "Kết bạn theo tệp", icon: FileUp, href: "/friends/import" },
      { title: "Lời mời kết bạn", icon: Mail, href: "/friends/requests" },
    ],
  },
  {
    title: "Nhóm",
    icon: UsersRound,
    children: [
      { title: "Mời vào nhóm", icon: DoorOpen, href: "/groups/invite" },
      { title: "Quét thành viên nhóm", icon: ScanSearch, href: "/groups/scan-members" },
      { title: "Tham gia nhóm bằng link", icon: LinkIcon2, href: "/groups/join-by-link" },
      { title: "Kiểm tra link nhóm", icon: Link2, href: "/groups/check-link" },
      { title: "Rời nhóm", icon: LogOut, href: "/groups/leave" },
      { title: "Link nhóm theo ngành", icon: Compass, href: "/groups/industry-links" },
    ],
  },
  {
    title: "Tính năng khác",
    icon: Globe,
    children: [
      { title: "Tìm Zalo theo SĐT", icon: Search, href: "/tools/find-by-phone" },
      { title: "Quản lý Proxy", icon: Shield, href: "/tools/proxy" },
      { title: "Tệp đã quét", icon: FileText, href: "/tools/scan-history" },
    ],
  },
  {
    title: "Báo cáo",
    icon: BarChart3,
    href: "/reports",
  },
  {
    title: "BẢNG GIÁ",
    icon: CreditCard,
    href: "/subscription",
  },
  {
    title: "Affiliate",
    icon: Share2,
    href: "/affiliate",
  },
  {
    title: "AI Chatbot",
    icon: Bot,
    href: "/ai-chatbot",
    badge: "Mới",
  },
  {
    title: "CRM",
    icon: Contact,
    href: "/crm",
    badge: "Mới",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            Z
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold text-primary">ZaloBot</span>
            <span className="text-[10px] text-muted-foreground leading-none">
              Marketing Automation
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) =>
                item.children ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen={item.children.some(
                      (child) => pathname === child.href
                    )}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuButton tooltip={item.title} />
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton
                                render={<Link href={child.href} />}
                                isActive={pathname === child.href}
                              >
                                <child.icon className="h-4 w-4" />
                                <span>{child.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.href!} />}
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            © 2026 ZaloBot v1.0.0
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
