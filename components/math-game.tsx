"use client"

import React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Plus, Minus, X, Divide, Star, RotateCcw, Sparkles, Trophy, Check, XIcon } from "lucide-react"

type Operation = "+" | "-" | "*" | "/"
type Difficulty = "easy" | "medium" | "hard"

interface Question {
  num1: number
  num2: number
  operation: Operation
  answer: number
}

const OPERATIONS: { value: Operation; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "+", label: "Qo'shish", icon: <Plus className="w-6 h-6" />, color: "bg-[#FF6B6B] hover:bg-[#FF5252] text-white" },
  { value: "-", label: "Ayirish", icon: <Minus className="w-6 h-6" />, color: "bg-[#4ECDC4] hover:bg-[#3DB8B0] text-white" },
  { value: "*", label: "Ko'paytirish", icon: <X className="w-6 h-6" />, color: "bg-[#FFE66D] hover:bg-[#FFD93D] text-gray-800" },
  { value: "/", label: "Bo'lish", icon: <Divide className="w-6 h-6" />, color: "bg-[#95E1D3] hover:bg-[#7DD3C3] text-gray-800" },
]

const DIFFICULTIES: { value: Difficulty; label: string; range: [number, number] }[] = [
  { value: "easy", label: "Oson", range: [1, 10] },
  { value: "medium", label: "O'rta", range: [1, 50] },
  { value: "hard", label: "Qiyin", range: [1, 100] },
]

