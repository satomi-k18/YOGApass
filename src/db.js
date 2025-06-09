import { get, set, del, keys, createStore } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';
import { addMonths } from './utils';

const studentStore = createStore('students-db', 'students');

/**
 * データモデル
 * {
 *   id: string,           // uuid
 *   name: string,
 *   tickets: number,      // 初期値 4
 *   purchasedAt: number,  // Date.now()
 *   expiresAt: number,    // purchasedAt + 2ヶ月
 *   note: string,
 *   updatedAt: number
 * }
 */

// 新規購入
export async function createPass({ name, note = '' }) {
  if (!name || name.trim() === '') {
    console.error('Student name is required to create a pass.');
    return null;
  }
  const now = Date.now();
  const student = {
    id: uuidv4(),
    name,
    tickets: 4,
    purchasedAt: now,
    expiresAt: addMonths(now, 2),
    note,
    updatedAt: now,
  };
  try {
    await set(student.id, student, studentStore);
    return student;
  } catch (error) {
    console.error('Failed to create pass:', error);
    return null;
  }
}

// 全生徒取得
export async function getAllStudents() {
  try {
    const studentIds = await keys(studentStore);
    const students = await Promise.all(studentIds.map(id => get(id, studentStore)));
    // Sort by purchasedAt descending (newest first)
    return students.sort((a, b) => b.purchasedAt - a.purchasedAt);
  } catch (error) {
    console.error('Failed to get all students:', error);
    return [];
  }
}

// 特定の生徒取得
export async function getStudent(id) {
  try {
    return await get(id, studentStore);
  } catch (error) {
    console.error(`Failed to get student ${id}:`, error);
    return undefined;
  }
}

// 受講時 -1
export async function useTicket(id) {
  try {
    const student = await get(id, studentStore);
    if (!student) {
      console.warn(`Student with ID ${id} not found.`);
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (student.tickets <= 0) {
      console.warn(`Student ${student.name} has no tickets left.`);
      return student; // Return student to allow UI to reflect "no tickets"
    }
    if (typeof student.expiresAt !== 'number' || student.expiresAt < today.getTime()) {
      console.warn(`Student ${student.name}'s pass has expired or expiry date is invalid.`);
      return student; // Return student to allow UI to reflect "expired"
    }

    student.tickets -= 1;
    student.updatedAt = Date.now();
    await set(id, student, studentStore);
    return student;
  } catch (error) {
    console.error(`Failed to use ticket for student ${id}:`, error);
    return null;
  }
}

// 生徒情報更新 (汎用)
export async function updateStudent(id, updates) {
  try {
    const student = await get(id, studentStore);
    if (student) {
      const updatedStudent = { ...student, ...updates, updatedAt: Date.now() };
      if (updates.purchasedAt && updates.purchasedAt !== student.purchasedAt) {
        if (typeof updatedStudent.purchasedAt === 'number') {
            updatedStudent.expiresAt = addMonths(updatedStudent.purchasedAt, 2);
        } else {
            console.error('Invalid purchasedAt date for recalculating expiry in updateStudent.');
        }
      }
      await set(id, updatedStudent, studentStore);
      return updatedStudent;
    }
    console.warn(`Student with ID ${id} not found for update.`);
    return null;
  } catch (error) {
    console.error(`Failed to update student ${id}:`, error);
    return null;
  }
}

// 生徒削除
export async function deleteStudent(id) {
  try {
    await del(id, studentStore);
  } catch (error) {
    console.error(`Failed to delete student ${id}:`, error);
  }
}
