import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddChildModal: React.FC = () => {
  const { addChild, setSelectedDetailView } = useApp();

  const [legalName, setLegalName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [diagnoses, setDiagnoses] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName.trim()) return;

    const dobYear = new Date(dateOfBirth || '2021-01-01').getFullYear();
    const ageYears = Math.max(1, new Date().getFullYear() - dobYear);

    addChild({
      legalName,
      preferredName: preferredName || legalName,
      dateOfBirth,
      ageYears,
      gender,
      bloodGroup,
      activeDiagnoses: diagnoses ? diagnoses.split(',').map((s) => s.trim()) : [],
      specialInstructions,
    });

    setSelectedDetailView(null);
  };

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          onClick={() => setSelectedDetailView(null)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#233531] text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Add Child Profile
        </h1>
        <div className="w-9" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Child's Legal Full Name
          </label>
          <input
            type="text"
            placeholder="e.g. Aarav Perera"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            required
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Preferred Nickname
          </label>
          <input
            type="text"
            placeholder="e.g. Aarav"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Active Diagnoses (Comma Separated)
          </label>
          <input
            type="text"
            placeholder="e.g. Asthma, Seasonal Allergies"
            value={diagnoses}
            onChange={(e) => setDiagnoses(e.target.value)}
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Caregiver Special Instructions
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Keep inhaler close during physical play..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full bg-white dark:bg-[#1A2825] border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#006A53]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#006A53] hover:bg-[#005240] text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-all mt-3"
        >
          <UserPlus className="w-4 h-4" />
          <span>Save Child Profile</span>
        </button>
      </form>
    </div>
  );
};
