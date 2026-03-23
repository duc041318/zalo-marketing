"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, Search, AlertTriangle } from "lucide-react";

const sampleGroups = [
  { id: 1, name: "Nhóm Kinh Doanh HN", members: 245, joinDate: "15/01/2026" },
  { id: 2, name: "Nhóm Marketing Online", members: 189, joinDate: "22/02/2026" },
  { id: 3, name: "Nhóm Tuyển Dụng IT", members: 312, joinDate: "05/03/2026" },
  { id: 4, name: "Nhóm Dev Frontend", members: 156, joinDate: "10/01/2026" },
  { id: 5, name: "Nhóm Freelancer VN", members: 423, joinDate: "18/12/2025" },
  { id: 6, name: "Nhóm Startup Việt Nam", members: 567, joinDate: "03/02/2026" },
];

export default function LeaveGroupPage() {
  const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");

  const filteredGroups = sampleGroups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleGroup = (id: number) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedGroups.size === sampleGroups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(sampleGroups.map((g) => g.id)));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rời nhóm</h1>
        <p className="text-muted-foreground">Rời nhóm hàng loạt</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chọn tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Tài khoản Zalo</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn tài khoản" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acc1">0912 345 678 - Nguyễn Văn A</SelectItem>
                <SelectItem value="acc2">0987 654 321 - Trần Văn B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Danh sách nhóm đã tham gia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhóm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedGroups.size === sampleGroups.length}
                onCheckedChange={toggleAll}
              />
              <span className="text-sm font-medium">Chọn tất cả</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Đã chọn: {selectedGroups.size}/{sampleGroups.length}
            </span>
          </div>

          <div className="space-y-2">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleGroup(group.id)}
              >
                <Checkbox
                  checked={selectedGroups.has(group.id)}
                  onCheckedChange={() => toggleGroup(group.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{group.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{group.members} thành viên</span>
                    <span>Tham gia: {group.joinDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-500 bg-yellow-50">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Lưu ý</p>
            <p className="text-sm text-yellow-700 mt-1">
              Bạn sẽ không thể tự tham gia lại nhóm sau khi rời.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="destructive"
        disabled={selectedGroups.size === 0}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Rời nhóm đã chọn
      </Button>
    </div>
  );
}
