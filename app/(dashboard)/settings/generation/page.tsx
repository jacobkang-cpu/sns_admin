import { GenerationSettingsForm } from "@/components/forms/generation-settings-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGenerationSettings } from "@/lib/repositories/content-repository";

export default async function GenerationSettingsPage() {
  const settings = await getGenerationSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Generation Control"
        title="콘텐츠 생성 설정"
        description="주간 생성 횟수, 기본 타깃, 채널, 가드레일을 관리해 자동 생성 초안의 일관성을 유지합니다."
      />

      <Card>
        <CardHeader>
          <CardTitle>생성 정책</CardTitle>
        </CardHeader>
        <CardContent>
          <GenerationSettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}

