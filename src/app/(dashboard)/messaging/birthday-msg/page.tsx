"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageComposer } from "@/components/features/message-composer";
import { Cake, CalendarDays, Clock, CheckCircle2, Loader2, Users } from "lucide-react";

const todayBirthdays = [
  { id: "1", name: "Nguyễn Minh Tuấn", birthday: "22/03/1990", status: "sent" as const },
  { id: "2", name: "Trần Thu Hà", birthday: "22/03/1995", status: "pending" as const },
  { id: "3", name: "Lê Quốc Bảo", birthday: "22/03/1988", status: "pending" as const },
];

const upcomingBirthdays = [
  { id: "4", name: "Phạm Thị Mai", birthday: "23/03/1992" },
  { id: "5", name: "Hoàng Văn Đức", birthday: "24/03/1985" },
  { id: "6", name: "Vũ Ngọc Lan", birthday: "25/03/1993" },
  { id: "7", name: "Đặng Anh Khoa", birthday: "26/03/1991" },
  { id: "8", name: "Bùi Thanh Tâm", birthday: "28/03/1994" },
];

const defaultMessage = `Chúc mừng sinh nhật {name}! 🎂

Chúc bạn một ngày sinh nhật thật vui vẻ, hạnh phúc và tràn đầy niềm vui. Chúc bạn luôn mạnh khỏe, thành công trong cuộc sống!

Thân mến.`;

export default function BirthdayMsgPage() {
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [sendTime, setSendTime] = useState("08:00");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [birthdayMessage, setBirthdayMessage] = useState(defaultMessage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nhắn tin sinh nhật</h1>
        <p className="text-muted-foreground">Tự động gửi lời chúc sinh nhật</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Cake className="h-8 w-8 text-pink-500" />
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Hôm nay</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <CalendarDays className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Tuần này</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-muted-foreground">Tháng này</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cài đặt gửi tự động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Auto toggle */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Tự động gửi lời chúc</p>
                  <p className="text-xs text-muted-foreground">
                    Hệ thống sẽ tự động gửi lời chúc sinh nhật mỗi ngày
                  </p>
                </div>
                <Switch checked={autoEnabled} onCheckedChange={setAutoEnabled} />
              </div>

              {/* Time setting */}
              <div className="space-y-2">
                <Label>Thời gian gửi</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={sendTime}
                    onChange={(e) => setSendTime(e.target.value)}
                    className="w-32"
                  />
                </div>
              </div>

              {/* Account selector */}
              <div className="space-y-2">
                <Label>Tài khoản Zalo</Label>
                <Select value={selectedAccount} onValueChange={(v) => setSelectedAccount(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tài khoản Zalo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acc1">Zalo - 0901234567</SelectItem>
                    <SelectItem value="acc2">Zalo - 0912345678</SelectItem>
                    <SelectItem value="acc3">Zalo - 0923456789</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message template */}
              <div className="space-y-2">
                <Label>Mẫu lời chúc</Label>
                <Textarea
                  className="min-h-[120px]"
                  value={birthdayMessage}
                  onChange={(e) => setBirthdayMessage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Sử dụng {"{name}"} để chèn tên người nhận
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Today's birthdays */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Sinh nhật hôm nay</CardTitle>
                <Badge variant="default">{todayBirthdays.length} người</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayBirthdays.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/10 text-sm font-medium text-pink-600">
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.birthday}</p>
                    </div>
                    {person.status === "sent" ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Đã gửi
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Loader2 className="h-3 w-3" />
                        Chờ gửi
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming birthdays */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Sinh nhật sắp tới</CardTitle>
                <Badge variant="secondary">{upcomingBirthdays.length} người</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingBirthdays.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-sm font-medium text-blue-600">
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.birthday}</p>
                    </div>
                    <Badge variant="secondary">Sắp tới</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message composer */}
          <MessageComposer />
        </div>
      </div>
    </div>
  );
}
