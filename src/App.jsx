import { useState } from 'react'
import './App.css'

const FOOD_LIST = [
  'dollarma choco',
  'cream drill chips',
  'mamee noodles (媽咪麵)',
  'spicy chicken noodles (韓式辣雞麵)',
  'caramel popcorn',
  'sour and spicy noodles (酸辣粉)',
  'pistachio cone',
  "pp's hand c chicken (老公整既手撕雞)",
  'poutine',
  'huge dumplight from first dim sum (一點心餃子)',
]

const RESTAURANT_LIST = [
  'wow chicken - Gang-Jeong Chicken, Shallot Chicken, Tteokbokki',
  'tasty pot - Taiwanese Supreme Spicy Hot Soup / 台式麻辣鍋',
  '味煌 - 菜園牛河, 美極牛柳粒, 乾炒牛河',
  'Kinjo - SUSHI + FRIED CHICKEN',
  'subway - chicken sub',
]

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function App() {
  const [begin, setBegin] = useState('')
  const [goal, setGoal] = useState('')
  const [current, setCurrent] = useState('')
  const [reward, setReward] = useState(null)
  const [isMajor, setIsMajor] = useState(false)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')

  function handleRewardMe() {
    const beginNum = parseFloat(begin)
    const goalNum = parseFloat(goal)
    const currentNum = parseFloat(current)

    if (isNaN(beginNum) || isNaN(goalNum) || isNaN(currentNum)) {
      setError('Please enter valid numbers for all fields.')
      setReward(null)
      return
    }
    if (goalNum >= beginNum) {
      setError('Goal weight must be less than starting weight.')
      setReward(null)
      return
    }
    if (currentNum > beginNum) {
      setError('Current weight cannot exceed starting weight.')
      setReward(null)
      return
    }

    setError('')

    const totalProgressNeeded = beginNum - goalNum
    const major = currentNum <= beginNum - totalProgressNeeded / 2

    let treat
    if (major) {
      treat = randomChoice(RESTAURANT_LIST)
    } else {
      treat = randomChoice(FOOD_LIST)
    }

    setIsMajor(major)
    setReward(treat)
    setHistory((prev) => [
      { weight: currentNum, reward: treat, major, id: Date.now() },
      ...prev,
    ])
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-emoji">🏆</div>
        <h1>Reward Me!</h1>
        <p className="subtitle">Track your weight loss journey and earn delicious rewards</p>
      </header>

      <main className="app-main">
        <section className="card input-card">
          <h2>Enter Your Weights</h2>
          <div className="input-group">
            <label htmlFor="begin">Starting Weight (kg)</label>
            <input
              id="begin"
              type="number"
              placeholder="e.g. 70"
              value={begin}
              onChange={(e) => setBegin(e.target.value)}
              min="0"
              step="0.1"
            />
          </div>
          <div className="input-group">
            <label htmlFor="goal">Goal Weight (kg)</label>
            <input
              id="goal"
              type="number"
              placeholder="e.g. 60"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              min="0"
              step="0.1"
            />
          </div>
          <div className="input-group">
            <label htmlFor="current">Current Weight (kg)</label>
            <input
              id="current"
              type="number"
              placeholder="e.g. 65"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              min="0"
              step="0.1"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="reward-btn" onClick={handleRewardMe}>
            🎉 Get My Reward!
          </button>
        </section>

        {reward && (
          <section className={`card reward-card ${isMajor ? 'major' : 'minor'}`}>
            {isMajor ? (
              <>
                <div className="reward-icon">🌟</div>
                <h2>MAJOR MILESTONE!</h2>
                <p className="reward-label">Go to a restaurant:</p>
                <p className="reward-name">{reward}</p>
              </>
            ) : (
              <>
                <div className="reward-icon">✨</div>
                <h2>Keep Going!</h2>
                <p className="reward-label">Have a snack:</p>
                <p className="reward-name">{reward}</p>
              </>
            )}
          </section>
        )}

        {history.length > 0 && (
          <section className="card history-card">
            <h2>📋 Reward History</h2>
            <ul className="history-list">
              {history.map((entry) => (
                <li key={entry.id} className={`history-item ${entry.major ? 'major' : 'minor'}`}>
                  <span className="history-icon">{entry.major ? '🌟' : '✨'}</span>
                  <span className="history-weight">{entry.weight} kg</span>
                  <span className="history-arrow">→</span>
                  <span className="history-reward">{entry.reward}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="card lists-card">
          <div className="lists-grid">
            <div>
              <h2>🍿 Snack Rewards</h2>
              <ul className="reward-list">
                {FOOD_LIST.map((food) => (
                  <li key={food}>{food}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>🍽️ Restaurant Milestones</h2>
              <ul className="reward-list">
                {RESTAURANT_LIST.map((rest) => (
                  <li key={rest}>{rest}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>You&apos;ve got this! 💪 Every gram counts.</p>
      </footer>
    </div>
  )
}

export default App
