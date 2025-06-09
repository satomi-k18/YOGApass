<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils'; // For displaying dates if needed

const StudentForm = ({ onSubmit, initialData, onCancelEdit }) => {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [purchasedAtDate, setPurchasedAtDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setNote(initialData.note || '');
      if (initialData.purchasedAt) {
        setPurchasedAtDate(new Date(initialData.purchasedAt).toISOString().split('T')[0]);
      }
    } else {
      // Reset form for new entry
      setName('');
      setNote('');
      setPurchasedAtDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);
=======
// src/components/StudentForm.jsx
import React, { useState } from 'react';

function StudentForm({ onAddStudent, isLoading }) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
>>>>>>> 02abac037f7bca105f4d710872bf81b9f6885958

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
<<<<<<< HEAD
      alert('生徒の名前を入力してください。');
      return;
    }
    const purchasedAtTimestamp = new Date(purchasedAtDate).getTime();
    onSubmit({ 
      name: name.trim(), 
      note: note.trim(), 
      // If editing, pass the id. If new, db will create id.
      ...(isEditing && { id: initialData.id }), 
      // Pass purchasedAt only if it's different or new, or if editing and it changed.
      // The db layer will handle tickets and expiresAt for new entries.
      // For edits, if purchasedAt changes, db layer should recalc expiresAt.
      purchasedAt: purchasedAtTimestamp 
    });
    if (!isEditing) {
        setName('');
        setNote('');
        setPurchasedAtDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-6 md:p-8 mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        {isEditing ? '生徒情報編集' : '新規購入登録'}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">生徒の名前 <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 山田 花子"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="purchasedAtDate" className="block text-sm font-medium text-gray-700 mb-1">購入日</label>
        <input
          type="date"
          id="purchasedAtDate"
          value={purchasedAtDate}
          onChange={(e) => setPurchasedAtDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
         <p className="text-xs text-gray-500 mt-1">有効期限はこの日から2ヶ月後として自動計算されます。</p>
      </div>

      <div className="mb-6">
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">メモ (任意)</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="3"
          placeholder="例: 週1回ペース希望、紹介割引適用など"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
      </div>

      <div className="flex items-center justify-end space-x-3">
        {isEditing && (
            <button
                type="button"
                onClick={onCancelEdit} // Prop to handle cancel
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                キャンセル
            </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? '更新する' : '登録する'}
        </button>
      </div>
    </form>
  );
};
=======
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
>>>>>>> 02abac037f7bca105f4d710872bf81b9f6885958

export default StudentForm;
