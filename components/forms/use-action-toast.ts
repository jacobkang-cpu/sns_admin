"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import type { ActionState } from "@/types/domain";

export function useActionToast(state: ActionState) {
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    const currentKey = `${state.status}:${state.message}`;

    if (lastKey.current === currentKey) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);
    }

    if (state.status === "error") {
      toast.error(state.message);
    }

    lastKey.current = currentKey;
  }, [state.message, state.status]);
}

