import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Perform sign-out logic here (e.g., clear user data, tokens)
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-full">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Are you sure you want to sign out?</h2>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-500"
        >
          Yes, Sign Out
        </button>
      </div>
    </div>
  );
};

export default SignOut;
