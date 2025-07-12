import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUsers } from '../contexts/UserContext';
import { Search, Star, MapPin, Clock, User } from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage] = useState(6);
  
  const { isLoggedIn } = useAuth();
  const { getPublicProfiles } = useUsers();
  
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useEffect(() => {
    const publicProfiles = getPublicProfiles();
    setProfiles(publicProfiles);
  }, [getPublicProfiles]);

  useEffect(() => {
    let filtered = profiles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(profile => 
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.skillsOffered.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        profile.skillsWanted.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by availability
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(profile => 
        profile.availability.toLowerCase().includes(availabilityFilter.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [profiles, searchTerm, availabilityFilter]);

  // Get current profiles for pagination
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-400" />);
    }

    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 text-glow">
          Find Your Perfect Skill Swap
        </h1>
        <p className="text-gray-300 text-lg">
          Connect with people who have the skills you need and share your expertise
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="input-field w-full md:w-48"
          >
            <option value="all">All Availability</option>
            <option value="weekends">Weekends</option>
            <option value="weekdays">Weekdays</option>
            <option value="evenings">Evenings</option>
            <option value="mornings">Mornings</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-300">
          Showing {filteredProfiles.length} of {profiles.length} profiles
        </p>
      </div>

      {/* Profiles Grid */}
      {currentProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentProfiles.map((profile) => (
            <div key={profile.id} className="card hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-start space-x-4">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-white/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-700/80 flex items-center justify-center ring-2 ring-white/30">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {profile.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {renderStars(profile.rating)}
                      <span className="text-sm text-gray-300 ml-1">
                        {profile.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-300 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{profile.location}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-300 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{profile.availability}</span>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-300 mb-1">Offers:</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skillsOffered.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm border border-white/30"
                          >
                            {skill}
                          </span>
                        ))}
                        {profile.skillsOffered.length > 3 && (
                          <span className="px-2 py-1 bg-gray-600/80 text-gray-300 text-xs rounded-full backdrop-blur-sm">
                            +{profile.skillsOffered.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-300 mb-1">Wants:</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skillsWanted.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-600/80 text-gray-300 text-xs rounded-full backdrop-blur-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {profile.skillsWanted.length > 3 && (
                          <span className="px-2 py-1 bg-gray-600/80 text-gray-300 text-xs rounded-full backdrop-blur-sm">
                            +{profile.skillsWanted.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Request Button */}
                  <div className="mt-4">
                    {isLoggedIn ? (
                      <Link
                        to={`/request/${profile.id}`}
                        className="btn-primary w-full text-center block"
                      >
                        Request Swap
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="btn-secondary w-full opacity-50 cursor-not-allowed"
                      >
                        Login to Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No profiles found</h3>
          <p className="text-gray-300">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/90 backdrop-blur-sm'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home; 