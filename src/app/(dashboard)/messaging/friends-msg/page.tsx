"use client";

import { useState, useMemo } from "react";
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
import { Search, Users, Send, UserCheck } from "lucide-react";

const sampleFriends = [
  { id: "1", name: "Nguyễn Văn A", phone: "0901234567", label: "Khách hàng" },
  { id: "2", name: "Trần Thị B", phone: "0912345678", label: "Đối tác" },
  { id: "3", name: "Lê Văn C", phone: "0923456789", label: "Bạn bè" },
  { id: "4", name: "Phạm Thị D", phone: "0934567890", label: "Khách hàng" },
  { id: "5", name: "Hoàng Văn E", phone: "0945678901", label: "Tiềm năng" },
  { id: "6", name: "Vũ Thị F", phone: "0956789012", label: "Đối tác" },
  { id: "7", name: "Đặng Văn G", phone: "0967890123", label: "Bạn bè" },
  { id: "8", name: "Bùi Thị H", phone: "0978901234", label: "Khách hàng" },
];

const labels = ["Tất cả", "Khách hàng", "Đối tác", "Bạn bè", "Tiềm năng"];

export default function FriendsMsgPage() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterLabel, setFilterLabel] = useState("Tất cả");

  const filteredFriends = useMemo(() => {
    return sampleFriends.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.phone.includes(searchQuery);
      const matchesLabel = filterLabel === "Tất cả" || f.label === filterLabel;
      return matchesSearch && matchesLabel;
    });
  }, [searchQuery, filterLabel]);

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
              <p className="text-2xl font-bold">1,000</p>
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
              <p className="text-2xl font-bold">50</p>
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
              <Select value={selectedAccount} onValueChange={(v) => setSelectedAccount(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tài khoản Zalo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acc1">Zalo - 0901234567</SelectItem>
                  <SelectItem value="acc2">Zalo - 0912345678</SelectItem>
                  <SelectItem value="acc3">Zalo - 0923456789</SelectItem>
                </SelectContent>
              </Select>
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
          </CardContent>
        </Card>

        {/* Message composer */}
        <MessageComposer />
      </div>
    </div>
  );
}
