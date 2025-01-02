import React, { useState } from 'react'
import { useAuthStore } from '../store/userAuthstore'
import { Camera, CameraOff, Mail, SwitchCameraIcon, User } from 'lucide-react';
import { BiConversation, BiCalendar, BiSolidUserCheck } from "react-icons/bi";


const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);


  const handleImageUpload = async(e) =>{
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async() =>{
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({profilePic: base64Image});
    }
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profil</h1>
            <p className="mt-2">Profil Bilgileri</p>
          </div>
          {/* Profil Resmi Yükleme */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/favicon.ico"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
              <SwitchCameraIcon className="w-5 h-5 text-base-200"/>
              <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="sext-sm text-zinc-400">
              {isUpdatingProfile? "Profil Resmi Yükleniyor..." : "Profil resmi yüklemek için kamera ikonuna tıklayın"}
            </p>
          </div>
          <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center">
              <User className="w-4 h-4 mr-2"/>
              İsminiz
            </div>
            <p>{authUser?.fullName}</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center">
              <Mail className="w-4 h-4 mr-2"/>
              Mailiniz
            </div>
            <p>{authUser?.email}</p>
          </div>

          <div className="mt-6 bg-base-200 rounded-xl p-6">
            <h2 className="text-lg font-meidum mb-4">Hesap Bilgileri</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Üyelik Tarihi</span> 
                <span><BiCalendar />{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Hesap Durumu </span>
                <span className=" text-green-500"><BiSolidUserCheck className="text-3xl"/></span>
              </div>
            </div>
            
          </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage
