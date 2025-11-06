import React from 'react'

const SummaryCard = ({Icon, text, number, color = 'blue', fullColor = false}) => {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-600',
    green: 'border-green-500 bg-green-600',
    purple: 'border-purple-500 bg-purple-600',
    orange: 'border-orange-500 bg-orange-600',
    amber: 'border-amber-500 bg-amber-600',
    red: 'border-red-500 bg-red-600'
  }

  const fullColorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    amber: 'bg-amber-600',
    red: 'bg-red-600'
  }

  return (
    <div className={`rounded-lg shadow-md p-4 sm:p-6 border-l-4 ${fullColor ? fullColorClasses[color] : `bg-white ${colorClasses[color]}`} hover:shadow-[0_4px_8px_rgba(255,0,255,0.2),0_8px_16px_rgba(0,255,255,0.15)] hover:transform hover:scale-105 hover:-translate-y-0.5 hover:backdrop-blur-sm transition-all duration-300 cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`text-xs sm:text-sm font-medium mb-1 truncate ${fullColor ? 'text-white/80' : 'text-gray-600'}`}>{text}</p>
          <p className={`text-xl sm:text-2xl font-bold ${fullColor ? 'text-white' : 'text-gray-800'}`}>{number}</p>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${fullColor ? 'bg-white/20' : colorClasses[color]} rounded-lg flex items-center justify-center opacity-100 flex-shrink-0 ml-3`}>
          {React.cloneElement(Icon, { className: 'w-5 h-5 sm:w-6 sm:h-6 text-white' })}
        </div>
      </div>
    </div>
  )
}

export default SummaryCard
