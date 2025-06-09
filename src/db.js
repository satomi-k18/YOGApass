// src/db.js
import { get, set, del, entries, clear } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';
import { addMonths } from './utils';

const STUDENT_STORE_NAME = 'students'; // We'll use a custom store for clarity if needed, or just prefix keys

// Helper to use a specific store with idb-keyval if we decide to.
// For now, idb-keyval uses a default store. We can manage multiple "tables" by prefixing keys.
// const studentStore = new Store(STUDENT_STORE_NAME, STUDENT_STORE_NAME);

/**
 * Retrieves all student records.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of student objects.
 */
export async function getAllStudents() {
  try {
    const allEntries = await entries(); // Gets all entries from the default idb-keyval store
    // Assuming student records are the primary data, or we can filter by a prefix if other data is stored.
    // For simplicity, we assume only student data is stored directly with their ID as key.
    return allEntries.map(([id, studentData]) => studentData); // id is already in studentData
  } catch (error) {
    console.error('Failed to get all students:', error);
    return [];
  }
}

/**
 * Retrieves a single student by ID.
 * @param {string} id - The ID of the student.
 * @returns {Promise<object|undefined>} - A promise that resolves to the student object or undefined if not found.
 */
export async function getStudent(id) {
  try {
    return await get(id);
  } catch (error) {
    console.error(`Failed to get student ${id}:`, error);
    return undefined;
  }
}

/**
 * Creates a new student pass.
 * @param {object} data - The student data.
 * @param {string} data.name - The name of the student.
 * @param {string} [data.note=''] - Optional note.
 * @returns {Promise<object|null>} - The created student object or null on failure.
 */
export async function createPass({ name, note = '' }) {
  if (!name) {
    console.error('Student name is required to create a pass.');
    return null;
  }
  const now = Date.now();
  const newStudent = {
    id: uuidv4(),
    name,
    tickets: 4,
    purchasedAt: now,
    expiresAt: addMonths(now, 2),
    note,
    updatedAt: now,
  };
  try {
    await set(newStudent.id, newStudent);
    return newStudent;
  } catch (error) {
    console.error('Failed to create pass:', error);
    return null;
  }
}

/**
 * Records the use of a ticket for a student.
 * Decrements the ticket count if valid and updates the timestamp.
 * @param {string} id - The ID of the student.
 * @returns {Promise<object|null>} - The updated student object or null if not found/no tickets/expired.
 */
export async function useTicket(id) {
  try {
    const student = await get(id);
    if (!student) {
      console.warn(`Student with ID ${id} not found.`);
      return null;
    }

    const today = new Date();
    today.setHours(0,0,0,0); // For comparing with expiresAt

    if (student.tickets <= 0) {
      console.warn(`Student ${student.name} has no tickets left.`);
      // Potentially return student object to indicate status, or null for "action failed"
      return student; // Return student to allow UI to reflect "no tickets"
    }
    if (student.expiresAt < today.getTime()) {
      console.warn(`Student ${student.name}'s pass has expired.`);
      return student; // Return student to allow UI to reflect "expired"
    }

    student.tickets -= 1;
    student.updatedAt = Date.now();
    await set(id, student);
    return student;
  } catch (error) {
    console.error(`Failed to use ticket for student ${id}:`, error);
    return null;
  }
}

/**
 * Updates an existing student record.
 * @param {string} id - The ID of the student to update.
 * @param {object} updatedData - An object containing the fields to update.
 * @returns {Promise<object|null>} - The updated student object or null on failure.
 */
export async function updateStudent(id, updatedData) {
  try {
    const student = await get(id);
    if (!student) {
      console.warn(`Student with ID ${id} not found for update.`);
      return null;
    }
    const newStudentData = { ...student, ...updatedData, updatedAt: Date.now() };
    // Ensure expiresAt is recalculated if purchasedAt changes
    if (updatedData.purchasedAt && updatedData.purchasedAt !== student.purchasedAt) {
        newStudentData.expiresAt = addMonths(newStudentData.purchasedAt, 2);
    }

    await set(id, newStudentData);
    return newStudentData;
  } catch (error) {
    console.error(`Failed to update student ${id}:`, error);
    return null;
  }
}

/**
 * Deletes a student record by ID.
 * @param {string} id - The ID of the student to delete.
 * @returns {Promise<boolean>} - True if deletion was successful, false otherwise.
 */
export async function deleteStudent(id) {
  try {
    await del(id);
    return true;
  } catch (error) {
    console.error(`Failed to delete student ${id}:`, error);
    return false;
  }
}

/**
 * Clears all student data from the store. (Use with caution)
 * @returns {Promise<void>}
 */
export async function clearAllStudents() {
    try {
        // idb-keyval's clear() clears the entire default database.
        // If we stored other things, we'd need to iterate and delete student-specific keys.
        const students = await getAllStudents();
        for (const student of students) {
            await del(student.id);
        }
        // Or if we are sure only student data is in the default store:
        // await clear();
        console.log('All student data cleared.');
    } catch (error) {
        console.error('Failed to clear all student data:', error);
    }
}
