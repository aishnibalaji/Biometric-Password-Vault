/* eslint-disable no-undef */
export class BiometricAuth {
  async isSupported() {
    if (!window.PublicKeyCredential) {
      return false;
    }
    
    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }

  async authenticate() {
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: window.crypto.getRandomValues(new Uint8Array(32)),
          rp: {
            name: "Password Vault",
            id: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
          },
          user: {
            id: window.crypto.getRandomValues(new Uint8Array(64)),
            name: "user@vault.app",
            displayName: "Vault User",
          },
          pubKeyCredParams: [{alg: -7, type: "public-key"}],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
        }
      });

      return credential !== null;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  }
}