import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../config";
const CarForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const photoInputRef = useRef();
  const videoInputRef = useRef();

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
    yearOfProduction: "",
    color: "",
    interior: "",
    typeOfCar: "",
    numberOfSeats: "",
    additionalAmenities: [],
    rentalPrice: "",
    location: "",
    rentalDuration: "hourly",
    specialOptionsForWedding: [],
    description: "",
    isVerified: false,
  });

  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  useEffect(() => {
    const savedFormData = localStorage.getItem("carFormData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carFormData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("owner.")) {
      const ownerField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        owner: { ...prev.owner, [ownerField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const MAX_PHOTOS = 5;
  const MAX_PHOTO_SIZE_MB = 5;
  const MAX_VIDEOS = 3;
  const MAX_VIDEO_SIZE_MB = 60;

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    let isValid = true;
    let errorMessage = "";

    if (type === "photos") {
      if (files.length > MAX_PHOTOS) {
        isValid = false;
        errorMessage = `You can upload a maximum of ${MAX_PHOTOS} photos.`;
      } else {
        const totalSize =
          files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);
        if (totalSize > MAX_PHOTO_SIZE_MB * MAX_PHOTOS) {
          isValid = false;
          errorMessage = `Each photo must be less than ${MAX_PHOTO_SIZE_MB} MB.`;
        }
      }
      if (isValid) {
        setFormData((prev) => ({ ...prev, photos: files }));
        const photoURLs = files.map((file) => URL.createObjectURL(file));
        setPhotoPreviews(photoURLs);
      } else {
        alert(errorMessage);
      }
    } else if (type === "videos") {
      if (files.length > MAX_VIDEOS) {
        isValid = false;
        errorMessage = `You can upload a maximum of ${MAX_VIDEOS} videos.`;
      } else {
        const totalSize =
          files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);
        if (totalSize > MAX_VIDEO_SIZE_MB * MAX_VIDEOS) {
          isValid = false;
          errorMessage = `Each video must be less than ${MAX_VIDEO_SIZE_MB} MB.`;
        }
      }
      if (isValid) {
        setFormData((prev) => ({ ...prev, videos: files }));
        const videoURLs = files.map((file) => URL.createObjectURL(file));
        setVideoPreviews(videoURLs);
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const token = localStorage.getItem("authToken");
  
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      console.log("Form data before sending:", formData);
  
      const response = await fetch(`${url}/api/car/create-car`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      console.log("Form data after sending:", formData);
      console.log("Form data after sending:", formData.photos);
      console.log("Response:", response);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Data:", errorData);
  
        if (errorData.message === "Not Authorized") {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("authToken");
          navigate("/login"); 
          return; 
        }
  
        const message = errorData.errors
          ? errorData.errors[0].msg
          : errorData.message || "An error occurred.";
        setError(message);
        return;
      }
      const textResponse = await response.text();
      const result = JSON.parse(textResponse);
      console.log("Data received:", result); 
      // localStorage.removeItem('carFormData');
      console.log("Car created successfully:", result);
      navigate("/cars-list");
    } catch (error) {
      console.error("Fetch error:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white shadow-md rounded"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Car</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" htmlFor="title">
          Car Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Car Owner Information</h3>
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="owner.name"
        >
          Car Owner Name
        </label>
        <input
          type="text"
          required
          name="owner.name"
          value={formData.owner.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="owner.phone"
        >
          Car Owner Phone
        </label>
        <input
          type="text"
          required
          name="owner.phone"
          value={formData.owner.phone}
          onChange={handleChange}
          minLength={10}
          maxLength={15}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {error && <p className="text-red-700 text-sm">{error}</p>}
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="owner.email"
        >
          Car Owner Email
        </label>
        <input
          type="email"
          required
          name="owner.email"
          value={formData.owner.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" htmlFor="facebook">
          Car Owner Facebook (optional)
        </label>
        <input
          type="text"
          name="owner.facebook"
          value={formData.owner.facebook}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" htmlFor="instagram">
          Car Owner Instagram (optional)
        </label>
        <input
          type="text"
          name="owner.instagram"
          value={formData.owner.instagram}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
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
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="yearOfProduction"
        >
          Year of Production
        </label>
        <input
          type="number"
          required
          name="yearOfProduction"
          value={formData.yearOfProduction}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" htmlFor="color">
          Color
        </label>
        <input
          type="text"
          name="color"
          required
          value={formData.color}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="typesOfCar"
        >
          Type of Car
        </label>
        <input
          type="text"
          name="typeOfCar"
          required
          value={formData.typeOfCar}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" htmlFor="interior">
          Interior
        </label>
        <input
          type="text"
          name="interior"
          required
          value={formData.interior}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="numberOfSeats"
        >
          Number of Seats
        </label>
        <input
        minLength={1}
          type="number"
          required
          name="numberOfSeats"
          value={formData.numberOfSeats}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="additionalAmenities"
        >
          Additional Amenities (comma-separated)
        </label>
        <input
          type="text"
          required
          name="additionalAmenities"
          value={formData.additionalAmenities.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              additionalAmenities: e.target.value.split(", "),
            })
          }
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="rentalPrice"
        >
          Rental Price
        </label>
        <input
          type="number"
          required
          name="rentalPrice"
          value={formData.rentalPrice}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" htmlFor="location">
          Location
        </label>
        <input
          type="text"
          required
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="rentalDuration"
        >
          Rental Duration
        </label>
        <select
          name="rentalDuration"
          required
          value={formData.rentalDuration}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="specialOptionsForWedding"
        >
          Special Options for Wedding (comma-separated)
        </label>
        <input
          type="text"
          required
          name="specialOptionsForWedding"
          value={formData.specialOptionsForWedding.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              specialOptionsForWedding: e.target.value.split(", "),
            })
          }
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-sm font-semibold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="isVerified"
            checked={formData.isVerified}
            onChange={() =>
              setFormData({ ...formData, isVerified: !formData.isVerified })
            }
            className="mr-2"
          />
          <span className="text-sm">Is Verified</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 text-white rounded ${
          loading ? "bg-gray-400" : "bg-blue-600"
        }`}
      >
        {loading ? "Submitting..." : "Add Car"}
      </button>
    </form>
  );
};

export default CarForm;
