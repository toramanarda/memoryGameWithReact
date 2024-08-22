import { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/img/memory.svg';

let dotSet = [
  "😍", "😜", "🥶", "🥵", "🤠", "😸", "🐱‍👤", "🐱‍🏍",
  "🙈", "🐱‍🚀", "👼", "🍔", "🍕", "🌯", "🍉", "🍈",
  "🍓", "🍄"
];

dotSet = [...dotSet, ...dotSet];
dotSet.sort(() => Math.random() - 0.5);

function App() {
  const [dots, setDots] = useState(dotSet.map(emoji => ({
    emoji,
    isSelected: false,
    isMatched: false
  })));
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true); // Modal visibility state

  // Timer effect
  useEffect(() => {
    let timer;
    if (isGameStarted) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameStarted]);

  const handleClick = (index) => {
    if (!isGameStarted) {
      setIsGameStarted(true); // Start the timer on the first click
    }

    if (selectedIndexes.length === 2) return;

    if (selectedIndexes.includes(index)) return;

    const newDots = [...dots];
    newDots[index].isSelected = !newDots[index].isSelected;

    setDots(newDots);
    const newSelectedIndexes = [...selectedIndexes, index];

    if (newSelectedIndexes.length === 2) {
      const [firstIndex, secondIndex] = newSelectedIndexes;
      if (newDots[firstIndex].emoji === newDots[secondIndex].emoji) {
        newDots[firstIndex].isMatched = true;
        newDots[secondIndex].isMatched = true;
      } else {
        setTimeout(() => {
          newDots[firstIndex].isSelected = false;
          newDots[secondIndex].isSelected = false;
          setDots([...newDots]);
        }, 1000);
      }
      setSelectedIndexes([]);
      setMoves(prevMoves => prevMoves + 1); // Increment moves
    } else {
      setSelectedIndexes(newSelectedIndexes);
    }

    setDots([...newDots]);
  };

  const handleRestart = () => {
    setDots(dotSet.map(emoji => ({
      emoji,
      isSelected: false,
      isMatched: false
    })));
    setSelectedIndexes([]);
    setMoves(0);
    setTime(0);
    setIsGameStarted(false);
    // No change to modal visibility on restart
  };

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsModalVisible(false);
  };

  const handleNewGame = () => {
    setDots(dotSet.map(emoji => ({
      emoji,
      isSelected: false,
      isMatched: false
    })));
    setSelectedIndexes([]);
    setMoves(0);
    setTime(0);
    setIsGameStarted(false);
    setIsModalVisible(true); // Show the modal when starting a new game
  };

  return (
    <>
      {isModalVisible && (
        <div className="modal">
          <div className="modalContent">
            <h1>Memory Game</h1>
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        </div>
      )}
      <div className="container">
        <Header onRestart={handleRestart} onNewGame={handleNewGame} />
        <div className="gameArea">
          {dots.map((dot, i) => (
            <Dot key={i} emoji={dot.emoji} isSelected={dot.isSelected} isMatched={dot.isMatched} onClick={() => handleClick(i)} />
          ))}
        </div>
        <Information time={time} moves={moves} />
      </div>
    </>
  );
}

function Header({ onRestart, onNewGame }) {
  return (
    <div className="header">
      <img src={logo} alt="memoryGameLogo" />
      <div className="gameOptions">
        <button onClick={onRestart}>Restart</button>
        <button onClick={onNewGame}>New Game</button>
      </div>
    </div>
  );
}

function Dot({ emoji, isSelected, isMatched, onClick }) {
  let dotClassName = 'dot';
  if (isMatched) {
    dotClassName += ' matched';
  }
  if (isSelected) {
    dotClassName += ' selected';
  }

  return (
    <div className={dotClassName} onClick={onClick}>
      <span>{emoji}</span>
    </div>
  );
}

function Information({ time, moves }) {
  return (
    <div className="infermation">
      <div className="time">
        <h4>Time</h4>
        <h3>{(time / 60).toFixed(2)}</h3>
      </div>
      <div className="moves">
        <h4>Moves</h4>
        <h3>{moves}</h3>
      </div>
    </div>
  );
}

export default App;
