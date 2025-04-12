"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { tasksAPI } from "@/utils/api";
import TaskList from "@/components/task-list";
import TaskStatistics from "@/components/task-statistics";
import CreateTaskForm from "@/components/create-task-form";
import Link from "next/link";

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const response = await tasksAPI.getTasks();
      if (response.data.status === "success") {
        setTasks(response.data.data.tasks || []);
      } else {
        setError("Failed to load tasks. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user?.id]);

  // Handle task creation
  const handleTaskCreated = async (newTask) => {
    try {
      await fetchTasks();
    } catch (error) {
      console.error("Error refreshing tasks:", error);
      setError("Failed to refresh tasks. Please try again.");
    }
  };

  // Handle task updates
  const handleTaskUpdate = async (taskId, updates) => {
    try {
      // Optimistically update the UI
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, ...updates } : task
        )
      );

      // Make the API call
      const response = await tasksAPI.updateTask(taskId, updates);
      
      if (response.data.status === "success") {
        // Refresh the task list to ensure consistency
        await fetchTasks();
      } else {
        // Revert optimistic update on failure
        await fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
      // Revert optimistic update
      await fetchTasks();
    }
  };

  // Handle task deletion
  const handleTaskDelete = async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to view your tasks.</p>
        <Link href="/login" className="btn-primary mt-4">
          Login
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
            <CreateTaskForm onTaskCreated={handleTaskCreated} />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading tasks...</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          )}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <TaskStatistics tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}
