import React from 'react';
import { badgeColor, daysLeftText, formatDate } from '../utils';

const StudentCard = ({ student, onUseTicket, onDelete, onEdit }) => {
  if (!student) return null;

  const { name, tickets, purchasedAt, expiresAt, note, id } = student;
  const colorClass = badgeColor(student);
  const expiryText = daysLeftText(student);

  return (
    <div className={`bg-white shadow-lg rounded-xl p-6 border-l-4 ${getBorderColor(student)}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
          <p className={`text-sm font-semibold px-2 py-0.5 inline-block rounded-full ${colorClass}`}>
            {expiryText}
          </p>
        </div>
        <div className="text-3xl font-bold text-indigo-600">
          残り <span className="text-5xl">{tickets}</span> 回
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
        <p><strong className="font-medium text-gray-700">購入日:</strong> {formatDate(purchasedAt)}</p>
        <p><strong className="font-medium text-gray-700">有効期限:</strong> {formatDate(expiresAt)}</p>
        {note && (
          <p className="col-span-2"><strong className="font-medium text-gray-700">メモ:</strong> {note}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => onUseTicket(id)}
          disabled={tickets <= 0 || new Date(expiresAt) < new Date()}
          className="flex-grow sm:flex-grow-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          受講 (チケット使用)
        </button>
        <button
          onClick={() => onEdit(student)}
          className="flex-grow sm:flex-grow-0 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
        >
          編集
        </button>
        <button
          onClick={() => onDelete(id)}
          className="flex-grow sm:flex-grow-0 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
        >
          削除
        </button>
      </div>
    </div>
  );
};

// Helper to determine border color based on status
const getBorderColor = (student) => {
  const color = badgeColor(student);
  if (color.includes('red')) return 'border-red-500';
  if (color.includes('yellow')) return 'border-yellow-500';
  if (color.includes('green')) return 'border-green-500';
  return 'border-slate-500';
};

export default StudentCard;
