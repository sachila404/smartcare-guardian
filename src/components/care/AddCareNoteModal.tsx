import React, { useState } from 'react';
import { X, Moon, Utensils, Pill, Stethoscope, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NoteCategory } from '../../types';

export const AddCareNoteModal: React.FC = () => {
  const { activeModal, setActiveModal, activeChild, addCareNote } = useApp();

  const [category, setCategory] = useState<NoteCategory>('general');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (activeModal !== 'add_note' || !activeChild) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addCareNote({
      childId: activeChild.id,
      category,
      title,
      content,
    });

    setActiveModal(null);
    setTitle('');
    setContent('');
  };

  const categories: { id: NoteCategory; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: FileText },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'feeding', label: 'Feeding', icon: Utensils },
    { id: 'medication', label: 'Medication', icon: Pill },
    { id: 'symptom', label: 'Symptom', icon: Stethoscope },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1A2825] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Log Care Note
          </h2>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#233531] text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                      isSelected
                        ? 'bg-[#006A53] text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-[#233531] text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Lunch completed, Woke up from nap"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Detailed Notes
            </label>
            <textarea
              rows={3}
              placeholder="Enter detailed observations or care instructions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#006A53] hover:bg-[#005240] text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all mt-2"
          >
            <span>Save Care Note</span>
          </button>
        </form>
      </div>
    </div>
  );
};
