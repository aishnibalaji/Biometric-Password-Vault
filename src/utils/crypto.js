// encryption/decryption 

// AES GCM encryption algorithm 
export class CryptoManager {
  constructor() {
    this.algorithm = {
      name: "AES-GCM",
      length: 256,
    };
  }

  // encryption key (symmetric)
  async generateKey() {
    return await window.crypto.subtle.generateKey(
      this.algorithm,
      true, // extractable
      ["encrypt", "decrypt"]
    );
  }

  // encrypt text data
  async encrypt(data, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);
    
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encoded
    );

    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    };
  }

  // decrypt text data
  async decrypt(encryptedData, key) {
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(encryptedData.iv),
        },
        key,
        new Uint8Array(encryptedData.data)
      );

      return new TextDecoder().decode(decrypted);

      //error handling 
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
}