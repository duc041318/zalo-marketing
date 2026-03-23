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
import { Search, UserPlus, Phone } from "lucide-react";

const searchHistory = [
  { phone: "0912345678", name: "Nguyễn Văn Thắng", time: "23/03/2026 10:30", found: true },
  { phone: "0987654321", name: "Trần Thị Mai", time: "23/03/2026 09:15", found: true },
  { phone: "0909111222", name: "—", time: "22/03/2026 16:45", found: false },
  { phone: "0938765432", name: "Lê Hoàng Nam", time: "22/03/2026 14:20", found: true },
  { phone: "0971234567", name: "—", time: "21/03/2026 11:00", found: false },
];

export default function FindByPhonePage() {
  const [account, setAccount] = useState("acc1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (phoneNumber.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tìm kiếm theo SĐT</h1>
        <p className="text-muted-foreground">
          Tìm thông tin Zalo qua số điện thoại
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Tài khoản Zalo</Label>
              <Select
                value={account}
                onValueChange={(v) => v && setAccount(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acc1">Zalo - Nguyễn Văn A (0912***678)</SelectItem>
                  <SelectItem value="acc2">Zalo - Trần Văn B (0987***321)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                placeholder="Nhập số điện thoại cần tìm"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setSearched(false);
                }}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả tìm kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                  NT
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-xl font-semibold">Nguyễn Văn Thắng</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Giới tính:</span>{" "}
                    <span className="font-medium">Nam</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ngày sinh:</span>{" "}
                    <span className="font-medium">15/08/1995</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Hoạt động:</span>{" "}
                    <span className="font-medium">Hôm nay</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trạng thái:</span>{" "}
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                      Chưa kết bạn
                    </Badge>
                  </div>
                </div>
                <Button className="mt-2">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Gửi lời mời kết bạn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử tìm kiếm gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">SĐT</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Tên</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Thời gian</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {searchHistory.map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 px-2 font-mono">{item.phone}</td>
                    <td className="py-3 px-2">{item.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{item.time}</td>
                    <td className="py-3 px-2">
                      {item.found ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Tìm thấy
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                          Không tìm thấy
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
