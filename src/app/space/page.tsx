'use client';
import React, { useEffect, useState } from 'react';
import habitDB from '../db';
interface StorageInfo {
  total: number;
  used: number;
}

const Page: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({ total: 0, used: 0 });

  useEffect(() => {
    async function fetchStorageInfo() {
      const quota = await navigator.storage.estimate();
      const totalSpace = quota.quota || 0;
      const usedSpace = quota.usage || 0;

      const totalSpaceMB = (totalSpace / (1024 * 1024)).toFixed(2);
      const usedSpaceMB = (usedSpace / (1024 * 1024)).toFixed(2);

      setStorageInfo({ total: parseFloat(totalSpaceMB), used: parseFloat(usedSpaceMB) });
    }

    fetchStorageInfo();
  }, []);

  const clearHabitDatabase = async () => {
    try {
      await habitDB.delete();
      console.log('HabitDatabase deleted successfully.');
      alert('HabitDatabase has been cleared.');
      // Reinitialize the database
      await habitDB.open();
    } catch (error) {
      console.error('Failed to delete HabitDatabase:', error);
      alert('Failed to clear HabitDatabase.');
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Storage Information</h2>
      <p>Total Space: {storageInfo.total} MB</p>
      <p>Used Space: {storageInfo.used} MB</p>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={clearHabitDatabase}
      >
        Clear HabitDatabase
      </button>
    </div>
  );
};

export default Page;
