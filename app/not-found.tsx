import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>페이지를 찾을 수 없습니다.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            요청한 리소스가 없거나 이동되었습니다.
          </p>
          <Link href="/dashboard" className={buttonVariants()}>
            대시보드로 이동
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
