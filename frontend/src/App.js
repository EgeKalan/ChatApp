import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

import { Route, Routes, Navigate } from 'react-router'
import { axiosInstance } from './lib/axios'
import { useAuthStore } from './store/userAuthstore'

import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";


const App = () => {
  const {authUser,checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();

  console.log({onlineUsers});

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);
  
  console.log({authUser});

  if(isCheckingAuth && !authUser) 
    return(
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )
    
    
  

  return (
    <div >
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App