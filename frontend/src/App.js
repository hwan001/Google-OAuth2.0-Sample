import './App.css';
import React from 'react';
import { useProfile } from './hooks/useProfile';
import Profile from './pages/Profile';
import { BASE_URL } from './constants';

function App() {
    const { profile, login, error, setProfile } = useProfile();

    const handleSignOut = () => {
      fetch(BASE_URL + '/logout', {
        method: 'POST',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setProfile(null);
        })
        .catch(error => console.error('Error:', error));
    };
  
    const handleRedirect = () => {
      window.location.href = `${BASE_URL}/protected`;
    };
  
    return (
      <div>
        <Profile profileDetails={profile} login={login} logout={handleSignOut} handleRedirect={handleRedirect} />
        {error && <p>Error fetching profile: {error.message}</p>}
      </div>
    );
}

export default App;
