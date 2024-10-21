import { useEffect, useState, useRef } from 'react';
import { url } from '../config';

const EditCarForm = ({ carId, onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    owner: {
      name: '',
      phone: '',
      email: '',
      facebook: '',
      instagram: '',
    },
    photos: [],
    videos: [],
    yearOfProduction: '',
    color: '',
    typeOfCar: '',
    interior: '',
    numberOfSeats: '',
    additionalAmenities: [],
    rentalPrice: '',
    location: '',
    rentalDuration: 'hourly',
    specialOptionsForWedding: [],
    description: '',
    isVerified: false,
  });

  const [error, setError] = useState('');
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`${url}/api/cars/${carId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch car data');
        }
        const carData = await response.json();
        setFormData(carData);
        setPhotoPreviews(carData.photos);
        setVideoPreviews(carData.videos);
      } catch (error) {
        setError(error.message);
      }
    };

    if (carId) {
      fetchCarData();
    }
  }, [carId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('owner.')) {
      setFormData({
        ...formData,
        owner: {
          ...formData.owner,
          [name.split('.')[1]]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'photos') {
      setFormData({ ...formData, photos: files });
      setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
    } else if (type === 'videos') {
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
      const response = await fetch(`${url}/api/cars/${carId}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error('Failed to update car details');
      }
      onUpdate(); 
    } catch (error) {
      setError('Failed to update car details');
    }
  };
  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white shadow-md rounded"
    >
      <h2 className="text-2xl font-bold mb-4">Update Car</h2>

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
        {loading ? 'Updating...' : 'Update Car'}
      </button>
    </form>
  );
};

export default EditCarForm;
