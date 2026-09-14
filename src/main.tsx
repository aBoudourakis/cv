import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import CV from './pages/CV/CV.tsx'
import BlankLayout from "src/layouts/blankLayout.tsx";

// CV stays a static import: it's the index route (see the `index: true`
// redirect below) and the highest-traffic page on a CV/portfolio site, so
// shipping it in the main bundle avoids the extra chunk round-trip on the
// most common first visit. Portfolio, Beyond Work and the standalone
// COVID Shield Cyprus page are secondary routes — `lazy` (react-router's
// route-level code splitting, https://reactrouter.com/start/framework/route-module#lazy)
// keeps their code, styles and page-specific assets out of that initial
// bundle entirely, so a CV-only visit never downloads them.
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
        lazy: () => import('./pages/Portfolio/Portfolio.tsx').then((m) => ({ Component: m.default })),
      },
      {
        path: 'Portfolio',
        lazy: () => import('./pages/Portfolio/Portfolio.tsx').then((m) => ({ Component: m.default })),
      },
      {
        path: 'beyond-work',
        lazy: () => import('./pages/BeyondWork/BeyondWork.tsx').then((m) => ({ Component: m.default })),
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
        lazy: () =>
          import('src/pages/CovidShieldCyprus/CovidShieldCyprus.tsx').then((m) => ({ Component: m.default })),
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
