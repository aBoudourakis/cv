import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import CV from './pages/CV/CV.tsx'
import Portfolio from './pages/Portfolio/Portfolio.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        element: <Navigate to="/CV" replace />,
      },
      {
        path: 'CV',
        Component: CV,
      },
      {
        path: 'portfolio',
        Component: Portfolio,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
