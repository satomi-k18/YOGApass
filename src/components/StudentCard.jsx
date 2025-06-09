// src/components/StudentCard.jsx
import React, { useState } from 'react';
import { formatDate, badgeColor, daysLeftText, daysLeft } from '../utils';

function StudentCard({ student, onUseTicket, onDeleteStudent, onEditStudent }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(student.name);
  const [editNote, setEditNote] = useState(student.note);
  // Store purchasedAt as YYYY-MM-DD for the input type="date"
  const [editPurchasedAt, setEditPurchasedAt] = useState(
    student.purchasedAt ? new Date(student.purchasedAt).toISOString().split('T')[0] : ''
  );

  const handleUseTicket = () => {
    if (student.tickets > 0 && daysLeft(student.expiresAt) >= 0) {
      onUseTicket(student.id);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`「${student.name}」さんの回数券情報を削除しますか？この操作は元に戻せません。`)) {
      onDeleteStudent(student.id);
    }
  };

  const handleEdit = () => {
    setEditName(student.name);
    setEditNote(student.note);
    setEditPurchasedAt(student.purchasedAt ? new Date(student.purchasedAt).toISOString().split('T')[0] : '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      alert('生徒名は必須です。');
      return;
    }
    const updatedData = {
      name: editName.trim(),
      note: editNote.trim(),
    };
    if (editPurchasedAt) {
      // Convert YYYY-MM-DD string back to timestamp
      // Ensure it's parsed as local date, then get time
      const parts = editPurchasedAt.split('-');
      const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
      updatedData.purchasedAt = localDate.getTime();
    } else {
        // If date is cleared, it might mean we want to reset it or handle as error
        // For now, let's prevent saving without a purchase date if it was editable.
        // Or, we could default it to original if not changed.
        // For simplicity, if it's editable and cleared, we alert.
        // If it wasn't editable, this field wouldn't be here.
        alert('購入日は必須です。');
        return;
    }

    onEditStudent(student.id, updatedData);
    setIsEditing(false);
  };

  const cardBadgeColor = badgeColor(student);
  const cardDaysLeftText = daysLeftText(student);
  const dLeft = daysLeft(student.expiresAt);
  const isExpiredOrUsed = student.tickets <= 0 || dLeft < 0;

  if (isEditing) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-lg border border-blue-500 transform transition-all duration-300">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">情報を編集</h3>
        <div className="mb-3">
          <label htmlFor={`edit-name-${student.id}`} className="block text-sm font-medium text-gray-700">生徒名</label>
          <input
            type="text"
            id={`edit-name-${student.id}`}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-3">
          <label htmlFor={`edit-purchased-${student.id}`} className="block text-sm font-medium text-gray-700">購入日</label>
          <input
            type="date"
            id={`edit-purchased-${student.id}`}
            value={editPurchasedAt}
            onChange={(e) => setEditPurchasedAt(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor={`edit-note-${student.id}`} className="block text-sm font-medium text-gray-700">メモ</label>
          <textarea
            id={`edit-note-${student.id}`}
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            rows="2"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancelEdit}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            キャンセル
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            保存
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[280px] ${isExpiredOrUsed ? 'opacity-75 bg-gray-50' : ''}`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-2xl font-bold ${isExpiredOrUsed ? 'text-gray-500' : 'text-gray-800'}`}>{student.name}</h3>
          <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${cardBadgeColor} whitespace-nowrap`}>
            {cardDaysLeftText}
          </span>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <p className={`${isExpiredOrUsed ? 'text-gray-400' : 'text-gray-700'}`}>
            <span className="font-medium">残り回数:</span>
            <span className={`ml-2 text-lg font-bold ${student.tickets > 0 ? 'text-blue-600' : 'text-red-500'}`}>
              {student.tickets} / 4 回
            </span>
          </p>
          <p className={`${isExpiredOrUsed ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="font-medium">購入日:</span> {formatDate(student.purchasedAt)}
          </p>
          <p className={`${isExpiredOrUsed ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="font-medium">有効期限:</span> {formatDate(student.expiresAt)}
            {dLeft === 0 && student.tickets > 0 && <span className="text-yellow-600 font-semibold ml-1">(本日まで)</span>}
          </p>
          {student.note && (
            <p className={`mt-2 p-2 text-xs ${isExpiredOrUsed ? 'text-gray-400 bg-gray-100' : 'text-gray-600 bg-gray-50'} rounded-md`}>
              <span className="font-medium">メモ:</span> {student.note}
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between space-x-2">
          <button
            onClick={handleUseTicket}
            disabled={student.tickets <= 0 || dLeft < 0}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-150"
          >
            受講 (残り {student.tickets})
          </button>
          <div className="flex space-x-1">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition duration-150"
              title="編集"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition duration-150"
              title="削除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;
