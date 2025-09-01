"use client"

import { useState } from 'react'
import { X } from 'lucide-react'

interface CalculatorWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function CalculatorWindow({ isOpen, onClose }: CalculatorWindowProps) {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)


  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const percentage = () => {
    const value = parseFloat(display) / 100
    setDisplay(String(value))
  }

  const toggleSign = () => {
    const value = parseFloat(display)
    setDisplay(String(-value))
  }

  const sqrt = () => {
    const value = parseFloat(display)
    if (value >= 0) {
      const result = Math.sqrt(value)
      setDisplay(String(result))
    }
  }

  const square = () => {
    const value = parseFloat(display)
    const result = value * value
    setDisplay(String(result))
  }

  const Button = ({ 
    onClick, 
    className = '', 
    children, 
    variant = 'default' 
  }: { 
    onClick: () => void
    className?: string
    children: React.ReactNode
    variant?: 'default' | 'operator' | 'number' | 'special'
  }) => {
    const baseStyle = "w-16 h-16 text-xl font-normal rounded-full transition-all duration-150 active:scale-95 flex items-center justify-center"
    
    const variants = {
      default: "bg-gray-600 hover:bg-gray-500 text-white",
      operator: "bg-orange-500 hover:bg-orange-400 text-white",
      number: "bg-gray-600 hover:bg-gray-500 text-white", 
      special: "bg-gray-500 hover:bg-gray-400 text-black"
    }

    return (
      <button
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-80 h-[600px] bg-black rounded-2xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-800 bg-black">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-sm"
                title="Cerrar"
              />
              <div className="w-3 h-3 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-sm transition-colors" />
              <div className="w-3 h-3 bg-green-400 hover:bg-green-500 rounded-full shadow-sm transition-colors" />
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <h2 className="text-lg font-medium text-white">Calculator</h2>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Display */}
        <div className="p-6 bg-black flex-1 flex items-end">
          <div className="text-right text-white w-full">
            {/* Display principal */}
            <div className="text-6xl font-light tracking-wide leading-none mb-4">
              {display}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-6 bg-black">
          <div className="grid grid-cols-4 gap-4 justify-items-center">
            {/* Fila 1 */}
            <Button onClick={clear} variant="special">AC</Button>
            <Button onClick={toggleSign} variant="special">+/-</Button>
            <Button onClick={percentage} variant="special">%</Button>
            <Button onClick={() => performOperation('÷')} variant="operator">÷</Button>

            {/* Fila 2 */}
            <Button onClick={() => inputNumber('7')} variant="number">7</Button>
            <Button onClick={() => inputNumber('8')} variant="number">8</Button>
            <Button onClick={() => inputNumber('9')} variant="number">9</Button>
            <Button onClick={() => performOperation('×')} variant="operator">×</Button>

            {/* Fila 3 */}
            <Button onClick={() => inputNumber('4')} variant="number">4</Button>
            <Button onClick={() => inputNumber('5')} variant="number">5</Button>
            <Button onClick={() => inputNumber('6')} variant="number">6</Button>
            <Button onClick={() => performOperation('-')} variant="operator">−</Button>

            {/* Fila 4 */}
            <Button onClick={() => inputNumber('1')} variant="number">1</Button>
            <Button onClick={() => inputNumber('2')} variant="number">2</Button>
            <Button onClick={() => inputNumber('3')} variant="number">3</Button>
            <Button onClick={() => performOperation('+')} variant="operator">+</Button>

            {/* Fila 5 */}
            <Button onClick={() => inputNumber('0')} variant="number" className="col-span-2 w-36 justify-start pl-6">0</Button>
            <Button onClick={inputDecimal} variant="number">.</Button>
            <Button onClick={() => performOperation('=')} variant="operator">=</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
