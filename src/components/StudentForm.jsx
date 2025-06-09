// src/components/StudentForm.jsx
import React, { useState } from 'react';

function StudentForm({ onAddStudent, isLoading }) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('生徒名は必須です。');
      return;
    }
    setError('');
    onAddStudent({ name, note });
    setName('');
    setNote('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">新しい回数券を追加</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 bg-red-100 p-2 rounded-md mb-4 text-sm">{error}</p>}
        <div className="mb-4">
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
            生徒名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="studentName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：山田 太郎"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            メモ (任意)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="3"
            placeholder="例：月曜17時クラス、振替希望など"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150 ease-in-out"
        >
          {isLoading ? '追加中...' : '回数券を追加'}
        </button>
      </form>
    </div>
  );
}

export default StudentForm;
