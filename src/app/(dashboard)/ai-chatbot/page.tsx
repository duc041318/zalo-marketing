"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MessageSquare, Zap, Clock, Plus, Pencil, Trash2, Bot, BarChart3 } from "lucide-react";

const initialScenarios = [
  { id: 1, keyword: "giá", response: "Dạ, anh/chị vui lòng cho em biết sản phẩm anh/chị quan tâm để em báo giá chính xác nhất ạ!" },
  { id: 2, keyword: "tư vấn", response: "Em xin gửi anh/chị thông tin chi tiết về dịch vụ. Anh/chị vui lòng để lại SĐT để em liên hệ tư vấn trực tiếp ạ." },
  { id: 3, keyword: "ship", response: "Phí ship nội thành: 20,000đ, ngoại thành: 30,000đ. Đơn trên 500,000đ được miễn phí ship ạ!" },
  { id: 4, keyword: "bảo hành", response: "Sản phẩm được bảo hành chính hãng 12 tháng. Anh/chị giữ hóa đơn để được hỗ trợ bảo hành nhanh nhất ạ." },
  { id: 5, keyword: "khuyến mãi", response: "Hiện tại bên em đang có chương trình giảm 20% cho khách hàng mới và tặng kèm voucher 100,000đ cho đơn tiếp theo ạ!" },
];

const topKeywords = [
  { keyword: "giá", count: 45 },
  { keyword: "tư vấn", count: 38 },
  { keyword: "ship", count: 32 },
  { keyword: "khuyến mãi", count: 28 },
  { keyword: "bảo hành", count: 21 },
];

export default function AIChatbotPage() {
  const [chatbotEnabled, setChatbotEnabled] = useState(true);
  const [afterHoursEnabled, setAfterHoursEnabled] = useState(true);
  const [autoGreetEnabled, setAutoGreetEnabled] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState(
    "Xin chào! Cảm ơn bạn đã liên hệ. Em có thể hỗ trợ gì cho anh/chị ạ?"
  );
  const [responseDelay, setResponseDelay] = useState("2");
  const [scenarios] = useState(initialScenarios);

  const maxCount = Math.max(...topKeywords.map((k) => k.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Chatbot</h1>
        <p className="text-muted-foreground">
          Cấu hình chatbot tự động trả lời
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tin nhắn xử lý hôm nay</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tỷ lệ phản hồi</p>
              <p className="text-2xl font-bold">94%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thời gian TB</p>
              <p className="text-2xl font-bold">2s</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config">Cấu hình</TabsTrigger>
          <TabsTrigger value="scenarios">Kịch bản</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>

        {/* Tab: Cấu hình */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Cài đặt chatbot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Toggle: Bật chatbot */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bật chatbot</p>
                  <p className="text-sm text-muted-foreground">
                    Tự động trả lời tin nhắn đến
                  </p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full cursor-pointer transition-colors flex items-center px-1 ${
                    chatbotEnabled ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"
                  }`}
                  onClick={() => setChatbotEnabled(!chatbotEnabled)}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>

              {/* Toggle: Trả lời ngoài giờ */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Trả lời ngoài giờ</p>
                  <p className="text-sm text-muted-foreground">
                    Chatbot hoạt động ngoài giờ làm việc (18h-8h)
                  </p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full cursor-pointer transition-colors flex items-center px-1 ${
                    afterHoursEnabled ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"
                  }`}
                  onClick={() => setAfterHoursEnabled(!afterHoursEnabled)}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>

              {/* Toggle: Gửi lời chào tự động */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Gửi lời chào tự động</p>
                  <p className="text-sm text-muted-foreground">
                    Gửi tin nhắn chào khi có người liên hệ lần đầu
                  </p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full cursor-pointer transition-colors flex items-center px-1 ${
                    autoGreetEnabled ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"
                  }`}
                  onClick={() => setAutoGreetEnabled(!autoGreetEnabled)}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="greeting">Tin nhắn chào mừng</Label>
                <Input
                  id="greeting"
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delay">Độ trễ phản hồi (giây)</Label>
                <Input
                  id="delay"
                  type="number"
                  value={responseDelay}
                  onChange={(e) => setResponseDelay(e.target.value)}
                  className="w-32"
                />
              </div>

              <Button>Lưu cấu hình</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Kịch bản */}
        <TabsContent value="scenarios" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Danh sách kịch bản</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm kịch bản
            </Button>
          </div>
          <div className="space-y-3">
            {scenarios.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Từ khóa:</span>
                        <Badge variant="secondary" className="font-mono">
                          {s.keyword}
                        </Badge>
                      </div>
                      <p className="text-sm">{s.response}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Thống kê */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Hôm nay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">156</p>
                <p className="text-xs text-green-600">+12% so với hôm qua</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tuần này
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,024</p>
                <p className="text-xs text-green-600">+8% so với tuần trước</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tháng này
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">4,280</p>
                <p className="text-xs text-green-600">+15% so với tháng trước</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top 5 từ khóa được hỏi nhiều nhất
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topKeywords.map((item) => (
                <div key={item.keyword} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.keyword}</span>
                    <span className="text-muted-foreground">{item.count} lần</span>
                  </div>
                  <div className="h-6 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {Math.round((item.count / maxCount) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
