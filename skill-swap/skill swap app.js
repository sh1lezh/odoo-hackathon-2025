import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SkillSwapPlatform() {
  const [profile, setProfile] = useState({ name: '', location: '', photo: '', skillsOffered: '', skillsWanted: '', availability: '', isPublic: true });
  const [swaps, setSwaps] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSwapRequest = () => {
    setSwaps(prev => [...prev, { ...profile, id: Date.now(), status: 'pending' }]);
  };

  const handleFeedback = (id, feedback) => {
    setFeedbacks(prev => [...prev, { id, feedback }]);
  };

  const acceptSwap = (id) => {
    setSwaps(prev => prev.map(s => s.id === id ? { ...s, status: 'accepted' } : s));
  };

  const rejectSwap = (id) => {
    setSwaps(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🛠️ Skill Swap Platform</h1>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Create Profile</TabsTrigger>
          <TabsTrigger value="swaps">Swap Requests</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="mt-4">
            <CardContent className="space-y-4">
              <Input placeholder="Name" name="name" onChange={handleProfileChange} />
              <Input placeholder="Location (optional)" name="location" onChange={handleProfileChange} />
              <Input placeholder="Photo URL (optional)" name="photo" onChange={handleProfileChange} />
              <Input placeholder="Skills Offered" name="skillsOffered" onChange={handleProfileChange} />
              <Input placeholder="Skills Wanted" name="skillsWanted" onChange={handleProfileChange} />
              <Input placeholder="Availability (e.g., weekends)" name="availability" onChange={handleProfileChange} />
              <Button onClick={handleSwapRequest}>Request Swap</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swaps">
          {swaps.map((swap, i) => (
            <Card key={i} className="mt-4">
              <CardContent className="space-y-2">
                <p><b>{swap.name}</b> ({swap.location})</p>
                <p>Offered: {swap.skillsOffered}</p>
                <p>Wanted: {swap.skillsWanted}</p>
                <p>Availability: {swap.availability}</p>
                <p>Status: {swap.status}</p>
                <Button onClick={() => acceptSwap(swap.id)}>Accept</Button>
                <Button variant="destructive" onClick={() => rejectSwap(swap.id)}>Reject</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="feedback">
          {swaps.filter(s => s.status === 'accepted').map((swap, i) => (
            <Card key={i} className="mt-4">
              <CardContent>
                <p>Leave feedback for <b>{swap.name}</b></p>
                <Textarea onBlur={(e) => handleFeedback(swap.id, e.target.value)} placeholder="Your feedback..." />
              </CardContent>
            </Card>
          ))}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Feedback Received:</h2>
            <ul className="list-disc pl-6">
              {feedbacks.map((f, i) => <li key={i}>{f.feedback}</li>)}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
