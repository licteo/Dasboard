import { Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

const colors = [
  'bg-orange-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500'
];

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  // Simple deterministic color selection based on id
  const accentColor = colors[project.id.length % colors.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="glass p-8 flex flex-col justify-between rounded-2xl group relative transition-all duration-300 hover:bg-white/[0.06] hover:border-white/15 hover:-translate-y-1"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(project.id)}
          className="p-1.5 text-white/20 hover:text-rose-400 transition-colors"
          title="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div>
        <div className={`w-8 h-1 ${accentColor} mb-6 transition-all group-hover:w-12`} />
        <h3 className="text-xl font-medium mb-2 text-white/90 group-hover:text-white">
          {project.name}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed font-light line-clamp-3 mb-6">
          {project.description}
        </p>
      </div>
      
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 py-2.5 border border-white/10 rounded-lg text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 hover:bg-white hover:text-black transition-all text-center"
      >
        Ir a la App
      </a>
    </motion.div>
  );
}
