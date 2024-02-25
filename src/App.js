import './App.css';
import GameBoard from './components/Gameboard/Gameboard';
import ScoreBoard from './components/Scoreboard/Scoreboard';

function App() {
  return (
    <div className="App .map-container">
      <div className='root'>
      <GameBoard></GameBoard>
      <ScoreBoard></ScoreBoard>
      </div>
      
    </div>
  );
}

export default App;
