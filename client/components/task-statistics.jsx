"use client";

import { useState, useEffect } from "react";

export default function TaskStatistics({ tasks }) {
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
    total: 0,
    dueSoon: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      if (!tasks || !Array.isArray(tasks)) {
        setStats({
          completed: 0,
          inProgress: 0,
          pending: 0,
          total: 0,
          dueSoon: 0
        });
        return;
      }

      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));

      const taskStats = tasks.reduce((acc, task) => {
        // Count by status
        if (task.status === "completed") {
          acc.completed++;
        } else if (task.status === "in-progress") {
          acc.inProgress++;
          // Check due soon only for non-completed tasks
          if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            if (dueDate <= threeDaysFromNow) {
              acc.dueSoon++;
            }
          }
        } else if (task.status === "pending") {
          acc.pending++;
          // Check due soon only for non-completed tasks
          if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            if (dueDate <= threeDaysFromNow) {
              acc.dueSoon++;
            }
          }
        }

        return acc;
      }, {
        completed: 0,
        inProgress: 0,
        pending: 0,
        dueSoon: 0
      });

      setStats({
        ...taskStats,
        total: tasks.length
      });
    };

    // Calculate stats immediately
    calculateStats();

    // Schedule a frame update to ensure UI is in sync
    const frameId = requestAnimationFrame(calculateStats);

    // Cleanup
    return () => cancelAnimationFrame(frameId);
  }, [tasks]);

  const getPercentage = (value) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Task Statistics</h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Completed</span>
            <span className="text-sm font-medium">
              {getPercentage(stats.completed)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${getPercentage(stats.completed)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">In Progress</span>
            <span className="text-sm font-medium">
              {getPercentage(stats.inProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${getPercentage(stats.inProgress)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Pending</span>
            <span className="text-sm font-medium">
              {getPercentage(stats.pending)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-yellow-600 h-2.5 rounded-full"
              style={{ width: `${getPercentage(stats.pending)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.total - stats.completed}
          </div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {stats.dueSoon}
          </div>
          <div className="text-sm text-gray-600">Due Soon</div>
        </div>
      </div>
    </div>
  );
}
