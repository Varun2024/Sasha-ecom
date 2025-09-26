import { Trash2, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // make sure this path is correct
import { serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const CollectionsView = () => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  // ✅ Fetch collections from Firestore
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
        if (data.length > 0) {
          setSelectedCollection(data[0]);
        }
      } catch (err) {
        console.error("Error fetching collections:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

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
      alert("Please add at least one image and a description.");
      return;
    }
    setIsUploading(true);

    try {
      // ✅ 1. Upload images to backend → Cloudinary
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file); // must match multer field name

        const res = await fetch("https://sasha-backend.onrender.com/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Upload failed: ${res.statusText}`);
        }

        const data = await res.json();
        return data.data.url; // Cloudinary URL from backend
      });

      const imageUrls = await Promise.all(uploadPromises);

      // ✅ 2. Save collection in Firestore
      const docRef = await addDoc(collection(db, "collections"), {
        description,
        imageUrls,
        createdAt: serverTimestamp(),
      });

      const newCollection = {
        id: docRef.id,
        description,
        imageUrls,
        createdAt: new Date().toISOString(),
      };

      setCollections((prev) => [newCollection, ...prev]);
      setSelectedCollection(newCollection);
      // ✅ 3. Reset form
      setDescription("");
      setFiles([]);
      setPreviews([]);
      alert("Collection saved successfully!");
    } catch (error) {
      console.error("Failed to save collection:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  const handleDelete = async (collectionId) => {
    if (!window.confirm("Are you sure you want to delete this collection? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "collections", collectionId));
      const updatedCollections = collections.filter(c => c.id !== collectionId);
      setCollections(updatedCollections);

      // Set selected collection to the new first one, or null if empty
      setSelectedCollection(updatedCollections.length > 0 ? updatedCollections[0] : null);
      toast.success("Collection deleted successfully!");
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Failed to delete collection.");
    }
  };

  const handleCollectionSelect = (e) => {
    const collectionId = e.target.value;
    const collectionToView = collections.find(c => c.id === collectionId);
    setSelectedCollection(collectionToView);
  };
  return (
    <div className="space-y-8">
      {/* Add New Collection */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Add New Collection
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Collection Description
            </label>
            <textarea
              id="description"
              rows="3"
              className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Spring 2025 Collection"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {previews.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Image Previews:
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.src}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removePreview(preview.name)}
                      className="absolute top-0 right-0 m-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-right">
            <button
              type="submit"
              disabled={isUploading}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isUploading ? "Saving..." : "Save Collection"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Collections */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Existing Collections
        </h3>
        {isLoading ? (
          <p>Loading collections...</p>
        ) : collections.length === 0 ? (
          <p className="text-gray-500">No collections yet.</p>
        ) : (
          <div className="space-y-6">
            {/* Collection Selector Dropdown */}
            <div>
              <label htmlFor="collection-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select a collection to view
              </label>
              <select
                id="collection-select"
                value={selectedCollection?.id || ''}
                onChange={handleCollectionSelect}
                className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {collections.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.description.substring(0, 80)}... (
                    {c.createdAt?.toDate().toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Collection Display */}
            {selectedCollection && (
              <div className="p-4 border rounded-lg bg-slate-50 relative">
                <p className="text-gray-700 mb-4">{selectedCollection.description}</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {selectedCollection.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Collection Image ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(selectedCollection.id)}
                  className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsView;
