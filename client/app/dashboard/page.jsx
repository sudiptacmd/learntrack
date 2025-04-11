import { getTasksByUserId, getEnrolledCourses } from "@/lib/data"
import Link from "next/link"
import TaskList from "@/components/task-list"
import CourseList from "@/components/course-list"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export default function DashboardPage() {
  // In a real app, we would get the userId from the session
  const userId = 1
  const tasks = getTasksByUserId(userId)
  const enrolledCourses = getEnrolledCourses(userId)

  // Get only incomplete tasks
  const incompleteTasks = tasks.filter((task) => !task.completed)

  // Get tasks due soon (within 7 days)
  const today = new Date()
  const sevenDaysLater = new Date(today)
  sevenDaysLater.setDate(today.getDate() + 7)

  const tasksDueSoon = incompleteTasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    return dueDate <= sevenDaysLater
  })

  // Calculate completion data for pie chart
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.length - completedTasks

  const completionData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: pendingTasks },
  ]

  // Colors for the pie chart
  const COLORS = ["#10B981", "#F59E0B"]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-purple-50">
          <h3 className="text-lg font-semibold mb-2">Tasks</h3>
          <p className="text-3xl font-bold text-purple-600">{tasks.length}</p>
          <p className="text-sm text-gray-600 mt-1">{tasks.filter((task) => task.completed).length} completed</p>
        </div>

        <div className="card bg-blue-50">
          <h3 className="text-lg font-semibold mb-2">Enrolled Courses</h3>
          <p className="text-3xl font-bold text-blue-600">{enrolledCourses.length}</p>
          <p className="text-sm text-gray-600 mt-1">Continue learning</p>
        </div>

        <div className="card bg-yellow-50">
          <h3 className="text-lg font-semibold mb-2">Due Soon</h3>
          <p className="text-3xl font-bold text-yellow-600">{tasksDueSoon.length}</p>
          <p className="text-sm text-gray-600 mt-1">Tasks due in the next 7 days</p>
        </div>
      </div>

      {/* Task Completion Chart */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Task Completion</h2>
          <Link href="/tasks" className="text-purple-600 hover:text-purple-800">
            View All Tasks
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
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
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Completed Tasks</p>
                <p className="text-sm text-gray-600">
                  {completedTasks} tasks ({tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">Pending Tasks</p>
                <p className="text-sm text-gray-600">
                  {pendingTasks} tasks ({tasks.length > 0 ? Math.round((pendingTasks / tasks.length) * 100) : 0}%)
                </p>
              </div>
            </div>
            <div className="pt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{
                    width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Overall progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Due Soon */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tasks Due Soon</h2>
          <Link href="/tasks" className="text-purple-600 hover:text-purple-800">
            View All Tasks
          </Link>
        </div>

        <TaskList tasks={tasksDueSoon.slice(0, 3)} />

        {tasksDueSoon.length === 0 && <p className="text-gray-500">No tasks due soon.</p>}
      </div>

      {/* Enrolled Courses */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Courses</h2>
          <Link href="/courses" className="text-purple-600 hover:text-purple-800">
            Browse More Courses
          </Link>
        </div>

        <CourseList courses={enrolledCourses} />

        {enrolledCourses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
            <Link href="/courses" className="btn-primary">
              Explore Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
