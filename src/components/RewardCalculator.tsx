import { useState } from "react";
import type { Profile } from "../types";

interface RewardCalculatorProps {
  profile: Profile;
  onReward: (weight: number, reward: string) => void;
  onUpdateWeight: (weight: number) => void;
}

export default function RewardCalculator({
  profile,
  onReward,
  onUpdateWeight,
}: RewardCalculatorProps) {
  const [weight, setWeight] = useState(profile.current.toString());
  const [reward, setReward] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const calculateReward = () => {
    const currentWeight = parseFloat(weight);

    if (isNaN(currentWeight)) {
      alert("Please enter a valid weight");
      return;
    }

    onUpdateWeight(currentWeight);

    const totalProgressNeeded = profile.startWeight - profile.finalGoal;
    const halfwayPoint = profile.startWeight - totalProgressNeeded / 2;

    let selectedReward: string;

    if (currentWeight <= halfwayPoint) {
      // Major milestone - restaurant
      selectedReward =
        profile.restaurantList[
          Math.floor(Math.random() * profile.restaurantList.length)
        ];
      setMessage("🌟 MAJOR MILESTONE! You deserve a restaurant treat!");
    } else {
      // Keep going - snack
      selectedReward =
        profile.foodList[Math.floor(Math.random() * profile.foodList.length)];
      setMessage("✨ Keep going! You earned a snack!");
    }

    setReward(selectedReward);
    onReward(currentWeight, selectedReward);
  };

  const progressPercent =
    ((profile.startWeight - parseFloat(weight)) /
      (profile.startWeight - profile.finalGoal)) *
    100;

  return (
    <div className="reward-calculator">
      <div className="progress-section">
        <div className="progress-info">
          <div className="stat">
            <span className="label">Start</span>
            <span className="value">{profile.startWeight}kg</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${Math.max(0, Math.min(100, progressPercent))}%`,
              }}
            />
          </div>
          <div className="stat">
            <span className="label">Goal</span>
            <span className="value">{profile.finalGoal}kg</span>
          </div>
        </div>
        <p className="progress-text">
          {profile.startWeight - parseFloat(weight) > 0
            ? `💪 Lost ${(profile.startWeight - parseFloat(weight)).toFixed(1)}kg!`
            : "📈 Start your journey!"}
        </p>
      </div>

      <div className="input-section">
        <div className="weight-input">
          <label>Current Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your current weight"
          />
        </div>
        <button className="calculate-btn" onClick={calculateReward}>
          🎁 Get My Reward!
        </button>
      </div>

      {reward && (
        <div className="reward-display">
          <p className="reward-message">{message}</p>
          <div className="reward-box">
            <p className="reward-text">{reward}</p>
          </div>
          <p className="log-text">✅ Logged at {parseFloat(weight)}kg</p>
        </div>
      )}
    </div>
  );
}
