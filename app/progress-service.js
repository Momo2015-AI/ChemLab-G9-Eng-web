export const STORAGE_KEY = 'chemlab_v16';
const CORRUPT_BACKUP_KEY = `${STORAGE_KEY}_corrupt`;

export class ProgressService {
  constructor({ storage = globalThis.localStorage, key = STORAGE_KEY } = {}) {
    this.storage = storage;
    this.key = key;
  }

  load() {
    let raw = null;
    try {
      raw = this.storage?.getItem(this.key) ?? null;
    } catch {
      return {};
    }
    if (raw === null || raw === '') return {};
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      // Keep the unreadable payload aside so a truncated write never wipes
      // student progress silently — it can be inspected or restored manually.
      try { this.storage?.setItem(CORRUPT_BACKUP_KEY, raw); } catch { /* ignore */ }
      console.warn(`[chemlab] 学习进度数据已损坏，已备份到 ${CORRUPT_BACKUP_KEY} 并重置。`);
      return {};
    }
  }

  save(progress) {
    try {
      this.storage?.setItem(this.key, JSON.stringify(progress));
      return true;
    } catch (error) {
      // Quota exceeded / private-mode failures must never break answering.
      console.warn('[chemlab] 学习进度保存失败，本次改动不会持久化。', error?.name || error);
      return false;
    }
  }
}
