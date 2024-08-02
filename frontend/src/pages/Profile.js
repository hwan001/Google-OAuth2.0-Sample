import React from 'react';
import '../App.css';
import IMG_PROFILE from '../images/profile.png';

function Profile({ profileDetails, login, logout, handleRedirect }) {    
    // Ensure profileDetails is not null or undefined
    if (!profileDetails) {
        profileDetails = {};
    }
    
    return (
        <>
            <div className='profile-container'>
                {
                    Object.keys(profileDetails).length !== 0 ? (
                        <div className="profile-details">
                            <img src={profileDetails.picture} alt="profile" className='profile-avathar' />
                            <div className="profile-content">
                                <h3>{profileDetails.name}</h3>
                                <h5>{profileDetails.email}</h5>
                            </div>
                            <div>
                                <button className='profile-button' onClick={logout}>Logout</button>
                            </div>
                            <button className='profile-button' onClick={handleRedirect}>Go to Specific Endpoint</button>
                        </div>
                    ) : (
                        <>
                            <div className="landing-container">
                                <div className="profile-details">
                                    <div className="landing-icon">
                                        <img src={IMG_PROFILE} alt="empty profile" className='profile-avathar' />
                                    </div>
                                    <h4>Sign in to create profile!</h4>
                                    <div>
                                        <button className='profile-button' onClick={login}>⚡ Sign in with Google</button>
                                    </div>
                                    <div>
                                        <button className='profile-button'onClick={handleRedirect}>Go to Specific Endpoint</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </>
    );
}

export default Profile;
//<h1>🎉</h1>