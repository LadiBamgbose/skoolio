import { Outlet, useLocation } from 'react-router-dom'
import { AppSidebar } from "@/components/shadcn/app-sidebar"
import QuizCreationSidebar from "@/components/quizCreation/QuizCreationSidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/shadcn/sidebar"

export default function DashboardLayout() {
  const location = useLocation()
  const isQuizPage = location.pathname === '/teacher/quiz'

  return (
    <div className="h-screen overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        {/* Conditionally render Quiz Creation Sidebar */}
        {isQuizPage && <QuizCreationSidebar />}
        <SidebarInset className="p-0 overflow-hidden">
          {/* This is where child routes will render */}
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}


