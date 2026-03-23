"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageComposer } from "@/components/features/message-composer";
import { Tag, Users, Check } from "lucide-react";

const sampleLabels = [
  { id: "1", name: "Khách hàng", count: 150, color: "bg-blue-500" },
  { id: "2", name: "Đối tác", count: 85, color: "bg-green-500" },
  { id: "3", name: "Tiềm năng", count: 230, color: "bg-yellow-500" },
  { id: "4", name: "VIP", count: 42, color: "bg-purple-500" },
  { id: "5", name: "Mới", count: 67, color: "bg-cyan-500" },
  { id: "6", name: "Đã mua", count: 198, color: "bg-orange-500" },
];

export default function LabelMsgPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleLabel = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const totalSelected = useMemo(() => {
    return sampleLabels
      .filter((l) => selectedIds.includes(l.id))
      .reduce((sum, l) => sum + l.count, 0);
  }, [selectedIds]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nhắn tin theo nhãn</h1>
        <p className="text-muted-foreground">Gửi tin nhắn theo nhãn đã gắn</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Tag className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{selectedIds.length}</p>
              <p className="text-xs text-muted-foreground">Nhãn đã chọn</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{totalSelected}</p>
              <p className="text-xs text-muted-foreground">Tổng người nhận</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Label grid */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Chọn nhãn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {sampleLabels.map((label) => {
                const isSelected = selectedIds.includes(label.id);
                return (
                  <div
                    key={label.id}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-transparent bg-muted/50 hover:border-muted-foreground/20"
                    }`}
                    onClick={() => toggleLabel(label.id)}
                  >
                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${label.color}`} />
                      <div>
                        <p className="text-sm font-medium">{label.name}</p>
                        <p className="text-xs text-muted-foreground">{label.count} người</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedIds.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {sampleLabels
                  .filter((l) => selectedIds.includes(l.id))
                  .map((label) => (
                    <Badge
                      key={label.id}
                      variant="default"
                      className="cursor-pointer"
                      onClick={() => toggleLabel(label.id)}
                    >
                      {label.name} ({label.count})
                    </Badge>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message composer */}
        <MessageComposer />
      </div>
    </div>
  );
}
