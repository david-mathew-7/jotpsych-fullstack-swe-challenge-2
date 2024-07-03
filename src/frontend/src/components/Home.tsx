import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Typography, Button, IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import APIService from '../services/APIService'; // Import APIService
import AudioRecorder from "./AudioRecorder";

function Home() {
  const [username, setUsername] = useState<string>("");
  const [motto, setMotto] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      let token = localStorage.getItem('token');

      if (token) {
        const apiService = APIService; // Get the APIService instance
        const response = await apiService.request("/user", "GET", undefined, true);
        console.log(response);
        if (response.username) {
          setUsername(response.username);
          setMotto(response.motto);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/refresh");
    setTimeout(() => navigate(-1), 100);
  };

  const handleMottoChange = (newMotto: string) => {
    setMotto(newMotto);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        {username ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h5" style={{ margin: 0 }}>
                    {/* Replace with user icon */}
                    👤
                  </Typography>
                </div>
                <Typography variant="subtitle1" style={{ marginTop: '5px' }}>
                  {username}
                </Typography>
              </div>
              <Typography variant="body1">
                "{motto}"
              </Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
                <AudioRecorder onMottoChange={handleMottoChange} />
              </Button>
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
            
          </>
        ) : (
          <Typography variant="body1">
            Please <Link to="/login">login</Link> or{" "}
            <Link to="/register">register</Link>.
          </Typography>
        )}
      </div>
    </div>
  );
}

export default Home;