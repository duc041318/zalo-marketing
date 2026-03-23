"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreHorizontal,
  Plus,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const sampleAccounts = [
  {
    id: 1,
    name: "Nguyễn Đức",
    zaloId: "1766297018453230527",
    phone: "+84***693",
    friends: 1000,
    groups: 139,
    proxy: "snvt1.proxyv4.io.vn:195... https",
    status: "active" as const,
  },
];

const faqItems = [
  "Tại sao tôi không thấy thông tin bạn bè hay nhóm?",
  "Tại sao tài khoản của tôi không chạy?",
  "Tại sao tài khoản thường xuyên bị thoát (Logout)?",
  'Trạng thái "Không hoạt động" nghĩa là gì?',
  "Tôi nên dùng loại Proxy nào?",
  "Làm sao để cập nhật danh sách bạn bè và nhóm mới nhất?",
  "Tại sao không gán được Proxy cho tài khoản?",
];

export default function ZaloAccountsPage() {
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý tài khoản Zalo</h1>
          <p className="text-muted-foreground">
            Quản lý, cập nhật proxy, và kiểm tra trạng thái tài khoản Zalo
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm hoặc Cập nhật
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Tên tài khoản</TableHead>
                <TableHead>Zalo ID</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead className="text-center">Bạn bè</TableHead>
                <TableHead className="text-center">Nhóm</TableHead>
                <TableHead>Proxy</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {account.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{account.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {account.zaloId}
                      </code>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{showPhone ? "+84912345693" : account.phone}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowPhone(!showPhone)}
                      >
                        {showPhone ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{account.friends}</TableCell>
                  <TableCell className="text-center">{account.groups}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {account.proxy}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        account.status === "active" ? "default" : "secondary"
                      }
                      className={
                        account.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : ""
                      }
                    >
                      {account.status === "active" ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-accent cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Cập nhật
                        </DropdownMenuItem>
                        <DropdownMenuItem>Gán Proxy</DropdownMenuItem>
                        <DropdownMenuItem>Đồng bộ bạn bè</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Xóa tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-primary">?</span> Câu hỏi thường gặp (FAQ)
        </h2>
        <Card>
          <CardContent className="p-0 divide-y">
            {faqItems.map((item, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-sm hover:bg-muted/50 transition-colors">
                  <span>{item}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-3 text-sm text-muted-foreground">
                  Nội dung trả lời sẽ được cập nhật sau...
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
