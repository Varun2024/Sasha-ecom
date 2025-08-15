import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../firebase/firebaseConfig";
import { Users, Mail, Calendar, Search, CheckCircle } from "lucide-react";
import { format, formatDistanceToNow, isWithinInterval, subDays } from "date-fns";

// Helper function to generate a colored avatar with the user's initial
const UserAvatar = ({ name }) => {
    if (!name) return null;
    const initial = name.charAt(0).toUpperCase();
    const colors = [
        "bg-blue-200 text-blue-800", "bg-emerald-200 text-emerald-800",
        "bg-amber-200 text-amber-800", "bg-indigo-200 text-indigo-800",
        "bg-pink-200 text-pink-800", "bg-rose-200 text-rose-800",
    ];
    // Simple hash to pick a color based on the name, ensuring it's consistent
    const colorIndex = initial.charCodeAt(0) % colors.length;

    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${colors[colorIndex]}`}>
            {initial}
        </div>
    );
};


const CustomersView = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        try {
            const usersCollection = collection(db, "users");
            const q = query(usersCollection, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            const thirtyDaysAgo = subDays(new Date(), 30);

            const customerList = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const joinedDate = data.createdAt.toDate();
                return {
                    id: doc.id,
                    firstName: data.firstName,
                    email: data.email,
                    joinedAt: joinedDate, // Store the actual Date object
                    isNew: isWithinInterval(joinedDate, { start: thirtyDaysAgo, end: new Date() }),
                };
            });

            setCustomers(customerList);
        } catch (error) {
            console.error("Error fetching customers:", error);
            toast.error("Failed to fetch customer data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <>
            <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar />
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                {/* --- Enhanced Header --- */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Customers</h3>
                        <p className="text-gray-500 mt-1">
                            {loading ? 'Fetching records...' : `Showing ${customers.length} total customers.`}
                        </p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* --- Customers Table --- */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50 text-sm text-gray-600">
                                <th className="p-4 font-semibold">Customer</th>
                                <th className="p-4 font-semibold">Contact Info</th>
                                <th className="p-4 font-semibold hidden md:table-cell">Date Joined</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-8">
                                        <div className="flex justify-center items-center gap-2 text-gray-500">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                                            Loading...
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.length > 0 ? (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <UserAvatar name={customer.firstName} />
                                                <span className="font-semibold text-gray-800">{customer.firstName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail size={16} />
                                                <span>{customer.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <div>
                                                <p className="text-gray-800">{format(customer.joinedAt, "PP")}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatDistanceToNow(customer.joinedAt, { addSuffix: true })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {customer.isNew && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    <CheckCircle size={14} /> New Customer
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-8">
                                        <Users size={40} className="mx-auto text-gray-400" />
                                        <p className="mt-4 text-gray-500">No customers found.</p>
                                        <p className="text-sm text-gray-400">When new users sign up, they will appear here.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default CustomersView;