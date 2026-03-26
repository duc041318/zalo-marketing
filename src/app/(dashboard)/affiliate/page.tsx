"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, DollarSign, Wallet, ClipboardCopy, Gift, TrendingUp, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Referral {
  id: number;
  name: string;
  email: string;
  date: string;
  plan: string;
  status: string;
  commission: string;
}

interface AffiliateData {
  referralLink: string;
  currentBalance: number;
  totalReferrals: number;
  registered: number;
  monthlyCommission: string;
  totalCommission: string;
  referrals: Referral[];
  commissionTiers: { plan: string; amount: string; description: string; badgeClass: string }[];
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [data, setData] = useState<AffiliateData>({
    referralLink: "",
    currentBalance: 0,
    totalReferrals: 0,
    registered: 0,
    monthlyCommission: "0",
    totalCommission: "0",
    referrals: [],
    commissionTiers: [],
  });

  useEffect(() => {
    const fetchAffiliate = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await api.get("/api/affiliate");
        if (result.affiliate) {
          setData(result.affiliate);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Không thể tải thông tin cộng tác viên";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchAffiliate();
  }, []);

  const handleCopy = () => {
    if (!data.referralLink) return;
    navigator.clipboard.writeText(data.referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawing(true);
      await api.post("/api/affiliate", { action: "withdraw" });
      // Refresh data
      const result = await api.get("/api/affiliate");
      if (result.affiliate) setData(result.affiliate);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể rút hoa hồng";
      alert(message);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    );
  }

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
              {data.referralLink || "Chưa có link giới thiệu"}
            </div>
            <Button onClick={handleCopy} variant={copied ? "default" : "outline"} disabled={!data.referralLink}>
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
              <p className="text-2xl font-bold">{data.totalReferrals}</p>
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
              <p className="text-2xl font-bold">{data.registered}</p>
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
              <p className="text-2xl font-bold">{data.monthlyCommission}đ</p>
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
              <p className="text-2xl font-bold">{data.totalCommission}đ</p>
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
                {data.commissionTiers && data.commissionTiers.length > 0 ? (
                  data.commissionTiers.map((tier, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className={tier.badgeClass || ""}>
                          {tier.plan}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-semibold text-green-600">{tier.amount}</td>
                      <td className="py-3 px-4 text-muted-foreground">{tier.description}</td>
                    </tr>
                  ))
                ) : (
                  <>
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
                  </>
                )}
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
            disabled={data.currentBalance < 500000 || withdrawing}
            onClick={handleWithdraw}
          >
            {withdrawing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            Rút hoa hồng
          </Button>
        </CardHeader>
        <CardContent>
          {data.referrals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mb-2" />
              <p>Chưa có lịch sử giới thiệu</p>
            </div>
          ) : (
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
                  {data.referrals.map((r) => (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
