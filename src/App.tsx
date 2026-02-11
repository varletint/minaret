import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { PublicLayout, AuthLayout, DashboardLayout } from "@/layouts";
import { HomePage } from "@/pages/Home";
import {
  LoginPage,
  RegisterPage,
  StationsPage,
  MosqueDetailPage,
  DonatePage,
} from "@/pages";
import {
  DashboardPage,
  StationSetupPage,
  SettingsPage,
  BroadcastPage,
  ShowsPage,
  ShowFormPage,
} from "@/pages/dashboard";
import { useAuth } from "@/hooks/useAuth";
import { usePageTracking } from "@/hooks/usePageTracking";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

/**
 * Protected route wrapper - redirects to login if not authenticated
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
}

/**
 * Guest route wrapper - redirects to dashboard if already authenticated
 */
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500' />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
}

/**
 * App Router
 */
function AppRouter() {
  usePageTracking();

  return (
    <Routes>
      {/* Public routes with footer */}
      <Route element={<PublicLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/mosques' element={<StationsPage />} />
        <Route path='/mosques/:id' element={<MosqueDetailPage />} />
        <Route path='/donate' element={<DonatePage />} />
      </Route>

      {/* Auth routes - centered, no footer */}
      <Route element={<AuthLayout />}>
        <Route
          path='/login'
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path='/register'
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
      </Route>

      {/* Dashboard routes - protected */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/dashboard/station/setup' element={<StationSetupPage />} />
        <Route path='/dashboard/settings' element={<SettingsPage />} />
        <Route path='/dashboard/broadcast' element={<BroadcastPage />} />
        <Route path='/dashboard/shows' element={<ShowsPage />} />
        <Route path='/dashboard/shows/new' element={<ShowFormPage />} />
        <Route path='/dashboard/shows/:_id/edit' element={<ShowFormPage />} />
      </Route>

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='dark' storageKey='minaret-theme'>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
        <Toaster
          position='top-right'
          theme='system'
          toastOptions={{
            classNames: {
              toast:
                "bg-card/95 backdrop-blur-md border border-border shadow-lg",
              error:
                "!bg-destructive/10 !text-destructive backdrop-blur-md border !border-destructive/50",
              success:
                "!bg-primary/10 !text-primary backdrop-blur-md border !border-primary/50",
              warning:
                "!bg-accent/10 !text-accent backdrop-blur-md border !border-accent/50",
              info: "!bg-[#3B82F6]/10 !text-[#3B82F6] backdrop-blur-md border !border-[#3B82F6]/50",
              description: "!text-muted-foreground",
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
