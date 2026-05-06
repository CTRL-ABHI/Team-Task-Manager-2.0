import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, Plus, Clock, Edit2, X, Calendar, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    dueDate: '', 
    project: '', 
    assignedTo: '',
    status: 'Todo' 
  });

  const [editTaskData, setEditTaskData] = useState({ 
    id: '',
    title: '', 
    description: '', 
    dueDate: '', 
    project: '', 
    assignedTo: '',
    status: 'Todo' 
  });

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/auth/users')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setAllUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      toast.success('Task created successfully');
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', dueDate: '', project: '', assignedTo: '', status: 'Todo' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${editTaskData.id}`, editTaskData);
      toast.success('Task updated successfully');
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        toast.success('Task deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const openEditModal = (task) => {
    setEditTaskData({
      id: task._id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      project: task.project?._id || '',
      assignedTo: task.assignedTo?._id || '',
      status: task.status
    });
    setIsEditModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Tasks</h1>
          <p className="text-slate-500 mt-1 text-sm">Organize and execute your work items.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={18} strokeWidth={2.5} />
            New Task
          </button>
        )}
      </div>

      <div className="card-premium overflow-hidden">
        {tasks.length > 0 ? (
          <div className="min-w-full overflow-x-auto">
            <div className="bg-slate-50/50 px-6 py-4 grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 min-w-[800px]">
              <div className="col-span-4">Task Details</div>
              <div className="col-span-2">Project</div>
              <div className="col-span-2">Assignee</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-2">Status</div>
            </div>
            <div className="divide-y divide-slate-100 min-w-[800px] bg-white">
              {tasks.map((task) => (
                <div 
                  key={task._id} 
                  className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors"
                >
                  <div className="col-span-4 pr-4">
                    <h4 className="font-semibold text-slate-900 text-sm">{task.title}</h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{task.description}</p>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded truncate max-w-full">
                      {task.project?.name || 'No Project'}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold border border-slate-200">
                          {task.assignedTo.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate">{task.assignedTo.name?.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 italic">Unassigned</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-between items-center">
                    <div className="relative">
                      <select 
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className={`badge-subtle appearance-none cursor-pointer pr-8 outline-none ${
                          task.status === 'Completed' ? 'badge-completed' :
                          task.status === 'In Progress' ? 'badge-progress' : 
                          'badge-todo'
                        }`}
                      >
                        <option value="Todo">TODO</option>
                        <option value="In Progress">IN PROGRESS</option>
                        <option value="Completed">COMPLETED</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                        <svg className="h-3 w-3 fill-current opacity-50" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                    {user?.role === 'admin' ? (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => openEditModal(task)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Edit Task"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50/50">
            <div className="w-16 h-16 mx-auto bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 mb-4">
              <CheckSquare size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No tasks found</h3>
            <p className="text-slate-500 text-sm mt-1">You don't have any active tasks.</p>
          </div>
        )}
      </div>

      {/* CREATE TASK MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold text-slate-900 font-display">Create Task</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreateTask} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Title</label>
                  <input 
                    type="text" 
                    required 
                    className="input-premium"
                    placeholder="e.g. Design Homepage"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    required 
                    className="input-premium min-h-[80px] resize-none"
                    placeholder="Provide detailed instructions..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project</label>
                    <select 
                      required 
                      className="input-premium py-2.5 bg-white"
                      value={newTask.project}
                      onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                    >
                      <option value="">Select Project</option>
                      {projects.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign To</label>
                    <select 
                      className="input-premium py-2.5 bg-white"
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    >
                      <option value="">Select Member</option>
                      {allUsers.map(u => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
                  <input 
                    type="date" 
                    required 
                    className="input-premium py-2.5"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT TASK MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold text-slate-900 font-display">Edit Task</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleEditTask} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Title</label>
                  <input 
                    type="text" 
                    required 
                    className="input-premium"
                    value={editTaskData.title}
                    onChange={(e) => setEditTaskData({...editTaskData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    required 
                    className="input-premium min-h-[80px] resize-none"
                    value={editTaskData.description}
                    onChange={(e) => setEditTaskData({...editTaskData, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project</label>
                    <select 
                      required 
                      className="input-premium py-2.5 bg-white"
                      value={editTaskData.project}
                      onChange={(e) => setEditTaskData({...editTaskData, project: e.target.value})}
                    >
                      <option value="">Select Project</option>
                      {projects.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign To</label>
                    <select 
                      className="input-premium py-2.5 bg-white"
                      value={editTaskData.assignedTo}
                      onChange={(e) => setEditTaskData({...editTaskData, assignedTo: e.target.value})}
                    >
                      <option value="">Select Member</option>
                      {allUsers.map(u => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
                  <input 
                    type="date" 
                    required 
                    className="input-premium py-2.5"
                    value={editTaskData.dueDate}
                    onChange={(e) => setEditTaskData({...editTaskData, dueDate: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
