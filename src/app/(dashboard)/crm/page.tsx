"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, UserPlus, HeartHandshake, CheckCircle, Plus, Search, Phone, Calendar, DollarSign } from "lucide-react";

const stages = [
  { id: "new", label: "Mới", color: "bg-blue-500" },
  { id: "contact", label: "Liên hệ", color: "bg-yellow-500" },
  { id: "consulting", label: "Đang tư vấn", color: "bg-orange-500" },
  { id: "closing", label: "Chốt đơn", color: "bg-purple-500" },
  { id: "done", label: "Hoàn thành", color: "bg-green-500" },
];

const customers = [
  { id: 1, name: "Nguyễn Văn An", phone: "0901234567", source: "Zalo", stage: "new", lastContact: "22/03/2026", value: "5,000,000", notes: "Quan tâm gói Pro, cần tư vấn thêm" },
  { id: 2, name: "Trần Thị Bích", phone: "0912345678", source: "Facebook", stage: "new", lastContact: "21/03/2026", value: "2,500,000", notes: "Hỏi về tính năng gửi tin nhắn hàng loạt" },
  { id: 3, name: "Lê Hoàng Cường", phone: "0923456789", source: "Website", stage: "new", lastContact: "23/03/2026", value: "8,000,000", notes: "Doanh nghiệp lớn, cần demo" },
  { id: 4, name: "Phạm Thị Dung", phone: "0934567890", source: "Zalo", stage: "contact", lastContact: "20/03/2026", value: "3,200,000", notes: "Đã gọi điện lần 1, hẹn gọi lại" },
  { id: 5, name: "Hoàng Văn Em", phone: "0945678901", source: "Facebook", stage: "contact", lastContact: "19/03/2026", value: "4,500,000", notes: "Đang so sánh với đối thủ" },
  { id: 6, name: "Ngô Thị Phượng", phone: "0956789012", source: "Website", stage: "consulting", lastContact: "22/03/2026", value: "12,000,000", notes: "Cần tích hợp API, đã gửi báo giá" },
  { id: 7, name: "Đỗ Văn Giang", phone: "0967890123", source: "Zalo", stage: "consulting", lastContact: "21/03/2026", value: "6,800,000", notes: "Yêu cầu dùng thử 7 ngày" },
  { id: 8, name: "Vũ Thị Hạnh", phone: "0978901234", source: "Facebook", stage: "consulting", lastContact: "18/03/2026", value: "9,500,000", notes: "Đã demo, chờ phản hồi ban giám đốc" },
  { id: 9, name: "Bùi Văn Khang", phone: "0989012345", source: "Zalo", stage: "closing", lastContact: "23/03/2026", value: "15,000,000", notes: "Đồng ý giá, đang làm hợp đồng" },
  { id: 10, name: "Lý Thị Lan", phone: "0990123456", source: "Website", stage: "closing", lastContact: "22/03/2026", value: "7,200,000", notes: "Chờ duyệt ngân sách nội bộ" },
  { id: 11, name: "Trịnh Văn Minh", phone: "0911234567", source: "Zalo", stage: "done", lastContact: "20/03/2026", value: "10,000,000", notes: "Đã thanh toán gói Enterprise" },
  { id: 12, name: "Mai Thị Ngọc", phone: "0922345678", source: "Facebook", stage: "done", lastContact: "17/03/2026", value: "4,000,000", notes: "Đã kích hoạt gói Pro thành công" },
];

function sourceBadge(source: string) {
  switch (source) {
    case "Zalo":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Zalo</Badge>;
    case "Facebook":
      return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Facebook</Badge>;
    case "Website":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Website</Badge>;
    default:
      return <Badge variant="secondary">{source}</Badge>;
  }
}

export default function CRMPage() {
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");

  const filtered = customers.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchStage = filterStage === "all" || c.stage === filterStage;
    return matchSearch && matchStage;
  });

  const getCustomersForStage = (stageId: string) =>
    filtered.filter((c) => c.stage === stageId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý khách hàng (CRM)</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý khách hàng tiềm năng
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm khách hàng
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng KH</p>
              <p className="text-2xl font-bold">324</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mới hôm nay</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2">
              <HeartHandshake className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang chăm sóc</p>
              <p className="text-2xl font-bold">89</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đã chốt</p>
              <p className="text-2xl font-bold">45</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filterStage}
          onValueChange={(v) => v && setFilterStage(v)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Lọc theo giai đoạn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="new">Mới</SelectItem>
            <SelectItem value="contact">Liên hệ</SelectItem>
            <SelectItem value="consulting">Đang tư vấn</SelectItem>
            <SelectItem value="closing">Chốt đơn</SelectItem>
            <SelectItem value="done">Hoàn thành</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => {
            const stageCustomers = getCustomersForStage(stage.id);
            return (
              <div key={stage.id} className="w-[300px] flex-shrink-0">
                <div
                  className={`${stage.color} text-white rounded-t-lg px-4 py-2 font-semibold flex items-center justify-between`}
                >
                  <span>{stage.label}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {stageCustomers.length}
                  </Badge>
                </div>
                <div className="bg-muted/50 rounded-b-lg p-3 space-y-3 min-h-[200px]">
                  {stageCustomers.map((customer) => (
                    <Card key={customer.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm">{customer.name}</p>
                          {sourceBadge(customer.source)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{customer.lastContact}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                          <DollarSign className="h-3 w-3" />
                          <span>{customer.value}đ</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {customer.notes}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
