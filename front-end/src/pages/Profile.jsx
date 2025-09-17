import './Profile.css';
import { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';

function Profile() {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zip_code: '',
    profile_photo_url: '',
    auth_provider_photo_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setMessage('Unable to fetch user.');
      setLoading(false);
      return;
    }
    setUser(user);

    const { data, error } = await supabase
      .from('citizens')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      setMessage('Failed to load profile.');
    } else {
      setProfile({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        city: data.city || '',
        state: data.state || '',
        zip_code: data.zip_code || '',
        profile_photo_url: data.profile_photo_url || '',
        auth_provider_photo_url: data.auth_provider_photo_url || ''
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setLoading(true);
    setMessage('');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase
      .storage
      .from('profile_photo_images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage('Photo upload failed.');
      setLoading(false);
      return;
    }

    const { data: publicURLData } = supabase
      .storage
      .from('profile_photo_images')
      .getPublicUrl(filePath);

    const updates = {
      profile_photo_url: publicURLData.publicUrl,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('citizens')
      .update(updates)
      .eq('id', user.id);

    if (updateError) {
      setMessage('Failed to update profile photo.');
    } else {
      setProfile((prev) => ({
        ...prev,
        profile_photo_url: publicURLData.publicUrl
      }));
      setMessage('Photo updated successfully!');
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage('');

    const updates = {
      phone: profile.phone,
      city: profile.city,
      state: profile.state,
      zip_code: profile.zip_code,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('citizens')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      setMessage('Failed to update profile.');
    } else {
      setMessage('Profile updated successfully!');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="profile-card">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <h1>Profile</h1>

      <div className="profile-photo-section">
        <img
          src={profile.profile_photo_url || profile.auth_provider_photo_url || '/default-avatar.png'}
          alt="Profile"
          className="avatar"
        />
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
      <md-text-button>Edit</md-text-button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <div className="profile-fields">
          <md-outlined-text-field
            label="Full Name"
            value={profile.full_name}
            readOnly
          ></md-outlined-text-field>

          <md-outlined-text-field
            label="Email"
            value={profile.email}
            readOnly
          ></md-outlined-text-field>

          <md-outlined-text-field
            label="Phone"
            name="phone"
            type="text"
            value={profile.phone}
            onChange={handleChange}
          ></md-outlined-text-field>

          <md-outlined-text-field
            label="City"
            name="city"
            value={profile.city}
            onChange={handleChange}
          ></md-outlined-text-field>

          <md-outlined-text-field
            label="State"
            name="state"
            value={profile.state}
            onChange={handleChange}
          ></md-outlined-text-field>

          <md-outlined-text-field
            label="Zip Code"
            name="zip_code"
            value={profile.zip_code}
            onChange={handleChange}
          ></md-outlined-text-field>
        </div>

        <md-filled-button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </md-filled-button>
      </form>

      <md-filled-button onClick={handleLogout}>
        Logout
      </md-filled-button>

      {message && <p className="profile-message">{message}</p>}
    </div>
  );
}

export default Profile;
