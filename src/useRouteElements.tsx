/* eslint-disable react-refresh/only-export-components */
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout'
import { useContext, lazy, Suspense } from 'react'
import { AppContext } from './contexts/app.context'
import path from './constants/path'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound'))
const ProjectManagement = lazy(() => import('./pages/ProjectManagement/ProjectManagement'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: (
            <MainLayout>
              <Suspense>
                <ProjectManagement />
              </Suspense>
            </MainLayout>
          ),
          index: true
        }
        // {
        //   path: path.login,
        //   element: (
        //     <RegisterLayout>
        //       <Suspense>
        //         <Login />
        //       </Suspense>
        //     </RegisterLayout>
        //   )
        // },
        // {
        //   path: path.register,
        //   element: (
        //     <RegisterLayout>
        //       <Suspense>
        //         <Register />
        //       </Suspense>
        //     </RegisterLayout>
        //   )
        // }
      ]
    },
    {
      path: '',
      element: <RejectectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense>
            <NotFound />
          </Suspense>
        </MainLayout>
      )
    }
  ])
  return routeElements
}