export default function MathGame() {
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [question, setQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null)
  const [stars, setStars] = useState<{ id: number; x: number; y: number }[]>([])
  const [totalQuestions, setTotalQuestions] = useState(0)

  const generateQuestion = useCallback((op: Operation, diff: Difficulty) => {
    const [min, max] = DIFFICULTIES.find(d => d.value === diff)!.range
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min
    let answer: number

    switch (op) {
      case "+":
        answer = num1 + num2
        break
      case "-":
        // Ensure num1 >= num2 for positive results
        if (num1 < num2) [num1, num2] = [num2, num1]
        answer = num1 - num2
        break
      case "*":
        // For multiplication, use smaller numbers
        num1 = Math.floor(Math.random() * Math.min(12, max - min + 1)) + min
        num2 = Math.floor(Math.random() * Math.min(12, max - min + 1)) + min
        answer = num1 * num2
        break
      case "/":
        // Generate division with whole number results
        num2 = Math.floor(Math.random() * Math.min(10, max - min + 1)) + 1
        answer = Math.floor(Math.random() * Math.min(10, max - min + 1)) + 1
        num1 = num2 * answer
        break
      default:
        answer = 0
    }

    setQuestion({ num1, num2, operation: op, answer })
    setUserAnswer("")
    setShowResult(null)
  }, [])

  const handleOperationSelect = (op: Operation) => {
    setSelectedOperation(op)
    generateQuestion(op, difficulty)
    setScore({ correct: 0, wrong: 0 })
    setTotalQuestions(0)
  }

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff)
    if (selectedOperation) {
      generateQuestion(selectedOperation, diff)
    }
  }

  const checkAnswer = () => {
    if (!question || userAnswer === "") return

    const isCorrect = parseInt(userAnswer) === question.answer
    setShowResult(isCorrect ? "correct" : "wrong")
    setTotalQuestions(prev => prev + 1)

    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }))
      // Add celebration stars
      const newStars = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }))
      setStars(prev => [...prev, ...newStars])
      setTimeout(() => {
        setStars(prev => prev.filter(s => !newStars.find(ns => ns.id === s.id)))
      }, 1500)
    } else {
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }))
    }
  }

  const nextQuestion = () => {
    if (selectedOperation) {
      generateQuestion(selectedOperation, difficulty)
    }
  }

  const restart = () => {
    setSelectedOperation(null)
    setQuestion(null)
    setUserAnswer("")
    setScore({ correct: 0, wrong: 0 })
    setShowResult(null)
    setTotalQuestions(0)
  }

  const progressPercentage = totalQuestions > 0 
    ? Math.min((score.correct / Math.max(totalQuestions, 1)) * 100, 100)
    : 0

  // Handle enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (showResult) {
          nextQuestion()
        } else if (userAnswer) {
          checkAnswer()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showResult, userAnswer])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute animate-bounce pointer-events-none z-50"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animation: "star-float 1.5s ease-out forwards",
          }}
        >
          <Star className="w-8 h-8 text-warning fill-warning" />
        </div>
      ))}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
           
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
              Matematika Mashq
            </h1>
           
          </div>
          <p className="text-xl text-muted-foreground font-medium">
            Arifmetikani tez va oson o&apos;rganing
          </p>
        </header>

        {/* Main Content */}
        {!selectedOperation ? (
          /* Operation Selection */
          <div className="space-y-8">
            {/* Difficulty Selector */}
            <Card className="p-6 shadow-lg border-2 border-border">
              <h2 className="text-xl font-bold text-center mb-4 text-card-foreground">Qiyinlik darajasi</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {DIFFICULTIES.map(diff => (
                  <Button
                    key={diff.value}
                    variant={difficulty === diff.value ? "default" : "outline"}
                    onClick={() => setDifficulty(diff.value)}
                    className={`text-lg px-6 py-3 rounded-xl font-semibold transition-all ${
                      difficulty === diff.value 
                        ? "ring-4 ring-primary/30 scale-105" 
                        : ""
                    }`}
                  >
                    {diff.label} ({diff.range[0]}-{diff.range[1]})
                  </Button>
                ))}
              </div>
            </Card>

            {/* Operations */}
            <Card className="p-6 shadow-lg border-2 border-border">
              <h2 className="text-xl font-bold text-center mb-6 text-card-foreground">Amalni tanlang</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {OPERATIONS.map(op => (
                  <Button
                    key={op.value}
                    onClick={() => handleOperationSelect(op.value)}
                    className={`${op.color} h-32 flex flex-col items-center justify-center gap-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 border-0`}
                  >
                    <div className="text-4xl font-bold">{op.icon}</div>
                    <span className="text-lg font-semibold">{op.label}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          /* Game Area */
          <div className="space-y-6">
            {/* Score and Progress */}
            <Card className="p-4 shadow-lg border-2 border-border">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-success/20 px-4 py-2 rounded-full">
                    <Check className="w-5 h-5 text-success" />
                    <span className="font-bold text-success">{score.correct}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-destructive/20 px-4 py-2 rounded-full">
                    <XIcon className="w-5 h-5 text-destructive" />
                    <span className="font-bold text-destructive">{score.wrong}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-warning" />
                  <span className="font-bold text-card-foreground">
                    {totalQuestions > 0 ? Math.round(progressPercentage) : 0}%
                  </span>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3 rounded-full" />
            </Card>

            {/* Difficulty Selector (compact) */}
            <div className="flex flex-wrap justify-center gap-2">
              {DIFFICULTIES.map(diff => (
                <Button
                  key={diff.value}
                  variant={difficulty === diff.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDifficultyChange(diff.value)}
                  className="rounded-full font-medium"
                >
                  {diff.label}
                </Button>
              ))}
            </div>

            {/* Question Card */}
            {question && (
              <Card className="p-8 shadow-xl border-2 border-border relative overflow-hidden">
                {/* Operation indicator */}
                <div className="absolute top-4 right-4">
                  {OPERATIONS.find(o => o.value === selectedOperation)?.icon}
                </div>

                {/* Question Display */}
                <div className="text-center mb-8">
                  <div className="text-6xl md:text-7xl font-extrabold text-card-foreground mb-6 flex items-center justify-center gap-4">
                    <span className="text-primary">{question.num1}</span>
                    <span className="text-muted-foreground">{question.operation}</span>
                    <span className="text-primary">{question.num2}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="text-accent">?</span>
                  </div>
                </div>

                {/* Answer Input */}
                <div className="max-w-xs mx-auto space-y-4">
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Javobingiz"
                    className="text-center text-3xl font-bold h-16 rounded-xl border-2 border-input focus:border-primary"
                    disabled={showResult !== null}
                    autoFocus
                  />

                  {/* Result Message */}
                  {showResult && (
                    <div
                      className={`p-4 rounded-xl text-center font-bold text-lg ${
                        showResult === "correct"
                          ? "bg-success/20 text-success"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {showResult === "correct" ? (
                        <div className="flex items-center justify-center gap-2">
                          <Star className="w-6 h-6 fill-current" />
                          <span>To&apos;g&apos;ri javob!</span>
                          <Star className="w-6 h-6 fill-current" />
                        </div>
                      ) : (
                        <div>
                          <span>Noto&apos;g&apos;ri</span>
                          <div className="text-base mt-1">
                            To&apos;g&apos;ri javob: <strong>{question.answer}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {!showResult ? (
                      <Button
                        onClick={checkAnswer}
                        disabled={userAnswer === ""}
                        className="flex-1 h-14 text-xl font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Tekshirish
                      </Button>
                    ) : (
                      <Button
                        onClick={nextQuestion}
                        className="flex-1 h-14 text-xl font-bold rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      >
                        Keyingi savol
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Restart Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={restart}
                className="text-lg px-8 py-3 rounded-xl font-semibold flex items-center gap-2 bg-transparent"
              >
                <RotateCcw className="w-5 h-5" />
                Qaytadan boshlash
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">Bolalar uchun matematika o&apos;yin sayti</p>
        </footer>
      </div>

      {/* Global styles for star animation */}
      <style jsx global>{`
        @keyframes star-float {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(0.5) rotate(180deg);
          }
        }
      `}</style>
    </div>
  )
}
