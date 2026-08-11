import { useRepositories } from "@/presentation/di/repositories";

export function usePrivacySettings() {
  const { data, isLoading, error, retry } =
    useRepositories().settings.usePrivacy();
  return { privacy: data, isLoading, error, retry };
}

export function useDataSettings() {
  const { data, isLoading, error, retry } =
    useRepositories().settings.useData();
  return { data, isLoading, error, retry };
}

export function useHelpSettings() {
  const { data, isLoading, error, retry } =
    useRepositories().settings.useHelp();
  return { help: data, isLoading, error, retry };
}
