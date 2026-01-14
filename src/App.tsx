import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Eager load the homepage for fast initial render
import Index from "./pages/Index";

// Lazy load other pages for better performance
const GetHelp = lazy(() => import("./pages/GetHelp"));
const SupportMission = lazy(() => import("./pages/SupportMission"));
const Events = lazy(() => import("./pages/Events"));
const JoinCommunity = lazy(() => import("./pages/JoinCommunity"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/20" />
      <div className="h-4 w-24 bg-muted rounded" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/get-help" element={<GetHelp />} />
            <Route path="/support" element={<SupportMission />} />
            <Route path="/events" element={<Events />} />
            <Route path="/join" element={<JoinCommunity />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
