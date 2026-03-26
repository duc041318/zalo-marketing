"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Users, UserPlus, HeartHandshake, CheckCircle, Plus, Search, Phone, Calendar, DollarSign, Loader2, X } from "lucide-react";
import { api } from "@/lib/api";

interface Customer {
  id: number;
  name: string;
  phone: string;
  source: string;
  stage: string;
  lastContact: string;
  value: string;
  notes: string;
}

interface CRMStats {
  total: number;
  newToday: number;
  nurturing: number;
  closed: number;
}

const stages = [
  { id: "new", label: "Mới", color: "bg-blue-500" },
  { id: "contact", label: "Liên hệ", color: "bg-yellow-500" },
  { id: "consulting", label: "Đang tư vấn", color: "bg-orange-500" },
  { id: "closing", label: "Chốt đơn", color: "bg-purple-500" },
  { id: "done", label: "Hoàn thành", color: "bg-green-500" },
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CRMStats>({ total: 0, newToday: 0, nurturing: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    source: "Zalo",
    stage: "new",
    notes: "",
  });

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterStage !== "all") params.set("category", filterStage);
      const data = await api.get(`/api/customers?${params.toString()}`);
      setCustomers(data.customers || []);
      if (data.stats) setStats(data.stats);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể tải danh sách khách hàng";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [search, filterStage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleAddCustomer = async () => {
    if (!formData.name || !formData.phone) return;
    try {
      setAdding(true);
      await api.post("/api/customers", formData);
      setFormData({ name: "", phone: "", source: "Zalo", stage: "new", notes: "" });
      setShowAddForm(false);
      fetchCustomers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể thêm khách hàng";
      alert(message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await api.delete(`/api/customers?id=${id}`);
      fetchCustomers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể xóa khách hàng";
      alert(message);
    }
  };

  const getCustomersForStage = (stageId: string) =>
    customers.filter((c) => c.stage === stageId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý khách hàng (CRM)</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý khách hàng tiềm năng
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm khách hàng
        </Button>
      </div>

      {/* Add Customer Form */}
      {showAddForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Thêm khách hàng mới</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên khách hàng</Label>
                <Input
                  placeholder="Nhập tên"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                  placeholder="Nhập SĐT"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nguồn</Label>
                <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v || "Zalo" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Zalo">Zalo</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Input
                  placeholder="Ghi chú"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCustomer} disabled={adding}>
                {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Thêm
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Hủy</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng KH</p>
              <p className="text-2xl font-bold">{stats.total}</p>
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
              <p className="text-2xl font-bold">{stats.newToday}</p>
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
              <p className="text-2xl font-bold">{stats.nurturing}</p>
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
              <p className="text-2xl font-bold">{stats.closed}</p>
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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchCustomers}>
            Thử lại
          </Button>
        </div>
      ) : (
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-destructive h-6 px-2"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            Xóa
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {stageCustomers.length === 0 && (
                      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                        Chưa có khách hàng
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
