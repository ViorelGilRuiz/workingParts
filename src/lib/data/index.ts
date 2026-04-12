import { WorkingPartsRepository } from "@/lib/data/repository";
import { createLocalBrowserRepository } from "@/lib/data/local-browser-repository";
import { createSupabaseBrowserRepository } from "@/lib/data/supabase-browser-repository";
import { isSupabaseConfigured } from "@/lib/env";

export function createWorkingPartsRepository(): WorkingPartsRepository {
  if (isSupabaseConfigured()) {
    return createSupabaseBrowserRepository();
  }

  return createLocalBrowserRepository();
}
