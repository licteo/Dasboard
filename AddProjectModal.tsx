import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, description: string, url: string) => void;
}

export default function AddProjectModal({ isOpen, onClose, onAdd }: AddProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && description && url) {
      onAdd(name, description, url);
      setName('');
      setDescription('');
      setUrl('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="relative w-full max-w-lg glass rounded-3xl p-12 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500" />
            
            <div className="flex justify-between items-center mb-10">
              <h2 className="serif text-3xl italic">Nuevo Proyecto</h2>
              <button
                onClick={onClose}
                className="p-2 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                  Nombre de la Aplicación
                </label>
                <input
                  autoFocus
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white transition-all text-xl font-light"
                  placeholder="Ej. Nexus Admin"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                  Descripción Corta
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white transition-all text-lg font-light resize-none"
                  placeholder="Define el propósito del proyecto..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                  URL de Acceso
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white/5 border-b border-white/10 px-0 py-3 text-white focus:outline-none focus:border-white transition-all text-sm font-light text-blue-400"
                  placeholder="https://..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-neutral-200 transition-all active:scale-98 mt-4 shadow-xl"
              >
                Registrar Proyecto
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
