import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { AppSidebar } from "@/components/shadcn/app-sidebar"
import QuizCreationSidebar from "@/components/quizCreation/QuizCreationSidebar"
import UpgradeModal from "@/components/shared/UpgradeModal"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/shadcn/sidebar"
import { QuizCreationProvider } from "@/contexts/QuizCreationContext"

const DEFAULT_QUIZ_SIDEBAR_WIDTH = 400

export default function DashboardLayout() {
  const location = useLocation()
  const isQuizPage = location.pathname === '/teacher/quiz'
  const [quizSidebarWidth, setQuizSidebarWidth] = useState(DEFAULT_QUIZ_SIDEBAR_WIDTH)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  return (
    <div className="h-screen overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        {/* Conditionally render Quiz Creation Sidebar */}
        {isQuizPage ? (
          <QuizCreationProvider>
            <QuizCreationSidebar 
              width={quizSidebarWidth} 
              setWidth={setQuizSidebarWidth}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />
            <SidebarInset 
              className="p-0 overflow-hidden h-screen" 
              style={{ marginLeft: `${quizSidebarWidth}px` }}
            >
              {/* This is where child routes will render */}
              <Outlet />
            </SidebarInset>
          </QuizCreationProvider>
        ) : (
          <SidebarInset className="p-0 overflow-hidden h-screen">
            {/* This is where child routes will render */}
            <Outlet />
          </SidebarInset>
        )}
      </SidebarProvider>

      {/* Upgrade Modal - rendered at top level to cover entire screen */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  )
}


