

import { useRef, useEffect } from 'react';
import { User, LogOut, Package, LogIn, UserPlus } from 'lucide-react';
import { BsBag } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path to your AuthContext
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; // Adjust path to your firebaseConfig

const ProfileContainer = ({ isOpen, onClose }) => {
    const profileRef = useRef(null);
    const navigate = useNavigate();
    // Get user state from the authentication context
    const { currentUser, userLoggedIn } = useAuth();

    // Effect to handle clicks outside the profile container to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Handles user logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            onClose(); // Close the dropdown after logging out
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    // Handles navigation and closes the dropdown
    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            ref={profileRef}
            className="fixed top-10 right-20 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
        >
            {/* --- RENDER USER INFO ONLY WHEN LOGGED IN --- */}
            {userLoggedIn && currentUser && (
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            {/* Display user's name or a default */}
                            <p className="font-semibold text-white truncate">{currentUser.user.displayName || 'User'}</p>
                            {/* Display user's email */}
                            <p className="text-sm text-gray-400 truncate">{currentUser.user.email}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- NAVIGATION SECTION --- */}
            <nav className="p-2">
                <button onClick={() => handleNavigate(userLoggedIn ? '/orders' : '/login')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
                    <Package className="w-5 h-5" />
                    <span>My Orders</span>
                </button>
                <button onClick={() => handleNavigate(userLoggedIn ? '/wishlist' : '/login')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
                    <BsBag className="w-5 h-5" />
                    <span>Wishlist</span>
                </button>
                
                {/* --- CONDITIONAL AUTH BUTTONS --- */}
                {userLoggedIn ? (
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 text-red-400 rounded-md hover:bg-gray-700">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                ) : (
                    <>
                        <hr className="my-2 border-gray-700" />
                        <button onClick={() => handleNavigate('/login')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
                            <LogIn className="w-5 h-5" />
                            <span>Login</span>
                        </button>
                        <button onClick={() => handleNavigate('/register')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
                            <UserPlus className="w-5 h-5" />
                            <span>Register</span>
                        </button>
                    </>
                )}
            </nav>
        </div>
    );
};

export default ProfileContainer;
