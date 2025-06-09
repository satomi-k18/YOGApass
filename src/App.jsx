// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import StudentForm from './components/StudentForm';
import StudentCard from './components/StudentCard';
import { getAllStudents, createPass, useTicket, deleteStudent, updateStudent } from './db';
import { formatDate, badgeColor, daysLeftText, daysLeft } from './utils'; // Import utils

function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllStudents();
      // Sort students: active first, then by expiration, then by name
      data.sort((a, b) => {
        const aDaysLeft = daysLeft(a.expiresAt);
        const bDaysLeft = daysLeft(b.expiresAt);
        const aActive = a.tickets > 0 && aDaysLeft >= 0;
        const bActive = b.tickets > 0 && bDaysLeft >= 0;

        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        // If both active or both inactive, sort by days left (soonest expiring first)
        if (aActive && bActive) {
            if (aDaysLeft !== bDaysLeft) return aDaysLeft - bDaysLeft;
        } else if (!aActive && !bActive) { // both inactive
            // if both no tickets, sort by purchase date (most recent first)
            if (a.tickets === 0 && b.tickets === 0) {
                if (a.purchasedAt !== b.purchasedAt) return b.purchasedAt - a.purchasedAt;
            }
            // if one is expired and other is no tickets, expired comes later
            else if (aDaysLeft < 0 && b.tickets === 0) return 1;
            else if (bDaysLeft < 0 && a.tickets === 0) return -1;
            // if both expired, sort by expiry date (most recently expired first)
            else if (aDaysLeft < 0 && bDaysLeft < 0) {
                 if (a.expiresAt !== b.expiresAt) return b.expiresAt - a.expiresAt;
            }
        }

        return a.name.localeCompare(b.name);
      });
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students:", err);
      setError("生徒データの読み込みに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleAddStudent = async ({ name, note }) => {
    const newStudent = await createPass({ name, note });
    if (newStudent) {
      // Add to list and re-sort, or just reload all
      loadStudents();
    } else {
      setError("生徒の追加に失敗しました。");
    }
  };

  const handleUseTicket = async (id) => {
    const updatedStudent = await useTicket(id);
    if (updatedStudent) {
      loadStudents(); // Reload to reflect changes and re-sort
    } else {
      setError("チケットの使用処理に失敗しました。");
    }
  };

  const handleDeleteStudent = async (id) => {
    const success = await deleteStudent(id);
    if (success) {
      loadStudents();
    } else {
      setError("生徒の削除に失敗しました。");
    }
  };
  
  // Placeholder for editing functionality
  const handleEditStudent = async (id, updatedData) => {
    const updated = await updateStudent(id, updatedData);
    if (updated) {
      loadStudents();
    } else {
      setError("生徒情報の更新に失敗しました。")
    }
  };


  return (
    <div className="container mx-auto p-4 antialiased min-h-screen flex flex-col">
      <header className="mb-8 text-center pt-6">
        <h1 className="text-4xl font-bold text-blue-700">回数券トラッカー</h1>
        <p className="text-gray-600 mt-1">購入から2ヶ月有効・4回券の利用状況を管理します。</p>
      </header>

      <main className="flex-grow">
        <StudentForm onAddStudent={handleAddStudent} isLoading={isLoading} />

        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-center">{error}</p>}

        {isLoading ? (
          <p className="text-center text-gray-500 text-xl py-10">読み込み中...</p>
        ) : (
          students.length === 0 && !error ? (
            <div className="text-center text-gray-500 text-xl py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2">登録されている回数券はありません。</p>
              <p className="text-sm mt-1">上のフォームから新しい回数券を追加してください。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  onUseTicket={handleUseTicket}
                  onDeleteStudent={handleDeleteStudent}
                  onEditStudent={handleEditStudent} // Pass edit handler
                />
              ))}
            </div>
          )
        )}
      </main>
       <footer className="text-center mt-12 py-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} 回数券トラッカー. 
          {/* Replace with your actual repo URL if you have one */}
          {/* <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
            GitHub
          </a> */}
        </p>
      </footer>
    </div>
  );
}

export default App;
