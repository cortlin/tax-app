import { useState } from "react";

export default function Pokemon() {
  const [pokemonName, setPokemonName] = useState("");
  console.log(pokemonName);
  // Data
  // --------------------------------------------------------

  /**
   * @param {string} pokemonName
   */
  // function getPokemon(pokemonName) {
  //   // Fetch the data
  // }

  // Render
  // --------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    getPokemon(pokemonName);
  };

  async function getPokemon(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    console.log(data);
  }

  return (
    <div>
      <h1>{`Pokemon Test`}</h1>
      <p>{`Using the form below, call the API endpoint "https://pokeapi.co/api/v2/pokemon/" with the search term entered into the input e.g: "https://pokeapi.co/api/v2/pokemon/pikachu".`}</p>
      <p>{`Using the response data, display the Pokemon's name, image; and a list of their moves.`}</p>
      <p>{`The Pokemon API will return the following response:`}</p>
      <pre>
        {`
{
  name: string; // The Pokemon's name
  sprites: {
    front_default: string; // The URL you should use for the image.
  };
  moves: [
    {
      move: {
        name: string; // The move name you should display in a list.
      }
    }
  ]
}
      `}
      </pre>
      <h2>{`Nice to haves:`}</h2>
      <ul>
        <li>{`Loading state`}</li>
        <li>{`Error state`}</li>
        <li>{`Empty state`}</li>
        <li>{`Disabled form while fetching`}</li>
      </ul>
      <p>
        {`You can find the docs for the API here: `}
        <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
          {`https://pokeapi.co/`}
        </a>
      </p>
      <div className="form">
        <form onSubmit={(e) => handleSubmit(e)}>
          <fieldset>
            <input
              type="text"
              value={pokemonName}
              onChange={(e) => setPokemonName(e.target.value)}
              placeholder={`Pokemon name`}
            />
            <button
              type="button"
              onClick={() => getPokemon(pokemonName)}
            >{`Search`}</button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
