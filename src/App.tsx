import React, { useState } from 'react';
import RickAndMortyAutocomplete from './components/RickAndMortyAutocomplete';
import './App.css'

const App: React.FC = () => {
  const [selectedCharacters, setSelectedCharacters] = useState<number[]>([]);

  return (
    <div className="App centered">
      <h1>RICK AND MORTY</h1>
      <div className="center-input">
        <RickAndMortyAutocomplete value={selectedCharacters} onChange={setSelectedCharacters} />
      </div>
    </div>
  );
};

export default App;
