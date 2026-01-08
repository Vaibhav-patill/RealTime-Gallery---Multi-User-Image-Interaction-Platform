
import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  MessageSquare,
  Heart,
  Activity,
  Trash2,
  Ban,
  X,
} from "lucide-react";
import useInteractions from "../../hooks/useInteractions";
import { db } from "../../services/instantdb";
import * as adminService from "../../services/admin";
import { getInitials, formatRelativeTime } from "../../utils/helpers";

const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("users");
  const { activities } = useInteractions();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const { data: allData, isLoading } = db.useQuery({
    users: {},
    reactions: {},
    comments: {},
    activities: {},
  });

  const users = allData?.users || [];
  const reactions = allData?.reactions || [];
  const comments = allData?.comments || [];


  const handleDeleteUser = async (id, username) => {
    if (window.confirm(`Delete user "${username}" permanently?`)) {
      await adminService.deleteUser(id);
    }
  };

  const handleBanUser = async (id, username) => {
    if (window.confirm(`Ban user "${username}"?`)) {
      await adminService.banUser(id);
    }
  };

  const handleDeleteReaction = async (id) => {
    await adminService.deleteReaction(id);
  };

  const handleDeleteComment = async (id) => {
    if (window.confirm("Delete this comment?")) {
      await adminService.deleteComment(id);
    }
  };

  const handleClearAllActivities = async () => {
    if (window.confirm(`Clear all ${activities.length} activities?`)) {
      await adminService.clearAllActivities(activities);
    }
  };


  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="text-center mt-3 text-slate-600">
            Loading admin data...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start overflow-y-auto px-4 py-6">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-lg shadow-xl flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-md">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Admin Panel</h2>
              <p className="text-sm text-slate-500">System management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-4 border-b bg-slate-50">
          {[
            { label: "Users", value: users.length, icon: Users },
            { label: "Reactions", value: reactions.length, icon: Heart },
            { label: "Comments", value: comments.length, icon: MessageSquare },
            { label: "Activities", value: activities.length, icon: Activity },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white border rounded-md p-3 flex items-center gap-3"
            >
              <item.icon className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 px-6 py-2 border-b overflow-x-auto">
          {["users", "reactions", "comments", "activities"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-slate-600 hover:text-slate-800"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">

          {activeTab === "users" &&
            users.map((u) => (
              <div
                key={u.id}
                className="flex justify-between items-center border rounded-md p-3 bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: u.userColor }}
                  >
                    {getInitials(u.username)}
                  </div>
                  <div>
                    <p className="font-semibold">{u.username}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                </div>

                {!u.isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBanUser(u.id, u.username)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-md"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id, u.username)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

          {activeTab === "reactions" &&
            reactions.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center border rounded-md p-3 bg-slate-50"
              >
                <div>
                  <span className="text-2xl">{r.emoji}</span>
                  <p className="text-sm font-medium">{r.username}</p>
                  <p className="text-xs text-slate-500">
                    {formatRelativeTime(r.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteReaction(r.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

          {activeTab === "comments" &&
            comments.map((c) => (
              <div key={c.id} className="border rounded-md p-3 bg-slate-50">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{c.username}</p>
                    <p className="text-sm text-slate-700 mt-1">{c.text}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatRelativeTime(c.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

          {activeTab === "activities" && (
            <>
              <button
                onClick={handleClearAllActivities}
                className="mb-3 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
              >
                Clear All Activities
              </button>

              {activities.map((a) => (
                <div key={a.id} className="border rounded-md p-3 bg-slate-50">
                  <p className="text-sm">
                    <b>{a.username}</b>{" "}
                    <span className="text-slate-600">
                      {a.type.replace("_", " ")}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatRelativeTime(a.timestamp)}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
