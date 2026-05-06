import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Shield, Trash2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/auth/users/${userId}`, { role: newRole });
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to permanently remove this user from the system?')) {
      try {
        await api.delete(`/auth/users/${userId}`);
        toast.success('User removed successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove user');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Team Directory</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage roles and view all registered team members.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
          <Users size={18} className="text-sky-600" />
          <span className="font-semibold text-slate-700">{users.length} Members</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((member, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            key={member._id} 
            className="card-premium p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm ring-1 ring-slate-100">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <span className={`badge-subtle ${member.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'} flex items-center gap-1 capitalize`}>
                {member.role === 'admin' && <Shield size={12} />}
                {member.role}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1.5 mb-6">
              <Mail size={14} />
              <a href={`mailto:${member.email}`} className="hover:text-sky-600 transition-colors">{member.email}</a>
            </div>

            {currentUser?.role === 'admin' && (
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <select 
                  className="input-premium py-1.5 px-3 text-sm bg-slate-50 border-slate-200 hover:border-slate-300 cursor-pointer"
                  value={member.role}
                  onChange={(e) => handleRoleChange(member._id, e.target.value)}
                  disabled={member._id === currentUser._id}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>

                <button 
                  onClick={() => handleDeleteUser(member._id)}
                  disabled={member._id === currentUser._id}
                  className={`p-2 rounded-lg transition-colors ${
                    member._id === currentUser._id 
                    ? 'text-slate-300 cursor-not-allowed bg-slate-50' 
                    : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                  title={member._id === currentUser._id ? "Cannot remove yourself" : "Remove user"}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Team;
