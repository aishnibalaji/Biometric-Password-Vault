//  data storage
export class StorageManager {
  constructor() {
    this.storageKey = 'passwordVaultData';
  }

  // Save encrypted passwords
  savePasswords(passwords) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(passwords));
      return true;
    } catch (error) {
      console.error('Failed to save passwords:', error);
      return false;
    }
  }

  // Load encrypted passwords
  loadPasswords() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load passwords:', error);
      return [];
    }
  }

  // clear data
  clearData() {
    localStorage.removeItem(this.storageKey);
  }
}