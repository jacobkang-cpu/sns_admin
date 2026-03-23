import { AiDraftGeneratorForm } from "@/components/forms/ai-draft-generator-form";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listContents } from "@/lib/repositories/content-repository";
import { formatDate } from "@/lib/utils";

type SearchParams = Promise<{
  query?: string;
  status?: string;
  formatType?: string;
}>;

export default async function ContentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const contents = await listContents({
    query: params.query,
    status: (params.status as any) ?? "all",
    formatType: (params.formatType as any) ?? "all",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content Inventory"
        title="콘텐츠 리스트"
        description="테이블과 필터로 초안 상태, 포맷, 타깃별 운영 현황을 빠르게 탐색합니다."
        action={<AiDraftGeneratorForm />}
      />

      <Card>
        <CardContent className="p-4">
          <form className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_auto]">
            <Input
              name="query"
              placeholder="제목, 타깃, 핵심 메시지 검색"
              defaultValue={params.query}
            />
            <Select name="status" defaultValue={params.status ?? "all"}>
              <option value="all">All Status</option>
              <option value="draft">draft</option>
              <option value="approved">approved</option>
              <option value="hold">hold</option>
              <option value="needs_revision">needs_revision</option>
              <option value="posted">posted</option>
              <option value="archived">archived</option>
            </Select>
            <Select name="formatType" defaultValue={params.formatType ?? "all"}>
              <option value="all">All Format</option>
              <option value="carousel">carousel</option>
              <option value="single_image">single_image</option>
              <option value="short_video">short_video</option>
              <option value="article">article</option>
              <option value="infographic">infographic</option>
            </Select>
            <Button type="submit">필터 적용</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {contents.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="space-y-2">
                        <p className="font-medium">{content.title}</p>
                        <div className="flex flex-wrap gap-2">
                          {content.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} className="bg-muted text-muted-foreground">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{content.targetAudience}</TableCell>
                    <TableCell>{content.formatType}</TableCell>
                    <TableCell>
                      <StatusBadge status={content.status} />
                    </TableCell>
                    <TableCell>{formatDate(content.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/contents/${content.id}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        상세
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-6">
              <EmptyState
                title="조건에 맞는 콘텐츠가 없습니다"
                description="필터를 조정하거나 검색어를 초기화해 보세요."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
