import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint } from 'lucide-react';
import { BiometricAuth } from '../../utils/biometric';

const Login = ({ onLogin }) => {
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const biometricAuth = new BiometricAuth();

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const supported = await biometricAuth.isSupported();
    setBiometricSupported(supported);
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    
    const success = await biometricAuth.authenticate();
    
    if (success) {
      onLogin();
    } else {
      alert('Authentication failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Password Vault</h1>
          <p className="text-gray-600">Secure your passwords with biometric authentication</p>
        </div>
        
        <button
          onClick={handleBiometricLogin}
          disabled={!biometricSupported || isLoading}
          className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all ${
            biometricSupported && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Fingerprint className="h-6 w-6" />
          {isLoading ? 'Authenticating...' : 
           biometricSupported ? 'Authenticate with Biometrics' : 'Biometrics Not Supported'}
        </button>
        
        {!biometricSupported && (
          <p className="text-sm text-gray-500 text-center mt-4">
            Your device doesn't support biometric authentication. Please use a compatible device.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;