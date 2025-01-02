import React from 'react'
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/userAuthstore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageCircle, MessageSquare, User } from 'lucide-react';
import { BiConversation } from "react-icons/bi";
import { Link } from 'react-router';
import toast from "react-hot-toast";

import {Toast} from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName:"",
    email:"",
    password:"",
  });

  const { signup, isSigningUp } = useAuthStore();


  const validateForm = () => {
    if(!formData.fullName.trim()) 
      return toast.error("Tam isim Gerekli");
    if(!formData.email.trim())
      return toast.error("E-Posta Gerekli");
    if(!formData.password)
      return toast.error("Şifre Gerekli");
    if(formData.password.length < 6)
      return toast.error("Şifre en az 6 karakterden oluşmalıdır");

    return true
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    const success = validateForm()

    if(success === true) signup(formData);
  };
  return (
    <div className="min-h-screen grid ">
      
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        
        <div className="w-full max-w-md space-y-8 pt-3">
        {/* Logo */}
          <div className="text-center mb-8">

              <div className="flex flex-col items-center gap-2 group">

                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center
                group-hover:bg-primary/20 transition-colors">
                  <BiConversation className="size-6 text-primary"/>
                </div>
                  <h1 className="text-2xl font-bold mt-2">Hesap Oluştur</h1>
                  <p className="text-base-content/60">Ücretsiz hesapla hemen başlayın</p>
              </div>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Tam İsim</span>
              </label>
              <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="size-5 text-base-content/40"/>
              </div>
              <input
                type="text"
                className={`input input-bordered w-full pl-10`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40"/>
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="name@email.com"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email:e.target.value})}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Şifre</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40"/>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="•••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() =>setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40"/>
                  ) : (
                    <Eye className="size-5 text-base-content/40"/>
                  )
                }
                </button>
              </div>
            </div>

            <button 
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin"/>
                  Bekleniyor...
                </>
              ) : (
                "Hesap Oluştur"
              )}
            </button>
 
          </form>

          <div className="text-center">
              <p className="text-base-content-60">
                Hesabınız var mı?{""}
                <Link to="/login" className="link link-primary">
                  Giriş Yap
                </Link>
              </p>
            </div>
        </div>

      </div>

    </div>
  );
};

export default SignUpPage
