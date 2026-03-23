"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

export default function FindByPhonePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tìm Zalo theo SĐT</h1>
        <p className="text-muted-foreground">Tìm kiếm tài khoản Zalo bằng số điện thoại</p>
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
