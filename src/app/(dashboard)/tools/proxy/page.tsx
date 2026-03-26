"use client";

import { useState, useEffect } from "react";
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
import { Plus, RefreshCw, Edit, Trash2, Shield, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface ProxyItem {
  id: number;
  host: string;
  port: string;
  type: "HTTP" | "SOCKS5";
  status: "active" | "error" | "unchecked";
  account: string | null;
}

const statusConfig = {
  active: { label: "Hoạt động", className: "bg-green-50 text-green-700 border-green-300" },
  error: { label: "Lỗi", className: "bg-red-50 text-red-700 border-red-300" },
  unchecked: { label: "Chưa kiểm tra", className: "bg-gray-50 text-gray-700 border-gray-300" },
};

export default function ProxyPage() {
  const [proxies, setProxies] = useState<ProxyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    type: "HTTP" as "HTTP" | "SOCKS5",
  });

  const fetchProxies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.get("/api/proxy");
      setProxies(data.proxies || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể tải danh sách proxy";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProxies();
  }, []);

  const totalActive = proxies.filter((p) => p.status === "active").length;
  const totalError = proxies.filter((p) => p.status === "error").length;

  const handleSave = async () => {
    if (!formData.host || !formData.port) return;
    try {
      setSaving(true);
      await api.post("/api/proxy", formData);
      setFormData({ host: "", port: "", username: "", password: "", type: "HTTP" });
      setShowForm(false);
      fetchProxies();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể thêm proxy";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa proxy này?")) return;
    try {
      await api.delete(`/api/proxy?id=${id}`);
      fetchProxies();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể xóa proxy";
      alert(message);
    }
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
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchProxies}>
            Thử lại
          </Button>
        </div>
      ) : proxies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Shield className="h-10 w-10 mb-2" />
          <p>Chưa có proxy nào</p>
          <p className="text-sm">Bấm &quot;Thêm Proxy&quot; để bắt đầu</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
