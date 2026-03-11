import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import propertyService from '../services/propertyService';
import api from '../services/api';
import { HiArrowLeft, HiUpload, HiX, HiOutlineShieldExclamation, HiPlus } from 'react-icons/hi';
import SafeImage from '../components/SafeImage';
import { useAuth } from '../context/AuthContext';

const AddProperty = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isUnverifiedAgent = user?.role?.slug === 'agent' && !user?.is_verified;
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'house',
        status: 'for_sale',
        price: '',
        address: '',
        location_id: '',
        bedrooms: '',
        bathrooms: '',
        size: '',
        land_size: '',
        land_size_unit: 'sqm',
        zoning: '',
        topography: '',
        access_road: '',
        title_type: '',
        price_per_sqm: '',
        virtual_tour_url: '',
        availability: 'available',
    });
    const [amenities, setAmenities] = useState(['']);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await api.get('/locations');
                setLocations(response.data);
                if (response.data.length > 0) {
                    setFormData(prev => ({ ...prev, location_id: response.data[0].id }));
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const addAmenity = () => setAmenities(prev => [...prev, '']);
    const removeAmenity = (index) => setAmenities(prev => prev.filter((_, i) => i !== index));
    const updateAmenity = (index, value) => setAmenities(prev => prev.map((a, i) => i === index ? value : a));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        images.forEach(image => {
            data.append('images[]', image);
        });

        amenities.filter(a => a?.trim()).forEach(name => {
            data.append('amenity_names[]', name.trim());
        });

        try {
            await propertyService.create(data);
            navigate('/dashboard/properties');
        } catch (error) {
            console.error('Error creating property:', error);
            alert('Failed to create property. ' + (error.response?.data?.message || 'Check backend connection.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center w-fit cursor-pointer px-6 py-3 border border-black/10 bg-gray-900 z-10 relative text-xs text-start font-black uppercase tracking-widest text-white hover:bg-blue-600 transition shadow-lg space-x-4 mb-8">
                <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                <button onClick={() => navigate(-1)} className="z-10 relative ">
                    <HiArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="font-black">Add New Property</h1>
            </div>

            {isUnverifiedAgent && (
                <div className="mb-8 p-6 bg-amber-50 border-l-4 border-indigo-600 rounded-r-2xl flex items-center space-x-4 animate-in slide-in-from-top duration-500">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <HiOutlineShieldExclamation className="h-10 w-10 text-green-600 shrink-0" />
                    <div>
                        <h3 className="text-amber-800 font-black uppercase text-xs tracking-widest">Verification Required</h3>
                        <p className="text-amber-700 text-sm font-medium mt-1">
                            Your agent account is currently pending admin approval. You can draft your property listing, but you cannot publish it until you are verified.
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 z-10 relative">
                {/* Basic Information */}
                <div className="bg-green-600 border border-black/30 p-8 relative shadow-sm space-y-6">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <h2 className="block text-lg text-start font-black text-white uppercase tracking-widest mb-6">Basic Information</h2>
                    <div className="grid grid-cols-1 gap-6 z-10 relative">
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Property Title</label>
                            <input name="title" required onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" placeholder="e.g. Modern Luxury Villa in Beverly Hills" />
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Description</label>
                            <textarea name="description" rows="5" required onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" placeholder="Describe the property details, surroundings, and highlights..."></textarea>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Property Type</label>
                            <select name="type" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70">
                                <option value="house">House</option>
                                <option value="apartment">Apartment</option>
                                <option value="commercial">Commercial</option>
                                <option value="land">Land</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Listing Status</label>
                            <select name="status" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70">
                                <option value="for_sale">For Sale</option>
                                <option value="for_rent">For Rent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Virtual Tour URL (Optional)</label>
                            <input name="virtual_tour_url" type="url" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" placeholder="https://youtube.com/..." />
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Availability</label>
                            <select name="availability" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70">
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                                <option value="reserved">Reserved</option>
                                <option value="off_market">Off Market</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pricing & Location */}
                <div className="bg-green-600 border border-black/30 relative p-8 shadow-sm space-y-6">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <h2 className="block text-lg text-start font-black text-white uppercase tracking-widest mb-6">Pricing & Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Price (UGX)</label>
                            <input name="price" type="number" required onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" placeholder="e.g. 500000" />
                        </div>
                        <div>
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Location Area</label>
                            <select name="location_id" required onChange={handleChange} value={formData.location_id} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70">
                                <option value="">Select a location</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Physical Address</label>
                            <input name="address" required onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" placeholder="Street name, plot number, etc." />
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div className="bg-green-600 relative p-8 shadow-sm border border-black/30 space-y-6">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <h2 className="block text-lg text-start font-black text-white uppercase tracking-widest mb-6">Amenities</h2>
                    <p className="text-sm text-white/80 mb-4 z-10 relative text-start">Add amenities offered by this property (e.g. Swimming Pool, Parking, Security).</p>
                    <div className="space-y-3 z-10 relative">
                        {amenities.map((name, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => updateAmenity(index, e.target.value)}
                                    className="flex-1 bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70"
                                    placeholder="e.g. Swimming Pool"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeAmenity(index)}
                                    disabled={amenities.length === 1}
                                    className="p-2 bg-red-500/80 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <HiX className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addAmenity}
                            className="flex items-center gap-2 px-4 py-2 border border-dashed border-white/50 text-white hover:bg-white/10 transition text-sm font-bold"
                        >
                            <HiPlus className="h-4 w-4" />
                            Add more
                        </button>
                    </div>
                </div>

                {/* Property Features (Common) */}
                {formData.type !== 'land' && (
                    <div className="bg-green-600 relative p-8 shadow-sm border border-black/30 space-y-6">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <h2 className="block text-lg text-start font-black text-white uppercase tracking-widest mb-6">Property Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-10 relative">
                            <div>
                                <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Bedrooms</label>
                                <input name="bedrooms" type="number" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" />
                            </div>
                            <div>
                                <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Bathrooms</label>
                                <input name="bathrooms" type="number" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" />
                            </div>
                            <div>
                                <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Area (sqft)</label>
                                <input name="size" type="number" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Land-Specific Details */}
                {formData.type === 'land' && (
                    <div className="bg-green-600 relative p-8 border space-y-6 border-black/30">
                        <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        <h2 className="block text-lg text-start font-black text-white uppercase tracking-widest mb-6">Land Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
                            <div>
                                <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Land Size</label>
                                <input name="land_size" type="number" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" />
                            </div>
                            <div>
                                <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Zoning Type</label>
                                <input name="zoning" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" placeholder="Residential, Commercial, Agricultural..." />
                            </div>
                            <div>
                                <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Title Type</label>
                                <input name="title_type" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" placeholder="Deed, Certificate of Occupancy..." />
                            </div>
                            <div>
                                <label className="block text-xs text-start font-black text-black uppercase tracking-widest mb-1">Access Road</label>
                                <input name="access_road" onChange={handleChange} className="w-full bg-gray-50 border border-black/80 p-2 focus:ring-0 text-sm font-bold text-black/70 placeholder-black/70" placeholder="Paved, Dirt..." />
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Upload Placeholder */}
                <div className="bg-green-600 p-8 relative shadow-sm border border-black/30">
                    <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                    <h2 className="block text-lg text-start font-black text-white uppercase tracking-widest mb-6">Property Images</h2>

                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 w-fit gap-4 mb-6">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative group w-20 h-20 rounded-2xl overflow-hidden border">
                                    <SafeImage src={preview} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <HiX className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="relative">
                        <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            accept=".jpg,.jpeg,.png,.webp,.avif,.gif,image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:bg-gray-50 transition">
                            <HiUpload className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-black font-medium">Click to upload or drag and drop photos</p>
                            <p className="text-xs text-gray-300 mt-2 uppercase font-bold tracking-widest">Supports JPG, JPEG, PNG, WEBP, AVIF, GIF up to 5MB each</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 border border-black  text-xs text-start font-black uppercase tracking-widest text-black hover:bg-blue-600 transition shadow-lg">Cancel</button>
                    <button
                        type="submit"
                        disabled={loading || isUnverifiedAgent}
                        className={`px-6 py-3 border border-black/10 text-xs text-start font-black uppercase tracking-widest text-white transition z-10 shadow-lg relative ${isUnverifiedAgent ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-blue-600'}`}
                    >
                         <img src="/bg-img.png" className='absolute w-full h-full object-cover opacity-20 inset-0' alt="" />
                        {loading ? 'Creating...' : 'Publish Property'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProperty;
