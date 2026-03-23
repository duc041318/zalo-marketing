"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageComposer } from "@/components/features/message-composer";
import { Phone, CheckCircle2, XCircle, Hash } from "lucide-react";

const samplePhones = `0901234567
0912345678
0923456789
0934567890
0945678901`;

export default function PhoneMsgPage() {
  const [phoneText, setPhoneText] = useState("");

  const phoneStats = useMemo(() => {
    if (!phoneText.trim()) return { total: 0, valid: 0, invalid: 0 };
    const lines = phoneText.split("\n").filter((l) => l.trim());
    const phoneRegex = /^(0|\+84)\d{9,10}$/;
    let valid = 0;
    let invalid = 0;
    lines.forEach((line) => {
      const cleaned = line.trim().replace(/[\s\-\.]/g, "");
      if (phoneRegex.test(cleaned)) {
        valid++;
      } else {
        invalid++;
      }
    });
    return { total: lines.length, valid, invalid };
  }, [phoneText]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nhắn tin SĐT</h1>
        <p className="text-muted-foreground">Gửi tin nhắn theo số điện thoại</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Hash className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{phoneStats.total}</p>
              <p className="text-xs text-muted-foreground">Số SĐT nhập</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{phoneStats.valid}</p>
              <p className="text-xs text-muted-foreground">Hợp lệ</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{phoneStats.invalid}</p>
              <p className="text-xs text-muted-foreground">Không hợp lệ</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Phone input */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Nhập số điện thoại</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPhoneText(samplePhones)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Dữ liệu mẫu
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Danh sách số điện thoại (mỗi số một dòng)</Label>
                <Textarea
                  placeholder={"0901234567\n0912345678\n0923456789"}
                  className="min-h-[200px] font-mono text-sm"
                  value={phoneText}
                  onChange={(e) => setPhoneText(e.target.value)}
                />
              </div>
              {phoneStats.total > 0 && (
                <div className="flex gap-2">
                  <Badge variant="default">{phoneStats.valid} hợp lệ</Badge>
                  {phoneStats.invalid > 0 && (
                    <Badge variant="destructive">{phoneStats.invalid} không hợp lệ</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Mỗi số điện thoại trên một dòng</li>
                  <li>Số điện thoại bắt đầu bằng 0 hoặc +84</li>
                  <li>Chỉ gửi được đến số đã đăng ký Zalo</li>
                  <li>Hệ thống sẽ tự động loại bỏ số trùng lặp</li>
                  <li>Tối đa 1,000 số mỗi lần gửi</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message composer */}
        <MessageComposer />
      </div>
    </div>
  );
}
