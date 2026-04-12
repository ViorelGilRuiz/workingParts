import { WorkingPartsRepository } from "@/lib/data/repository";
import { createLocalBrowserRepository } from "@/lib/data/local-browser-repository";

export function createWorkingPartsRepository(): WorkingPartsRepository {
  return createLocalBrowserRepository();
}
