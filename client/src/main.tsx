import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SigninPage from './pages/SigninPage.tsx'
import SignupPage from './pages/SignupPage.tsx'
import UpdatePage from './pages/UpdatePage.tsx'
import EmailSentPage from './pages/EmailSentPage.tsx'
import AddProductPage from './pages/AddProductPage.tsx'
import ProductPage from './pages/ProductPage.tsx'
import HomePage from './pages/HomePage.tsx'
import EditProductPage from './pages/EditProductPage.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { StoreProvider } from './Store.tsx'
import ErrorPage from './pages/ErrorPage.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path='addproduct' element={<AddProductPage />} />
        <Route path='edit/:id' element={<EditProductPage />} />
        <Route path='product/:id' element={<ProductPage />} />
      </Route>
      <Route path='signin' element={<SigninPage />} />
      <Route path='signup' element={<SignupPage />} />
      <Route path='update' element={<UpdatePage />} />
      <Route path='emailsent' element={<EmailSentPage />} />
    </Route>
  )
);

export const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StoreProvider>
  </StrictMode>
)


