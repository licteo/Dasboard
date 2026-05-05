/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Plus, 
  Search,
  LogOut,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { 
  onSnapshot, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { Project } from './types';
import ProjectCard from './components/ProjectCard';
import AddProjectModal from './components/AddProjectModal';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Data Listener
  useEffect(() => {
    const projectsQuery = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects');
    });

    return () => unsubscribe();
  }, []);

  // 3. Test Connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const handleSignOut = () => signOut(auth);

  const handleAddProject = async (name: string, description: string, url: string) => {
    try {
      await addDoc(collection(db, 'projects'), {
        name,
        description,
        url,
        ownerId: 'public',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-white serif italic text-2xl"
        >
          Dashboard<span className="text-orange-500">.</span>Central
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#EAEAEA] flex flex-col font-sans selection:bg-orange-500/30">
      {/* Navigation */}
      <nav className="h-24 w-full px-12 flex items-center justify-between border-b border-white/5 bg-[#050505] sticky top-0 z-40 backdrop-blur-md">
        <div>
          <h1 className="serif text-2xl font-semibold tracking-tight italic">
            Dashboard<span className="text-orange-500">.</span>Central
          </h1>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-semibold">Proyectos Activos</span>
              <span className="text-lg font-light tracking-wide">{projects.length} Unidades</span>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center relative">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 px-12 py-16 flex flex-col max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col h-full">
          <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
              <h2 className="text-5xl font-light tracking-tight mb-2">Mis Aplicaciones</h2>
              <span className="text-sm text-white/40 italic serif block">Sincronizado con Firestore Enterprise DB</span>
            </div>
            
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="FILTRAR PROYECTOS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-[10px] uppercase tracking-widest font-semibold focus:outline-none focus:border-white/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onDelete={handleDeleteProject}
                />
              ))}
            </AnimatePresence>

            <button
              onClick={() => setIsModalOpen(true)}
              className="glass p-8 flex flex-col items-center justify-center rounded-2xl border-dashed border-white/10 bg-transparent opacity-40 hover:opacity-100 transition-all group min-h-[250px]"
            >
              <div className="text-center">
                <div className="text-4xl font-light mb-4 text-white/50 group-hover:text-orange-500 transition-colors">+</div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold">Nueva Ranura</p>
              </div>
            </button>
          </div>
          
          {filteredProjects.length === 0 && searchTerm && (
            <div className="py-32 text-center">
              <p className="serif italic text-white/30 text-xl">Ningún resultado para tu búsqueda.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="px-12 pb-12 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/20 font-semibold gap-4">
        <div className="flex gap-8">
          <span>Dash.Central v1.0.5</span>
          <span className="hidden md:inline">•</span>
          <span>© 2026 Studio Design</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Repositorio</a>
          <a href="#" className="hover:text-white transition-colors">Sistema</a>
          <a href="#" className="hover:text-white transition-colors">Métricas</a>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-12 right-12 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-5" />
        <Plus size={28} />
      </button>

      {/* Modal */}
      <AddProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddProject}
      />
    </div>
  );
}
