"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Monitor, Smartphone, Clock, Zap, Tag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Plan {
  name: string;
  prices: Record<string, number>;
  discount?: Record<string, number>;
  originalPrice?: Record<string, number>;
  popular?: boolean;
  features: string[];
}

interface Subscription {
  planName: string;
  accountLimit: string;
  deviceLimit: string;
  expiresAt: string;
  status: string;
}

interface SubscriptionStats {
  devices: string;
  devicesSub: string;
  accounts: string;
  accountsSub: string;
  runningJobs: string;
  runningJobsSub: string;
  jobLimit: string;
  jobLimitSub: string;
}

const defaultPlans: Plan[] = [
  {
    name: "STARTER",
    prices: { "1 tháng": 150000, "6 tháng": 750000, "1 năm": 1200000 },
    discount: { "1 tháng": 40, "6 tháng": 17, "1 năm": 33 },
    originalPrice: { "1 tháng": 250000, "6 tháng": 900000, "1 năm": 1800000 },
    features: ["3 tài khoản Zalo", "1 thiết bị", "5 job đồng thời", "Nhắn tin cơ bản", "Hỗ trợ email"],
  },
  {
    name: "PRO",
    prices: { "1 tháng": 300000, "3 tháng": 800000, "1 năm": 2500000 },
    popular: true,
    features: [
      "10 tài khoản Zalo",
      "3 thiết bị",
      "50 job đồng thời",
      "Tất cả tính năng nhắn tin",
      "Quản lý bạn bè & nhóm",
      "Báo cáo chi tiết",
      "Hỗ trợ ưu tiên",
    ],
  },
  {
    name: "BUSINESS",
    prices: { "1 năm": 5000000 },
    features: [
      "25 tài khoản Zalo",
      "5 thiết bị",
      "200 job đồng thời",
      "Tất cả tính năng PRO",
      "AI Chatbot tự động",
      "CRM tích hợp",
      "API access",
      "Hỗ trợ 24/7",
    ],
  },
];

const iconMap: Record<string, typeof Monitor> = {
  "Thiết bị": Monitor,
  "Tài khoản Zalo": Smartphone,
  "Job đang chạy": Clock,
  "Giới hạn Job": Zap,
};

export default function SubscriptionPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Record<string, string>>({
    STARTER: "1 tháng",
    PRO: "3 tháng",
    BUSINESS: "1 năm",
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upgrading, setUpgrading] = useState("");

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api.get("/api/subscription");
        if (data.subscription) setSubscription(data.subscription);
        if (data.stats) setStats(data.stats);
        if (data.plans) setPlans(data.plans);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Không thể tải thông tin gói đăng ký";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  const handleUpgrade = async (planName: string) => {
    try {
      setUpgrading(planName);
      await api.post("/api/subscription", {
        plan: planName,
        period: selectedPeriod[planName],
      });
      // Refresh subscription data
      const data = await api.get("/api/subscription");
      if (data.subscription) setSubscription(data.subscription);
      if (data.stats) setStats(data.stats);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể nâng cấp gói";
      alert(message);
    } finally {
      setUpgrading("");
    }
  };

  const statItems = stats
    ? [
        { label: "Thiết bị", value: stats.devices, sub: stats.devicesSub },
        { label: "Tài khoản Zalo", value: stats.accounts, sub: stats.accountsSub },
        { label: "Job đang chạy", value: stats.runningJobs, sub: stats.runningJobsSub },
        { label: "Giới hạn Job", value: stats.jobLimit, sub: stats.jobLimitSub },
      ]
    : [
        { label: "Thiết bị", value: "-", sub: "Đang tải..." },
        { label: "Tài khoản Zalo", value: "-", sub: "Đang tải..." },
        { label: "Job đang chạy", value: "-", sub: "Đang tải..." },
        { label: "Giới hạn Job", value: "-", sub: "Đang tải..." },
      ];

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gói đăng ký</h1>
          <p className="text-muted-foreground">
            Chọn gói phù hợp với nhu cầu của bạn
          </p>
        </div>
        <Button variant="outline">
          <Tag className="mr-2 h-4 w-4" />
          Nhập mã kích hoạt
        </Button>
      </div>

      {/* Current Plan */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Gói hiện tại</h3>
              </div>
              <div className="space-y-0.5 text-sm text-muted-foreground">
                <p>Gói: <span className="font-medium text-foreground">{subscription?.planName || "Dùng thử"}</span></p>
                <p>Giới hạn tài khoản: <span className="font-medium text-foreground">{subscription?.accountLimit || "1/1"}</span></p>
                <p>Giới hạn thiết bị: <span className="font-medium text-foreground">{subscription?.deviceLimit || "1/1"}</span></p>
                <p>
                  Hết hạn:{" "}
                  <span className="font-medium text-destructive">{subscription?.expiresAt || "N/A"}</span>
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-orange-300 text-orange-600">
              {subscription?.status || "Dùng thử"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statItems.map((stat) => {
          const IconComp = iconMap[stat.label] || Monitor;
          return (
            <Card key={stat.label}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                  </div>
                  <IconComp className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${
              plan.popular ? "border-primary shadow-lg" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">Phổ biến nhất</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>

              {/* Period Selector */}
              {Object.keys(plan.prices).length > 1 && (
                <div className="flex gap-1 mt-2">
                  {Object.keys(plan.prices).map((period) => (
                    <Button
                      key={period}
                      variant={
                        selectedPeriod[plan.name] === period
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="text-xs"
                      onClick={() =>
                        setSelectedPeriod((prev) => ({
                          ...prev,
                          [plan.name]: period,
                        }))
                      }
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="mt-3">
                {plan.discount?.[selectedPeriod[plan.name] as keyof typeof plan.discount] && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm line-through text-muted-foreground">
                      {(plan.originalPrice?.[selectedPeriod[plan.name] as keyof typeof plan.originalPrice] ?? 0).toLocaleString("vi-VN")} đ
                    </span>
                    <Badge variant="destructive" className="text-[10px]">
                      Tiết kiệm {plan.discount[selectedPeriod[plan.name] as keyof typeof plan.discount]}%
                    </Badge>
                  </div>
                )}
                <p className="text-3xl font-bold text-primary">
                  {(plan.prices[selectedPeriod[plan.name] as keyof typeof plan.prices] ?? Object.values(plan.prices)[0]).toLocaleString("vi-VN")}{" "}
                  <span className="text-base font-normal text-muted-foreground">đ</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedPeriod[plan.name] || Object.keys(plan.prices)[0]}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-6"
                variant={plan.popular ? "default" : "outline"}
                disabled={upgrading === plan.name}
                onClick={() => handleUpgrade(plan.name)}
              >
                {upgrading === plan.name && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Chọn gói {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
