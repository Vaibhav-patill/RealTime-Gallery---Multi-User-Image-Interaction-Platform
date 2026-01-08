
import { useState } from "react";
import { createPortal } from "react-dom";
import { Camera, LogOut, Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getInitials } from "../../utils/helpers";
import AdminPanel from "../Admin/AdminPanel";

const Header = () => {
  const { userProfile, isAdmin, signOut } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 glass-effect shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600/10 text-indigo-700 p-2.5 rounded-xl">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">RealTime Gallery</h1>
                <p className="text-xs text-slate-500">
                  Live interactions, instant updates
                </p>
              </div>
            </div>

            {userProfile && (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <button
                    onClick={() => setShowAdminPanel(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </button>
                )}

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: userProfile.userColor }}
                  >
                    {getInitials(userProfile.username)}
                  </div>
                  <span className="text-sm font-semibold hidden sm:block">
                    {userProfile.username}
                  </span>
                </div>

                <button
                  onClick={signOut}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <LogOut className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showAdminPanel &&
        createPortal(
          <AdminPanel onClose={() => setShowAdminPanel(false)} />,
          document.body
        )}
    </>
  );
};

export default Header;
