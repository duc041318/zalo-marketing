"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Monitor, Smartphone, Clock, Zap, Tag } from "lucide-react";
import { useState } from "react";

const plans = [
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

const stats = [
  { label: "Thiết bị", value: "1", sub: "Thiết bị đang hoạt động", icon: Monitor },
  { label: "Tài khoản Zalo", value: "1", sub: "Tài khoản đang hoạt động", icon: Smartphone },
  { label: "Job đang chạy", value: "0/1", sub: "Có thể tạo job mới", icon: Clock },
  { label: "Giới hạn Job", value: "1", sub: "Có thể tạo mới", icon: Zap },
];

export default function SubscriptionPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Record<string, string>>({
    STARTER: "1 tháng",
    PRO: "3 tháng",
    BUSINESS: "1 năm",
  });

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
                <p>Gói: <span className="font-medium text-foreground">Dùng thử</span></p>
                <p>Giới hạn tài khoản: <span className="font-medium text-foreground">1/1</span></p>
                <p>Giới hạn thiết bị: <span className="font-medium text-foreground">1/1</span></p>
                <p>
                  Hết hạn:{" "}
                  <span className="font-medium text-destructive">23/03/2026</span>
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-orange-300 text-orange-600">
              Dùng thử
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
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
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
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
              <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"}>
                Chọn gói {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
