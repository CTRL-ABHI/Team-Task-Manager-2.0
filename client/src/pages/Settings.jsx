import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { User, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { name, email };
      if (password) payload.password = password;

      const { data } = await api.put('/auth/profile', payload);
      
      setUser(data);
      localStorage.setItem('token', data.token);
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Account Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your profile information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-premium p-6 text-center"
          >
            <div className="w-24 h-24 mx-auto bg-sky-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-4">
              <span className="text-3xl font-bold text-sky-700">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 capitalize">
              <Shield size={14} className="text-slate-400" />
              {user?.role} Access
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 card-premium p-6 sm:p-8"
        >
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5" htmlFor="name">
                  <User size={16} className="text-slate-400" /> Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="input-premium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
                  <Mail size={16} className="text-slate-400" /> Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="input-premium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4 mt-8">Security</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
                  <Lock size={16} className="text-slate-400" /> New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="input-premium pr-10"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5" htmlFor="confirmPassword">
                  <Lock size={16} className="text-slate-400" /> Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="input-premium pr-10"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary px-8 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
