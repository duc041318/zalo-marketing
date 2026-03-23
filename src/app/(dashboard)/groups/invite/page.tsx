"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Search } from "lucide-react";

const sampleFriends = [
  { id: 1, name: "Nguyễn Văn An", initials: "NA" },
  { id: 2, name: "Trần Thị Bình", initials: "TB" },
  { id: 3, name: "Lê Hoàng Cường", initials: "LC" },
  { id: 4, name: "Phạm Minh Đức", initials: "PD" },
  { id: 5, name: "Hoàng Thị Em", initials: "HE" },
  { id: 6, name: "Vũ Quốc Phong", initials: "VP" },
  { id: 7, name: "Đặng Thanh Giang", initials: "DG" },
  { id: 8, name: "Bùi Hải Hà", initials: "BH" },
];

export default function GroupInvitePage() {
  const [selectedFriends, setSelectedFriends] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [delay, setDelay] = useState(3);

  const filteredFriends = sampleFriends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFriend = (id: number) => {
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

  const toggleAll = () => {
    if (selectedFriends.size === sampleFriends.length) {
      setSelectedFriends(new Set());
    } else {
      setSelectedFriends(new Set(sampleFriends.map((f) => f.id)));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mời vào nhóm</h1>
        <p className="text-muted-foreground">Mời bạn bè vào nhóm tự động</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cấu hình</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <Label>Nhóm đích</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g1">Nhóm Kinh Doanh HN</SelectItem>
                  <SelectItem value="g2">Nhóm Marketing</SelectItem>
                  <SelectItem value="g3">Nhóm Dev Team</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Delay giữa mỗi lời mời</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="w-24"
                  min={1}
                />
                <span className="text-sm text-muted-foreground">giây</span>
              </div>
            </div>

            <Button className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Mời vào nhóm
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Danh sách bạn bè</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bạn bè..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedFriends.size === sampleFriends.length}
                  onCheckedChange={toggleAll}
                />
                <span className="text-sm font-medium">Chọn tất cả</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Đã chọn: {selectedFriends.size}/{sampleFriends.length}
              </span>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleFriend(friend.id)}
                >
                  <Checkbox
                    checked={selectedFriends.has(friend.id)}
                    onCheckedChange={() => toggleFriend(friend.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{friend.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{friend.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
