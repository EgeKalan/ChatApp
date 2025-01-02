import React, { useState } from 'react'
import { useAuthStore } from '../store/userAuthstore'
import { Link } from 'react-router';
import { LogOut, MessageCircle, MessageSquare, Settings, User } from 'lucide-react';
import { BiConversation, BiColorFill } from "react-icons/bi";

const Navbar = () => {
  const {logout, authUser} = useAuthStore();

  return (
<header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
  <div className="container mx-auto px-4 h-16 ">

     
    <div className="flex items-center justify-between h-full">
         



      <div className="flex items-center justify-center gap-8 ">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center  justify-center">
            <BiConversation className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold">ChatApp</h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">

        {authUser ? (
          <>
            {/* Profil Linki */}
            <Link to="/profile" className="btn btn-sm gap-2">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Profil</span>
            </Link>

            {/* Çıkış Yap Butonu */}
            <button
              className="flex gap-2 items-center btn btn-sm btn-ghost"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Çıkış Yap</span>
            </button>
          </>
        ) : null}
      </div>
    </div>
  </div>
</header>

  );
};

export default Navbar
