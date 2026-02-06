'use client'

import { Calendar, Clock, TrendingUp, Award } from 'lucide-react'

interface Task {
  id: string
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  completedAt?: string
}

interface TaskStatsWidgetProps {
  tasks: Task[]
}

export default function TaskStatsWidget({ tasks }: TaskStatsWidgetProps) {
  const today = new Date().toDateString()
  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  const todayTasks = tasks.filter(task => 
    new Date(task.createdAt).toDateString() === today
  )
  
  const completedToday = tasks.filter(task => 
    task.completedAt && new Date(task.completedAt).toDateString() === today
  )
  
  const weeklyCompleted = tasks.filter(task => 
    task.completedAt && new Date(task.completedAt) >= thisWeek
  )
  
  const highPriorityPending = tasks.filter(task => 
    task.priority === 'HIGH' && task.status !== 'COMPLETED'
  )

  const stats = [
    {
      icon: Calendar,
      label: 'Created Today',
      value: todayTasks.length,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Award,
      label: 'Completed Today',
      value: completedToday.length,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: TrendingUp,
      label: 'Weekly Progress',
      value: weeklyCompleted.length,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Clock,
      label: 'High Priority',
      value: highPriorityPending.length,
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 hover:shadow-xl transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}