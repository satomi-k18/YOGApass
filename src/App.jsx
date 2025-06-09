import React, { useState, useEffect, useCallback } from 'react';
import StudentForm from './components/StudentForm';
import StudentCard from './components/StudentCard';
import { getAllStudents, createPass, useTicket as dbUseTicket, deleteStudent as dbDeleteStudent, updateStudent as dbUpdateStudent } from './db';

function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null); // For editing existing student
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllStudents();
      // Sort students: active first, then by expiration, then by name
      data.sort((a, b) => {
        const aDaysLeft = calculateDaysLeft(a.expiresAt);
        const bDaysLeft = calculateDaysLeft(b.expiresAt);
        const aActive = a.tickets > 0 && aDaysLeft >= 0;
        const bActive = b.tickets > 0 && bDaysLeft >= 0;

        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        if (aActive && bActive) { // Both active
          if (aDaysLeft !== bDaysLeft) return aDaysLeft - bDaysLeft; // Soonest expiring first
        } else if (!aActive && !bActive) { // Both inactive
          if (a.tickets === 0 && b.tickets > 0) return 1; // No tickets vs some tickets (expired)
          if (a.tickets > 0 && b.tickets === 0) return -1; // Some tickets (expired) vs no tickets
          if (a.tickets === 0 && b.tickets === 0) { // Both no tickets
            if (a.purchasedAt !== b.purchasedAt) return b.purchasedAt - a.purchasedAt; // Most recent purchase first
          }
          if (aDaysLeft < 0 && bDaysLeft >=0) return 1; // Expired vs not expired (but no tickets)
          if (aDaysLeft >=0 && bDaysLeft < 0) return -1; // Not expired (but no tickets) vs Expired
          if (aDaysLeft < 0 && bDaysLeft < 0) { // Both expired
            if (a.expiresAt !== b.expiresAt) return b.expiresAt - a.expiresAt; // Most recently expired first
          }
        }
        return a.name.localeCompare(b.name);
      });
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
    setIsLoading(false);
  }, []);

  // Helper function for sorting
  const calculateDaysLeft = (expiresAt) => {
    const now = new Date();
    const expiryDate = new Date(expiresAt);
    // Set time to 00:00:00 for fair comparison of dates
    now.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    return Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFormSubmit = async (formData) => {
    try {
      if (editingStudent) {
        const purchasedTimestamp = typeof formData.purchasedAt === 'string' 
          ? new Date(formData.purchasedAt).getTime() 
          : formData.purchasedAt;
        await dbUpdateStudent(editingStudent.id, { ...formData, purchasedAt: purchasedTimestamp });
      } else {
        await createPass(formData);
      }
      fetchStudents();
      setEditingStudent(null);
    } catch (error) {
      console.error("Failed to save student:", error);
    }
  };

  const handleUseTicket = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (student && student.tickets > 0 && new Date(student.expiresAt) >= new Date()) {
        await dbUseTicket(studentId);
        fetchStudents();
      } else {
        alert('チケットを使用できません。残り回数または有効期限を確認してください。');
      }
    } catch (error) {
      console.error("Failed to use ticket:", error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('この生徒の情報を削除してもよろしいですか？')) {
      try {
        await dbDeleteStudent(studentId);
        fetchStudents();
        if (editingStudent && editingStudent.id === studentId) {
          setEditingStudent(null);
        }
      } catch (error) {
        console.error("Failed to delete student:", error);
      }
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl min-h-screen flex flex-col">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-indigo-700">回数券トラッカー</h1>
        <p className="text-lg text-gray-600 mt-2">「4回券・購入から2か月有効」の管理アプリ</p>
      </header>

      <main className="flex-grow">
        <div className="mb-12 bg-white p-6 rounded-lg shadow-lg">
          <StudentForm 
            onSubmit={handleFormSubmit} 
            initialData={editingStudent} 
            onCancelEdit={handleCancelEdit} 
          />
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-6 text-gray-700">登録生徒一覧</h2>
          {isLoading ? (
            <p className="text-center text-gray-500 py-8 text-xl">読み込み中...</p>
          ) : students.length === 0 ? (
            <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl mb-2">現在登録されている生徒はいません。</p>
              <p className="text-sm">上のフォームから新しい回数券情報を追加してください。</p>
            </div>
          ) : (
            <div className="space-y-6">
              {students.map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  onUseTicket={handleUseTicket}
                  onDelete={handleDeleteStudent}
                  onEdit={handleEditStudent}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center mt-12 py-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} 回数券トラッカー
        </p>
      </footer>
    </div>
  );
}

export default App;
