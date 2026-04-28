import { useState, useEffect } from "react";
import "./App.css";
import ProfileManager from "./components/ProfileManager";
import RewardCalculator from "./components/RewardCalculator";
import History from "./components/History";
import type { Profile } from "./types";

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "calculator" | "history" | "manage"
  >("calculator");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("reward_profiles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfiles(parsed);
        if (parsed.length > 0) {
          setCurrentProfileId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to load profiles:", e);
      }
    }
  }, []);

  // Save to localStorage whenever profiles change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem("reward_profiles", JSON.stringify(profiles));
    }
  }, [profiles]);

  const currentProfile = profiles.find((p) => p.id === currentProfileId);

  const addProfile = (profile: Profile) => {
    setProfiles([...profiles, profile]);
    setCurrentProfileId(profile.id);
  };

  const deleteProfile = (id: string) => {
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    if (currentProfileId === id && updated.length > 0) {
      setCurrentProfileId(updated[0].id);
    } else if (updated.length === 0) {
      setCurrentProfileId(null);
    }
  };

  const updateProfile = (id: string, updated: Partial<Profile>) => {
    setProfiles(profiles.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const addRewardToHistory = (weight: number, reward: string) => {
    if (!currentProfile) return;
    const updated = {
      ...currentProfile,
      history: [
        ...currentProfile.history,
        { date: new Date().toLocaleString(), weight, reward },
      ],
    };
    updateProfile(currentProfile.id, updated);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>✨ Reward Me ✨</h1>
        <p>Track your weight and celebrate your progress!</p>
      </header>

      {profiles.length === 0 ? (
        <div className="welcome">
          <ProfileManager onAddProfile={addProfile} />
        </div>
      ) : (
        <div className="main-container">
          <aside className="sidebar">
            <h2>Profiles</h2>
            <div className="profile-list">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  className={`profile-btn ${currentProfileId === profile.id ? "active" : ""}`}
                  onClick={() => setCurrentProfileId(profile.id)}
                >
                  {profile.name}
                </button>
              ))}
            </div>
            <ProfileManager onAddProfile={addProfile} />
          </aside>

          <main className="content">
            {currentProfile && (
              <>
                <div className="profile-header">
                  <div>
                    <h2>{currentProfile.name}</h2>
                    <p className="profile-info">
                      Goal: {currentProfile.finalGoal}kg • Current:{" "}
                      {currentProfile.current}kg
                    </p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (confirm("Delete this profile?")) {
                        deleteProfile(currentProfile.id);
                      }
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>

                <div className="tabs">
                  <button
                    className={`tab ${activeTab === "calculator" ? "active" : ""}`}
                    onClick={() => setActiveTab("calculator")}
                  >
                    🎁 Reward
                  </button>
                  <button
                    className={`tab ${activeTab === "manage" ? "active" : ""}`}
                    onClick={() => setActiveTab("manage")}
                  >
                    ⚙️ Manage
                  </button>
                  <button
                    className={`tab ${activeTab === "history" ? "active" : ""}`}
                    onClick={() => setActiveTab("history")}
                  >
                    📝 History
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === "calculator" && (
                    <RewardCalculator
                      profile={currentProfile}
                      onReward={addRewardToHistory}
                      onUpdateWeight={(weight) =>
                        updateProfile(currentProfile.id, { current: weight })
                      }
                    />
                  )}
                  {activeTab === "manage" && (
                    <div className="manage-section">
                      <div className="manage-group">
                        <h3>🍕 Food List</h3>
                        <div className="items-list">
                          {currentProfile.foodList.map((food, idx) => (
                            <div key={idx} className="item">
                              <span>{food}</span>
                              <button
                                className="remove-btn"
                                onClick={() => {
                                  const updated =
                                    currentProfile.foodList.filter(
                                      (_, i) => i !== idx,
                                    );
                                  updateProfile(currentProfile.id, {
                                    foodList: updated,
                                  });
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="add-item">
                          <input
                            type="text"
                            id="food-input"
                            placeholder="Add new food..."
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(
                                "food-input",
                              ) as HTMLInputElement;
                              if (input.value.trim()) {
                                updateProfile(currentProfile.id, {
                                  foodList: [
                                    ...currentProfile.foodList,
                                    input.value.trim(),
                                  ],
                                });
                                input.value = "";
                              }
                            }}
                          >
                            ➕
                          </button>
                        </div>
                      </div>

                      <div className="manage-group">
                        <h3>🍽️ Restaurant List</h3>
                        <div className="items-list">
                          {currentProfile.restaurantList.map(
                            (restaurant, idx) => (
                              <div key={idx} className="item">
                                <span>{restaurant}</span>
                                <button
                                  className="remove-btn"
                                  onClick={() => {
                                    const updated =
                                      currentProfile.restaurantList.filter(
                                        (_, i) => i !== idx,
                                      );
                                    updateProfile(currentProfile.id, {
                                      restaurantList: updated,
                                    });
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="add-item">
                          <input
                            type="text"
                            id="restaurant-input"
                            placeholder="Add new restaurant..."
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(
                                "restaurant-input",
                              ) as HTMLInputElement;
                              if (input.value.trim()) {
                                updateProfile(currentProfile.id, {
                                  restaurantList: [
                                    ...currentProfile.restaurantList,
                                    input.value.trim(),
                                  ],
                                });
                                input.value = "";
                              }
                            }}
                          >
                            ➕
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "history" && (
                    <History history={currentProfile.history} />
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
