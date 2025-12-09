"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, X, Divide, Minus, Plus, Delete, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

export function StockCalculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearEntry = () => {
    setDisplay("0")
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

  const calculate = (firstValue: number, secondValue: number, op: string): number => {
    switch (op) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0
      case "%":
        return (firstValue * secondValue) / 100
      default:
        return secondValue
    }
  }

  const calculateEquals = () => {
    const inputValue = parseFloat(display)

    if (operation && previousValue !== null) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const calculatePercentage = () => {
    const inputValue = parseFloat(display)
    if (previousValue !== null && operation) {
      const percent = (previousValue * inputValue) / 100
      setDisplay(String(percent))
    } else {
      setDisplay(String(inputValue / 100))
    }
    setWaitingForOperand(true)
  }

  const toggleSign = () => {
    const value = parseFloat(display)
    setDisplay(String(value * -1))
  }

  const ButtonCalc = ({ 
    children, 
    onClick, 
    variant = "default",
    className 
  }: { 
    children: React.ReactNode
    onClick: () => void
    variant?: "default" | "operator" | "equals" | "clear"
    className?: string
  }) => {
    const variantStyles = {
      default: "bg-secondary hover:bg-secondary/80 text-foreground",
      operator: "bg-primary hover:bg-primary/90 text-primary-foreground",
      equals: "bg-green-600 hover:bg-green-700 text-white",
      clear: "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
    }

    return (
      <Button
        onClick={onClick}
        className={cn(
          "h-14 text-lg font-semibold transition-all active:scale-95",
          variantStyles[variant],
          className
        )}
      >
        {children}
      </Button>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Hesap Makinesi</CardTitle>
        </div>
        <CardDescription>Stok hesaplamaları için hızlı hesaplama</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Display */}
        <div className="bg-muted rounded-lg p-4 min-h-16 flex items-center justify-end border-2 border-border">
          <div className="text-right">
            {operation && previousValue !== null && (
              <div className="text-xs text-muted-foreground mb-1">
                {previousValue} {operation}
              </div>
            )}
            <div className="text-3xl font-bold font-mono break-all">
              {parseFloat(display).toLocaleString('tr-TR', { 
                maximumFractionDigits: 8,
                useGrouping: true 
              })}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <ButtonCalc onClick={clear} variant="clear" className="col-span-2">
            <RotateCcw className="h-4 w-4 mr-2" />
            AC
          </ButtonCalc>
          <ButtonCalc onClick={clearEntry} variant="clear">
            <Delete className="h-4 w-4" />
          </ButtonCalc>
          <ButtonCalc onClick={() => performOperation("÷")} variant="operator">
            <Divide className="h-4 w-4" />
          </ButtonCalc>

          {/* Row 2 */}
          <ButtonCalc onClick={() => inputDigit("7")}>7</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit("8")}>8</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit("9")}>9</ButtonCalc>
          <ButtonCalc onClick={() => performOperation("×")} variant="operator">
            <X className="h-4 w-4" />
          </ButtonCalc>

          {/* Row 3 */}
          <ButtonCalc onClick={() => inputDigit("4")}>4</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit("5")}>5</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit("6")}>6</ButtonCalc>
          <ButtonCalc onClick={() => performOperation("-")} variant="operator">
            <Minus className="h-4 w-4" />
          </ButtonCalc>

          {/* Row 4 */}
          <ButtonCalc onClick={() => inputDigit("1")}>1</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit("2")}>2</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit("3")}>3</ButtonCalc>
          <ButtonCalc onClick={() => performOperation("+")} variant="operator">
            <Plus className="h-4 w-4" />
          </ButtonCalc>

          {/* Row 5 */}
          <ButtonCalc onClick={toggleSign}>±</ButtonCalc>
          <ButtonCalc onClick={() => inputDigit("0")}>0</ButtonCalc>
          <ButtonCalc onClick={inputDecimal}>,</ButtonCalc>
          <ButtonCalc onClick={calculateEquals} variant="equals">=</ButtonCalc>

          {/* Row 6 - Percentage */}
          <ButtonCalc onClick={calculatePercentage} className="col-span-4" variant="operator">
            % Yüzde
          </ButtonCalc>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Hızlı Hesaplamalar:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const value = parseFloat(display)
                if (!isNaN(value)) {
                  setDisplay(String(value * 1.18))
                  setWaitingForOperand(true)
                }
              }}
              className="text-xs"
            >
              +18% KDV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const value = parseFloat(display)
                if (!isNaN(value)) {
                  setDisplay(String(value / 1.18))
                  setWaitingForOperand(true)
                }
              }}
              className="text-xs"
            >
              -18% KDV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const value = parseFloat(display)
                if (!isNaN(value)) {
                  setDisplay(String(value * 1.20))
                  setWaitingForOperand(true)
                }
              }}
              className="text-xs"
            >
              +20% Kar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const value = parseFloat(display)
                if (!isNaN(value)) {
                  setDisplay(String(value * 0.80))
                  setWaitingForOperand(true)
                }
              }}
              className="text-xs"
            >
              -20% İndirim
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
