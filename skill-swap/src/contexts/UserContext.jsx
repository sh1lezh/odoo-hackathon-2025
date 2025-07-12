import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  useEffect(() => {
    // Load mock profiles from localStorage or create default ones
    const savedProfiles = localStorage.getItem('skillSwapProfiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    } else {
      // Create mock profiles
      const mockProfiles = [
        {
          id: '1',
          name: 'John Doe',
          location: 'New York, NY',
          photo: null,
          skillsOffered: ['React', 'JavaScript', 'Node.js'],
          skillsWanted: ['Python', 'Machine Learning'],
          availability: 'Weekends',
          rating: 4.5,
          isPublic: true
        },
        {
          id: '2',
          name: 'Jane Smith',
          location: 'San Francisco, CA',
          photo: null,
          skillsOffered: ['Python', 'Data Science', 'SQL'],
          skillsWanted: ['React', 'TypeScript'],
          availability: 'Evenings',
          rating: 4.8,
          isPublic: true
        },
        {
          id: '3',
          name: 'Mike Johnson',
          location: 'Austin, TX',
          photo: null,
          skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
          skillsWanted: ['JavaScript', 'React'],
          availability: 'Weekdays',
          rating: 4.2,
          isPublic: true
        }
      ];
      setProfiles(mockProfiles);
      localStorage.setItem('skillSwapProfiles', JSON.stringify(mockProfiles));
    }

    // Load current user profile
    const savedCurrentProfile = localStorage.getItem('skillSwapCurrentProfile');
    if (savedCurrentProfile) {
      setCurrentUserProfile(JSON.parse(savedCurrentProfile));
    }
  }, []);

  const updateProfile = (profileData) => {
    setCurrentUserProfile(profileData);
    localStorage.setItem('skillSwapCurrentProfile', JSON.stringify(profileData));
    
    // Update in profiles list if it exists
    setProfiles(prev => {
      const updated = prev.map(p => p.id === profileData.id ? profileData : p);
      localStorage.setItem('skillSwapProfiles', JSON.stringify(updated));
      return updated;
    });
  };

  const createProfile = (profileData) => {
    const newProfile = { ...profileData, id: Date.now().toString() };
    setCurrentUserProfile(newProfile);
    setProfiles(prev => {
      const updated = [...prev, newProfile];
      localStorage.setItem('skillSwapProfiles', JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem('skillSwapCurrentProfile', JSON.stringify(newProfile));
  };

  const getPublicProfiles = () => {
    return profiles.filter(profile => profile.isPublic);
  };

  const getProfileById = (id) => {
    return profiles.find(profile => profile.id === id);
  };

  const value = {
    profiles,
    currentUserProfile,
    updateProfile,
    createProfile,
    getPublicProfiles,
    getProfileById
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 