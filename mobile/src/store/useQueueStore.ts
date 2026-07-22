import { create } from 'zustand';
import {
  ShiftPatientRecord,
  addShiftRecord,
  getShiftRecords,
  deleteShiftRecord,
  clearShiftQueue,
} from '../core/database';

interface QueueState {
  records: ShiftPatientRecord[];
  isLoading: boolean;
  loadQueue: () => Promise<void>;
  addRecord: (record: Omit<ShiftPatientRecord, 'id' | 'timestamp'>) => Promise<boolean>;
  removeRecord: (id: string) => Promise<boolean>;
  clearAll: () => Promise<boolean>;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  records: [],
  isLoading: false,

  loadQueue: async () => {
    set({ isLoading: true });
    try {
      const records = await getShiftRecords();
      set({ records, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addRecord: async (input) => {
    const record: ShiftPatientRecord = {
      ...input,
      id: `pt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };

    // Optimistic UI update
    set((state) => ({ records: [record, ...state.records] }));

    const success = await addShiftRecord(record);
    if (!success) {
      // Revert if db write fails
      get().loadQueue();
    }
    return success;
  },

  removeRecord: async (id) => {
    set((state) => ({ records: state.records.filter((r) => r.id !== id) }));
    const success = await deleteShiftRecord(id);
    if (!success) {
      get().loadQueue();
    }
    return success;
  },

  clearAll: async () => {
    set({ records: [] });
    const success = await clearShiftQueue();
    if (!success) {
      get().loadQueue();
    }
    return success;
  },
}));
