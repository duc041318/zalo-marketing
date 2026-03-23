"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, DollarSign, Wallet, ClipboardCopy, Gift, TrendingUp } from "lucide-react";

const referrals = [
  { id: 1, name: "Nguyễn Văn Toàn", email: "toan.nv@email.com", date: "20/03/2026", plan: "Pro", status: "paid", commission: "100,000" },
  { id: 2, name: "Trần Thị Mai", email: "mai.tt@email.com", date: "18/03/2026", plan: "Starter", status: "paid", commission: "50,000" },
  { id: 3, name: "Lê Hoàng Sơn", email: "son.lh@email.com", date: "15/03/2026", plan: "Enterprise", status: "paid", commission: "200,000" },
  { id: 4, name: "Phạm Thị Hương", email: "huong.pt@email.com", date: "14/03/2026", plan: "Pro", status: "pending", commission: "100,000" },
  { id: 5, name: "Hoàng Văn Đức", email: "duc.hv@email.com", date: "12/03/2026", plan: "Starter", status: "trial", commission: "0" },
  { id: 6, name: "Ngô Thị Yến", email: "yen.nt@email.com", date: "10/03/2026", plan: "Pro", status: "paid", commission: "100,000" },
  { id: 7, name: "Đỗ Văn Tùng", email: "tung.dv@email.com", date: "08/03/2026", plan: "Enterprise", status: "pending", commission: "200,000" },
  { id: 8, name: "Vũ Thị Linh", email: "linh.vt@email.com", date: "05/03/2026", plan: "Starter", status: "trial", commission: "0" },
];

function statusBadge(status: string) {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Đã thanh toán</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Chờ xử lý</Badge>;
    case "trial":
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Dùng thử</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://zalomarketing.vn/ref/ABC123";
  const currentBalance = 1500000;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cộng tác viên</h1>
        <p className="text-muted-foreground">
          Chương trình giới thiệu và hoa hồng
        </p>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Link giới thiệu của bạn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-muted rounded-lg px-4 py-2 font-mono text-sm flex items-center overflow-x-auto">
              {referralLink}
            </div>
            <Button onClick={handleCopy} variant={copied ? "default" : "outline"}>
              <ClipboardCopy className="mr-2 h-4 w-4" />
              {copied ? "Đã sao chép!" : "Sao chép"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng giới thiệu</p>
              <p className="text-2xl font-bold">28</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đã đăng ký</p>
              <p className="text-2xl font-bold">15</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hoa hồng tháng này</p>
              <p className="text-2xl font-bold">1,500,000đ</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng hoa hồng</p>
              <p className="text-2xl font-bold">12,350,000đ</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng hoa hồng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Gói</th>
                  <th className="text-left py-3 px-4 font-medium">Hoa hồng / người</th>
                  <th className="text-left py-3 px-4 font-medium">Mô tả</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <Badge variant="secondary">Gói Starter</Badge>
                  </td>
                  <td className="py-3 px-4 font-semibold text-green-600">50,000đ/người</td>
                  <td className="py-3 px-4 text-muted-foreground">Hoa hồng cho mỗi người đăng ký gói Starter</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Gói Pro</Badge>
                  </td>
                  <td className="py-3 px-4 font-semibold text-green-600">100,000đ/người</td>
                  <td className="py-3 px-4 text-muted-foreground">Hoa hồng cho mỗi người đăng ký gói Pro</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Gói Enterprise</Badge>
                  </td>
                  <td className="py-3 px-4 font-semibold text-green-600">200,000đ/người</td>
                  <td className="py-3 px-4 text-muted-foreground">Hoa hồng cho mỗi người đăng ký gói Enterprise</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lịch sử giới thiệu</CardTitle>
          <Button
            disabled={currentBalance < 500000}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Rút hoa hồng
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Tên</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày đăng ký</th>
                  <th className="text-left py-3 px-4 font-medium">Gói</th>
                  <th className="text-left py-3 px-4 font-medium">Trạng thái</th>
                  <th className="text-right py-3 px-4 font-medium">Hoa hồng</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-3 px-4 font-medium">{r.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{r.email}</td>
                    <td className="py-3 px-4">{r.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{r.plan}</Badge>
                    </td>
                    <td className="py-3 px-4">{statusBadge(r.status)}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      {r.commission === "0" ? "-" : `${r.commission}đ`}
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
