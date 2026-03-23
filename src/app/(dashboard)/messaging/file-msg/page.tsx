"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageComposer } from "@/components/features/message-composer";
import { Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, Clock } from "lucide-react";

const sampleData = [
  { stt: 1, name: "Nguyễn Văn A", phone: "0901234567", status: "valid" as const },
  { stt: 2, name: "Trần Thị B", phone: "0912345678", status: "valid" as const },
  { stt: 3, name: "Lê Văn C", phone: "0923456789", status: "valid" as const },
  { stt: 4, name: "Phạm Thị D", phone: "abc123", status: "invalid" as const },
  { stt: 5, name: "Hoàng Văn E", phone: "0945678901", status: "pending" as const },
];

const statusConfig = {
  valid: { label: "Hợp lệ", variant: "default" as const, Icon: CheckCircle2 },
  invalid: { label: "Không hợp lệ", variant: "destructive" as const, Icon: XCircle },
  pending: { label: "Chờ xử lý", variant: "secondary" as const, Icon: Clock },
};

export default function FileMsgPage() {
  const [uploaded, setUploaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    setUploaded(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nhắn tin theo tệp</h1>
        <p className="text-muted-foreground">Upload file Excel/CSV để gửi tin nhắn hàng loạt</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Upload area */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tải lên tệp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">Kéo thả file vào đây</p>
                <p className="text-xs text-muted-foreground mt-1">hoặc click để chọn file</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Hỗ trợ: .xlsx, .csv (tối đa 10MB)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setUploaded(true)}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Chọn file
                </Button>
              </div>

              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Tải mẫu file
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hướng dẫn định dạng file</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>File Excel/CSV cần có các cột sau:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Tên</strong> - Tên người nhận (bắt buộc)</li>
                  <li><strong className="text-foreground">Số điện thoại</strong> - SĐT đã đăng ký Zalo (bắt buộc)</li>
                  <li><strong className="text-foreground">Ghi chú</strong> - Thông tin bổ sung (tùy chọn)</li>
                </ul>
                <p className="mt-2">Lưu ý:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Số điện thoại phải bắt đầu bằng 0 hoặc +84</li>
                  <li>Mỗi dòng tương ứng với một người nhận</li>
                  <li>Tối đa 5,000 dòng mỗi lần upload</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Preview table */}
          {uploaded && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Xem trước dữ liệu</CardTitle>
                  <Badge variant="secondary">{sampleData.length} dòng</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>STT</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleData.map((row) => {
                      const config = statusConfig[row.status];
                      const StatusIcon = config.Icon;
                      return (
                        <TableRow key={row.stt}>
                          <TableCell>{row.stt}</TableCell>
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell>{row.phone}</TableCell>
                          <TableCell>
                            <Badge variant={config.variant} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Message composer */}
          <MessageComposer />
        </div>
      </div>
    </div>
  );
}
