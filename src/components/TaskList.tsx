'use client'

import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, Trash2, Edit, Calendar } from 'lucide-react'

interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  completedAt?: string
}

interface TaskListProps {
  tasks: Task[]
  onTaskUpdated: () => void
}

export default function TaskList({ tasks, onTaskUpdated }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      onTaskUpdated()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      onTaskUpdated()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const updateTaskTitle = async (taskId: string) => {
    if (!editTitle.trim()) return
    
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle })
      })
      setEditingTask(null)
      setEditTitle('')
      onTaskUpdated()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800'
      case 'MEDIUM': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
      case 'LOW': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      case 'IN_PROGRESS': return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case 'TODO': return <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      default: return null
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-800 p-8 rounded-xl shadow-lg text-center border border-gray-100 dark:border-dark-700">
        <div className="animate-bounce-subtle">
          <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">No tasks yet. Create your first task to get started!</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Click the "Add Task" button above to begin your productivity journey.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div 
          key={task.id} 
          className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-dark-700 animate-slide-up group"
          style={{animationDelay: `${index * 0.1}s`}}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="mt-1">
                {getStatusIcon(task.status)}
              </div>
              <div className="flex-1">
                {editingTask === task.id ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      onKeyPress={(e) => e.key === 'Enter' && updateTaskTitle(task.id)}
                    />
                    <button
                      onClick={() => updateTaskTitle(task.id)}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="px-4 py-2 bg-gray-300 dark:bg-dark-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-400 dark:hover:bg-dark-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h3 className={`font-semibold text-lg transition-all duration-200 ${
                    task.status === 'COMPLETED' 
                      ? 'line-through text-gray-500 dark:text-gray-400' 
                      : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}>
                    {task.title}
                  </h3>
                )}
                
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  {task.completedAt && (
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Completed: {new Date(task.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => {
                  setEditingTask(task.id)
                  setEditTitle(task.title)
                }}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                title="Edit task"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                className="text-sm border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}