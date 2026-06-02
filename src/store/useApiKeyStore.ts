import { create } from 'zustand';
import type { ApiKey } from '@/types/global';

interface ApiKeyStore {
  apiKeys: ApiKey[];
  setApiKeys: (keys: ApiKey[]) => void;
  getFirstKey: () => string | null;
}

export const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
  apiKeys: [],
  setApiKeys: (keys) => {
    if (JSON.stringify(get().apiKeys) !== JSON.stringify(keys)) {
      set({ apiKeys: keys });
    }
  },
  getFirstKey: () => {
    const keys = get().apiKeys;
    return keys.length > 0 ? keys[0].key : null;
  },
}));
