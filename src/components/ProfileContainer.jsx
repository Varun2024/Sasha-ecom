// import { useRef, useEffect } from 'react';
// import { User, LogOut, Package } from 'lucide-react';
// import { BsBag } from 'react-icons/bs';
// import { useNavigate } from 'react-router-dom';



// const ProfileContainer = ({ isOpen, onClose }) => {
//     const profileRef = useRef(null);
//     const navigate = useNavigate();
//     // Effect to handle clicks outside the profile container to close it
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (profileRef.current && !profileRef.current.contains(event.target)) {
//                 onClose();
//             }
//         };

//         if (isOpen) {
//             document.addEventListener('mousedown', handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [isOpen, onClose]);

//     if (!isOpen) {
//         return null;
//     }
    
//     return (
//         <div
//             ref={profileRef}
//             className="absolute top-10 right-20 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
//         >
//             <div className="p-4 border-b border-gray-700">
//                 <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
//                         <User className="w-8 h-8 text-white" />
//                     </div>
//                     <div>
//                         <p className="font-semibold text-white">Alex Doe</p>
//                         <p className="text-sm text-gray-400">alex.doe@example.com</p>
//                     </div>
//                 </div>
//             </div>
//             <nav className="p-2">
//                 <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
//                     <Package className="w-5 h-5" />
//                     <span>My Orders</span>
//                 </a>
//                 <a onClick={() => navigate('/wishlist')} className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
//                     <BsBag className="w-5 h-5" />
//                     <span>Wishlist</span>
//                 </a>
//                 <a href="#" className="flex items-center gap-3 px-3 py-2 text-red-400 rounded-md hover:bg-gray-700">
//                     <LogOut className="w-5 h-5" />
//                     <span>Logout</span>
//                 </a>
//             </nav>
//         </div>
//     );
// };

// export default ProfileContainer;

import { useRef, useEffect } from 'react';
import { User, LogOut, Package, LogIn, UserPlus } from 'lucide-react';
import { BsBag } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';// Adjust path to your AuthContext
import { signOutUser } from '../firebase/auth';

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
       signOutUser()
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
            className="absolute top-10 right-20 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
        >
            {userLoggedIn && currentUser ? (
                // --- RENDER WHEN USER IS LOGGED IN ---
                <>
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                {/* Display user's name or a default */}
                                <p className="font-semibold text-white truncate">{currentUser.displayName || 'User'}</p>
                                {/* Display user's email */}
                                <p className="text-sm text-gray-400 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                    </div>
                    <nav className="p-2">
                        <button onClick={() => handleNavigate('/orders')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
                            <Package className="w-5 h-5" />
                            <span>My Orders</span>
                        </button>
                        <button onClick={() => handleNavigate('/wishlist')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
                            <BsBag className="w-5 h-5" />
                            <span>Wishlist</span>
                        </button>
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 text-red-400 rounded-md hover:bg-gray-700">
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </nav>
                </>
            ) : (
                // --- RENDER WHEN USER IS LOGGED OUT ---
                <nav className="p-2">
                     <button onClick={() => handleNavigate('/login')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
                        <LogIn className="w-5 h-5" />
                        <span>Login</span>
                    </button>
                    <button onClick={() => handleNavigate('/register')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700">
                        <UserPlus className="w-5 h-5" />
                        <span>Register</span>
                    </button>
                </nav>
            )}
        </div>
    );
};

export default ProfileContainer;