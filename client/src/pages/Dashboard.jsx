import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: <ListTodo size={24} className="text-sky-600" />, bg: 'bg-sky-50' },
    { title: 'Completed', value: stats?.completedTasks || 0, icon: <CheckCircle2 size={24} className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { title: 'In Progress', value: stats?.inProgressTasks || 0, icon: <TrendingUp size={24} className="text-violet-600" />, bg: 'bg-violet-50' },
    { title: 'Overdue', value: stats?.overdueTasks || 0, icon: <AlertCircle size={24} className="text-rose-600" />, bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 text-sm">Here's what's happening with your projects today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            key={index} 
            className="card-premium p-5 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 font-display">{card.value}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mt-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-slate-400" size={20} />
          <h2 className="text-lg font-bold text-slate-900 font-display">Recent Activity</h2>
        </div>
        
        <div className="card-premium bg-white">
          {stats?.recentTasks?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {stats.recentTasks.map((task) => (
                <div 
                  key={task._id} 
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                      task.status === 'Completed' ? 'bg-emerald-500' :
                      task.status === 'In Progress' ? 'bg-sky-500' : 'bg-slate-300'
                    }`}></div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{task.title}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">
                        in <span className="font-medium text-slate-700">{task.project?.name}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`badge-subtle ${
                      task.status === 'Completed' ? 'badge-completed' :
                      task.status === 'In Progress' ? 'badge-progress' : 
                      'badge-todo'
                    }`}>
                      {task.status}
                    </span>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                      <Clock size={14} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-sm">
              No recent activity found.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
