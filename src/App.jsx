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
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students:", error);
      // Optionally, set an error state here to display to the user
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFormSubmit = async (formData) => {
    try {
      if (editingStudent) {
        // Ensure purchasedAt is a number (timestamp)
        const purchasedTimestamp = typeof formData.purchasedAt === 'string' 
          ? new Date(formData.purchasedAt).getTime() 
          : formData.purchasedAt;
        await dbUpdateStudent(editingStudent.id, { ...formData, purchasedAt: purchasedTimestamp });
      } else {
        await createPass(formData); // formData should include name, note, and purchasedAt (as timestamp)
      }
      fetchStudents();
      setEditingStudent(null); // Clear editing state
    } catch (error) {
      console.error("Failed to save student:", error);
      // Optionally, set an error state here
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
          setEditingStudent(null); // Clear form if deleted student was being edited
        }
      } catch (error) {
        console.error("Failed to delete student:", error);
      }
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form for editing
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-indigo-700">回数券トラッカー</h1>
        <p className="text-lg text-gray-600 mt-2">「4回券・購入から2か月有効」の管理アプリ</p>
      </header>

      <div className="mb-12">
        <StudentForm 
          onSubmit={handleFormSubmit} 
          initialData={editingStudent} 
          onCancelEdit={handleCancelEdit} 
        />
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">登録生徒一覧</h2>
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">読み込み中...</p>
        ) : students.length === 0 ? (
          <p className="text-center text-gray-500 bg-white p-8 rounded-lg shadow">現在登録されている生徒はいません。</p>
        ) : (
          <div className="space-y-6">
            {students.map(student => (
              <StudentCard 
                key={student.id} 
                student={student} 
                onUseTicket={handleUseTicket} // Pass studentId directly from StudentCard
                onDelete={handleDeleteStudent} // Pass studentId directly from StudentCard
                onEdit={handleEditStudent}   // Pass student object directly from StudentCard
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
