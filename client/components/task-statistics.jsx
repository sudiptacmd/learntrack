"use client"

import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function TaskStatistics({ tasks }) {
  const [completionData, setCompletionData] = useState([])
  const [priorityData, setPriorityData] = useState([])

  useEffect(() => {
    // Calculate completion data for pie chart
    const completedTasks = tasks.filter((task) => task.completed).length
    const pendingTasks = tasks.length - completedTasks

    setCompletionData([
      { name: "Completed", value: completedTasks },
      { name: "Pending", value: pendingTasks },
    ])

    // Calculate priority data for bar chart
    const highPriorityTasks = tasks.filter((task) => task.priority === "high")
    const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium")
    const lowPriorityTasks = tasks.filter((task) => task.priority === "low")

    const highCompleted = highPriorityTasks.filter((task) => task.completed).length
    const mediumCompleted = mediumPriorityTasks.filter((task) => task.completed).length
    const lowCompleted = lowPriorityTasks.filter((task) => task.completed).length

    setPriorityData([
      {
        name: "High",
        completed: highCompleted,
        total: highPriorityTasks.length,
        pending: highPriorityTasks.length - highCompleted,
      },
      {
        name: "Medium",
        completed: mediumCompleted,
        total: mediumPriorityTasks.length,
        pending: mediumPriorityTasks.length - mediumCompleted,
      },
      {
        name: "Low",
        completed: lowCompleted,
        total: lowPriorityTasks.length,
        pending: lowPriorityTasks.length - lowCompleted,
      },
    ])
  }, [tasks])

  // Colors for the pie chart
  const COLORS = ["#10B981", "#F59E0B"]

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-semibold">{`${data.name} Priority`}</p>
          <p className="text-green-600">{`Completed: ${data.completed}`}</p>
          <p className="text-yellow-600">{`Pending: ${data.pending}`}</p>
          <p>{`Total: ${data.total}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Task Completion Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart for Task Completion */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Completion Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart for Priority Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#10B981" />
                <Bar dataKey="pending" name="Pending" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Completion Progress</h3>
        <div className="space-y-6">
          {priorityData.map((priority) => (
            <div key={priority.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{priority.name} Priority Tasks</span>
                <span className="text-sm font-semibold">
                  {priority.completed} / {priority.total} (
                  {priority.total > 0 ? Math.round((priority.completed / priority.total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    priority.name === "High"
                      ? "bg-red-600"
                      : priority.name === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{
                    width: `${priority.total > 0 ? (priority.completed / priority.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}

          {/* Overall Progress */}
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Overall Completion</span>
              <span className="text-sm font-semibold">
                {completionData[0]?.value || 0} / {(completionData[0]?.value || 0) + (completionData[1]?.value || 0)} (
                {completionData.length > 0 && completionData[0]?.value + completionData[1]?.value > 0
                  ? Math.round((completionData[0]?.value / (completionData[0]?.value + completionData[1]?.value)) * 100)
                  : 0}
                %)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    completionData.length > 0 && completionData[0]?.value + completionData[1]?.value > 0
                      ? (completionData[0]?.value / (completionData[0]?.value + completionData[1]?.value)) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
