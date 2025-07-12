import { createContext, useContext, useState, useEffect } from 'react';

const RequestContext = createContext();

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Load requests from localStorage
    const savedRequests = localStorage.getItem('skillSwapRequests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, []);

  const saveRequests = (newRequests) => {
    setRequests(newRequests);
    localStorage.setItem('skillSwapRequests', JSON.stringify(newRequests));
  };

  const createRequest = (requestData) => {
    const newRequest = {
      id: Date.now().toString(),
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    const updatedRequests = [...requests, newRequest];
    saveRequests(updatedRequests);
    return newRequest;
  };

  const updateRequestStatus = (requestId, status) => {
    const updatedRequests = requests.map(request => 
      request.id === requestId ? { ...request, status } : request
    );
    saveRequests(updatedRequests);
  };

  const getReceivedRequests = (userId) => {
    return requests.filter(request => request.toUserId === userId);
  };

  const getSentRequests = (userId) => {
    return requests.filter(request => request.fromUserId === userId);
  };

  const getAllRequests = (userId) => {
    return requests.filter(request => 
      request.fromUserId === userId || request.toUserId === userId
    );
  };

  const value = {
    requests,
    createRequest,
    updateRequestStatus,
    getReceivedRequests,
    getSentRequests,
    getAllRequests
  };

  return (
    <RequestContext.Provider value={value}>
      {children}
    </RequestContext.Provider>
  );
}; 