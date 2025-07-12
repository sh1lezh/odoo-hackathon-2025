import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRequests } from '../contexts/RequestContext';
import { User, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';

const SwapRequests = () => {
  const { user, isLoggedIn } = useAuth();
  const { getAllRequests, updateRequestStatus } = useRequests();
  
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (user) {
      const userRequests = getAllRequests(user.id);
      setRequests(userRequests);
    }
  }, [user, getAllRequests]);

  const handleStatusUpdate = (requestId, newStatus) => {
    updateRequestStatus(requestId, newStatus);
    // Refresh requests
    const userRequests = getAllRequests(user.id);
    setRequests(userRequests);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-400 bg-green-900';
      case 'rejected':
        return 'text-red-400 bg-red-900';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900';
      default:
        return 'text-gray-400 bg-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    if (activeTab === 'received') return request.toUserId === user?.id;
    if (activeTab === 'sent') return request.fromUserId === user?.id;
    return request.status === activeTab;
  });

  if (!isLoggedIn) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your requests</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Swap Requests</h1>
        <p className="text-gray-400">Manage your skill swap requests</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All Requests
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'received'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Sent
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'accepted'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Accepted
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'rejected'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const isReceived = request.toUserId === user?.id;
            const otherUserName = isReceived ? request.fromUserName : request.toUserName;
            
            return (
              <div key={request.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* User Info */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {isReceived ? `From ${otherUserName}` : `To ${otherUserName}`}
                        </h3>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="capitalize">{request.status}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-400">You offer:</p>
                          <p className="text-white font-medium">{request.skillOffered}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">You want:</p>
                          <p className="text-white font-medium">{request.skillWanted}</p>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-400">Message:</p>
                          <p className="text-gray-300 text-sm italic">"{request.message}"</p>
                        </div>
                      )}

                      <div className="text-xs text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isReceived && request.status === 'pending' && (
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'accepted')}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="btn-danger text-sm px-3 py-1"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No requests found</h3>
          <p className="text-gray-400">
            {activeTab === 'all' && 'You haven\'t made or received any swap requests yet.'}
            {activeTab === 'received' && 'You haven\'t received any swap requests yet.'}
            {activeTab === 'sent' && 'You haven\'t sent any swap requests yet.'}
            {activeTab === 'pending' && 'No pending requests.'}
            {activeTab === 'accepted' && 'No accepted requests.'}
            {activeTab === 'rejected' && 'No rejected requests.'}
          </p>
          {activeTab === 'sent' && (
            <p className="text-gray-400 mt-2">
              Browse profiles on the home page to send your first request!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SwapRequests; 