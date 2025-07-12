import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUsers } from '../contexts/UserContext';
import { User, MapPin, Camera, Save, X, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { currentUserProfile, updateProfile, createProfile } = useUsers();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    photo: '',
    skillsOffered: '',
    skillsWanted: '',
    availability: '',
    isPublic: true
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUserProfile) {
      setFormData({
        name: currentUserProfile.name || '',
        location: currentUserProfile.location || '',
        photo: currentUserProfile.photo || '',
        skillsOffered: currentUserProfile.skillsOffered ? currentUserProfile.skillsOffered.join(', ') : '',
        skillsWanted: currentUserProfile.skillsWanted ? currentUserProfile.skillsWanted.join(', ') : '',
        availability: currentUserProfile.availability || '',
        isPublic: currentUserProfile.isPublic !== undefined ? currentUserProfile.isPublic : true
      });
    }
  }, [currentUserProfile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setMessage('Name is required');
        setIsSaving(false);
        return;
      }

      // Convert skills strings to arrays
      const skillsOffered = formData.skillsOffered
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const skillsWanted = formData.skillsWanted
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const profileData = {
        id: currentUserProfile?.id || Date.now().toString(),
        userId: user?.id,
        name: formData.name.trim(),
        location: formData.location.trim(),
        photo: formData.photo.trim(),
        skillsOffered,
        skillsWanted,
        availability: formData.availability.trim(),
        isPublic: formData.isPublic,
        rating: currentUserProfile?.rating || 0
      };

      if (currentUserProfile) {
        updateProfile(profileData);
      } else {
        createProfile(profileData);
      }

      setMessage('Profile saved successfully!');
      setIsEditing(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (currentUserProfile) {
      setFormData({
        name: currentUserProfile.name || '',
        location: currentUserProfile.location || '',
        photo: currentUserProfile.photo || '',
        skillsOffered: currentUserProfile.skillsOffered ? currentUserProfile.skillsOffered.join(', ') : '',
        skillsWanted: currentUserProfile.skillsWanted ? currentUserProfile.skillsWanted.join(', ') : '',
        availability: currentUserProfile.availability || '',
        isPublic: currentUserProfile.isPublic !== undefined ? currentUserProfile.isPublic : true
      });
    }
    setIsEditing(false);
    setMessage('');
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleDiscard}
                  className="btn-secondary flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Discard</span>
                </button>
              </>
            )}
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-900 border border-green-700 text-green-200'
              : 'bg-red-900 border border-red-700 text-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter photo URL"
                  className="input-field w-full"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter a URL for your profile photo
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="input-field w-full"
              placeholder="Enter your full name"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field pl-10 w-full"
                placeholder="City, State or Country"
              />
            </div>
          </div>

          {/* Skills Offered */}
          <div>
            <label htmlFor="skillsOffered" className="block text-sm font-medium text-gray-300 mb-2">
              Skills You Offer
            </label>
            <textarea
              id="skillsOffered"
              name="skillsOffered"
              value={formData.skillsOffered}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              className="input-field w-full"
              placeholder="Enter skills separated by commas (e.g., React, JavaScript, Node.js)"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate multiple skills with commas
            </p>
          </div>

          {/* Skills Wanted */}
          <div>
            <label htmlFor="skillsWanted" className="block text-sm font-medium text-gray-300 mb-2">
              Skills You Want
            </label>
            <textarea
              id="skillsWanted"
              name="skillsWanted"
              value={formData.skillsWanted}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              className="input-field w-full"
              placeholder="Enter skills separated by commas (e.g., Python, Machine Learning, Design)"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate multiple skills with commas
            </p>
          </div>

          {/* Availability */}
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-300 mb-2">
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              disabled={!isEditing}
              className="input-field w-full"
            >
              <option value="">Select availability</option>
              <option value="Weekends">Weekends</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Evenings">Evenings</option>
              <option value="Mornings">Mornings</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          {/* Profile Visibility */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                disabled={!isEditing}
                className="rounded border-gray-600 text-primary-600 focus:ring-primary-500 bg-gray-700"
              />
              <span className="text-sm font-medium text-gray-300">
                Make profile public
              </span>
              {formData.isPublic ? (
                <Eye className="w-4 h-4 text-gray-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Public profiles are visible to all users and can receive swap requests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 