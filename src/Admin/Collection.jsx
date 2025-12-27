/* eslint-disable no-unused-vars */
import { Trash2, UploadCloud, X, ImageIcon, Calendar, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { serverTimestamp } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";

const CollectionsView = () => {
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    // ✅ REFINED FETCH: Ensures selectedCollection is set after state update
    useEffect(() => {
        const fetchCollections = async () => {
            setIsLoading(true);
            try {
                const q = query(collection(db, "collections"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                
                setCollections(data);
                // Set the default view to the most recent collection
                if (data.length > 0) {
                    setSelectedCollection(data[0]);
                }
            } catch (err) {
                console.error("Error fetching collections:", err);
                toast.error("COULD NOT SYNC ARCHIVE");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCollections();
    }, []);

    const handleCollectionSelect = (e) => {
        const collectionId = e.target.value;
        const collectionToView = collections.find(c => c.id === collectionId);
        setSelectedCollection(collectionToView);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        selectedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prevPreviews) => [
                    ...prevPreviews,
                    { src: reader.result, name: file.name },
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePreview = (name) => {
        setFiles(files.filter((f) => f.name !== name));
        setPreviews(previews.filter((p) => p.name !== name));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0 || !description) {
            toast.error("ASSETS AND DESCRIPTION REQUIRED");
            return;
        }
        setIsUploading(true);
        const toastId = toast.loading("UPLOADING TO ATELIER...");

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("image", file);
                const res = await fetch("https://sasha-backend.onrender.com/api/upload", {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) throw new Error("Upload failed");
                const data = await res.json();
                return data.data.url;
            });

            const imageUrls = await Promise.all(uploadPromises);

            const docRef = await addDoc(collection(db, "collections"), {
                description,
                imageUrls,
                createdAt: serverTimestamp(),
            });

            const newColl = { 
                id: docRef.id, 
                description, 
                imageUrls, 
                createdAt: { toDate: () => new Date() } 
            };

            setCollections((prev) => [newColl, ...prev]);
            setSelectedCollection(newColl);
            setDescription("");
            setFiles([]);
            setPreviews([]);
            toast.update(toastId, { render: "COLLECTION PUBLISHED", type: "success", isLoading: false, autoClose: 2000 });
        } catch (error) {
            toast.update(toastId, { render: "PUBLISH FAILED", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (collectionId) => {
        if (!window.confirm("PERMANENTLY REMOVE THIS COLLECTION?")) return;
        try {
            await deleteDoc(doc(db, "collections", collectionId));
            const updated = collections.filter(c => c.id !== collectionId);
            setCollections(updated);
            setSelectedCollection(updated.length > 0 ? updated[0] : null);
            toast.success("REMOVED FROM ARCHIVE");
        } catch (error) {
            toast.error("DELETE FAILED");
        }
    };

    return (
        <div className="max-w-7xl pb-20 animate-in fade-in duration-700 h-full">
            <ToastContainer position="bottom-right" theme="light" />

            {/* --- SECTION: ARCHIVE BROWSER (Now at the top for quick access) --- */}
            <section className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#fafafa]">
                    <div className="flex items-center gap-4">
                        <Layers size={20} strokeWidth={1.5} className="text-gray-400" />
                        <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-900">Collection Archive</h3>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select
                            value={selectedCollection?.id || ''}
                            onChange={handleCollectionSelect}
                            className="w-full md:w-80 bg-white border border-gray-200 px-4 py-2.5 text-[11px] tracking-widest uppercase font-medium outline-none focus:border-black transition-all appearance-none cursor-pointer"
                        >
                            {collections.length === 0 && <option>No Collections Found</option>}
                            {collections.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.description.substring(0, 35)}...
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    {isLoading ? (
                        <div className="py-20 text-center text-[10px] tracking-[0.4em] uppercase text-gray-300 animate-pulse">Synchronizing Atelier...</div>
                    ) : selectedCollection ? (
                        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                <div className="max-w-3xl border-l border-gray-900 pl-6">
                                    <p className="text-lg md:text-xl font-light text-gray-800 leading-relaxed italic">
                                        "{selectedCollection.description}"
                                    </p>
                                    <div className="flex items-center gap-4 mt-6">
                                        <Calendar size={12} className="text-gray-400" />
                                        <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-bold">
                                            Published: {selectedCollection.createdAt?.toDate ? selectedCollection.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(selectedCollection.id)}
                                    className="px-6 py-3 border border-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[10px] tracking-widest uppercase font-bold flex items-center gap-2"
                                >
                                    <Trash2 size={12} /> Remove Collection
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
                                {selectedCollection.imageUrls?.map((url, index) => (
                                    <div key={index} className="aspect-[3/4] overflow-hidden bg-[#fafafa] group relative">
                                        <img
                                            src={url}
                                            alt="Sasha Archive Asset"
                                            className="h-full w-full object-cover transition-transform duration-1000 grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 border border-black/5 pointer-events-none"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 text-center border-2 border-dashed border-gray-50">
                            <ImageIcon size={40} strokeWidth={1} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400">The archive is currently empty</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- SECTION: NEW CURATION --- */}
            <section className="bg-white border border-gray-100 shadow-sm rounded-sm max-w-4xl mx-auto">
                <div className="p-8 border-b border-gray-50 bg-[#fafafa] text-center">
                    <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-900">New Curation</h3>
                    <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase mt-2">Add latest photographic assets</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
                    <div className="space-y-4">
                        <label className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400">Collection Narrative</label>
                        <input
                            type="text"
                            className="w-full border-b border-gray-100 py-3 text-sm outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-200 font-light tracking-wide"
                            placeholder="E.G., NOIR SERIES: AUTUMN WINTER 2025"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-6">
                        <label className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400">High-Res Assets</label>
                        <div className="group relative border border-dashed border-gray-200 rounded-sm hover:border-black transition-all duration-500 py-16 flex flex-col items-center justify-center bg-[#fcfcfc]">
                            <input
                                id="file-upload"
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <UploadCloud className="text-gray-300 group-hover:text-black transition-colors mb-4" size={32} strokeWidth={1} />
                            <p className="text-[10px] tracking-widest uppercase font-medium text-gray-400">Select collection files</p>
                        </div>
                    </div>

                    {previews.length > 0 && (
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative aspect-[3/4] group overflow-hidden border border-gray-100">
                                    <img src={preview.src} alt="New Asset" className="h-full w-full object-cover grayscale-[0.6] group-hover:grayscale-0 transition-all duration-500" />
                                    <button
                                        type="button"
                                        onClick={() => removePreview(preview.name)}
                                        className="absolute top-2 right-2 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full bg-black text-white text-[11px] font-bold tracking-[0.3em] uppercase py-5 hover:bg-gray-800 transition-all disabled:bg-gray-100 disabled:text-gray-300"
                        >
                            {isUploading ? "Syncing..." : "Finalize Curation"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default CollectionsView;