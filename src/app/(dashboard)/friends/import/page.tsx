"use client";

import { useState, useRef } from "react";
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
import {
  Upload,
  Download,
  Play,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";

const sampleRows = [
  { stt: 1, phone: "0901234567", message: "Xin chào, mình kết bạn nhé!", status: "Chờ gửi" },
  { stt: 2, phone: "0912345678", message: "Hi, mình muốn kết bạn với bạn", status: "Chờ gửi" },
  { stt: 3, phone: "0923456789", message: "", status: "Chờ gửi" },
  { stt: 4, phone: "0934567890", message: "Kết bạn nhé bạn ơi!", status: "Chờ gửi" },
  { stt: 5, phone: "0945678901", message: "Xin chào!", status: "Chờ gửi" },
];

export default function FriendsImportPage() {
  const [uploaded, setUploaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [delay, setDelay] = useState(5);
  const [maxPerDay, setMaxPerDay] = useState(50);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploaded(true);
      setIsRunning(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploaded(true);
      setIsRunning(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kết bạn theo tệp</h1>
        <p className="text-muted-foreground">
          Import file để kết bạn hàng loạt
        </p>
      </div>

      {/* Select Zalo account */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn tài khoản Zalo</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedAccount} onValueChange={(v) => v && setSelectedAccount(v)}>
            <SelectTrigger className="w-full md:w-[400px]">
              <SelectValue placeholder="Chọn tài khoản Zalo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0912xxx456">
                0912xxx456 - Nguyễn Văn A
              </SelectItem>
              <SelectItem value="0987xxx321">
                0987xxx321 - Trần Thị B
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* File upload area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Upload file danh sách
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 cursor-pointer transition-colors ${
              dragOver
                ? "border-blue-500 bg-blue-50"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">
              Kéo thả file vào đây hoặc click để chọn
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hỗ trợ .xlsx, .csv (tối đa 5MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Tải mẫu file
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Instructions card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Hướng dẫn định dạng file
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Cột A:</span> Số
                điện thoại (bắt buộc)
              </li>
              <li>
                <span className="font-medium text-foreground">Cột B:</span> Lời
                nhắn kết bạn (tùy chọn)
              </li>
              <li>Dòng đầu tiên là tiêu đề, dữ liệu bắt đầu từ dòng 2</li>
              <li>Số điện thoại phải bắt đầu bằng 0 hoặc +84</li>
              <li>Mỗi file tối đa 1000 số điện thoại</li>
            </ul>
          </CardContent>
        </Card>

        {/* Settings card */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delay">Delay giữa mỗi lần gửi</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="delay"
                  type="number"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="w-24"
                  min={1}
                />
                <span className="text-sm text-muted-foreground">giây</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPerDay">Số lượng tối đa/ngày</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="maxPerDay"
                  type="number"
                  value={maxPerDay}
                  onChange={(e) => setMaxPerDay(Number(e.target.value))}
                  className="w-24"
                  min={1}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview table */}
      {uploaded && (
        <Card>
          <CardHeader>
            <CardTitle>Xem trước danh sách</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">STT</th>
                    <th className="text-left py-2 px-3 font-medium">
                      Số điện thoại
                    </th>
                    <th className="text-left py-2 px-3 font-medium">
                      Lời nhắn
                    </th>
                    <th className="text-left py-2 px-3 font-medium">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sampleRows.map((row) => (
                    <tr key={row.stt} className="border-b last:border-0">
                      <td className="py-2 px-3">{row.stt}</td>
                      <td className="py-2 px-3 font-mono">{row.phone}</td>
                      <td className="py-2 px-3">
                        {row.message || (
                          <span className="text-muted-foreground italic">
                            Không có
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant="secondary">{row.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleStart}
          disabled={!uploaded || isRunning}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          Bắt đầu kết bạn
        </Button>
        {!uploaded && (
          <p className="text-sm text-muted-foreground">
            Vui lòng upload file trước khi bắt đầu
          </p>
        )}
      </div>

      {/* Progress section */}
      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle>Tiến trình</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full bg-muted rounded h-2">
              <div className="w-[60%] bg-blue-500 h-2 rounded" />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>
                Đã gửi: <span className="font-semibold">30/50</span>
              </span>
              <span className="text-muted-foreground">|</span>
              <span>
                Thành công:{" "}
                <span className="font-semibold text-green-600">25</span>
              </span>
              <span className="text-muted-foreground">|</span>
              <span>
                Thất bại:{" "}
                <span className="font-semibold text-red-600">5</span>
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
