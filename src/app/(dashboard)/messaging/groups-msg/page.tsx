"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Users, UserCheck } from "lucide-react";

const sampleGroups = [
  { id: "1", name: "Nhóm Kinh Doanh", members: 156 },
  { id: "2", name: "Nhóm Marketing", members: 89 },
  { id: "3", name: "Nhóm Kỹ Thuật", members: 234 },
  { id: "4", name: "Nhóm Chăm Sóc Khách Hàng", members: 67 },
  { id: "5", name: "Nhóm Quản Lý", members: 45 },
  { id: "6", name: "Nhóm Đối Tác", members: 112 },
];

export default function GroupsMsgPage() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredGroups = useMemo(() => {
    return sampleGroups.filter((g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const allSelected = filteredGroups.length > 0 && filteredGroups.every((g) => selectedIds.includes(g.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredGroups.some((g) => g.id === id)));
    } else {
      const newIds = new Set([...selectedIds, ...filteredGroups.map((g) => g.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const toggleGroup = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nhắn tin cho nhóm</h1>
        <p className="text-muted-foreground">Gửi tin nhắn vào các nhóm Zalo</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">139</p>
              <p className="text-xs text-muted-foreground">Tổng nhóm</p>
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
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Groups list */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Danh sách nhóm</CardTitle>
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
                placeholder="Tìm kiếm nhóm..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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

            {/* Groups list */}
            <div className="max-h-[400px] space-y-2 overflow-y-auto">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleGroup(group.id)}
                >
                  <Checkbox
                    checked={selectedIds.includes(group.id)}
                    onCheckedChange={() => toggleGroup(group.id)}
                  />
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-sm font-medium text-blue-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{group.name}</p>
                    <p className="text-xs text-muted-foreground">{group.members} thành viên</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {group.members}
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
