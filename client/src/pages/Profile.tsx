import { useAppContext } from "../context/AppContext";
import { UseTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import type { ProfileFormData } from "../types";
import Card from "../components/ui/Card";
import { Calendar, LogOutIcon, MoonIcon, Scale, SunIcon, Target, User } from "lucide-react";
import Button from "../components/ui/Button";
import { goalLabels, goalOptions } from "../assets/assets";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import toast from "react-hot-toast";
import api from "../configs/api";

const Profile = () => {
  const { user, logout, fetchUser, allFoodLogs, allActivityLogs } =
    useAppContext();
  const { theme, toggleTheme } = UseTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: "maintain",
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400,
  });

  const fetchUserData = () => {
    if (user) {
      setFormData({
        age: user?.age || 0,
        weight: user?.weight || 0,
        height: user?.height || 0,
        goal: user?.goal || "maintain",
        dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
        dailyCalorieBurn: user?.dailyCalorieBurn || 400,
      });
    }
  };

  const getStats = () => {
    const totalFoodEntries = allFoodLogs?.length || 0;
    const totalActivities = allActivityLogs?.length || 0;

    return { totalFoodEntries, totalActivities };
  };

  const stats = getStats();

  const handleSave = async () => {
    try {
      await api.put(`/api/users/${user?.id}`, formData)

      await fetchUser(user?.token || "");
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Failed to update your profile");
    }
    setIsEditing(false);
  };

  useEffect(() => {
    (() => {
      fetchUserData();
    })();
  }, [user]);

  if (!user || !formData) return null;

  return (
    <div className="page-container">
      {/* header */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your settings
        </p>
      </div>

      <div className="profile-content">
        {/* left col */}
        <Card>
          {/* card title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <User className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Your Profile
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Member since{" "}
                {new Date(user?.createdAt || "").toLocaleDateString()}
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(v) => setFormData({ ...formData, age: Number(v) })}
                min={13}
                max={120}
              />

              <Input
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={(v) =>
                  setFormData({ ...formData, weight: Number(v) })
                }
                min={20}
                max={300}
              />

              <Input
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(v) =>
                  setFormData({ ...formData, height: Number(v) })
                }
                min={100}
                max={250}
              />

              <Select
                label="Fitness Goal"
                value={formData.goal as string}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    goal: v as "lose" | "maintain" | "gain",
                  })
                }
                options={goalOptions}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      age: Number(user.age),
                      weight: Number(user.weight),
                      height: Number(user.height),
                      goal: user.goal || "",
                      dailyCalorieIntake: user.dailyCalorieIntake || 2000,
                      dailyCalorieBurn: user.dailyCalorieBurn || 400,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* age */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                  <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Calendar className="size-4.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Age
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {user.age} years
                    </p>
                  </div>
                </div>
                {/* weight */}

                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                  <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Scale className="size-4.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Weight
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {user.weight} kg
                    </p>
                  </div>
                </div>

                {/* height */}
                {user.height !== 0 && (
                  <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                    <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <User className="size-4.5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Height
                      </p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {user.height} cm
                      </p>
                    </div>
                  </div>
                )}
                {/* goal */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                  <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <Target className="size-4.5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Goal
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {goalLabels[user?.goal || "gain"]}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="w-full mt-4"
              >
                Edit Profile
              </Button>
            </>
          )}
        </Card>

        {/* right col */}
        <div className="space-y-4">
          {/* stats card */}
          <Card>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              Your Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.totalFoodEntries}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Food Entries
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalActivities}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Activities
                </p>
              </div>
            </div>
          </Card>
          {/* theme button for phone */}
          <div className="lg:hidden">
            <button
              onClick={toggleTheme}
              className="group flex items-center justify-between w-full px-4 py-3 rounded-xl 
    bg-slate-100/70 dark:bg-slate-800/70 
    border border-slate-200 dark:border-slate-700
    hover:border-slate-300 dark:hover:border-slate-600
    hover:bg-slate-200/70 dark:hover:bg-slate-700/70
    text-slate-600 dark:text-slate-300
    transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg
        bg-white dark:bg-slate-900
        shadow-sm
        group-hover:scale-110
        transition-transform duration-300"
                >
                  {theme === "light" ? (
                    <MoonIcon className="size-5 text-indigo-500 dark:text-indigo-400" />
                  ) : (
                    <SunIcon className="size-5 text-amber-500" />
                  )}
                </div>

                <div className="text-left">
                  <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </span>

                  <span className="block text-xs text-slate-400 dark:text-slate-500">
                    {theme === "light"
                      ? "Switch to dark theme"
                      : "Switch to light theme"}
                  </span>
                </div>
              </div>

              {/* Toggle switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-indigo-500"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* logout btn */}
          <Button variant="danger" onClick={logout} className="w-full ring ring-red-300 hover:ring-2">
            <LogOutIcon className="size-4"/>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
