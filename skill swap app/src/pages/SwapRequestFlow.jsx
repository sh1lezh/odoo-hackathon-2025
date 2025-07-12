import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUsers } from '../contexts/UserContext';
import { useRequests } from '../contexts/RequestContext';
import { ArrowLeft, User, Send, CheckCircle } from 'lucide-react';

const SwapRequestFlow = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const { user, isLoggedIn } = useAuth();
  const { getProfileById, currentUserProfile } = useUsers();
  const { createRequest } = useRequests();
  
  const [targetProfile, setTargetProfile] = useState(null);
  const [selectedSkillOffered, setSelectedSkillOffered] = useState('');
  const [selectedSkillWanted, setSelectedSkillWanted] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const profile = getProfileById(userId);
    if (profile) {
      setTargetProfile(profile);
    } else {
      navigate('/');
    }
  }, [userId, isLoggedIn, navigate, getProfileById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSkillOffered || !selectedSkillWanted) {
      alert('Please select both a skill to offer and a skill to request');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        fromUserId: user.id,
        toUserId: targetProfile.id,
        fromUserName: currentUserProfile?.name || user.name,
        toUserName: targetProfile.name,
        skillOffered: selectedSkillOffered,
        skillWanted: selectedSkillWanted,
        message: message.trim(),
        status: 'pending'
      };

      createRequest(requestData);
      setIsSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/requests');
      }, 2000);
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!targetProfile || !currentUserProfile) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Request Sent!</h2>
        <p className="text-gray-400">
          Your swap request has been sent to {targetProfile.name}. 
          You'll be notified when they respond.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-white">Send Swap Request</h1>
      </div>

      <div className="card">
        {/* Target User Info */}
        <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="flex-shrink-0">
            {targetProfile.photo ? (
              <img
                src={targetProfile.photo}
                alt={targetProfile.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{targetProfile.name}</h3>
            <p className="text-gray-400">{targetProfile.location}</p>
            <p className="text-sm text-gray-400">Availability: {targetProfile.availability}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target User's Skills */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">What {targetProfile.name} offers:</h3>
            <div className="flex flex-wrap gap-2">
              {targetProfile.skillsOffered.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">What {targetProfile.name} wants:</h3>
            <div className="flex flex-wrap gap-2">
              {targetProfile.skillsWanted.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-600 text-gray-300 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Swap Proposal</h3>
            
            {/* Select Skill to Offer */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                I will offer:
              </label>
              <select
                value={selectedSkillOffered}
                onChange={(e) => setSelectedSkillOffered(e.target.value)}
                className="input-field w-full"
                required
              >
                <option value="">Select a skill to offer</option>
                {currentUserProfile.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Choose from your offered skills
              </p>
            </div>

            {/* Select Skill to Request */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                I want to learn:
              </label>
              <select
                value={selectedSkillWanted}
                onChange={(e) => setSelectedSkillWanted(e.target.value)}
                className="input-field w-full"
                required
              >
                <option value="">Select a skill to request</option>
                {targetProfile.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Choose from {targetProfile.name}'s offered skills
              </p>
            </div>

            {/* Optional Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message (optional):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="input-field w-full"
                placeholder="Add a personal message to your request..."
              />
              <p className="text-xs text-gray-400 mt-1">
                Tell them why you'd like to swap skills
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedSkillOffered || !selectedSkillWanted}
              className="btn-primary flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending...' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestFlow; 