import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

export default function LoginPageIndex() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const { navigate } = useAppContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill all fields');
            return;
        }
        try {
            await login(email, password);
            navigate('/');
        } catch {
            // Error already toasted
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-8 py-12 w-80 sm:w-96 bg-white rounded-lg shadow-xl border"
            >
                <h2 className="text-2xl font-bold text-center text-purple-700">User Login</h2>

                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full p-2 border rounded outline-indigo-500"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full p-2 border rounded outline-indigo-500"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 hover:bg-indigo-600 text-white py-2 rounded transition disabled:opacity-70"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}