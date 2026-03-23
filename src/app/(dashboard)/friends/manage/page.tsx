"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

export default function FriendsManagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản lý bạn bè</h1>
        <p className="text-muted-foreground">Danh sách, tìm kiếm, lọc và gắn nhãn bạn bè</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Construction className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Đang phát triển</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tính năng này sẽ sớm được cập nhật
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
