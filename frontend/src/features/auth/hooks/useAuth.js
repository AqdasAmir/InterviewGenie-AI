import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe, verifyOtp, resendOtp } from "../services/auth.api";
import { toast } from "react-hot-toast";


export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            toast.success("Logged in successfully!")
            return data;
        } catch (err) {
            console.error(err)
            toast.error("Login failed!");
            throw err;
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            toast.success(data.message || "OTP sent to your email!");
            return data;
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Registration failed!");
            throw err;
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
            toast.success("Logged out successfully!")
        } catch (err) {
            console.log(err)
            toast.error("Logout failed!")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async ({ email, otp }) => {
        setLoading(true);
        try {
            const data = await verifyOtp({ email, otp });
            setUser(data.user);
            toast.success(data.message || "Email verified successfully!");
            return data;
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Verification failed!");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async ({ email }) => {
        try {
            const data = await resendOtp({ email });
            toast.success(data.message || "A new OTP has been sent!");
            return data;
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to resend OTP");
            throw err;
        }
    };

    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout, handleVerifyOtp, handleResendOtp }
}