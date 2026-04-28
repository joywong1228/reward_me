import { useState } from "react";
import type { Profile } from "../types";

interface ProfileManagerProps {
  onAddProfile: (profile: Profile) => void;
}

const DEFAULT_FOODS = [
  "dollarma choco",
  "cream drill chips",
  "mamee noodles (媽咪麵)",
  "spicy chicken noodles (韓式辣雞麵)",
  "caramel popcorn",
  "sour and spicy noodles (酸辣粉)",
  "pistachio cone",
  "pp's hand c chicken (老公整既手撕雞)",
  "poutine",
  "huge dumplight from first dim sum (一點心餃子)",
];

const DEFAULT_RESTAURANTS = [
  "wow chicken - Gang-Jeong Chicken, Shallot Chicken, Tteokbokki",
  "tasty pot - Taiwanese Supreme Spicy Hot Soup / 台式麻辣鍋",
  "味煌 - 菜園牛河, 美極牛柳粒, 乾炒牛河",
  "Kinjo - SUSHI + FRIED CHICKEN",
  "subway - chicken sub",
];

export default function ProfileManager({ onAddProfile }: ProfileManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [startWeight, setStartWeight] = useState("");
  const [finalGoal, setFinalGoal] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !startWeight || !finalGoal || !currentWeight) {
      alert("Please fill in all fields");
      return;
    }

    const profile: Profile = {
      id: Date.now().toString(),
      name,
      startWeight: parseFloat(startWeight),
      finalGoal: parseFloat(finalGoal),
      current: parseFloat(currentWeight),
      foodList: [...DEFAULT_FOODS],
      restaurantList: [...DEFAULT_RESTAURANTS],
      history: [],
    };

    onAddProfile(profile);
    setName("");
    setStartWeight("");
    setFinalGoal("");
    setCurrentWeight("");
    setShowForm(false);
  };

  const createPresetProfile = () => {
    const profile: Profile = {
      id: Date.now().toString(),
      name: "My Weight Journey",
      startWeight: 53,
      finalGoal: 43,
      current: 51.8,
      foodList: [...DEFAULT_FOODS],
      restaurantList: [...DEFAULT_RESTAURANTS],
      history: [],
    };
    onAddProfile(profile);
  };

  return (
    <div className="profile-manager">
      {!showForm ? (
        <div className="profile-buttons">
          <button className="add-profile-btn" onClick={() => setShowForm(true)}>
            ➕ New Profile
          </button>
          <button
            className="add-profile-btn preset-btn"
            onClick={createPresetProfile}
          >
            ⚡ Quick Start
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Profile Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Goal"
            />
          </div>
          <div className="form-group">
            <label>Starting Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={startWeight}
              onChange={(e) => setStartWeight(e.target.value)}
              placeholder="e.g., 75"
            />
          </div>
          <div className="form-group">
            <label>Goal Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={finalGoal}
              onChange={(e) => setFinalGoal(e.target.value)}
              placeholder="e.g., 65"
            />
          </div>
          <div className="form-group">
            <label>Current Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="e.g., 75"
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              Create
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
