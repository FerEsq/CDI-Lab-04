import { useLoginMutation } from "../store/api/api-slice";

const useAuth = () => {
    const [handleLoginMutation, { isLoading: isLoginLoading }] = useLoginMutation()

    const handleLogin = async (email: string, password: string, callback: () => void) => {
        try {
            const response = await handleLoginMutation({ email, password }).unwrap();
            if (response.token) {
                callback();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return { 
        handleLogin, 
        isLoginLoading
    };
}

export default useAuth;