import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import APIService from '../services/APIService'; // Make sure to import APIService correctly

function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiService = APIService; // Get the APIService instance
      const response = await apiService.request("/register", "POST", { username, password }, true); // Use the request method
      const data = response; // Directly use the response since it's already parsed
      setMessage(data.message || "Registration successful");
    } catch (error) {
      console.error(error);
      setMessage("Failed to register.");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={false}
          helperText=""
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={false}
          helperText=""
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ marginTop: 2 }}
        >
          Register
        </Button>
      </form>
      {message && <p>{message}</p>}
    </Box>
  );
}

export default Register;
