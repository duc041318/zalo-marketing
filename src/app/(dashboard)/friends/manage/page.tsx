"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MoreHorizontal,
  Tag,
  Trash2,
  Send,
  Users,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";

type Label = "Khách hàng" | "Đối tác" | "VIP" | "Tiềm năng" | "Bạn bè";

interface Friend {
  id: number;
  name: string;
  phone: string;
  label: Label;
  date: string;
  avatarColor: string;
}

interface ZaloAccount {
  id: string;
  name: string;
  phone: string;
}

const labelColors: Record<Label, string> = {
  "Khách hàng": "bg-blue-100 text-blue-800",
  "Đối tác": "bg-green-100 text-green-800",
  VIP: "bg-yellow-100 text-yellow-800",
  "Tiềm năng": "bg-purple-100 text-purple-800",
  "Bạn bè": "bg-gray-100 text-gray-800",
};

const filters = ["Tất cả", "Khách hàng", "Đối tác", "Bạn bè", "Tiềm năng", "VIP"] as const;

export default function FriendsManagePage() {
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");
  const [selectedFriends, setSelectedFriends] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState<ZaloAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [labeling, setLabeling] = useState(false);

  // Load Zalo accounts
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await api.get("/api/zalo-accounts");
        setAccounts(data.accounts || []);
      } catch {
        // silently fail, accounts dropdown will be empty
      }
    };
    loadAccounts();
  }, []);

  // Load friends when account/search/filter changes
  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (selectedAccount !== "all") params.set("accountId", selectedAccount);
      if (searchQuery) params.set("search", searchQuery);
      if (activeFilter !== "Tất cả") params.set("label", activeFilter);
      const data = await api.get(`/api/friends?${params.toString()}`);
      setFriends(data.friends || []);
      setTotal(data.total || 0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể tải danh sách bạn bè";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, searchQuery, activeFilter]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const toggleSelect = (id: number) => {
    setSelectedFriends((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedFriends.size === friends.length) {
      setSelectedFriends(new Set());
    } else {
      setSelectedFriends(new Set(friends.map((f) => f.id)));
    }
  };

  const handleBulkLabel = async (label: string) => {
    if (selectedFriends.size === 0) return;
    try {
      setLabeling(true);
      await api.put("/api/friends/labels", {
        friendIds: Array.from(selectedFriends),
        label,
      });
      setSelectedFriends(new Set());
      fetchFriends();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể gắn nhãn";
      alert(message);
    } finally {
      setLabeling(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  // Compute stats from data
  const labeledCount = friends.filter((f) => f.label).length;
  const unlabeledCount = friends.filter((f) => !f.label).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý bạn bè</h1>
        <p className="text-muted-foreground">
          Danh sách, tìm kiếm, lọc và gắn nhãn bạn bè
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng bạn bè</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Đã gắn nhãn</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labeledCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Chưa gắn nhãn</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unlabeledCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Account Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bạn bè theo tên hoặc số điện thoại..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedAccount} onValueChange={(v) => setSelectedAccount(v)}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Chọn tài khoản" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tài khoản</SelectItem>
            {accounts.map((acc) => (
              <SelectItem key={acc.id} value={acc.id}>
                {acc.phone} - {acc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {selectedFriends.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            Đã chọn {selectedFriends.size}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={labeling}
            onClick={() => handleBulkLabel("Khách hàng")}
          >
            {labeling ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Tag className="h-4 w-4 mr-1" />
            )}
            Gắn nhãn
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Xóa bạn
          </Button>
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-1" />
            Gửi tin nhắn
          </Button>
        </div>
      )}

      {/* Friends Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={fetchFriends}>
                Thử lại
              </Button>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-[40px_1fr_120px_120px_50px] items-center gap-4 px-4 py-3 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={
                      friends.length > 0 &&
                      selectedFriends.size === friends.length
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Chọn tất cả"
                  />
                </div>
                <div>Bạn bè</div>
                <div>Nhãn</div>
                <div>Ngày kết bạn</div>
                <div>Hành động</div>
              </div>

              {/* Table Rows */}
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="grid grid-cols-[40px_1fr_120px_120px_50px] items-center gap-4 px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedFriends.has(friend.id)}
                      onCheckedChange={() => toggleSelect(friend.id)}
                      aria-label={`Chọn ${friend.name}`}
                    />
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className={`${friend.avatarColor || "bg-primary"} text-white text-xs`}>
                        {getInitials(friend.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{friend.name}</div>
                      <div className="text-sm text-muted-foreground">{friend.phone}</div>
                    </div>
                  </div>
                  <div>
                    {friend.label && (
                      <Badge
                        variant="secondary"
                        className={labelColors[friend.label] || ""}
                      >
                        {friend.label}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{friend.date}</div>
                  <div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {friends.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Users className="h-10 w-10 mb-2" />
                  <p>Không tìm thấy bạn bè nào</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị 1-{friends.length} trên {total.toLocaleString()} bạn bè
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
