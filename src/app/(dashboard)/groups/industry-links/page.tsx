"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Megaphone,
  ShoppingCart,
  Briefcase,
  Plane,
  GraduationCap,
  Cpu,
  UtensilsCrossed,
  Search,
  ArrowLeft,
  Users,
} from "lucide-react";

const categories = [
  { id: "bds", name: "Bất động sản", icon: Building2, count: 125 },
  { id: "marketing", name: "Marketing", icon: Megaphone, count: 98 },
  { id: "kdol", name: "Kinh doanh online", icon: ShoppingCart, count: 156 },
  { id: "td", name: "Tuyển dụng", icon: Briefcase, count: 87 },
  { id: "dl", name: "Du lịch", icon: Plane, count: 64 },
  { id: "gd", name: "Giáo dục", icon: GraduationCap, count: 112 },
  { id: "cn", name: "Công nghệ", icon: Cpu, count: 143 },
  { id: "at", name: "Ẩm thực", icon: UtensilsCrossed, count: 76 },
];

const sampleGroupsByCategory: Record<string, { name: string; members: number }[]> = {
  bds: [
    { name: "BĐS Hà Nội - Mua Bán", members: 1245 },
    { name: "Đầu Tư Bất Động Sản 2026", members: 890 },
    { name: "Môi Giới BĐS Sài Gòn", members: 2100 },
    { name: "Nhà Đất Đà Nẵng", members: 567 },
    { name: "BĐS Nghỉ Dưỡng Việt Nam", members: 432 },
  ],
  marketing: [
    { name: "Digital Marketing VN", members: 3200 },
    { name: "Content Marketing Hub", members: 1560 },
    { name: "SEO & SEM Vietnam", members: 980 },
    { name: "Social Media Marketing", members: 2340 },
    { name: "Marketing Automation", members: 670 },
  ],
  kdol: [
    { name: "Kinh Doanh Online Toàn Quốc", members: 4500 },
    { name: "Dropshipping Việt Nam", members: 1230 },
    { name: "Bán Hàng Shopee/Lazada", members: 3400 },
    { name: "Affiliate Marketing VN", members: 890 },
    { name: "Kinh Doanh Không Vốn", members: 2100 },
  ],
  td: [
    { name: "Tuyển Dụng IT Hà Nội", members: 2800 },
    { name: "Việc Làm Sài Gòn", members: 3100 },
    { name: "Tuyển Dụng Sales", members: 1560 },
    { name: "HR Vietnam Network", members: 890 },
    { name: "Fresher Jobs Vietnam", members: 2300 },
  ],
  dl: [
    { name: "Du Lịch Việt Nam", members: 5600 },
    { name: "Phượt Thủ Sài Gòn", members: 2340 },
    { name: "Travel Cheap Vietnam", members: 1890 },
    { name: "Review Khách Sạn VN", members: 1200 },
    { name: "Du Lịch Đông Nam Á", members: 980 },
  ],
  gd: [
    { name: "Giáo Dục Mầm Non", members: 1500 },
    { name: "Dạy Tiếng Anh Online", members: 3400 },
    { name: "Gia Sư Hà Nội", members: 890 },
    { name: "Học Lập Trình Free", members: 4200 },
    { name: "Du Học Sinh Việt Nam", members: 2100 },
  ],
  cn: [
    { name: "Lập Trình Viên Việt Nam", members: 6700 },
    { name: "AI & Machine Learning VN", members: 2300 },
    { name: "React / Next.js Vietnam", members: 1890 },
    { name: "DevOps Vietnam", members: 1200 },
    { name: "Startup Tech Vietnam", members: 3400 },
  ],
  at: [
    { name: "Ẩm Thực Sài Gòn", members: 4500 },
    { name: "Nấu Ăn Tại Nhà", members: 2300 },
    { name: "Review Quán Ăn HN", members: 3100 },
    { name: "Đầu Bếp Việt Nam", members: 890 },
    { name: "Bánh Ngọt Handmade", members: 1560 },
  ],
};

export default function IndustryLinksPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);
  const groups = selectedCategory ? sampleGroupsByCategory[selectedCategory] || [] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Link nhóm theo ngành</h1>
        <p className="text-muted-foreground">Thu thập link nhóm theo lĩnh vực</p>
      </div>

      {!selectedCategory ? (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm ngành nghề..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col items-center text-center pt-6 pb-4 space-y-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.count} nhóm
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      Xem
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => setSelectedCategory(null)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {selectedCategoryData && (
                  <selectedCategoryData.icon className="h-5 w-5 text-primary" />
                )}
                {selectedCategoryData?.name}
                <span className="text-sm font-normal text-muted-foreground">
                  ({groups.length} nhóm)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groups.map((group, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{group.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{group.members.toLocaleString()} thành viên</span>
                      </div>
                    </div>
                    <Button size="sm">Tham gia</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
