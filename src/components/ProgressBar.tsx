'use client'

interface ProgressBarProps {
  completed: number
  inProgress: number
  total: number
}

export default function ProgressBar({ completed, inProgress, total }: ProgressBarProps) {
  if (total === 0) return null

  const completedPercent = (completed / total) * 100
  const inProgressPercent = (inProgress / total) * 100

  return (
    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3 overflow-hidden">
      <div className="h-full flex">
        <div 
          className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000 ease-out"
          style={{ width: `${completedPercent}%` }}
        />
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
          style={{ width: `${inProgressPercent}%` }}
        />
      </div>
    </div>
  )
}