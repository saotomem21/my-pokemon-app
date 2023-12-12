import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [search, setSearch] = useState('');
  const [pokemon, setPokemon] = useState<any>(null);
  const [japaneseName, setJapaneseName] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchButtonClick = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
      setPokemon(response.data);

      // 日本語名を取得
      const speciesResponse = await axios.get(response.data.species.url);
      const japaneseNameObj = speciesResponse.data.names.find((nameObj: any) => nameObj.language.name === "ja");
      setJapaneseName(japaneseNameObj ? japaneseNameObj.name : '');
    } catch (error) {
      console.error(error);
      setPokemon(null);
      setJapaneseName('');
    }
  };

  return (
    <div className="App">
      <h1>ポケモン検索</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="ポケモンの名前またはIDを入力"
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button
          onClick={handleSearchButtonClick}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2"
        >
          検索
        </button>
      </div>
      {pokemon && (
        <div className="pokemon-info">
          <h2>{pokemon.name} (英語名)</h2>
          {japaneseName && <h2>{japaneseName} (日本語名)</h2>}
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>タイプ: {pokemon.types.map((type: any) => type.type.name).join(', ')}</p>
          <p>身長: {pokemon.height / 10} m</p>
          <p>体重: {pokemon.weight / 10} kg</p>
          <h3>基本ステータス</h3>
          <ul>
            {pokemon.stats.map((stat: any) => (
              <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
