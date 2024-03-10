import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';

interface Character {
    id: number;
    name: string;
    image: string;
    episode: string[];
}

interface Props {
    value: number[];
    onChange: (value: number[]) => void;
}

const RickAndMortyAutocomplete: React.FC<Props> = ({ value, onChange }) => {
    const [input, setInput] = useState('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!input) {
            setCharacters([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await axios.get('https://rickandmortyapi.com/api/character', {
                    params: { name: input },
                });

                setCharacters(
                    response.data.results.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        image: item.image,
                        episode: item.episode.map((episode: string) => episode.split('/').at(-1)),
                    }))
                );
            } catch (error) {
                setError('Error fetching characters');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [input]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        setCharacters([]); // Reset characters when input changes
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }
    };

    const handleCharacterSelect = (character: any) => {
        const index = value.findIndex((c: any) => c.id === character.id);

        if (index === -1) {
            setCharacters([...value, character]);
            onChange([...value, character]);
        } else {
            const newCharacters: any = value.filter((c: any) => c.id !== character.id);
            setCharacters(newCharacters);
            onChange(newCharacters);
        }

        // Clear the input value
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setInput('');
    };

    const handleRemoveCharacter = (character: Character) => {
        const newValue: any = value.filter((c: any) => c.id !== character.id);
        setCharacters(newValue);
        onChange(newValue);
    };

    const highlightedIndex = value.findIndex((id) => id === characters.find((c) => c.id === id)?.id);

    const highlightSearchText = (text: string, searchInput: string) => {
        const regex = new RegExp(`(${searchInput})`, 'gi');
        return text.split(regex).map((part, index) =>
            regex.test(part) ? <span key={index} className="highlighted-text">{part}</span> : part
        );
    };

    return (
        <div className="rm-autocomplete">
            <div className="rm-autocomplete__selected-characters">
                {value.map((character: any) => (
                    <div key={character.id} className="rm-autocomplete__selected-character">
                        {/* <img src={character.image} alt={character.name} className="rm-autocomplete__selected-image" /> */}
                        <span className="rm-autocomplete__selected-name">{character.name}</span>
                        <button type="button" className="rm-autocomplete__remove-button" onClick={() => handleRemoveCharacter(character)}>
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            <input
                ref={inputRef}
                className={classNames('rm-autocomplete__input', { 'rm-autocomplete__input--loading': loading })}
                value={inputRef.current?.value || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            {loading && <div className="rm-autocomplete__loading">Loading...</div>}
            {error && <div className="rm-autocomplete__error">{error}</div>}
            {input && !loading && !error && (
                <ul className="rm-autocomplete__list">
                    {characters.map((character: any) => (
                        <li
                            key={character.id}
                            className={classNames('rm-autocomplete__item', {
                                'rm-autocomplete__item--selected': highlightedIndex === value.indexOf(character),
                            })}
                            onClick={() => handleCharacterSelect(character)}
                        >
                            <input
                                type="checkbox"
                                className="rm-autocomplete__checkbox"
                                checked={value.includes(character)}
                                onChange={() => handleCharacterSelect(character)}
                            />
                            <div className="rm-autocomplete__image-and-info">
                                <img src={character.image} alt={character.name} className="rm-autocomplete__image" />
                                <div className="rm-autocomplete__name-and-episodes">
                                    <span className="rm-autocomplete__name">
                                        {highlightSearchText(character.name, input)}
                                    </span>
                                    <span className="rm-autocomplete__episodes">{`${character.episode.length} Episode${character.episode.length > 1 ? 's' : ''}`}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RickAndMortyAutocomplete;
