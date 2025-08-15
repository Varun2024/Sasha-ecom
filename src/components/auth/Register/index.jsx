import { useState } from 'react';
import { doCreateUserWithEmailAndPassword, signInWithGoogle } from '../../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; // Adjust the import path as necessary
import { toast, ToastContainer } from 'react-toastify';
export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            const user = await doCreateUserWithEmailAndPassword(email, password);
            // console.log('User registered:', user);
            // Add user to Firestore
            if (user) {
                await setDoc(doc(db, 'users', user.user.uid), {
                    email,
                    displayName: name,
                    createdAt: new Date(),
                });
            }
            toast.success('Registration successful! Redirecting to cart...', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
            });

            setTimeout(() => {
                navigate('/cart'); 
            }, 3000);
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('This email address is already in use.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else {
                setError('Failed to create an account. Please try again.');
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setGoogleLoading(true);
        setError('');
        try {
            const guser = await signInWithGoogle();
            if (guser) {
                await setDoc(doc(db, 'users', guser.user.uid), {
                    email: guser.user.email,
                    firstName: guser.user.displayName,
                    createdAt: new Date(),
                });
            }
            toast.success('Registration successful! Redirecting to cart...', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
            });
            setTimeout(() => {
                navigate('/cart'); // Redirect to cart after successful registration
            }, 3000);

        } catch (err) {
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Google sign-in was cancelled.');
            } else {
                setError('Failed to log in with Google. Please try again.');
                console.error('Google Login Error:', err);
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-[90vh] bg-gray-100 flex items-center justify-center mt-16">
            <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden m-4">
                <ToastContainer />
                {/* Visual Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <h1 className="text-4xl font-bold mb-3">Welcome!</h1>
                    <p className="text-center text-indigo-100">Create an account to get started. It's quick and easy.</p>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Account</h2>
                    <p className="text-gray-600 mb-8">Let's get you set up.</p>

                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert"><p>{error}</p></div>}

                    <form onSubmit={handleRegister}>
                        <div className="mb-5 relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                <input
                                    className="shadow-sm appearance-none border rounded-lg w-full py-3 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    id="name"
                                    type="text"
                                    placeholder="Sasha"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-5 relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email-register">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
                                </span>
                                <input
                                    className="shadow-sm appearance-none border rounded-lg w-full py-3 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    id="email-register"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6 relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-register">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                <input
                                    className="shadow-sm appearance-none border rounded-lg w-full py-3 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    id="password-register"
                                    type="password"
                                    autoComplete='current-password'
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105 disabled:bg-indigo-400"
                                type="submit"
                                disabled={loading || googleLoading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>

                        <div className="relative flex py-4 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            disabled={loading || googleLoading}
                            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                                <path fill="#4285F4" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                <path fill="#34A853" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l5.657,5.657C39.936,35.664,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                <path fill="#FBBC05" d="M10.21,29.21l5.657-5.657C14.805,22.447,14,20.318,14,18s0.805-4.447,1.867-5.553l-5.657-5.657C8.716,9.21,8,11.945,8,15s0.716,5.79,2.21,8.21z"></path>
                                <path fill="#EA4335" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-5.657-5.657C30.036,35.233,27.218,36,24,36c-3.318,0-6.225-1.196-8.344-3.21l-5.657,5.657C11.344,41.266,17.138,44,24,44z"></path>
                                <path fill="none" d="M8,8h32v32H8z"></path>
                            </svg>
                            {googleLoading ? 'Signing Up...' : 'Sign up with Google'}
                        </button>
                    </form>
                    <p className="text-center text-gray-600 text-sm mt-8">
                        Already have an account?{' '}
                        <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                            onClick={() => navigate('/login')}
                        >
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}