"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { tasksAPI, coursesAPI } from "@/utils/api";
import TaskList from "@/components/task-list";
import CourseList from "@/components/course-list";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    tasksDueSoon: 0,
  });
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchCourses();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks();
      if (response.data.status === "success") {
        setTasks(response.data.data.tasks);
        updateStats(response.data.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getCourses();
      if (response.data.status === "success") {
        setEnrolledCourses(response.data.data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const updateStats = (tasks) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const tasksDueSoon = tasks.filter(
      (task) =>
        !task.completed &&
        new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length;

    setStats({
      totalTasks,
      completedTasks,
      tasksDueSoon,
    });
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await tasksAPI.updateTask(updatedTask._id, updatedTask);
      if (response.data.status === "success") {
        setTasks((prevTasks) => {
          const newTasks = prevTasks.map((task) =>
            task._id === updatedTask._id ? response.data.data.task : task
          );
          updateStats(newTasks);
          return newTasks;
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await tasksAPI.deleteTask(taskId);
      if (response.data.status === "success") {
        setTasks((prevTasks) => {
          const newTasks = prevTasks.filter((task) => task._id !== taskId);
          updateStats(newTasks);
          return newTasks;
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Calculate tasks due soon once
  const tasksDueSoon = tasks.filter(
    (task) =>
      !task.completed &&
      new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  // Update stats whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      updateStats(tasks);
    }
  }, [tasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Here's an overview of your tasks and courses.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Tasks</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {stats.totalTasks}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">
              Completed Tasks
            </h3>
            <p className="mt-2 text-3xl font-bold text-green-500">
              {stats.completedTasks}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Due Soon</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-500">
              {stats.tasksDueSoon}
            </p>
          </div>
        </div>

        {/* Tasks Due Soon */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Tasks Due Soon
          </h3>
          {tasksDueSoon.length > 0 ? (
            <TaskList
              tasks={tasksDueSoon}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
            />
          ) : (
            <p className="text-gray-500">No tasks due in the next 7 days.</p>
          )}
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Your Courses
          </h3>
          {enrolledCourses.length > 0 ? (
            <CourseList courses={enrolledCourses} />
          ) : (
            <p className="text-gray-500">
              You haven't enrolled in any courses yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
