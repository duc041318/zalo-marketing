"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus, Search, RefreshCw, Users, MapPin, Briefcase } from "lucide-react"

interface Recommendation {
  id: number
  name: string
  subtitle: string
  source: "Bạn chung" | "Cùng nhóm" | "Gần đây" | "Danh bạ"
}

const recommendations: Recommendation[] = [
  { id: 1, name: "Nguyễn Hoàng Anh", subtitle: "5 bạn chung", source: "Bạn chung" },
  { id: 2, name: "Trần Minh Tú", subtitle: "Hà Nội", source: "Gần đây" },
  { id: 3, name: "Lê Thị Phương", subtitle: "3 bạn chung", source: "Bạn chung" },
  { id: 4, name: "Phạm Đức Huy", subtitle: "Nhóm Marketing", source: "Cùng nhóm" },
  { id: 5, name: "Vũ Thị Hồng", subtitle: "8 bạn chung", source: "Bạn chung" },
  { id: 6, name: "Đặng Văn Long", subtitle: "Danh bạ điện thoại", source: "Danh bạ" },
  { id: 7, name: "Hoàng Thu Trang", subtitle: "Nhóm Dev", source: "Cùng nhóm" },
  { id: 8, name: "Ngô Quốc Việt", subtitle: "TP.HCM", source: "Gần đây" },
]

const sourceBadgeClasses: Record<Recommendation["source"], string> = {
  "Bạn chung": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  "Cùng nhóm": "bg-green-100 text-green-700 hover:bg-green-100",
  "Gần đây": "bg-purple-100 text-purple-700 hover:bg-purple-100",
  "Danh bạ": "bg-orange-100 text-orange-700 hover:bg-orange-100",
}

const sourceIcons: Record<Recommendation["source"], React.ReactNode> = {
  "Bạn chung": <Users className="h-3 w-3 mr-1" />,
  "Cùng nhóm": <Briefcase className="h-3 w-3 mr-1" />,
  "Gần đây": <MapPin className="h-3 w-3 mr-1" />,
  "Danh bạ": <Users className="h-3 w-3 mr-1" />,
}

function getInitials(name: string) {
  const parts = name.split(" ")
  if (parts.length >= 2) {
    return parts[parts.length - 2][0] + parts[parts.length - 1][0]
  }
  return name.slice(0, 2)
}

export default function RecommendationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set())

  const filteredRecommendations = recommendations.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendRequest = (id: number) => {
    setSentRequests((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gợi ý kết bạn</h1>
        <p className="text-muted-foreground">Danh sách gợi ý kết bạn từ Zalo</p>
      </div>

      {/* Actions Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Select>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Chọn tài khoản Zalo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="account-1">Zalo - Nguyễn Văn A</SelectItem>
            <SelectItem value="account-2">Zalo - Trần Văn B</SelectItem>
            <SelectItem value="account-3">Zalo - Lê Thị C</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới gợi ý
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm gợi ý..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            Tổng gợi ý: <span className="font-semibold text-foreground">86</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserPlus className="h-4 w-4" />
          <span>
            Đã gửi lời mời: <span className="font-semibold text-foreground">12</span>
          </span>
        </div>
      </div>

      {/* Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecommendations.map((rec) => {
          const isSent = sentRequests.has(rec.id)
          return (
            <Card key={rec.id}>
              <CardContent className="flex flex-col items-center text-center py-6 px-4 space-y-3">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(rec.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h3 className="font-semibold text-base">{rec.name}</h3>
                  <p className="text-sm text-muted-foreground">{rec.subtitle}</p>
                </div>

                <Badge
                  variant="secondary"
                  className={sourceBadgeClasses[rec.source]}
                >
                  {sourceIcons[rec.source]}
                  {rec.source}
                </Badge>

                {isSent ? (
                  <Button variant="outline" disabled>
                    Đã gửi
                  </Button>
                ) : (
                  <Button onClick={() => handleSendRequest(rec.id)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Kết bạn
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Không tìm thấy gợi ý nào phù hợp.
        </div>
      )}
    </div>
  )
}
