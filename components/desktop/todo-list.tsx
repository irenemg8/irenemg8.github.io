"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export function TodoList() {
  const { t } = useLanguage()
  const todoItems = t('about.todo.items')
  const [todos] = useState<TodoItem[]>(() => {
    if (Array.isArray(todoItems) && todoItems.length >= 8) {
      return [
        { id: '1', text: todoItems[0], completed: false },
        { id: '2', text: todoItems[1], completed: false },
        { id: '3', text: todoItems[2], completed: true },
        { id: '4', text: todoItems[3], completed: false },
        { id: '5', text: todoItems[4], completed: false },
        { id: '6', text: todoItems[5], completed: false },
        { id: '7', text: todoItems[6], completed: true },
        { id: '8', text: todoItems[7], completed: false }
      ];
    }
    // Fallback todo items
    return [
      { id: '1', text: 'Land my dream UX job', completed: false },
      { id: '2', text: 'Drink water', completed: false },
      { id: '3', text: 'Move to the US', completed: true },
      { id: '4', text: 'Finish grad school without losing my mind', completed: false },
      { id: '5', text: 'Build that banger spotify playlist', completed: false },
      { id: '6', text: 'World domination', completed: false },
      { id: '7', text: 'Get really good at making pasta', completed: true },
      { id: '8', text: 'Travel somewhere new every year', completed: false }
    ];
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="absolute top-8 left-8 z-20"
    >
      <div className="macos-glass rounded-lg p-4 shadow-lg border border-white/20 backdrop-blur-xl">
        <h3 className="macos-text-semibold text-gray-800 dark:text-gray-200 text-sm mb-3">
          {t('about.todo')}
        </h3>
        <div className="space-y-1">
          {todos.map((todo, index) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center space-x-2"
            >
              <div className={`text-xs macos-text leading-relaxed ${
                todo.completed 
                  ? 'line-through text-gray-400 dark:text-gray-500' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {todo.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}