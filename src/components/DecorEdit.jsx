import { useEffect, useState, useRef } from "react";
import { url } from "../config";

const DecorEdit = ({ decorId, onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    owner: {
      name: "",
      phone: "",
      email: "",
      instagram: "",
      facebook: "",
    },
    photos: [],
    videos: [],
    typeOfDecoration: "",
    location: "",
    description: "",
    isVerified: false,
  });

  const [error, setError] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    const fetchDecorData = async () => {
      try {
        const response = await fetch(`${url}/api/decorations-lists/${decorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch car data");
        }
        const decorData = await response.json();
        setFormData(decorData);
        setPhotoPreviews(decorData.photos);
        setVideoPreviews(decorData.videos);
      } catch (error) {
        setError(error.message);
      }
    };

    if (decorId) {
        fetchDecorData();
    }
  }, [decorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("owner.")) {
      setFormData({
        ...formData,
        owner: {
          ...formData.owner,
          [name.split(".")[1]]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "photos") {
      setFormData({ ...formData, photos: files });
      setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
    } else if (type === "videos") {
      setFormData({ ...formData, videos: files });
      setVideoPreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => formDataToSend.append(key, file));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(`/api/cars/${decorId}`, {
        method: "PUT",
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error("Failed to update car details");
      }
      onUpdate();
    } catch (error) {
      setError("Failed to update car details");
    }
  };
  return (
    <form
    encType="multipart/form-data"
    onSubmit={handleSubmit}
    className="max-w-lg mx-auto p-4 border rounded-lg shadow-md"
  >
    <h2 className="text-2xl font-semibold mb-4">Update Decoration</h2>
    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="title">
        Title
      </label>
      <input
        type="text"
        name="title"
        id="title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
    </div>
    <h3 className="text-xl font-semibold mb-2">Owner Information</h3>
    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="owner.name">
        Name
      </label>
      <input
        type="text"
        name="owner.name"
        value={formData.owner.name}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="owner.phone">
        Phone
      </label>
      <input
        type="text"
        name="owner.phone"
        value={formData.owner.phone}
        onChange={handleChange}
        required
        minLength={10}
        maxLength={15}
        className="w-full border rounded p-2"
      />
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="owner.email">
        Email
      </label>
      <input
        type="email"
        name="owner.email"
        value={formData.owner.email}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="owner.instagram">
        Instagram
      </label>
      <input
        type="text"
        name="owner.instagram"
        value={formData.owner.instagram}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="owner.facebook">
        Facebook
      </label>
      <input
        type="text"
        name="owner.facebook"
        value={formData.owner.facebook}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-2" htmlFor="photos">
        Photos
      </label>
      <input
        ref={photoInputRef}
        type="file"
        required
        name="photos"
        multiple
        accept="image/*"
        onChange={(e) => handleFileChange(e, "photos")}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="mt-4 grid grid-cols-2 gap-4">
        {photoPreviews.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`preview ${index}`}
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-semibold mb-2" htmlFor="videos">
        Videos
      </label>
      <input
        ref={videoInputRef}
        type="file"
        name="videos"
        multiple
        required
        accept="video/*"
        onChange={(e) => handleFileChange(e, "videos")}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="mt-4 grid grid-cols-1 gap-4">
        {videoPreviews.map((src, index) => (
          <video
            key={index}
            controls
            className="w-full h-32 object-cover rounded"
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
      </div>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="typeOfDecoration">
        Type of Decoration
      </label>
      <select
        name="typeOfDecoration"
        value={formData.typeOfDecoration}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      >
        <option value="">Select Type</option>
        <option value="Churches">Churches</option>
        <option value="Halls">Halls</option>
        <option value="Cars">Cars</option>
        <option value="Chair Covers">Chair Covers</option>
        <option value="LED Signs">LED Signs</option>
      </select>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="location">
        Location
      </label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 mb-1" htmlFor="description">
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
        rows="4"
      />
    </div>
    <div className="mb-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          name="isVerified"
          checked={formData.isVerified}
          onChange={() =>
            setFormData((prev) => ({ ...prev, isVerified: !prev.isVerified }))
          }
          className="mr-2"
        />
        Is Verified
      </label>
    </div>
    <button
      type="submit"
      disabled={loading}
      className={`w-full p-2 text-white rounded ${
        loading ? "bg-gray-400" : "bg-blue-600"
      }`}
    >
      {loading ? "Submitting..." : "Add Decoration"}
    </button>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </form>
  );
};

export default DecorEdit;
