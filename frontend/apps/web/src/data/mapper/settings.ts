import type {
  DataSettings,
  ExportRecord,
  HelpSettings,
  PrivacySettings,
  StorageUsage,
} from "@/domain/model/settings";
import type {
  DataSettingsDto,
  ExportRecordDto,
  HelpSettingsDto,
  PrivacySettingsDto,
  StorageUsageDto,
} from "@/data/dto/settings";

export function toPrivacySettings(dto: PrivacySettingsDto): PrivacySettings {
  return { ...dto };
}

export function toExportRecord(dto: ExportRecordDto): ExportRecord {
  return {
    id: dto.id,
    requestedAt: new Date(dto.requestedAt),
    target: dto.target,
    format: dto.format,
    status: dto.status,
    downloadUrl: dto.downloadUrl,
  };
}

export function toStorageUsage(dto: StorageUsageDto): StorageUsage {
  return {
    kind: dto.kind,
    usedBytes: dto.usedBytes,
    limitBytes: dto.limitBytes,
  };
}

export function toDataSettings(dto: DataSettingsDto): DataSettings {
  return {
    history: dto.history.map(toExportRecord),
    storage: dto.storage.map(toStorageUsage),
    canRequestExport: dto.canRequestExport,
    nextExportAvailableAt: dto.nextExportAvailableAt
      ? new Date(dto.nextExportAvailableAt)
      : null,
  };
}

export function toHelpSettings(dto: HelpSettingsDto): HelpSettings {
  return {
    faqs: dto.faqs.map((f) => ({ ...f })),
    links: dto.links.map((l) => ({ ...l })),
    responseBusinessDays: dto.responseBusinessDays,
    version: dto.version,
    updatedAt: new Date(dto.updatedAt),
    supportId: dto.supportId,
  };
}
