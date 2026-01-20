import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { PublicLayout, AuthLayout } from "@/layouts";
import { HomePage } from "@/pages/Home";
import { LoginPage, RegisterPage } from "@/pages";
import { useAuth } from "@/hooks/useAuth";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
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
        {/* Phase 2: Mosques pages will go here */}
        {/* <Route path="/mosques" element={<MosquesPage />} /> */}
        {/* <Route path="/mosques/:id" element={<MosqueDetailPage />} /> */}
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
      {/* Phase 3: Dashboard will go here */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <div className='min-h-screen flex items-center justify-center'>
              <div className='text-center'>
                <h1 className='text-2xl font-bold'>Dashboard</h1>
                <p className='text-muted-foreground mt-2'>Coming in Phase 3</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
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
        <Toaster position='top-right' richColors closeButton theme='system' />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
