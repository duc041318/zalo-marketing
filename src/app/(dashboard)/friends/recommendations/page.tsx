"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const sampleRecommendations = [
  { id: 1, name: "Xe Du Lịch Việt Chung", avatar: "X" },
  { id: 2, name: "Tâm Dv Bãi Xe Sân Bay", avatar: "T" },
  { id: 3, name: "Hạnh Bông Bi", avatar: "H" },
  { id: 4, name: "Vui Transport Travel", avatar: "V" },
  { id: 5, name: "Dương Fotuner", avatar: "D" },
  { id: 6, name: "Tuyên Hà Travel", avatar: "T" },
  { id: 7, name: "Minh Khang Auto", avatar: "M" },
  { id: 8, name: "Thanh Hải Logistics", avatar: "T" },
  { id: 9, name: "Phạm Văn An", avatar: "P" },
];

export default function FriendRecommendationsPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [accepted, setAccepted] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);

  const visibleRecommendations = sampleRecommendations.filter(
    (r) => !accepted.includes(r.id) && !rejected.includes(r.id)
  );

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === visibleRecommendations.length) {
      setSelected([]);
    } else {
      setSelected(visibleRecommendations.map((r) => r.id));
    }
  };

  const acceptSelected = () => {
    setAccepted((prev) => [...prev, ...selected]);
    setSelected([]);
  };

  const rejectSelected = () => {
    setRejected((prev) => [...prev, ...selected]);
    setSelected([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/friends/manage">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Gợi ý Kết Bạn</h1>
          <p className="text-muted-foreground">
            Những người bạn có thể biết
          </p>
        </div>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={
                selected.length === visibleRecommendations.length &&
                visibleRecommendations.length > 0
              }
              onCheckedChange={selectAll}
            />
            <span className="text-sm text-muted-foreground">
              Chọn tất cả ({selected.length}/{visibleRecommendations.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={acceptSelected}
              disabled={selected.length === 0}
              className="bg-primary"
            >
              <Check className="mr-1 h-4 w-4" />
              Đồng ý ({selected.length})
            </Button>
            <Button
              variant="destructive"
              onClick={rejectSelected}
              disabled={selected.length === 0}
            >
              <X className="mr-1 h-4 w-4" />
              Hủy ({selected.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid of recommendations */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleRecommendations.map((person) => (
          <Card
            key={person.id}
            className={`relative transition-all ${
              selected.includes(person.id)
                ? "ring-2 ring-primary"
                : "hover:shadow-md"
            }`}
          >
            <CardContent className="flex flex-col items-center gap-3 py-6">
              {/* Checkbox */}
              <div className="absolute top-3 left-3">
                <Checkbox
                  checked={selected.includes(person.id)}
                  onCheckedChange={() => toggleSelect(person.id)}
                />
              </div>

              {/* Avatar */}
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {person.avatar}
                </AvatarFallback>
              </Avatar>

              {/* Name */}
              <h3 className="font-medium text-center">{person.name}</h3>

              {/* Actions */}
              <div className="flex w-full gap-2">
                <Button
                  className="flex-1"
                  size="sm"
                  onClick={() => setAccepted((prev) => [...prev, person.id])}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Đồng ý
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  size="sm"
                  onClick={() => setRejected((prev) => [...prev, person.id])}
                >
                  <X className="mr-1 h-4 w-4" />
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {visibleRecommendations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Không còn gợi ý kết bạn nào.
        </div>
      )}
    </div>
  );
}
