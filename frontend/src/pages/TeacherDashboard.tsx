import { AppSidebar } from "@/components/shadcn/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/shadcn/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shadcn/sidebar"
import StatsCard from "@/components/dashboard/StatsCard"
import QuizTable from "@/components/dashboard/QuizTable"

export default function TeacherDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard 
              title="Total Quizzes"
              value={24}
              percentChange={12.5}
            />
            <StatsCard 
              title="Active Quizzes"
              value={18}
              percentChange={8.3}
            />
            <StatsCard 
              title="Inactive Quizzes"
              value={6}
              percentChange={-3.2}
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Quizzes</h2>
            <QuizTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
