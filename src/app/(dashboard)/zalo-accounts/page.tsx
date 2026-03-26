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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Plus,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Loader2,
  X,
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
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { api } from "@/lib/api";

interface ZaloAccount {
  id: number;
  name: string;
  zaloId: string;
  phone: string;
  friends: number;
  groups: number;
  proxy: string;
  status: "active" | "inactive";
}

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
  const [accounts, setAccounts] = useState<ZaloAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    zaloId: "",
    name: "",
    phone: "",
    cookie: "",
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.get("/api/zalo-accounts");
      setAccounts(data.accounts || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể tải danh sách tài khoản";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddAccount = async () => {
    if (!formData.zaloId || !formData.name) return;
    try {
      setAdding(true);
      await api.post("/api/zalo-accounts", formData);
      setFormData({ zaloId: "", name: "", phone: "", cookie: "" });
      setShowAddDialog(false);
      fetchAccounts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể thêm tài khoản";
      alert(message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
    try {
      await api.delete(`/api/zalo-accounts?id=${id}`);
      fetchAccounts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể xóa tài khoản";
      alert(message);
    }
  };

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
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm hoặc Cập nhật
        </Button>
      </div>

      {/* Add Account Dialog */}
      {showAddDialog && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Thêm tài khoản Zalo</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddDialog(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Zalo ID</Label>
                <Input
                  placeholder="Nhập Zalo ID"
                  value={formData.zaloId}
                  onChange={(e) =>
                    setFormData({ ...formData, zaloId: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tên tài khoản</Label>
                <Input
                  placeholder="Nhập tên"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Cookie</Label>
                <Input
                  placeholder="Nhập cookie"
                  value={formData.cookie}
                  onChange={(e) =>
                    setFormData({ ...formData, cookie: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddAccount} disabled={adding}>
                {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Thêm tài khoản
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={fetchAccounts}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Thử lại
              </Button>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>Chưa có tài khoản Zalo nào</p>
              <p className="text-sm">Bấm &quot;Thêm hoặc Cập nhật&quot; để bắt đầu</p>
            </div>
          ) : (
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
                {accounts.map((account) => (
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            navigator.clipboard.writeText(account.zaloId)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{showPhone ? account.phone : account.phone.replace(/\d(?=\d{3})/g, "*")}</span>
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
                    <TableCell className="text-center">
                      {account.friends}
                    </TableCell>
                    <TableCell className="text-center">
                      {account.groups}
                    </TableCell>
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
                        {account.status === "active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
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
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            Xóa tài khoản
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
