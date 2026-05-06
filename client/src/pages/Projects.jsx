import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { FolderKanban, Plus, Users, X, Info, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [newProject, setNewProject] = useState({ name: '', description: '', members: [] });
  const [editProjectData, setEditProjectData] = useState({ id: '', name: '', description: '', members: [] });

  const fetchData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        api.get('/projects'),
        api.get('/auth/users')
      ]);
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

  const handleMemberToggle = (userId, isEdit = false) => {
    if (isEdit) {
      setEditProjectData(prev => {
        const members = prev.members.includes(userId)
          ? prev.members.filter(id => id !== userId)
          : [...prev.members, userId];
        return { ...prev, members };
      });
    } else {
      setNewProject(prev => {
        const members = prev.members.includes(userId)
          ? prev.members.filter(id => id !== userId)
          : [...prev.members, userId];
        return { ...prev, members };
      });
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      toast.success('Project created successfully');
      setIsModalOpen(false);
      setNewProject({ name: '', description: '', members: [] });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${editProjectData.id}`, editProjectData);
      toast.success('Project updated successfully');
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project');
    }
  };

  const openDetails = (project) => {
    setSelectedProject(project);
    setDetailsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditProjectData({
      id: project._id,
      name: project.name,
      description: project.description,
      members: project.members ? project.members.map(m => m._id) : []
    });
    setDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) {
      try {
        await api.delete(`/projects/${projectId}`);
        toast.success('Project deleted successfully');
        setDetailsModalOpen(false);
        fetchData();
      } catch (error) {
        toast.error('Failed to delete project');
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
          <h1 className="text-2xl font-bold text-slate-900 font-display">Projects</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage workspaces and collaborate with your team.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={18} strokeWidth={2.5} />
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              key={project._id} 
              className="card-premium p-6 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
                  <FolderKanban size={20} />
                </div>
                <span className="badge-subtle bg-slate-50 text-slate-600 border-slate-200">
                  Active
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 font-display">{project.name}</h3>
              <p className="text-sm text-slate-500 mt-2 flex-1 leading-relaxed">
                {project.description.length > 90 ? project.description.substring(0, 90) + '...' : project.description}
              </p>
              
              {project.members && project.members.length > 0 && (
                <div className="mt-6 flex -space-x-2">
                  {project.members.slice(0, 4).map((member, i) => (
                    <div key={member._id || i} className="inline-flex h-8 w-8 rounded-full bg-slate-200 border-2 border-white items-center justify-center text-xs text-slate-600 font-semibold ring-1 ring-slate-100" title={member.name}>
                      {member.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  ))}
                  {project.members.length > 4 && (
                    <div className="inline-flex h-8 w-8 rounded-full bg-slate-50 border-2 border-white items-center justify-center text-xs text-slate-500 font-medium ring-1 ring-slate-200">
                      +{project.members.length - 4}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <Users size={16} />
                  <span>{project.members?.length || 0} members</span>
                </div>
                <button 
                  onClick={() => openDetails(project)}
                  className="text-sky-600 font-semibold text-sm hover:text-sky-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full card-premium p-12 text-center border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50">
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-slate-400 mb-4 shadow-sm border border-slate-100">
              <FolderKanban size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No projects yet</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">Get started by creating your first workspace.</p>
            {user?.role === 'admin' && (
              <button onClick={() => setIsModalOpen(true)} className="btn-primary mx-auto">
                <Plus size={18} /> Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* CREATE PROJECT MODAL */}
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
                <h3 className="text-lg font-bold text-slate-900 font-display">Create Project</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreateProject} className="p-6 space-y-5 overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name</label>
                  <input 
                    type="text" 
                    required 
                    className="input-premium"
                    placeholder="e.g. Website Redesign"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    required 
                    className="input-premium min-h-[100px] resize-none"
                    placeholder="Briefly describe the project goals..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign Team Members</label>
                  <div className="border border-slate-200 rounded-lg p-2 max-h-40 overflow-y-auto space-y-0.5 bg-slate-50">
                    {allUsers.map((u) => (
                      <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                          checked={newProject.members.includes(u._id)}
                          onChange={() => handleMemberToggle(u._id, false)}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-800">{u.name}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 mt-4">
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

      {/* EDIT PROJECT MODAL */}
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
                <h3 className="text-lg font-bold text-slate-900 font-display">Edit Project</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleEditProject} className="p-6 space-y-5 overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name</label>
                  <input 
                    type="text" 
                    required 
                    className="input-premium"
                    value={editProjectData.name}
                    onChange={(e) => setEditProjectData({...editProjectData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    required 
                    className="input-premium min-h-[100px] resize-none"
                    value={editProjectData.description}
                    onChange={(e) => setEditProjectData({...editProjectData, description: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign Team Members</label>
                  <div className="border border-slate-200 rounded-lg p-2 max-h-40 overflow-y-auto space-y-0.5 bg-slate-50">
                    {allUsers.map((u) => (
                      <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                          checked={editProjectData.members.includes(u._id)}
                          onChange={() => handleMemberToggle(u._id, true)}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-800">{u.name}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 mt-4">
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

      {/* VIEW DETAILS MODAL */}
      <AnimatePresence>
        {detailsModalOpen && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setDetailsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start shrink-0">
                <div className="flex gap-4 items-center">
                   <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
                    <Info size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">{selectedProject.name}</h3>
                    <span className="badge-subtle bg-slate-50 text-slate-600 border-slate-200 mt-1 inline-block">
                      Active Workspace
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setDetailsModalOpen(false)} 
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto">
                
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Team Members ({selectedProject.members?.length || 0})</h4>
                  {selectedProject.members && selectedProject.members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.members.map((member) => (
                        <div key={member._id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                           <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm text-slate-600 font-semibold">
                            {member.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold text-slate-800 truncate">{member.name}</span>
                            <span className="text-xs text-slate-500 truncate">{member.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm italic">No team members assigned.</p>
                  )}
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-between items-center">
                  {user?.role === 'admin' ? (
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => handleDeleteProject(selectedProject._id)} 
                        className="text-rose-600 font-semibold text-sm hover:text-rose-700 transition-colors px-3 py-2 rounded-lg hover:bg-rose-50 flex items-center gap-1.5"
                      >
                        <Trash2 size={16} /> Delete Workspace
                      </button>
                      <button 
                        type="button" 
                        onClick={() => openEditModal(selectedProject)} 
                        className="text-slate-600 font-semibold text-sm hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-1.5"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                    </div>
                  ) : <div></div>}
                  <button type="button" onClick={() => setDetailsModalOpen(false)} className="btn-secondary w-full sm:w-auto">
                    Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
