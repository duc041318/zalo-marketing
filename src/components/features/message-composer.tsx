"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Image,
  Paperclip,
  Link2,
  Clock,
  Send,
  Loader2,
  Save,
  Smile,
} from "lucide-react";
import { useState } from "react";

interface MessageComposerProps {
  showSchedule?: boolean;
  showTemplate?: boolean;
  onSend?: (data: { content: string; scheduled: boolean; scheduleTime: string }) => void;
}

const templates = [
  { id: "1", name: "Chào hỏi", content: "Xin chào {name}! Mình là {sender}, rất vui được kết nối với bạn." },
  { id: "2", name: "Giới thiệu sản phẩm", content: "Chào {name}, mình muốn giới thiệu đến bạn sản phẩm mới nhất của chúng tôi..." },
  { id: "3", name: "Khuyến mãi", content: "Hi {name}! Chương trình khuyến mãi đặc biệt dành riêng cho bạn: Giảm 30% tất cả sản phẩm." },
  { id: "4", name: "Nhắc nhở", content: "Xin chào {name}, đây là lời nhắc về cuộc hẹn/đơn hàng của bạn..." },
];

export function MessageComposer({
  showSchedule = true,
  showTemplate = true,
  onSend,
}: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleTemplateSelect = (templateId: string | null) => {
    if (!templateId) return;
    setSelectedTemplate(templateId);
    const tpl = templates.find((t) => t.id === templateId);
    if (tpl) setContent(tpl.content);
  };

  const handleSend = async () => {
    if (!content.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    onSend?.({ content, scheduled, scheduleTime });
    setContent("");
  };

  const variables = ["{name}", "{sender}", "{phone}", "{date}"];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Soạn tin nhắn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template selector */}
        {showTemplate && (
          <div className="space-y-2">
            <Label>Mẫu tin nhắn</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn mẫu tin nhắn..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((tpl) => (
                  <SelectItem key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Message content */}
        <div className="space-y-2">
          <Label>Nội dung</Label>
          <Textarea
            placeholder="Nhập nội dung tin nhắn..."
            className="min-h-[120px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {variables.map((v) => (
                <Badge
                  key={v}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/10 text-xs"
                  onClick={() => setContent((prev) => prev + " " + v)}
                >
                  {v}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {content.length} ký tự
            </span>
          </div>
        </div>

        {/* Attachments */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" type="button">
            <Image className="mr-1 h-4 w-4" />
            Ảnh
          </Button>
          <Button variant="outline" size="sm" type="button">
            <Paperclip className="mr-1 h-4 w-4" />
            File
          </Button>
          <Button variant="outline" size="sm" type="button">
            <Link2 className="mr-1 h-4 w-4" />
            Link
          </Button>
          <Button variant="outline" size="sm" type="button">
            <Smile className="mr-1 h-4 w-4" />
            Emoji
          </Button>
        </div>

        {/* Schedule */}
        {showSchedule && (
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Hẹn giờ gửi</p>
                <p className="text-xs text-muted-foreground">
                  Đặt lịch gửi tin nhắn tự động
                </p>
              </div>
            </div>
            <Switch checked={scheduled} onCheckedChange={setScheduled} />
          </div>
        )}

        {scheduled && (
          <div className="space-y-2">
            <Label>Thời gian gửi</Label>
            <Input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleSend} disabled={!content.trim() || sending} className="flex-1">
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {scheduled ? "Đặt lịch gửi" : "Gửi ngay"}
              </>
            )}
          </Button>
          <Button variant="outline" type="button">
            <Save className="mr-2 h-4 w-4" />
            Lưu mẫu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
