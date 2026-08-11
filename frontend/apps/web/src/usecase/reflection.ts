import { useRepositories } from "@/presentation/di/repositories";

export function useReflectionEntries() {
  const { data, isLoading, error, retry } =
    useRepositories().reflection.useEntries();
  return { entries: data, isLoading, error, retry };
}
