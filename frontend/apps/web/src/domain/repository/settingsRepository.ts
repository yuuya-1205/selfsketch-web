import type {
  DataSettings,
  HelpSettings,
  PrivacySettings,
} from "@/domain/model/settings";
import type { RepositoryResult } from "./result";

export interface SettingsRepository {
  usePrivacy(): RepositoryResult<PrivacySettings>;
  useData(): RepositoryResult<DataSettings>;
  useHelp(): RepositoryResult<HelpSettings>;
}
