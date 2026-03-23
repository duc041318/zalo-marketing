"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download } from "lucide-react";

const sampleResults = [
  { id: 1, link: "https://zalo.me/g/abc123", name: "Nhóm Kinh Doanh HN", members: 245, active: true },
  { id: 2, link: "https://zalo.me/g/def456", name: "Nhóm Marketing Online", members: 189, active: true },
  { id: 3, link: "https://zalo.me/g/ghi789", name: "Nhóm Tuyển Dụng IT", members: 0, active: false },
  { id: 4, link: "https://zalo.me/g/jkl012", name: "Nhóm Dev Frontend", members: 312, active: true },
  { id: 5, link: "https://zalo.me/g/mno345", name: "Nhóm Freelancer VN", members: 0, active: false },
];

export default function CheckLinkPage() {
  const [links, setLinks] = useState("");
  const [checked, setChecked] = useState(false);

  const activeCount = sampleResults.filter((r) => r.active).length;
  const expiredCount = sampleResults.filter((r) => !r.active).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kiểm tra link nhóm</h1>
        <p className="text-muted-foreground">Kiểm tra link nhóm còn hoạt động không</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nhập link cần kiểm tra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Danh sách link</Label>
            <Textarea
              placeholder="Dán link nhóm, mỗi link một dòng"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              rows={5}
            />
          </div>

          <Button onClick={() => setChecked(true)}>
            <Search className="mr-2 h-4 w-4" />
            Kiểm tra
          </Button>
        </CardContent>
      </Card>

      {checked && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{sampleResults.length}</div>
                <p className="text-sm text-muted-foreground">Tổng link</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                <p className="text-sm text-muted-foreground">Hoạt động</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
                <p className="text-sm text-muted-foreground">Hết hạn</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Kết quả kiểm tra</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Xuất kết quả
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Link</TableHead>
                    <TableHead>Tên nhóm</TableHead>
                    <TableHead>Số TV</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {result.link}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{result.name}</TableCell>
                      <TableCell className="text-sm">
                        {result.active ? result.members : "—"}
                      </TableCell>
                      <TableCell>
                        {result.active ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            Hết hạn
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
