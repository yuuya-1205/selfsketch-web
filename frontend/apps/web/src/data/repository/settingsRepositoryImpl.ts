import type { SettingsRepository } from "@/domain/repository/settingsRepository";
import { settingsDataSource } from "@/data/datasource/settingsDataSource";
import { toDomainError } from "@/data/mapper/error";
import {
  toDataSettings,
  toHelpSettings,
  toPrivacySettings,
} from "@/data/mapper/settings";

export const settingsRepository: SettingsRepository = {
  usePrivacy() {
    const { data, isLoading, error, refetch } =
      settingsDataSource.usePrivacySettingsQuery();
    return {
      data: data && toPrivacySettings(data),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },

  useData() {
    const { data, isLoading, error, refetch } =
      settingsDataSource.useDataSettingsQuery();
    return {
      data: data && toDataSettings(data),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },

  useHelp() {
    const { data, isLoading, error, refetch } =
      settingsDataSource.useHelpSettingsQuery();
    return {
      data: data && toHelpSettings(data),
      isLoading,
      error: toDomainError(error),
      retry: refetch,
    };
  },
};
