'use client'

import { useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import { TrendingUp, Target, Clock, Award } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface Task {
  id: string
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  completedAt?: string
}

interface AnalyticsProps {
  tasks: Task[]
}

export default function Analytics({ tasks }: AnalyticsProps) {
  // Status distribution data with dark mode colors
  const statusData = {
    labels: ['To Do', 'In Progress', 'Completed'],
    datasets: [{
      data: [
        tasks.filter(t => t.status === 'TODO').length,
        tasks.filter(t => t.status === 'IN_PROGRESS').length,
        tasks.filter(t => t.status === 'COMPLETED').length
      ],
      backgroundColor: ['#FEF3C7', '#DBEAFE', '#D1FAE5'],
      borderColor: ['#F59E0B', '#3B82F6', '#10B981'],
      borderWidth: 2
    }]
  }

  // Priority distribution data
  const priorityData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      data: [
        tasks.filter(t => t.priority === 'LOW').length,
        tasks.filter(t => t.priority === 'MEDIUM').length,
        tasks.filter(t => t.priority === 'HIGH').length
      ],
      backgroundColor: ['#D1FAE5', '#FEF3C7', '#FEE2E2'],
      borderColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 2
    }]
  }

  // Daily completion trend (last 7 days)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  })

  const dailyCompletions = last7Days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    return tasks.filter(task => 
      task.completedAt && 
      format(new Date(task.completedAt), 'yyyy-MM-dd') === dayStr
    ).length
  })

  const trendData = {
    labels: last7Days.map(day => format(day, 'MMM dd')),
    datasets: [{
      label: 'Tasks Completed',
      data: dailyCompletions,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.8)'
        }
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.8)'
        }
      }
    }
  }

  // Calculate productivity metrics
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED')
  const totalTasks = tasks.length
  
  const avgCompletionTime = completedTasks.length > 0 
    ? completedTasks.reduce((acc, task) => {
        if (task.completedAt) {
          const created = new Date(task.createdAt)
          const completed = new Date(task.completedAt)
          return acc + (completed.getTime() - created.getTime())
        }
        return acc
      }, 0) / completedTasks.length / (1000 * 60 * 60 * 24) // Convert to days
    : 0

  const weeklyCompletions = dailyCompletions.reduce((a, b) => a + b, 0)
  const mostProductiveDay = dailyCompletions.length > 0 
    ? last7Days[dailyCompletions.indexOf(Math.max(...dailyCompletions))]
    : null

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTasks}</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Total Tasks</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">All tasks in your workspace</p>
        </div>
        
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {completedTasks.length > 0 
                  ? Math.round(completedTasks.reduce((acc, task) => {
                      if (task.completedAt) {
                        const created = new Date(task.createdAt)
                        const completed = new Date(task.completedAt)
                        return acc + (completed.getTime() - created.getTime())
                      }
                      return acc
                    }, 0) / completedTasks.length / (1000 * 60 * 60 * 24))
                  : 0
                }
              </p>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Avg. Days</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Average completion time</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Task Status Distribution
          </h3>
          <div className="h-64 relative">
            <Doughnut data={statusData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Priority Distribution
          </h3>
          <div className="h-64 relative">
            <Doughnut data={priorityData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Daily Completion Trend (Last 7 Days)
        </h3>
        <div className="h-64 relative">
          <Bar data={trendData} options={chartOptions} />
        </div>
      </div>

      {/* Enhanced Insights */}
      <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          Task Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Most Productive Day</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {mostProductiveDay 
                ? format(mostProductiveDay, 'EEEE, MMM dd')
                : 'No data available'
              }
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">High Priority Tasks</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              {tasks.filter(t => t.priority === 'HIGH' && t.status !== 'COMPLETED').length} remaining
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Productivity Score</h4>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              {totalTasks > 0 ? Math.round((weeklyCompletions / totalTasks) * 100) : 0}% this week
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}