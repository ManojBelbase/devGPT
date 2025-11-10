import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

export default function LoginPageIndex() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, loading: authLoading } = useAuth();
    const { navigate } = useAppContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill all fields');
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            await login(email, password);

            // Wait a bit for state to update, then navigate
            await new Promise(resolve => setTimeout(resolve, 200));
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            // Error is already toasted in AuthContext
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoading = authLoading || isSubmitting;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-8 py-12 w-80 sm:w-96 bg-white rounded-lg shadow-xl border"
            >
                <h2 className="text-2xl font-bold text-center text-purple-700">User Login</h2>

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                        placeholder="••••••••"
                        disabled={isLoading}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-indigo-600 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}