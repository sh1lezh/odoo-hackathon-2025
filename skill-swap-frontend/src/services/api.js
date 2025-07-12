import React, { useState } from 'react';
import axios from 'axios';

const SkillSwapForm = () => {
  const [formData, setFormData] = useState({ skills_offered: '', skills_wanted: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000', formData);
      alert(response.data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={formData.skills_offered}
        onChange={(e) => setFormData({ ...formData, skills_offered: e.target.value })}
      >
        <option value="">Choose one of your offered skills</option>
        <option value="Skill1">Skill1</option>
        <option value="Skill2">Skill2</option>
      </select>
      <select
        value={formData.skills_wanted}
        onChange={(e) => setFormData({ ...formData, skills_wanted: e.target.value })}
      >
        <option value="">Choose one of their wanted skills</option>
        <option value="Skill3">Skill3</option>
        <option value="Skill4">Skill4</option>
      </select>
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Message"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SkillSwapForm;
