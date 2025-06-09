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
  await set(student.id, student, studentStore);
  return student;
}

// 全生徒取得
export async function getAllStudents() {
  const studentIds = await keys(studentStore);
  const students = await Promise.all(studentIds.map(id => get(id, studentStore)));
  // Sort by purchasedAt descending (newest first)
  return students.sort((a, b) => b.purchasedAt - a.purchasedAt);
}

// 特定の生徒取得
export async function getStudent(id) {
  return await get(id, studentStore);
}

// 受講時 -1
export async function useTicket(id) {
  const student = await get(id, studentStore);
  if (student && student.tickets > 0) {
    student.tickets -= 1;
    student.updatedAt = Date.now();
    await set(id, student, studentStore);
    return student;
  }
  return student; // or throw error if no tickets/student not found
}

// 生徒情報更新 (汎用)
export async function updateStudent(id, updates) {
  const student = await get(id, studentStore);
  if (student) {
    const updatedStudent = { ...student, ...updates, updatedAt: Date.now() };
    // Ensure expiresAt is recalculated if purchasedAt changes
    if (updates.purchasedAt && updates.purchasedAt !== student.purchasedAt) {
      updatedStudent.expiresAt = addMonths(updatedStudent.purchasedAt, 2);
    }
    await set(id, updatedStudent, studentStore);
    return updatedStudent;
  }
  return null; // Or throw error
}

// 生徒削除
export async function deleteStudent(id) {
  await del(id, studentStore);
}

console.log('db.js loaded with functions');
