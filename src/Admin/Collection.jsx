import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // make sure this path is correct
import { serverTimestamp } from "firebase/firestore";

const CollectionsView = () => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

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

        const res = await fetch("http://localhost:5000/api/upload", {
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
            {collections.map((collection) => (
              <div key={collection.id} className="p-4 border rounded-lg">
                <p className="text-gray-700 mb-4">{collection.description}</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {collection.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Collection ${collection.id} Image ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  ))}
                </div>
                {/* {collection.createdAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Created:{" "}
                    {new Date(
                      collection.createdAt?.seconds
                        ? collection.createdAt.seconds * 1000
                        : collection.createdAt
                    ).toLocaleString()}
                  </p>
                )} */}  
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsView;
