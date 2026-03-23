"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History, ChevronLeft, ChevronRight, Filter } from "lucide-react";

type ActivityType = "message" | "friend" | "invite" | "scan";
type ActivityStatus = "success" | "failed" | "running";

interface Activity {
  id: number;
  type: ActivityType;
  description: string;
  account: string;
  time: string;
  status: ActivityStatus;
}

const typeConfig: Record<ActivityType, { label: string; className: string }> = {
  message: { label: "Nhắn tin", className: "bg-blue-50 text-blue-700 border-blue-300" },
  friend: { label: "Kết bạn", className: "bg-green-50 text-green-700 border-green-300" },
  invite: { label: "Mời nhóm", className: "bg-purple-50 text-purple-700 border-purple-300" },
  scan: { label: "Quét thành viên", className: "bg-orange-50 text-orange-700 border-orange-300" },
};

const statusConfig: Record<ActivityStatus, { label: string; className: string }> = {
  success: { label: "Thành công", className: "bg-green-50 text-green-700 border-green-300" },
  failed: { label: "Thất bại", className: "bg-red-50 text-red-700 border-red-300" },
  running: { label: "Đang chạy", className: "bg-yellow-50 text-yellow-700 border-yellow-300" },
};

const activities: Activity[] = [
  { id: 1, type: "message", description: "Gửi tin nhắn hàng loạt - Chiến dịch khuyến mãi T3", account: "Nguyễn Văn A", time: "23/03/2026 10:30", status: "success" },
  { id: 2, type: "friend", description: "Gửi lời mời kết bạn từ danh sách SĐT", account: "Trần Văn B", time: "23/03/2026 10:15", status: "success" },
  { id: 3, type: "invite", description: "Mời thành viên vào nhóm 'Khách hàng VIP'", account: "Nguyễn Văn A", time: "23/03/2026 09:45", status: "failed" },
  { id: 4, type: "scan", description: "Quét thành viên nhóm 'Cộng đồng Marketing'", account: "Trần Văn B", time: "23/03/2026 09:30", status: "running" },
  { id: 5, type: "message", description: "Gửi tin nhắn chăm sóc khách hàng cũ", account: "Nguyễn Văn A", time: "23/03/2026 09:00", status: "success" },
  { id: 6, type: "friend", description: "Tự động kết bạn từ gợi ý Zalo", account: "Trần Văn B", time: "22/03/2026 17:30", status: "failed" },
  { id: 7, type: "invite", description: "Mời thành viên vào nhóm 'Đại lý cấp 1'", account: "Nguyễn Văn A", time: "22/03/2026 16:00", status: "success" },
  { id: 8, type: "scan", description: "Quét thành viên nhóm 'Hội kinh doanh online'", account: "Trần Văn B", time: "22/03/2026 15:00", status: "success" },
  { id: 9, type: "message", description: "Gửi tin nhắn giới thiệu sản phẩm mới", account: "Nguyễn Văn A", time: "22/03/2026 14:00", status: "running" },
  { id: 10, type: "friend", description: "Kết bạn hàng loạt - Danh sách khách hàng tiềm năng", account: "Trần Văn B", time: "22/03/2026 11:30", status: "success" },
];

export default function ScanHistoryPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lịch sử hoạt động</h1>
        <p className="text-muted-foreground">
          Xem lịch sử các hoạt động tự động
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Loại hoạt động</Label>
              <Select
                value={typeFilter}
                onValueChange={(v) => v && setTypeFilter(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="message">Nhắn tin</SelectItem>
                  <SelectItem value="friend">Kết bạn</SelectItem>
                  <SelectItem value="invite">Mời nhóm</SelectItem>
                  <SelectItem value="scan">Quét thành viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={statusFilter}
                onValueChange={(v) => v && setStatusFilter(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="success">Thành công</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="running">Đang chạy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">256</p>
              <p className="text-sm text-muted-foreground">Tổng</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">198</p>
              <p className="text-sm text-muted-foreground">Thành công</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">45</p>
              <p className="text-sm text-muted-foreground">Thất bại</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">13</p>
              <p className="text-sm text-muted-foreground">Đang chạy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Danh sách hoạt động
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">STT</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Loại</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Mô tả</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Tài khoản</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Thời gian</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={activity.id} className="border-b last:border-0">
                    <td className="py-3 px-2 text-muted-foreground">{index + 1}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={typeConfig[activity.type].className}>
                        {typeConfig[activity.type].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 max-w-xs truncate">{activity.description}</td>
                    <td className="py-3 px-2">{activity.account}</td>
                    <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">{activity.time}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={statusConfig[activity.status].className}>
                        {statusConfig[activity.status].label}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Hiển thị 1-10 trên 256
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
