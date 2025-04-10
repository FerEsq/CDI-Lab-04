// appNavigator.tsx

import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Files from '../pages/Files';
import UnprotectedRoute from './components/UnprotectedRoute';
const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: '/files',
        element: (
            <ProtectedRoute>
                <Files />
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        element: (
            <UnprotectedRoute>
                <Login />
            </UnprotectedRoute>
        ),
    },
    {
        path: '/signup',
        element: (
            <UnprotectedRoute>
                <Signup />
            </UnprotectedRoute>
        ),
    },
]);

export default router;