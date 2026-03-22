"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function SubmitButton({
  children,
  pendingLabel = "저장 중...",
  type = "submit",
  ...props
}: React.ComponentProps<typeof Button> & {
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type={type} disabled={pending || props.disabled}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? pendingLabel : children}
    </Button>
  );
}
