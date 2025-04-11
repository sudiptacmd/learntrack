"use client"

import { useState } from "react"
import { CheckCircle, Circle, Trash, Edit, Calendar, Clock } from "lucide-react"

export default function TaskItem({ task, onComplete, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDescription, setEditedDescription] = useState(task.description)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    // In a real app, this would update the task in the database
    task.title = editedTitle
    task.description = editedDescription
    setIsEditing(false)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div
      className={`card border-l-4 ${
        task.priority === "high"
          ? "border-l-red-500"
          : task.priority === "medium"
            ? "border-l-yellow-500"
            : "border-l-green-500"
      } ${task.completed ? "bg-gray-50" : ""} transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-grow">
          <button onClick={() => onComplete(task.id)} className="mt-1">
            {task.completed ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <Circle className="h-6 w-6 text-gray-400" />
            )}
          </button>

          <div className="flex-grow">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="form-input"
                />
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="form-input"
                  rows="2"
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setIsEditing(false)} className="btn-secondary py-1 px-3 text-sm">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn-primary py-1 px-3 text-sm">
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <h3 className={`font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>
                    {task.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {task.completed && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Completed</span>
                  )}
                </div>
                <p className={`text-sm text-gray-600 ${task.completed ? "line-through" : ""}`}>{task.description}</p>
                <div className="flex items-center mt-2 text-sm space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{task.dueDate}</span>
                  </div>
                  <div className={`flex items-center ${getPriorityColor(task.priority)}`}>
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="capitalize">{task.priority} Priority</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex space-x-2">
            <button onClick={handleEdit} className="text-gray-500 hover:text-purple-600">
              <Edit className="h-5 w-5" />
            </button>
            <button onClick={() => onDelete(task.id)} className="text-gray-500 hover:text-red-600">
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
  )
}
