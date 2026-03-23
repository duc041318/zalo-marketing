"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Inbox, Check, X, Clock, UserCheck, UserX } from "lucide-react";

const sentRequests = [
  { id: 1, name: "Nguyễn Văn Minh", phone: "0901xxx234", date: "20/03/2026", status: "accepted" },
  { id: 2, name: "Trần Thị Lan", phone: "0912xxx567", date: "19/03/2026", status: "pending" },
  { id: 3, name: "Lê Hoàng Nam", phone: "0987xxx890", date: "18/03/2026", status: "declined" },
  { id: 4, name: "Phạm Thu Hà", phone: "0934xxx123", date: "17/03/2026", status: "pending" },
  { id: 5, name: "Đỗ Văn Tuấn", phone: "0978xxx456", date: "16/03/2026", status: "accepted" },
  { id: 6, name: "Hoàng Thị Yến", phone: "0945xxx789", date: "15/03/2026", status: "pending" },
];

const receivedRequests = [
  { id: 1, name: "Vũ Đình Khoa", date: "21/03/2026" },
  { id: 2, name: "Ngô Thị Hương", date: "20/03/2026" },
  { id: 3, name: "Bùi Minh Đức", date: "19/03/2026" },
  { id: 4, name: "Lý Thị Ngọc", date: "18/03/2026" },
];

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
  const [receivedStates, setReceivedStates] = useState<Record<number, "accepted" | "declined" | null>>(
    () => {
      const initial: Record<number, null> = {};
      receivedRequests.forEach((r) => {
        initial[r.id] = null;
      });
      return initial;
    }
  );

  const handleAccept = (id: number) => {
    setReceivedStates((prev) => ({ ...prev, [id]: "accepted" }));
  };

  const handleDecline = (id: number) => {
    setReceivedStates((prev) => ({ ...prev, [id]: "declined" }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lời mời kết bạn</h1>
        <p className="text-muted-foreground">Theo dõi lời mời đã gửi và nhận</p>
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
                <p className="text-2xl font-bold">45</p>
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
                <p className="text-2xl font-bold">30</p>
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
                <p className="text-2xl font-bold">5</p>
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
                <p className="text-2xl font-bold">10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sent" className="w-full">
        <TabsList>
          <TabsTrigger value="sent">
            <Send className="h-4 w-4 mr-2" />
            Đã gửi
          </TabsTrigger>
          <TabsTrigger value="received">
            <Inbox className="h-4 w-4 mr-2" />
            Đã nhận
          </TabsTrigger>
        </TabsList>

        {/* Tab: Đã gửi */}
        <TabsContent value="sent" className="space-y-3 mt-4">
          {sentRequests.map((item) => (
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
                    disabled={item.status !== "pending"}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Hủy lời mời
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab: Đã nhận */}
        <TabsContent value="received" className="space-y-3 mt-4">
          {receivedRequests.map((item) => {
            const state = receivedStates[item.id];
            return (
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
                    {state === "accepted" ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Đã chấp nhận
                      </Badge>
                    ) : state === "declined" ? (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        <UserX className="h-3 w-3 mr-1" />
                        Đã từ chối
                      </Badge>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAccept(item.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Đồng ý
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDecline(item.id)}>
                          <X className="h-4 w-4 mr-1" />
                          Từ chối
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
