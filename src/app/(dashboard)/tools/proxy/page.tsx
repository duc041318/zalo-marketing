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
import { Plus, RefreshCw, Edit, Trash2, Shield } from "lucide-react";

interface ProxyItem {
  id: number;
  host: string;
  port: string;
  type: "HTTP" | "SOCKS5";
  status: "active" | "error" | "unchecked";
  account: string | null;
}

const initialProxies: ProxyItem[] = [
  { id: 1, host: "103.152.xxx.12", port: "8080", type: "HTTP", status: "active", account: "Nguyễn Văn A" },
  { id: 2, host: "45.77.xxx.89", port: "1080", type: "SOCKS5", status: "active", account: "Trần Văn B" },
  { id: 3, host: "192.168.xxx.55", port: "3128", type: "HTTP", status: "error", account: null },
  { id: 4, host: "172.16.xxx.100", port: "1080", type: "SOCKS5", status: "active", account: "Nguyễn Văn A" },
  { id: 5, host: "10.0.xxx.22", port: "8888", type: "HTTP", status: "error", account: null },
];

const statusConfig = {
  active: { label: "Hoạt động", className: "bg-green-50 text-green-700 border-green-300" },
  error: { label: "Lỗi", className: "bg-red-50 text-red-700 border-red-300" },
  unchecked: { label: "Chưa kiểm tra", className: "bg-gray-50 text-gray-700 border-gray-300" },
};

export default function ProxyPage() {
  const [proxies, setProxies] = useState<ProxyItem[]>(initialProxies);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    type: "HTTP" as "HTTP" | "SOCKS5",
  });

  const totalActive = proxies.filter((p) => p.status === "active").length;
  const totalError = proxies.filter((p) => p.status === "error").length;

  const handleSave = () => {
    if (formData.host && formData.port) {
      const newProxy: ProxyItem = {
        id: Date.now(),
        host: formData.host,
        port: formData.port,
        type: formData.type,
        status: "unchecked",
        account: null,
      };
      setProxies([...proxies, newProxy]);
      setFormData({ host: "", port: "", username: "", password: "", type: "HTTP" });
      setShowForm(false);
    }
  };

  const handleDelete = (id: number) => {
    setProxies(proxies.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cài đặt Proxy</h1>
          <p className="text-muted-foreground">
            Cấu hình proxy cho các tài khoản Zalo
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm Proxy
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{proxies.length}</p>
              <p className="text-sm text-muted-foreground">Tổng proxy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{totalActive}</p>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{totalError}</p>
              <p className="text-sm text-muted-foreground">Lỗi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Thêm Proxy mới</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Host</Label>
                <Input
                  placeholder="Ví dụ: 103.152.xxx.12"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input
                  placeholder="Ví dụ: 8080"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Username (tùy chọn)</Label>
                <Input
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Password (tùy chọn)</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Loại Proxy</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => v && setFormData({ ...formData, type: v as "HTTP" | "SOCKS5" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HTTP">HTTP</SelectItem>
                    <SelectItem value="SOCKS5">SOCKS5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Lưu</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {proxies.map((proxy) => (
          <Card key={proxy.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-mono font-semibold">
                      {proxy.host}:{proxy.port}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tài khoản: {proxy.account || "Chưa gán"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={
                      proxy.type === "HTTP"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-purple-50 text-purple-700 border-purple-300"
                    }
                  >
                    {proxy.type}
                  </Badge>
                  <Badge variant="outline" className={statusConfig[proxy.status].className}>
                    {statusConfig[proxy.status].label}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Kiểm tra
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(proxy.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
