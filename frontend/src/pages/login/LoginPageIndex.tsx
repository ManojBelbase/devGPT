import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../redux/thunks/authThunk";
import SocialAuthButtons from "./components/SocialAuthButtons";
import toast from "react-hot-toast";
import type { AppDispatch } from "../../redux/store";

const LoginPageIndex = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            let res;

            if (isRegister) {
                res = await dispatch(
                    registerUser({ name, email, password })
                ).unwrap();
            } else {
                res = await dispatch(
                    loginUser({ email, password })
                ).unwrap();
            }

            if (res.status === "success") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch (err: any) {
            toast.error(err?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image/Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-purple-600 via-purple-700 to-purple-600 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <div className="max-w-md text-center">
                        {/* Main Icon */}
                        <div className="mb-8 flex justify-center">
                            <div className="relative">
                                <img
                                    src="logo.png"
                                    alt="devGPT Logo"
                                    className="w-20 h-20 rounded-sm"
                                />
                            </div>
                        </div>

                        <h2 className="text-4xl font-bold mb-4">Welcome to devGPT</h2>
                        <p className="text-lg text-purple-100 mb-8">
                            Your AI-powered development assistant that helps you code smarter, faster, and better.
                        </p>

                        {/* Feature Icons */}
                        <div className="grid grid-cols-3 gap-6 mt-12">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <polyline points="16 18 22 12 16 6" />
                                        <polyline points="8 6 2 12 8 18" />
                                    </svg>
                                </div>
                                <span className="text-sm text-purple-100">Smart Code</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-purple-100">Fast  Response</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6M5.6 18.4l4.2-4.2m4.2-4.2l4.2-4.2" />
                                    </svg>
                                </div>
                                <span className="text-sm text-purple-100">AI Powered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-linear-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="text-center mb-8 lg:hidden">
                        <div className="inline-flex items-center justify-center   mb-2 shadow-sm">
                            <img src="logo.png" className="w-10 h-10 rounded-sm" />
                        </div>
                        <h1 className="text-xl font-bold bg-linear-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
                            devGPT
                        </h1>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden lg:block mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isRegister ? "Create Account" : "Welcome Back"}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {isRegister ? "Create your account to get started" : "Please login to continue"}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <div className="space-y-5">
                            {isRegister && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required={isRegister}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                />
                            </div>


                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="w-full bg-linear-to-r from-purple-600 to-purple-600 text-white py-3 rounded-sm font-semibold shadow-sm hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {isRegister ? "Create Account" : "Sign In"}
                            </button>
                        </div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white/80 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <SocialAuthButtons />

                        <div className="mt-6 text-center">
                            <span className="text-gray-600 text-sm">
                                {isRegister ? "Already have an account?" : "Don't have an account?"}
                            </span>{" "}
                            <button
                                type="button"
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors"
                            >
                                {isRegister ? "Sign in" : "Sign up"}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-xs mt-6">
                        By continuing, you agree to devGPT's Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default LoginPageIndex;