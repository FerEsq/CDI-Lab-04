import { useLoginMutation } from "../store/api/api-slice";

const useAuth = () => {
    const [handleLoginMutation] = useLoginMutation()

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

    return { handleLogin };
}

export default useAuth;