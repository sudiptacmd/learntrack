import { getTasksByUserId } from "@/lib/data"
import TaskList from "@/components/task-list"
import CreateTaskForm from "@/components/create-task-form"
import TaskStatistics from "@/components/task-statistics"

export default function TasksPage() {
  // In a real app, we would get the userId from the session
  const userId = 1
  const tasks = getTasksByUserId(userId)

  // Calculate task statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks

  // Group tasks by priority
  const highPriorityTasks = tasks.filter((task) => task.priority === "high")
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium")
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low")

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Task Management</h1>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-purple-50">
          <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold text-purple-600">{totalTasks}</p>
        </div>

        <div className="card bg-green-50">
          <h3 className="text-lg font-semibold mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
        </div>

        <div className="card bg-yellow-50">
          <h3 className="text-lg font-semibold mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingTasks}</p>
        </div>

        <div className="card bg-red-50">
          <h3 className="text-lg font-semibold mb-2">High Priority</h3>
          <p className="text-3xl font-bold text-red-600">{highPriorityTasks.length}</p>
        </div>
      </div>

      {/* Graphical Task Statistics */}
      <TaskStatistics tasks={tasks} />

      {/* Create Task Form */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <CreateTaskForm userId={userId} />
      </div>

      {/* Task Lists */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">High Priority Tasks</h2>
          <TaskList tasks={highPriorityTasks} />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Medium Priority Tasks</h2>
          <TaskList tasks={mediumPriorityTasks} />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Low Priority Tasks</h2>
          <TaskList tasks={lowPriorityTasks} />
        </div>
      </div>
    </div>
  )
}
