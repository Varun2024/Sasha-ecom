

import { useRef, useEffect } from 'react';
import { User, LogOut, Package, LogIn, UserPlus, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const ProfileContainer = ({ isOpen, onClose }) => {
    const profileRef = useRef(null);
    const { currentUser, userLoggedIn } = useAuth();

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

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.reload(); 
            onClose();
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleNavigate = (path) => {
        window.location.href = path;
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            ref={profileRef}
            className="fixed top-16 right-6 md:right-12 w-64 bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] z-[100] rounded-sm animate-in fade-in slide-in-from-top-2 duration-200"
        >
            {/* --- USER ACCOUNT HEADER --- */}
            <div className="p-5 border-b border-gray-50 bg-[#fafafa]">
                {userLoggedIn && currentUser ? (
                    <div className="space-y-1">
                        <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-semibold">Account</p>
                        <p className="text-sm font-medium text-gray-900 truncate uppercase tracking-tight">
                            {currentUser.user.displayName || 'Guest User'}
                        </p>
                        <p className="text-[11px] text-gray-500 font-light truncate">{currentUser.user.email}</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-semibold">Welcome</p>
                        <p className="text-sm font-medium text-gray-900 uppercase">Sasha Store</p>
                    </div>
                )}
            </div>
            
            {/* --- NAVIGATION SECTION --- */}
            <nav className="py-2">
                <button 
                    onClick={() => handleNavigate(userLoggedIn ? '/orders' : '/login')} 
                    className="w-full text-left flex items-center gap-4 px-5 py-3 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors group"
                >
                    <Package className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
                    <span className="text-[11px] uppercase tracking-[0.15em] font-medium">My Orders</span>
                </button>

                <button 
                    onClick={() => handleNavigate('/wishlist')} 
                    className="w-full text-left flex items-center gap-4 px-5 py-3 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors group"
                >
                    <Heart className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
                    <span className="text-[11px] uppercase tracking-[0.15em] font-medium">Wishlist</span>
                </button>

                <div className="h-[1px] bg-gray-50 my-2 mx-5"></div>
                
                {/* --- CONDITIONAL AUTH BUTTONS --- */}
                {userLoggedIn ? (
                    <button 
                        onClick={handleLogout} 
                        className="w-full text-left flex items-center gap-4 px-5 py-3 text-red-500 hover:bg-red-50 transition-colors group"
                    >
                        <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100" strokeWidth={1.5} />
                        <span className="text-[11px] uppercase tracking-[0.15em] font-medium">Log Out</span>
                    </button>
                ) : (
                    <div className="px-2 space-y-1">
                        <button 
                            onClick={() => handleNavigate('/login')} 
                            className="w-full text-center bg-black text-white text-[10px] uppercase tracking-[0.2em] py-3 font-semibold hover:bg-gray-800 transition-all"
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => handleNavigate('/register')} 
                            className="w-full text-center text-gray-500 text-[10px] uppercase tracking-[0.2em] py-3 font-medium hover:text-black transition-all"
                        >
                            Create Account
                        </button>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default ProfileContainer;