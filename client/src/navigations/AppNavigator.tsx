// appNavigator.tsx

import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
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
        path: '/login',
        element: (
            <UnprotectedRoute>
                <Login />
            </UnprotectedRoute>
        ),
    },
]);

export default router;