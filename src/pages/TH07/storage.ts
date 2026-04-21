import type { IBaiViet, ITheTag } from './constant';
import { MOCK_BAI_VIET, MOCK_TAGS, STORAGE_KEYS } from './constant';

const coWindow = (): boolean => typeof window !== 'undefined';

const docDanhSach = <T>(key: string, fallback: T[]): T[] => {
  if (!coWindow()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
};

export const loadPosts = (): IBaiViet[] => docDanhSach<IBaiViet>(STORAGE_KEYS.baiViet, MOCK_BAI_VIET);

export const savePosts = (posts: IBaiViet[]): void => {
  if (!coWindow()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.baiViet, JSON.stringify(posts));
};

export const loadTags = (): ITheTag[] => docDanhSach<ITheTag>(STORAGE_KEYS.the, MOCK_TAGS);

export const saveTags = (tags: ITheTag[]): void => {
  if (!coWindow()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.the, JSON.stringify(tags));
};
