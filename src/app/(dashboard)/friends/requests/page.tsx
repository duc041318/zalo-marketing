"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Inbox, Check, X, Clock, UserCheck, UserX, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface FriendRequest {
  id: number;
  name: string;
  phone?: string;
  date: string;
  status: string;
}

interface RequestStats {
  sent: number;
  accepted: number;
  declined: number;
  pending: number;
}

interface ZaloAccount {
  id: string;
  name: string;
  phone: string;
}

function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return parts[0][0] + parts[parts.length - 1][0];
  }
  return name[0];
}

function getStatusBadge(status: string) {
  switch (status) {
    case "accepted":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><UserCheck className="h-3 w-3 mr-1" />Chấp nhận</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" />Chờ phản hồi</Badge>;
    case "declined":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><UserX className="h-3 w-3 mr-1" />Từ chối</Badge>;
    default:
      return null;
  }
}

export default function FriendRequestsPage() {
  const [accounts, setAccounts] = useState<ZaloAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [stats, setStats] = useState<RequestStats>({ sent: 0, accepted: 0, declined: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Load accounts
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await api.get("/api/zalo-accounts");
        setAccounts(data.accounts || []);
      } catch {
        // silently fail
      }
    };
    loadAccounts();
  }, []);

  // Load requests
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (selectedAccount !== "all") params.set("accountId", selectedAccount);

      const [sentData, receivedData] = await Promise.all([
        api.get(`/api/friends/requests?${params.toString()}&direction=outgoing`),
        api.get(`/api/friends/requests?${params.toString()}&direction=incoming`),
      ]);

      setSentRequests(sentData.requests || []);
      setReceivedRequests(receivedData.requests || []);
      setStats(sentData.stats || receivedData.stats || { sent: 0, accepted: 0, declined: 0, pending: 0 });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể tải lời mời kết bạn";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (requestId: number, action: "accept" | "decline" | "cancel") => {
    const key = `${requestId}-${action}`;
    try {
      setActionLoading((prev) => ({ ...prev, [key]: true }));
      await api.put("/api/friends/requests", { requestId, action });
      fetchRequests();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Thao tác thất bại";
      alert(message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lời mời kết bạn</h1>
          <p className="text-muted-foreground">Theo dõi lời mời đã gửi và nhận</p>
        </div>
        <Select value={selectedAccount} onValueChange={(v) => setSelectedAccount(v)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Chọn tài khoản" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tài khoản</SelectItem>
            {accounts.map((acc) => (
              <SelectItem key={acc.id} value={acc.id}>
                {acc.phone} - {acc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đã gửi</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chấp nhận</p>
                <p className="text-2xl font-bold">{stats.accepted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Từ chối</p>
                <p className="text-2xl font-bold">{stats.declined}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 p-2">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chờ phản hồi</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchRequests}>
            Thử lại
          </Button>
        </div>
      ) : (
        /* Tabs */
        <Tabs defaultValue="sent" className="w-full">
          <TabsList>
            <TabsTrigger value="sent">
              <Send className="h-4 w-4 mr-2" />
              Đã gửi ({sentRequests.length})
            </TabsTrigger>
            <TabsTrigger value="received">
              <Inbox className="h-4 w-4 mr-2" />
              Đã nhận ({receivedRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Đã gửi */}
          <TabsContent value="sent" className="space-y-3 mt-4">
            {sentRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Send className="h-10 w-10 mb-2" />
                <p>Chưa có lời mời nào được gửi</p>
              </div>
            ) : (
              sentRequests.map((item) => (
                <Card key={item.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.phone}</p>
                      </div>
                      <div className="text-sm text-muted-foreground hidden sm:block">
                        {item.date}
                      </div>
                      <div>{getStatusBadge(item.status)}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={item.status !== "pending" || actionLoading[`${item.id}-cancel`]}
                        onClick={() => handleAction(item.id, "cancel")}
                      >
                        {actionLoading[`${item.id}-cancel`] ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 mr-1" />
                        )}
                        Hủy lời mời
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Tab: Đã nhận */}
          <TabsContent value="received" className="space-y-3 mt-4">
            {receivedRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Inbox className="h-10 w-10 mb-2" />
                <p>Chưa có lời mời nào được nhận</p>
              </div>
            ) : (
              receivedRequests.map((item) => (
                <Card key={item.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      {item.status === "accepted" ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Đã chấp nhận
                        </Badge>
                      ) : item.status === "declined" ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          <UserX className="h-3 w-3 mr-1" />
                          Đã từ chối
                        </Badge>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={actionLoading[`${item.id}-accept`]}
                            onClick={() => handleAction(item.id, "accept")}
                          >
                            {actionLoading[`${item.id}-accept`] ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 mr-1" />
                            )}
                            Đồng ý
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoading[`${item.id}-decline`]}
                            onClick={() => handleAction(item.id, "decline")}
                          >
                            {actionLoading[`${item.id}-decline`] ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <X className="h-4 w-4 mr-1" />
                            )}
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
