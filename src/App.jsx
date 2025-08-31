import { useEffect, useState } from 'react';

export default function App() {
  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // === Search states ===
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  const weatherForecastUrl = 'https://api.data.gov.my/weather/forecast';

  // === Dictionaries ===
  const forecastDescriptions = {
    Berjerebu: 'Hazy',
    'Tiada hujan': 'No rain',
    Hujan: 'Rain',
    'Hujan di beberapa tempat': 'Scattered rain',
    'Hujan di satu dua tempat': 'Isolated Rain',
    'Hujan di satu dua tempat di kawasan pantai':
      'Isolated rain over coastal areas',
    'Hujan di satu dua tempat di kawasan pedalaman':
      'Isolated rain over inland areas',
    'Ribut petir': 'Thunderstorms',
    'Ribut petir di beberapa tempat': 'Scattered thunderstorms',
    'Ribut petir di beberapa tempat di kawasan pedalaman':
      'Scattered thunderstorms over inland areas',
    'Ribut petir di beberapa tempat di kawasan pantai':
      'Isolated thunderstorms over coastal areas',
    'Ribut petir di satu dua tempat': 'Isolated thunderstorms',
    'Ribut petir di satu dua tempat di kawasan pantai':
      'Isolated thunderstorms over coastal areas',
    'Ribut petir di satu dua tempat di kawasan pedalaman':
      'Isolated thunderstorms over inland areas',
    'Ribut petir di kebanyakan tempat di kawasan pantai':
      'Thunderstorms in most places',
    'Ribut petir di kebanyakan tempat': 'Thunderstorms in most places',
    'Hujan di kebanyakan tempat di kawasan pantai':
      'Rain in most places in the coastal areas',
    'Hujan di beberapa tempat di kawasan pedalaman':
      'Rain in some places in the interior',
    'Ribut petir menyeluruh': 'Extensive thunderstorms',
    'Hujan di kebanyakan tempat': 'Rain in most places',
    Berangin: 'Windy',
  };

  const summaryWhenDescriptions = {
    Pagi: 'Morning',
    Malam: 'Night',
    Petang: 'Afternoon',
    'Pagi dan Petang': 'Morning and Afternoon',
    'Pagi dan Malam': 'Morning and Night',
    'Petang dan Malam': 'Afternoon and Night',
    'Sepanjang Hari': 'Throughout the Day',
  };

  // === Transform API Data ===
  const transformWeatherData = (data) => {
    return data.map((item) => ({
      ...item,
      morning_forecast:
        forecastDescriptions[item.morning_forecast] || item.morning_forecast,
      afternoon_forecast:
        forecastDescriptions[item.afternoon_forecast] ||
        item.afternoon_forecast,
      night_forecast:
        forecastDescriptions[item.night_forecast] || item.night_forecast,
      summary_forecast:
        forecastDescriptions[item.summary_forecast] || item.summary_forecast,
      summary_when:
        summaryWhenDescriptions[item.summary_when] || item.summary_when,
    }));
  };

  // === Fetch Weather ===
  const fetchWeather = async () => {
    try {
      setLoading(true);
      const currentDate = new Date().toISOString().split('T')[0];
      const cachedDate = localStorage.getItem('WeatherForecastRefreshData');
      const cachedWeatherData = localStorage.getItem('WeatherForecastRawData');

      if (cachedDate === currentDate && cachedWeatherData) {
        setRawData(JSON.parse(cachedWeatherData));
        return;
      }

      const response = await fetch(weatherForecastUrl);
      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
      const json = await response.json();
      const transformed = transformWeatherData(json);

      localStorage.setItem('WeatherForecastRefreshData', currentDate);
      localStorage.setItem(
        'WeatherForecastRawData',
        JSON.stringify(transformed)
      );

      setRawData(transformed);
    } catch (err) {
      console.error('Error fetching:', err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  // === Build unique searchable list ===
  const uniqueLocations = rawData
    ? [
        ...new Map(
          rawData.map((x) => [x.location.location_id, x.location])
        ).values(),
      ]
    : [];

  // === Handle typing ===
  const handleInputChange = (value) => {
    setSearchInput(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();
    const matches = uniqueLocations.filter(
      (loc) =>
        loc.location_name.toLowerCase().includes(lower) ||
        loc.location_id.toLowerCase().includes(lower)
    );

    setSuggestions(matches.slice(0, 10)); // max 10 suggestions
  };

  // === Handle selecting suggestion ===
  const handleSelect = (locId) => {
    setSearchInput('');
    setSuggestions([]);

    if (!rawData) return;

    const result = rawData
      .filter((x) => x.location.location_id === locId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setSearchResult(result);
  };

  const handleClear = () => {
    setSearchInput('');
    setSuggestions([]);
    setSearchResult(null);
  };

  // === Reusable Card Renderer ===
  const renderCard = (title, data) => (
    <div className='bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold text-cyan-300'>{title}</h2>
      </div>
      {data && data.length > 0 ? (
        <div className='overflow-x-auto'>
          <div className='flex gap-4 pb-2'>
            {data.slice(0, 7).map((item, index) => (
              <div
                key={index}
                className='bg-gray-700/50 p-4 rounded-lg min-w-[200px] flex-shrink-0 hover:bg-gray-700 transition-colors duration-200'>
                <div className='text-sm font-medium text-gray-200 mb-2'>
                  {item.date}
                </div>
                <div className='text-xs text-gray-300 space-y-1'>
                  <p>🌅 Morning: {item.morning_forecast}</p>
                  <p>☀️ Afternoon: {item.afternoon_forecast}</p>
                  <p>🌙 Night: {item.night_forecast}</p>
                  <div className='flex justify-between mt-2'>
                    <span className='text-cyan-300'>{item.max_temp}°C</span>
                    <span className='text-gray-400'>{item.min_temp}°C</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className='text-gray-400 text-sm italic'>
          No weather data available
        </p>
      )}
    </div>
  );

  // === Group data by state (default dashboard view) ===
  const stateDataMap = {};
  if (rawData && !searchResult) {
    rawData.forEach((item) => {
      const state = item.location?.location_name;
      if (!stateDataMap[state]) stateDataMap[state] = [];
      stateDataMap[state].push(item);
    });

    Object.keys(stateDataMap).forEach((state) => {
      stateDataMap[state].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
  }

  return (
    <div className='h-screen w-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 overflow-auto'>
      <div className='h-full w-full max-w-full mx-auto flex flex-col'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold tracking-tight text-cyan-300'>
            Malaysia Weather Dashboard
          </h1>
          <div className='text-sm text-gray-400'>
            Updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Search Bar */}
        <div className='bg-gray-800 rounded-lg p-4 mb-6 relative'>
          <input
            type='text'
            placeholder='Search by Location Name or ID...'
            value={searchInput}
            onChange={(e) => handleInputChange(e.target.value)}
            className='w-full p-2 rounded bg-gray-700 text-white'
          />

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className='absolute bg-gray-700 text-white mt-1 rounded shadow-lg max-h-60 overflow-y-auto w-full z-10'>
              {suggestions.map((loc) => (
                <li
                  key={loc.location_id}
                  onClick={() => handleSelect(loc.location_id)}
                  className='px-3 py-2 hover:bg-gray-600 cursor-pointer'>
                  {loc.location_name} -- {loc.location_id}
                </li>
              ))}
            </ul>
          )}

          {searchResult && (
            <button
              onClick={handleClear}
              className='mt-3 bg-gray-600 px-4 py-2 rounded text-white'>
              Clear
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className='flex justify-center items-center flex-grow'>
            <div className='text-lg text-cyan-400 animate-pulse'>
              Loading weather data...
            </div>
          </div>
        ) : error ? (
          <div className='bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center w-full'>
            {error}
          </div>
        ) : searchResult ? (
          <div className='flex-grow overflow-y-auto space-y-4'>
            {renderCard(
              `${searchResult[0].location.location_name} (${searchResult[0].location.location_id})`,
              searchResult
            )}
          </div>
        ) : (
          <div className='flex-grow overflow-y-auto space-y-4'>
            {Object.entries(stateDataMap).map(([state, data]) =>
              renderCard(state, data)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
