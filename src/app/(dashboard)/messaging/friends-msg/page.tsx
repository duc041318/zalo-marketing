"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageComposer } from "@/components/features/message-composer";
import { Search, Users, Send, UserCheck, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Friend {
  id: string;
  name: string;
  phone: string;
  label: string;
}

interface ZaloAccount {
  id: string;
  name: string;
  phone: string;
}

const labels = ["Tất cả", "Khách hàng", "Đối tác", "Bạn bè", "Tiềm năng"];

export default function FriendsMsgPage() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterLabel, setFilterLabel] = useState("Tất cả");
  const [accounts, setAccounts] = useState<ZaloAccount[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [totalFriends, setTotalFriends] = useState(0);
  const [sentToday, setSentToday] = useState(0);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [sending, setSending] = useState(false);

  // Load Zalo accounts
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoadingAccounts(true);
        const data = await api.get("/api/zalo-accounts");
        setAccounts(data.accounts || []);
      } catch {
        // silently fail
      } finally {
        setLoadingAccounts(false);
      }
    };
    loadAccounts();
  }, []);

  // Load friends when account changes
  const fetchFriends = useCallback(async () => {
    if (!selectedAccount) {
      setFriends([]);
      setTotalFriends(0);
      return;
    }
    try {
      setLoadingFriends(true);
      const data = await api.get(`/api/friends?accountId=${selectedAccount}`);
      setFriends(data.friends || []);
      setTotalFriends(data.total || 0);
    } catch {
      setFriends([]);
    } finally {
      setLoadingFriends(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // Client-side filtering
  const filteredFriends = useMemo(() => {
    return friends.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.phone.includes(searchQuery);
      const matchesLabel = filterLabel === "Tất cả" || f.label === filterLabel;
      return matchesSearch && matchesLabel;
    });
  }, [friends, searchQuery, filterLabel]);

  const allSelected = filteredFriends.length > 0 && filteredFriends.every((f) => selectedIds.includes(f.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredFriends.some((f) => f.id === id)));
    } else {
      const newIds = new Set([...selectedIds, ...filteredFriends.map((f) => f.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const toggleFriend = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSendMessage = async (data: { content: string; scheduled: boolean; scheduleTime: string }) => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một bạn bè");
      return;
    }
    try {
      setSending(true);
      await api.post("/api/messages", {
        accountId: selectedAccount,
        recipientIds: selectedIds,
        content: data.content,
        scheduled: data.scheduled,
        scheduleTime: data.scheduleTime,
      });
      setSentToday((prev) => prev + selectedIds.length);
      setSelectedIds([]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể gửi tin nhắn";
      alert(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nhắn tin bạn bè</h1>
        <p className="text-muted-foreground">Gửi tin nhắn đến danh sách bạn bè</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{totalFriends.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Tổng bạn bè</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <UserCheck className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{selectedIds.length}</p>
              <p className="text-xs text-muted-foreground">Đã chọn</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Send className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{sentToday}</p>
              <p className="text-xs text-muted-foreground">Đã gửi hôm nay</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Friends list */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Danh sách bạn bè</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Account selector */}
            <div className="space-y-2">
              <Label>Tài khoản Zalo</Label>
              {loadingAccounts ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải tài khoản...
                </div>
              ) : (
                <Select value={selectedAccount} onValueChange={(v) => setSelectedAccount(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tài khoản Zalo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        Zalo - {acc.phone} ({acc.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bạn bè..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter by label */}
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <Badge
                  key={label}
                  variant={filterLabel === label ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setFilterLabel(label)}
                >
                  {label}
                </Badge>
              ))}
            </div>

            {/* Select all */}
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm font-medium">Chọn tất cả</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} đã chọn
              </span>
            </div>

            {/* Friends list */}
            {loadingFriends ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !selectedAccount ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mb-2" />
                <p className="text-sm">Chọn tài khoản Zalo để xem bạn bè</p>
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mb-2" />
                <p className="text-sm">Không tìm thấy bạn bè nào</p>
              </div>
            ) : (
              <div className="max-h-[400px] space-y-2 overflow-y-auto">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleFriend(friend.id)}
                  >
                    <Checkbox
                      checked={selectedIds.includes(friend.id)}
                      onCheckedChange={() => toggleFriend(friend.id)}
                    />
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {friend.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">{friend.phone}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {friend.label}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message composer */}
        <MessageComposer onSend={handleSendMessage} />
      </div>

      {sending && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Đang gửi tin nhắn...</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
