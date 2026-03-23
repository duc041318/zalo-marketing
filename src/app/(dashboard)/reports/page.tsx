"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  UserPlus,
  UsersRound,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const stats = [
  {
    title: "Tin nhắn đã gửi",
    value: "1,234",
    change: "+12%",
    icon: MessageSquare,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Lời mời kết bạn",
    value: "567",
    change: "+8%",
    icon: UserPlus,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Nhóm đã tham gia",
    value: "89",
    change: "+3%",
    icon: UsersRound,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Tỷ lệ thành công",
    value: "94.5%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
];

const recentJobs = [
  { id: 1, type: "Nhắn tin bạn bè", status: "success", count: 50, time: "2 phút trước" },
  { id: 2, type: "Gợi ý kết bạn", status: "success", count: 32, time: "15 phút trước" },
  { id: 3, type: "Nhắn tin nhóm", status: "failed", count: 5, time: "1 giờ trước" },
  { id: 4, type: "Kết bạn theo tệp", status: "running", count: 120, time: "Đang chạy" },
  { id: 5, type: "Nhắn tin SĐT", status: "success", count: 200, time: "3 giờ trước" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Báo cáo & Thống kê</h1>
        <p className="text-muted-foreground">
          Theo dõi hiệu quả hoạt động marketing
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {stat.change} so với tuần trước
                  </p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ hoạt động 7 ngày qua</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">
              Biểu đồ thống kê sẽ được hiển thị ở đây (Recharts)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  {job.status === "success" && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {job.status === "failed" && (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  {job.status === "running" && (
                    <Clock className="h-5 w-5 text-orange-500 animate-pulse" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{job.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.count} đối tượng
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{job.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
