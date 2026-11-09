
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import {
  Landing,
  About,
  Login,
  HomeLayout,
  Register,
  CoursePage,
} from './pages';

import Profile from './pages/Profile';
import Error from './pages/Error';
import AdminNotifications from './pages/admin/AdminNotifications';
import Notifications from './pages/Notifications';
import AdminAssignments from './pages/admin/AdminAssignments';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'courses',
        element: <CoursePage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
  },
  {
    path: '/dashboard/profile',
    element: <Profile />,
    errorElement: <Error />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
    errorElement: <Error />,
  },
  {
    path: '/admin/notifications',
    element: <AdminNotifications />,
    errorElement: <Error />,
  },
  {
    path: '/admin/assignment',
    element: <AdminAssignments />,
    errorElement: <Error />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
