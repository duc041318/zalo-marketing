"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play } from "lucide-react";

interface LinkResult {
  link: string;
  status: "success" | "error" | "pending";
  message: string;
}

export default function JoinByLinkPage() {
  const [links, setLinks] = useState("");
  const [delay, setDelay] = useState(10);
  const [results, setResults] = useState<LinkResult[]>([]);

  const parsedLinks = links
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const validLinks = parsedLinks.filter((l) =>
    l.startsWith("https://zalo.me/g/") || l.startsWith("https://zalo.me/group/")
  );

  const handleStart = () => {
    setResults([
      {
        link: "https://zalo.me/g/abc123",
        status: "success",
        message: "Tham gia thành công - Nhóm Kinh Doanh HN",
      },
      {
        link: "https://zalo.me/g/def456",
        status: "error",
        message: "Link đã hết hạn hoặc không hợp lệ",
      },
      {
        link: "https://zalo.me/g/ghi789",
        status: "pending",
        message: "Đang xử lý...",
      },
    ]);
  };

  const statusBadge = (status: LinkResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Thành công
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Thất bại
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Đang xử lý
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tham gia nhóm bằng link</h1>
        <p className="text-muted-foreground">Tự động tham gia nhóm qua link</p>
      </div>

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
            <Label>Danh sách link nhóm</Label>
            <Textarea
              placeholder="Dán link nhóm, mỗi link một dòng"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Số link: {parsedLinks.length}</span>
            <span>|</span>
            <span>Hợp lệ: {validLinks.length}</span>
          </div>

          <div className="space-y-2">
            <Label>Delay giữa mỗi lần tham gia</Label>
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

          <Button onClick={handleStart}>
            <Play className="mr-2 h-4 w-4" />
            Bắt đầu tham gia
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kết quả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{result.link}</p>
                    <p className="text-xs text-muted-foreground">{result.message}</p>
                  </div>
                  {statusBadge(result.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
