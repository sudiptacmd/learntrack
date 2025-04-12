"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CheckCircle,
  Circle,
  Trash,
  Edit,
  Calendar,
  Clock,
} from "lucide-react";

export default function TaskItem({ task, onComplete, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await onComplete(task._id);
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(task._id);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask(task);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onUpdate(task._id, editedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
      // Reset to original values if update fails
      setEditedTask(task);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`card border-l-4 ${
        task.priority === "high"
          ? "border-l-red-500"
          : task.priority === "medium"
          ? "border-l-yellow-500"
          : "border-l-green-500"
      } ${
        task.status === "completed" ? "bg-gray-50" : ""
      } transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-grow">
          <button
            onClick={handleComplete}
            className="mt-1 cursor-pointer hover:opacity-75 transition-opacity"
            disabled={isEditing || isLoading}
          >
            {task.status === "completed" ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <Circle className="h-6 w-6 text-gray-400" />
            )}
          </button>

          <div className="flex-grow">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={editedTask.title}
                  onChange={handleChange}
                  className="form-input w-full"
                  placeholder="Task title"
                />
                <textarea
                  name="description"
                  value={editedTask.description}
                  onChange={handleChange}
                  className="form-input w-full"
                  rows="2"
                  placeholder="Task description"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="priority"
                    value={editedTask.priority}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <input
                    type="date"
                    name="dueDate"
                    value={
                      editedTask.dueDate
                        ? format(new Date(editedTask.dueDate), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3
                  className={`text-lg font-medium ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 mt-1">{task.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(
                      task.priority
                    )}`}
                  >
                    {task.priority} priority
                  </span>
                  {task.dueDate && (
                    <span className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="text-gray-500 hover:text-gray-700"
              disabled={task.completed || isLoading}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600"
              disabled={isLoading}
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Progress indicator for task completion */}
      {task.completed && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}
