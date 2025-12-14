import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PollProvider } from "@/context/PollContext";
import Index from "./pages/Index";
import StudentName from "./pages/student/StudentName";
import StudentWait from "./pages/student/StudentWait";
import StudentPoll from "./pages/student/StudentPoll";
import StudentResults from "./pages/student/StudentResults";
import StudentKicked from "./pages/student/StudentKicked";
import TeacherCreate from "./pages/teacher/TeacherCreate";
import TeacherLive from "./pages/teacher/TeacherLive";
import TeacherHistory from "./pages/teacher/TeacherHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PollProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student/name" element={<StudentName />} />
            <Route path="/student/wait" element={<StudentWait />} />
            <Route path="/student/poll" element={<StudentPoll />} />
            <Route path="/student/results" element={<StudentResults />} />
            <Route path="/student/kicked" element={<StudentKicked />} />
            <Route path="/teacher/create" element={<TeacherCreate />} />
            <Route path="/teacher/live" element={<TeacherLive />} />
            <Route path="/teacher/history" element={<TeacherHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PollProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
