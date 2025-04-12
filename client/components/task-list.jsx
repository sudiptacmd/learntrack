"use client";

import { useState, useEffect } from "react";
import TaskItem from "./task-item";
import { tasksAPI } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function TaskList({
  tasks: initialTasks = [],
  onTaskUpdate,
  onTaskDelete,
}) {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        setTasks([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await tasksAPI.getTasks();
        setTasks(response.data.data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const response = await tasksAPI.updateTask(taskId, updates);
      if (response.data.status === "success") {
        // Update local state immediately
        const updatedTask = response.data.data.task || { ...updates, _id: taskId };
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, ...updatedTask } : task
          )
        );
        
        // Notify parent component
        if (onTaskUpdate) {
          onTaskUpdate(taskId, updatedTask);
        }
        
        // Force a re-fetch to ensure data consistency
        const refreshResponse = await tasksAPI.getTasks();
        if (refreshResponse.data.status === "success") {
          setTasks(refreshResponse.data.data.tasks || []);
        }
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await tasksAPI.deleteTask(taskId);
      if (response.data.status === "success") {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
        if (onTaskDelete) {
          onTaskDelete(taskId);
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading authentication state...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to view your tasks.</p>
      </div>
    );
  }

  const handleTaskComplete = async (taskId) => {
    try {
      // Find the task to be updated
      const taskToUpdate = tasks.find(task => task._id === taskId);
      if (!taskToUpdate) return;

      // Update local state immediately for better UX
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: "completed" } : task
        )
      );

      // Make API call
      const response = await tasksAPI.updateTask(taskId, { 
        status: "completed",
        completedAt: new Date().toISOString()
      });
      
      if (response.data.status === "success") {
        // Get fresh task data
        const refreshResponse = await tasksAPI.getTasks();
        if (refreshResponse.data.status === "success") {
          const updatedTasks = refreshResponse.data.data.tasks || [];
          setTasks(updatedTasks);

          // Notify parent component with full task data
          if (onTaskUpdate) {
            const updatedTask = updatedTasks.find(t => t._id === taskId);
            if (updatedTask) {
              onTaskUpdate(taskId, updatedTask);
            }
          }
        }
      } else {
        // Revert local state if API call failed
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? taskToUpdate : task
          )
        );
      }
    } catch (error) {
      console.error("Error completing task:", error);
      // Revert local state on error and refresh task list
      const refreshResponse = await tasksAPI.getTasks();
      if (refreshResponse.data.status === "success") {
        setTasks(refreshResponse.data.data.tasks || []);
      }
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onComplete={handleTaskComplete}
          onDelete={handleTaskDelete}
          onUpdate={handleTaskUpdate}
        />
      ))}
    </div>
  );
}
