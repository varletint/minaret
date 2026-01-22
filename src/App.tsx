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
  return (
    <Routes>
      {/* Public routes with footer */}
      <Route element={<PublicLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/mosques' element={<StationsPage />} />
        <Route path='/mosques/:id' element={<MosqueDetailPage />} />
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
        <Route path='/dashboard/shows/:id/edit' element={<ShowFormPage />} />
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
          // richColors
          // closeButton
          theme='system'
          toastOptions={{
            classNames: {
              error:
                "!bg-red-200/50 !text-red-600 bg-background80 backdrop-blur-md border !border-red-600  border-border",
              success:
                "!bg-green-200/50 !text-green-600 bg-background80 backdrop-blur-md border !border-green-600  border-border",
              warning:
                "!bg-yellow-200/50 !text-yellow-600 bg-background80 backdrop-blur-md border !border-yellow-600  border-border",
              info: "!bg-blue-200/50!text-blue-600 bg-background80 backdrop-blur-md border !border-blue-600  border-border",
            },
            // "!bg-red-400/50 text-600 bg-background80 backdrop-blur-md border  border-border",
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
