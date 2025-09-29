import { useLoginMutation, useRegisterMutation, useLogoutMutation, useCheckAuthQuery } from "../store/api/api-slice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAppState } from "../store/slices/appState-slice";

const useAuth = () => {
    const dispatch = useDispatch();
    const [handleLoginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
    const [handleRegisterMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
    const [handleLogoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();
    const { data: authStatus, isLoading: isCheckingAuth, refetch: checkAuth } = useCheckAuthQuery();
    const [error, setError] = useState<string | null>(null);

    // Update app state based on authentication status
    useEffect(() => {
        if (!isCheckingAuth && authStatus !== undefined) {
            if (authStatus.authenticated) {
                dispatch(setAppState('LOGGED_IN'));
            } else {
                dispatch(setAppState('NOT_LOGGED_IN'));
            }
        }
    }, [authStatus, isCheckingAuth, dispatch]);

    const handleLogin = async (email: string, password: string, callback: () => void) => {
        setError(null);
        try {
            const response = await handleLoginMutation({ email, password }).unwrap();
            if (response.message === 'Login successful') {
                // Check authentication status after login
                await checkAuth();
                callback();
            }
            console.log('Login response:', response);
        } catch (err: unknown) {
            const error = err as { data?: { message?: string } };
            setError(error.data?.message || 'Error al iniciar sesión');
            console.error('Login error:', err);
        }
    }

    const handleRegister = async (email: string, password: string, callback: () => void) => {
        setError(null);
        try {
            const response = await handleRegisterMutation({ email, password }).unwrap();
            if (response.message === 'User registered successfully') {
                // Check authentication status after registration
                await checkAuth();
                callback();
            }
            console.log('Register response:', response);
        } catch (err: unknown) {
            const error = err as { data?: { message?: string } };
            setError(error.data?.message || 'Error al registrarse');
            console.error('Register error:', err);
        }
    }

    const handleLogout = async (callback: () => void) => {
        try {
            await handleLogoutMutation().unwrap();
            // Check authentication status after logout
            await checkAuth();
            callback();
            console.log('Logout successful');
        } catch (err: unknown) {
            console.error('Logout error:', err);
            // Even if logout fails, we should still redirect
            callback();
        }
    }

    return { 
        handleLogin,
        handleRegister,
        handleLogout,
        isLoginLoading,
        isRegisterLoading,
        isLogoutLoading,
        isCheckingAuth,
        isAuthenticated: authStatus?.authenticated || false,
        error
    };
}

export default useAuth;