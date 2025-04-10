"use client"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Tab {
  id: string
  label: string
}

interface TabbedInterfaceProps {
  tabs: Tab[]
  activeTab: string
  setActiveTab: (id: string) => void
  className?: string
}

export default function TabbedInterface({ tabs, activeTab, setActiveTab, className }: TabbedInterfaceProps) {
  return (
    <div className={cn("w-full overflow-hidden") }>
      <div className="relative flex rounded-full bg-yellow-500 p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative z-10 flex-1 rounded-full py-2.5 text-center font-bold text-sm  transition-all",
                isActive ? "text-gray-800" : "text-gray-100",
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 z-[-1] rounded-full bg-white"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
