import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Shield, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateUser } from '../store/slices/authSlice';
import authService from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const cardStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '20px',
  padding: '28px',
};

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
    } catch { toast.error('Failed to update'); }
    setSaving(false);
  };

  const exportData = async () => {
    try {
      const res = await authService.exportData();
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moodecho-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported!');
    } catch { toast.error('Export failed'); }
  };

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      localStorage.clear();
      window.location.href = '/';
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9' }}>Settings</h1>

      {/* Profile */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={20} style={{ color: '#818cf8' }} /> Profile
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Tell us about yourself..."
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1.5px solid #334155',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#e2e8f0',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.6',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
              onBlur={(e) => { e.target.style.borderColor = '#334155'; }}
            />
          </div>
          <Button onClick={saveProfile} isLoading={saving}>Save Changes</Button>
        </div>
      </div>

      {/* Data & Privacy */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} style={{ color: '#34d399' }} /> Data & Privacy
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#1e293b',
              borderRadius: '14px',
              padding: '18px 20px',
              border: '1px solid #334155',
            }}
          >
            <div>
              <p style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '14px' }}>Export Your Data</p>
              <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Download all mood data as JSON</p>
            </div>
            <Button variant="secondary" size="sm" onClick={exportData}>
              <Download size={14} /> Export
            </Button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(239,68,68,0.05)',
              borderRadius: '14px',
              padding: '18px 20px',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
          >
            <div>
              <p style={{ color: '#f87171', fontWeight: '600', fontSize: '14px' }}>Delete Account</p>
              <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Permanently delete all data</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
              <Trash2 size={14} /> Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Account Info
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            ['Email', user?.email],
            ['Member since', user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'],
            ['Current streak', `🔥 ${user?.moodStreak?.current || 0} days`],
            ['Longest streak', `🏆 ${user?.moodStreak?.longest || 0} days`],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>{label}</span>
              <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="⚠️ Delete Account">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
            This will <strong style={{ color: '#f87171' }}>permanently delete</strong> your account
            and all associated data. This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" fullWidth onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={deleteAccount}>
              Delete Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;