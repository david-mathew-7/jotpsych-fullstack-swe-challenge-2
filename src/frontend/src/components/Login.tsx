import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useFormik } from "formik";
import APIService from '../services/APIService';

function Login() {
  const [message, setMessage] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const apiService = APIService;
        const response = await apiService.request("/login", "POST", values, true);
        const data = response;
        if (data.token) {
          localStorage.setItem("token", data.token);
          setMessage("Login successful");
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        console.error(error);
        setMessage("An error occurred during login.");
      }
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          type="text"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={false}
          helperText=""
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
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
          Login
        </Button>
      </form>
      {message && <p>{message}</p>}
    </Box>
  );
}

export default Login;
