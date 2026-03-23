"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, UserPlus } from "lucide-react";

const sampleMembers = [
  { id: 1, name: "Nguyễn Văn Hùng", initials: "NH", phone: "0912***456", isFriend: true },
  { id: 2, name: "Trần Thị Mai", initials: "TM", phone: "0987***123", isFriend: false },
  { id: 3, name: "Lê Quốc Bảo", initials: "LB", phone: "0345***789", isFriend: false },
  { id: 4, name: "Phạm Anh Tuấn", initials: "PT", phone: "0976***234", isFriend: true },
  { id: 5, name: "Hoàng Minh Châu", initials: "HC", phone: "0911***567", isFriend: false },
  { id: 6, name: "Vũ Đình Khoa", initials: "VK", phone: "0888***890", isFriend: false },
];

export default function ScanMembersPage() {
  const [scanned, setScanned] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quét thành viên nhóm</h1>
        <p className="text-muted-foreground">Quét và thu thập thông tin thành viên nhóm</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cấu hình quét</CardTitle>
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
            <Label>Nhóm hoặc link nhóm</Label>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g1">Nhóm Kinh Doanh HN</SelectItem>
                  <SelectItem value="g2">Nhóm Marketing</SelectItem>
                  <SelectItem value="g3">Nhóm Dev Team</SelectItem>
                </SelectContent>
              </Select>
              <span className="flex items-center text-sm text-muted-foreground">hoặc</span>
              <Input placeholder="Dán link nhóm..." className="flex-1" />
            </div>
          </div>

          <Button onClick={() => setScanned(true)}>
            <Search className="mr-2 h-4 w-4" />
            Bắt đầu quét
          </Button>
        </CardContent>
      </Card>

      {scanned && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">156</div>
                <p className="text-sm text-muted-foreground">Tổng thành viên</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">42</div>
                <p className="text-sm text-muted-foreground">Đã là bạn</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-500">114</div>
                <p className="text-sm text-muted-foreground">Chưa kết bạn</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Danh sách thành viên</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất Excel
                </Button>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Kết bạn tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">STT</TableHead>
                    <TableHead>Thành viên</TableHead>
                    <TableHead>SĐT</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleMembers.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.phone}
                      </TableCell>
                      <TableCell>
                        {member.isFriend ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Đã là bạn
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Chưa kết bạn</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
