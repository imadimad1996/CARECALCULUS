import * as SQLite from 'expo-sqlite';

export interface ShiftPatientRecord {
  id: string;
  bedNumber: string;
  patientInitials: string;
  calculatorId: string;
  calculatorTitle: string;
  calculatedScore: string;
  interpretation: string;
  unitStandard: string;
  timestamp: number;
  notes?: string;
}

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase | null> {
  try {
    if (!dbInstance) {
      dbInstance = await SQLite.openDatabaseAsync('carecalculus_shift_queue.db');
      await initDatabase(dbInstance);
    }
    return dbInstance;
  } catch (error) {
    console.warn('[SQLite] Native SQLite opening failed or running in non-native mode:', error);
    return null;
  }
}

async function initDatabase(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS shift_queue (
      id TEXT PRIMARY KEY NOT NULL,
      bed_number TEXT NOT NULL,
      patient_initials TEXT NOT NULL,
      calculator_id TEXT NOT NULL,
      calculator_title TEXT NOT NULL,
      calculated_score TEXT NOT NULL,
      interpretation TEXT NOT NULL,
      unit_standard TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      notes TEXT
    );
  `);
}

export async function addShiftRecord(record: ShiftPatientRecord): Promise<boolean> {
  const db = await getDatabase();
  if (!db) return false;
  try {
    await db.runAsync(
      `INSERT INTO shift_queue (id, bed_number, patient_initials, calculator_id, calculator_title, calculated_score, interpretation, unit_standard, timestamp, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        record.id,
        record.bedNumber,
        record.patientInitials,
        record.calculatorId,
        record.calculatorTitle,
        record.calculatedScore,
        record.interpretation,
        record.unitStandard,
        record.timestamp,
        record.notes || '',
      ]
    );
    return true;
  } catch (error) {
    console.error('[SQLite] Error adding record:', error);
    return false;
  }
}

export async function getShiftRecords(): Promise<ShiftPatientRecord[]> {
  const db = await getDatabase();
  if (!db) return [];
  try {
    const allRows = await db.getAllAsync<any>(
      `SELECT * FROM shift_queue ORDER BY timestamp DESC;`
    );
    return allRows.map((row) => ({
      id: row.id,
      bedNumber: row.bed_number,
      patientInitials: row.patient_initials,
      calculatorId: row.calculator_id,
      calculatorTitle: row.calculator_title,
      calculatedScore: row.calculated_score,
      interpretation: row.interpretation,
      unitStandard: row.unit_standard,
      timestamp: row.timestamp,
      notes: row.notes,
    }));
  } catch (error) {
    console.error('[SQLite] Error getting records:', error);
    return [];
  }
}

export async function deleteShiftRecord(id: string): Promise<boolean> {
  const db = await getDatabase();
  if (!db) return false;
  try {
    await db.runAsync(`DELETE FROM shift_queue WHERE id = ?;`, [id]);
    return true;
  } catch (error) {
    console.error('[SQLite] Error deleting record:', error);
    return false;
  }
}

export async function clearShiftQueue(): Promise<boolean> {
  const db = await getDatabase();
  if (!db) return false;
  try {
    await db.runAsync(`DELETE FROM shift_queue;`);
    return true;
  } catch (error) {
    console.error('[SQLite] Error clearing queue:', error);
    return false;
  }
}
