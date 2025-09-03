"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Bot, Sparkles, Zap } from "lucide-react"
import { BorderBeam } from "@/components/ui/border-beam"

interface LoadingAnimationProps {
  isVisible: boolean
  onComplete?: () => void
  duration?: number
}

export function LoadingAnimation({ 
  isVisible, 
  onComplete, 
  duration = 3000 
}: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { label: "Initializing AI Systems", icon: Bot },
    { label: "Loading Dashboard Components", icon: Sparkles },
    { label: "Synchronizing Data Streams", icon: Zap },
    { label: "Ready for Command", icon: Bot }
  ]

  useEffect(() => {
    if (!isVisible) return

    const progressInterval = 50

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / progressInterval))
        
        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length)
        const safeStepIndex = Math.max(0, Math.min(stepIndex, steps.length - 1))
        setCurrentStep(safeStepIndex)
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete?.(), 500)
          return 100
        }
        
        return newProgress
      })
    }, progressInterval)

    return () => clearInterval(interval)
  }, [isVisible, duration, onComplete, steps.length])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Main Loading Card */}
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 overflow-hidden"
          >
            <BorderBeam duration={3} size={120} colorFrom="#ebde10" colorTo="#f5ed6b" />
            
            {/* Logo and Title */}
            <motion.div 
              className="text-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                SNR AI Automation
              </h1>
              <p className="text-slate-400">
                Executive Command Center
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>0%</span>
                <span className="text-slate-300">{Math.round(progress)}%</span>
                <span>100%</span>
              </div>
            </motion.div>

            {/* Current Step */}
            <motion.div 
              className="text-center"
              key={currentStep}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center gap-3 text-slate-300">
                {(() => {
                  const step = steps[currentStep]
                  const StepIcon = step?.icon || Bot
                  return <StepIcon className="w-5 h-5 animate-pulse" />
                })()}
                <span className="font-medium">
                  {steps[currentStep]?.label || "Loading..."}
                </span>
              </div>
            </motion.div>

            {/* Loading Dots */}
            <motion.div 
              className="flex justify-center mt-6 gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface DashboardEntranceProps {
  children: React.ReactNode
  isVisible: boolean
}

export function DashboardEntrance({ children, isVisible }: DashboardEntranceProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            staggerChildren: 0.1
          }}
          className="w-full h-full"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Individual component entrance animations
export const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 1.02,
    transition: { duration: 0.3 }
  }
}

export const cardVariants = {
  initial: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}
