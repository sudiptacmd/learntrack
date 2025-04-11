"use client"

import { useState } from "react"
import TaskItem from "./task-item"

export default function TaskList({ tasks }) {
  const [taskList, setTaskList] = useState(tasks)

  const handleTaskComplete = (taskId) => {
    setTaskList(taskList.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleTaskDelete = (taskId) => {
    setTaskList(taskList.filter((task) => task.id !== taskId))
  }

  if (taskList.length === 0) {
    return <p className="text-gray-500">No tasks found.</p>
  }

  return (
    <div className="space-y-3">
      {taskList.map((task) => (
        <TaskItem key={task.id} task={task} onComplete={handleTaskComplete} onDelete={handleTaskDelete} />
      ))}
    </div>
  )
}
