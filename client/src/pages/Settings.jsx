import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Shield, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateUser } from '../store/slices/authSlice';
import authService from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const Settings = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await authService.updateProfile({ name, bio });
      dispatch(updateUser(res.data.data));
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update');
    }
    setSaving(false);
  };

  const exportData = async () => {
    try {
      const res = await authService.exportData();
      const blob = new Blob([JSON.stringify(res.data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moodecho-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported!');
    } catch {
      toast.error('Export failed');
    }
  };

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      localStorage.clear();
      window.location.href = '/';
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Profile */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-400" /> Profile
        </h2>
        <div className="space-y-4">
          <Input
            label="Name" name="name" value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              rows={3}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 placeholder-dark-500 resize-none focus:outline-none focus:border-primary-500 transition-colors"
              placeholder="Tell us about yourself..."
            />
          </div>
          <Button onClick={saveProfile} isLoading={saving}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" /> Data & Privacy
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-dark-800 rounded-xl">
            <div>
              <p className="text-white font-medium">Export Your Data</p>
              <p className="text-dark-500 text-sm">Download all your mood data as JSON</p>
            </div>
            <Button variant="secondary" size="sm" onClick={exportData}>
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
            <div>
              <p className="text-red-400 font-medium">Delete Account</p>
              <p className="text-dark-500 text-sm">Permanently delete all data</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="⚠️ Delete Account"
      >
        <div className="space-y-4">
          <p className="text-dark-300">
            This will <strong className="text-red-400">permanently delete</strong> your account
            and all associated data. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={deleteAccount}>
              Delete Everything
            </Button>
          </div>
        </div>
      </Modal>

      {/* Account Info */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-dark-500 mb-3">Account Info</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-500">Email</span>
            <span className="text-dark-300">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Member since</span>
            <span className="text-dark-300">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Current streak</span>
            <span className="text-dark-300">🔥 {user?.moodStreak?.current || 0} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-500">Longest streak</span>
            <span className="text-dark-300">🏆 {user?.moodStreak?.longest || 0} days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;