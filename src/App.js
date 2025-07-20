import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import PasswordForm from './components/PasswordForm/PasswordForm';
import { CryptoManager } from './utils/crypto';
import { StorageManager } from './utils/storage';
import { Shield, Plus, Lock } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [masterKey, setMasterKey] = useState(null);
  const [editingPassword, setEditingPassword] = useState(null);

  const cryptoManager = new CryptoManager();
  const storageManager = new StorageManager();

  useEffect(() => {
    if (isAuthenticated) {
      loadPasswords();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    // master key 
    const key = await cryptoManager.generateKey();
    setMasterKey(key);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMasterKey(null);
    setPasswords([]);
    setShowForm(false);
    setEditingPassword(null);
  };

  const loadPasswords = () => {
    const storedPasswords = storageManager.loadPasswords();
    setPasswords(storedPasswords);
  };

  const handleSavePassword = async (formData) => {
    if (!masterKey) return;

    try {
      // Encrypt password and notes
      const encryptedPassword = await cryptoManager.encrypt(formData.password, masterKey);
      const encryptedNotes = formData.notes ? 
        await cryptoManager.encrypt(formData.notes, masterKey) : null;

      const passwordEntry = {
        id: editingPassword?.id || Date.now(),
        website: formData.website,
        username: formData.username,
        password: encryptedPassword,
        notes: encryptedNotes,
        createdAt: new Date().toISOString()
      };


      let updatedPasswords;
      if (editingPassword) {
        // Update existing password
        updatedPasswords = passwords.map(p => 
          p.id === editingPassword.id ? passwordEntry : p
        );
      } else {
        // new password
        updatedPasswords = [...passwords, passwordEntry];
      }

      // Save to storage
      storageManager.savePasswords(updatedPasswords);
      setPasswords(updatedPasswords);
      
      // Reset form
      setShowForm(false);
      setEditingPassword(null);
      
    } catch (error) {
      console.error('Failed to save password:', error);
      alert('Failed to save password. Please try again.');
    }
  };

  const handleEditPassword = async (passwordEntry) => {
    if (!masterKey) return;

    try {
      // Decrypt password and notes for editing
      const decryptedPassword = await cryptoManager.decrypt(passwordEntry.password, masterKey);
      const decryptedNotes = passwordEntry.notes ? 
        await cryptoManager.decrypt(passwordEntry.notes, masterKey) : '';

      setEditingPassword({
        ...passwordEntry,
        password: decryptedPassword,
        notes: decryptedNotes
      });
      setShowForm(true);
    } catch (error) {
      console.error('Failed to decrypt password:', error);
      alert('Failed to load password for editing.');
    }
  };

  // password deletion
  const handleDeletePassword = (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      const updatedPasswords = passwords.filter(p => p.id !== id);
      storageManager.savePasswords(updatedPasswords);
      setPasswords(updatedPasswords);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // full form 
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Password Vault</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Lock className="h-4 w-4" />
                Lock
              </button>
            </div>
          </div>
        </header>

        {/* Password Form */}
        {showForm && (
          <PasswordForm
            onSave={handleSavePassword}
            onCancel={() => {
              setShowForm(false);
              setEditingPassword(null);
            }}
            editData={editingPassword}
          />
        )}

        {/* Password List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              Stored Passwords ({passwords.length})
            </h2>
          </div>
          
          {passwords.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Lock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No passwords stored yet. Add your first password to get started.</p>
            </div>
          ) : (
            <div className="divide-y">
              {passwords.map((password) => (
                <PasswordItem
                  key={password.id}
                  password={password}
                  onEdit={() => handleEditPassword(password)}
                  onDelete={() => handleDeletePassword(password.id)}
                  cryptoManager={cryptoManager}
                  masterKey={masterKey}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// simplified password item component
const PasswordItem = ({ password, onEdit, onDelete }) => {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">{password.website}</h3>
          <p className="text-sm text-gray-600">{password.username}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;