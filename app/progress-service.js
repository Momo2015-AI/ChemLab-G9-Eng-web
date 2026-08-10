const STORAGE_KEY = 'chemlab_v16';

export class ProgressService {
  constructor({ storage = globalThis.localStorage, key = STORAGE_KEY } = {}) {
    this.storage = storage;
    this.key = key;
  }

  load() {
    try {
      return JSON.parse(this.storage?.getItem(this.key) || '{}');
    } catch {
      return {};
    }
  }

  save(progress) {
    this.storage?.setItem(this.key, JSON.stringify(progress));
  }
}
