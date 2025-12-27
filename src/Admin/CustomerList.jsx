import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../firebase/firebaseConfig";
import { Users, Mail, Calendar, Search, Check, ChevronRight } from "lucide-react";
import { format, formatDistanceToNow, isWithinInterval, subDays } from "date-fns";

const UserAvatar = ({ name }) => {
    if (!name) return null;
    const initial = name.charAt(0).toUpperCase();
    return (
        <div className="w-10 h-10 border border-gray-100 bg-[#fafafa] flex items-center justify-center text-[13px] font-semibold text-gray-900">
            {initial}
        </div>
    );
};

const CustomersView = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCustomers = async () => {
        try {
            const usersCollection = collection(db, "users");
            const q = query(usersCollection, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const thirtyDaysAgo = subDays(new Date(), 30);

            const customerList = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const joinedDate = data.createdAt?.toDate() || new Date();
                return {
                    id: doc.id,
                    firstName: data.firstName || data.displayName || "Guest",
                    email: data.email,
                    joinedAt: joinedDate,
                    isNew: isWithinInterval(joinedDate, { start: thirtyDaysAgo, end: new Date() }),
                };
            });
            setCustomers(customerList);
        } catch (error) {
            console.error("Error fetching customers:", error);
            toast.error("DATABASE SYNC FAILED");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const filteredCustomers = customers.filter(c => 
        c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
            <ToastContainer position="bottom-right" theme="light" autoClose={2000} hideProgressBar />

            {/* --- Editorial Header --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                <div>
                    <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-900">Directory</h3>
                    <h2 className="text-3xl font-light tracking-[0.1em] text-gray-900 uppercase mt-2">
                        Customer <span className="font-semibold">Profiles</span>
                    </h2>
                    <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-4">
                        {loading ? 'Synchronizing...' : `Total Registered: ${customers.length}`}
                    </p>
                </div>
                
                <div className="relative group">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="SEARCH PROFILES..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-b border-gray-100 py-2 pl-7 pr-4 text-[11px] tracking-widest uppercase focus:outline-none focus:border-black transition-all w-full md:w-64 font-light"
                    />
                </div>
            </div>

            {/* --- Data Display --- */}
            <div className="bg-white border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#fafafa] border-b border-gray-50">
                            <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Profile</th>
                            <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Communication</th>
                            <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 hidden md:table-cell text-center">Acquisition Date</th>
                            <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="py-20 text-center text-[10px] tracking-widest text-gray-300 animate-pulse">Establishing Connection...</td>
                            </tr>
                        ) : filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="group hover:bg-[#fafafa] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <UserAvatar name={customer.firstName} />
                                            <span className="text-[13px] font-medium tracking-tight text-gray-900 uppercase">
                                                {customer.firstName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3 text-[12px] font-light text-gray-500">
                                            <Mail size={14} strokeWidth={1} />
                                            <span className="tracking-wide lowercase">{customer.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden md:table-cell text-center">
                                        <div className="space-y-1">
                                            <p className="text-[12px] text-gray-900 font-medium tracking-tighter uppercase">{format(customer.joinedAt, "MMM dd, yyyy")}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest italic font-light">
                                                {formatDistanceToNow(customer.joinedAt)} ago
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        {customer.isNew ? (
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[9px] font-bold tracking-[0.2em] uppercase rounded-full">
                                                <Check size={10} /> Recent Join
                                            </span>
                                        ) : (
                                            <ChevronRight size={14} className="ml-auto text-gray-200 group-hover:text-black transition-colors" />
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-32 text-center">
                                    <Users size={32} strokeWidth={1} className="mx-auto text-gray-100 mb-4" />
                                    <p className="text-[11px] tracking-[0.3em] uppercase text-gray-300">No records found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomersView;