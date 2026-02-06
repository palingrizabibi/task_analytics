'use client'

import { useState, useEffect } from 'react'
import { Plus, BarChart3, CheckCircle, Clock, AlertCircle, TrendingUp, Zap, Target } from 'lucide-react'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'
import Analytics from '@/components/Analytics'
import ThemeToggle from '@/components/ThemeToggle'
import ProgressBar from '@/components/ProgressBar'
import SearchFilter from '@/components/SearchFilter'
import TaskStatsWidget from '@/components/TaskStatsWidget'

interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  completedAt?: string
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'tasks' | 'analytics'>('tasks')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to fetch tasks')
      }
      const data = await response.json()
      const taskArray = Array.isArray(data) ? data : []
      setTasks(taskArray)
      setFilteredTasks(taskArray)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = () => {
    setShowForm(false)
    fetchTasks()
  }

  const handleTaskUpdated = () => {
    fetchTasks()
  }

  // Search and filter functions
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTasks(tasks)
      return
    }
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredTasks(filtered)
  }

  const handleFilter = (status: string, priority: string) => {
    let filtered = tasks
    
    if (status !== 'ALL') {
      filtered = filtered.filter(task => task.status === status)
    }
    
    if (priority !== 'ALL') {
      filtered = filtered.filter(task => task.priority === priority)
    }
    
    setFilteredTasks(filtered)
  }

  const handleClearFilters = () => {
    setFilteredTasks(tasks)
  }

  const stats = {
    total: Array.isArray(tasks) ? tasks.length : 0,
    completed: Array.isArray(tasks) ? tasks.filter(t => t.status === 'COMPLETED').length : 0,
    inProgress: Array.isArray(tasks) ? tasks.filter(t => t.status === 'IN_PROGRESS').length : 0,
    todo: Array.isArray(tasks) ? tasks.filter(t => t.status === 'TODO').length : 0
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  // Enhanced progress calculation
  const progressData = {
    completed: stats.completed,
    inProgress: stats.inProgress,
    todo: stats.todo,
    total: stats.total
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <header className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              Task Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Track and analyze your productivity with style</p>
          </div>
          <ThemeToggle />
        </div>
        
        {/* Progress Overview */}
        {stats.total > 0 && (
          <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</h3>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Remaining</span>
                </div>
              </div>
            </div>
            <ProgressBar completed={stats.completed} inProgress={stats.inProgress} total={stats.total} />
            <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{stats.completed} completed</span>
              <span>{stats.inProgress} in progress</span>
              <span>{stats.todo} remaining</span>
            </div>
          </div>
        )}
      </header>

      {/* Task Stats Widget */}
      <TaskStatsWidget tasks={Array.isArray(tasks) ? tasks : []} />

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-dark-700 animate-slide-up group">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">✓</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-dark-700 animate-slide-up group" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-dark-700 animate-slide-up group" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">#</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-dark-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'tasks'
                ? 'bg-white dark:bg-dark-700 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-dark-700 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-700 dark:text-green-300">
              {stats.completed} Completed
            </span>
          </div>
          {stats.inProgress > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-700 dark:text-blue-300">
                {stats.inProgress} Active
              </span>
            </div>
          )}
          {filteredTasks.length !== tasks.length && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Target className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium text-yellow-700 dark:text-yellow-300">
                {filteredTasks.length} Filtered
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tasks</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          </div>
          
          {showForm && (
            <div className="animate-slide-up">
              <TaskForm
                onTaskCreated={handleTaskCreated}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
          
          {/* Search and Filter */}
          <SearchFilter 
            onSearch={handleSearch}
            onFilter={handleFilter}
            onClear={handleClearFilters}
          />
          
          <TaskList tasks={Array.isArray(filteredTasks) ? filteredTasks : []} onTaskUpdated={handleTaskUpdated} />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="animate-fade-in">
          <Analytics tasks={Array.isArray(tasks) ? tasks : []} />
        </div>
      )}
    </div>
  )
}