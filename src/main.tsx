import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import CV from './pages/CV/CV.tsx'
import Portfolio from './pages/Portfolio/Portfolio.tsx'
import CovidShieldCyprus from "src/pages/CovidShieldCyprus/CovidShieldCyprus.tsx";
import BeyondWork from "src/pages/BeyondWork/BeyondWork.tsx";
import BlankLayout from "src/layouts/blankLayout.tsx";

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
        path: 'cv',
        element: <Navigate to="/CV" replace />,
      },
      {
        path: 'portfolio',
        Component: Portfolio,
      },
      {
        path: 'Portfolio',
        Component: Portfolio,
      },
      {
        path: 'beyond-work',
        Component: BeyondWork,
      },
      {
        path: 'Beyond-Work',
        element: <Navigate to="/beyond-work" replace />,
      },
      {
        path: '*',
        element: <Navigate to="/CV" replace />,
      },
    ],
  },
  {
    path: '/covid-shield-cyprus',
    Component: BlankLayout,
    children: [
      {
        index: true,
        Component: CovidShieldCyprus,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
