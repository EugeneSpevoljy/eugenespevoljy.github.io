import { useEffect, useState } from 'react';

export default function App() {
  // State declarations for all states and territories
  const [rawData, setRawData] = useState(null);
  const [perlisData, setPerlisData] = useState(null); // St001
  const [kedahData, setKedahData] = useState(null); // St002
  const [pulauPinangData, setPulauPinangData] = useState(null); // St003
  const [perakData, setPerakData] = useState(null); // St004
  const [kelantanData, setKelantanData] = useState(null); // St005
  const [terengganuData, setTerengganuData] = useState(null); // St006
  const [pahangData, setPahangData] = useState(null); // St007
  const [selangorData, setSelangorData] = useState(null); // St008
  const [wpKualaLumpurData, setWpKualaLumpurData] = useState(null); // St009
  const [wpPutrajayaData, setWpPutrajayaData] = useState(null); // St010
  const [negeriSembilanData, setNegeriSembilanData] = useState(null); // St011
  const [melakaData, setMelakaData] = useState(null); // St012
  const [johorData, setJohorData] = useState(null); // St013
  const [sarawakData, setSarawakData] = useState(null); // St501
  const [sabahData, setSabahData] = useState(null); // St502
  const [wpLabuanData, setWpLabuanData] = useState(null); // St503
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const weatherForecastUrl = 'https://api.data.gov.my/weather/forecast';

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

  const fetchWeather = async () => {
    try {
      setLoading(true);

      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];

      // Check localStorage for cached data
      const cachedDate = localStorage.getItem('WeatherForecastRefreshData');
      const cachedWeatherData = localStorage.getItem('WeatherForecastRawData');

      // If cached date matches current date and we have cached data, use it
      if (cachedDate === currentDate && cachedWeatherData) {
        setRawData(JSON.parse(cachedWeatherData));
        setError(null);
        return;
      }

      // Fetch new data if no valid cache
      const response = await fetch(weatherForecastUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      // Transform the data before storing
      const transformedData = transformWeatherData(json);

      // Update localStorage with transformed data
      localStorage.setItem('WeatherForecastRefreshData', currentDate);
      localStorage.setItem(
        'WeatherForecastRawData',
        JSON.stringify(transformedData)
      );

      setRawData(transformedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching:', error);
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Reusable filter function
  const selectWhere = (data, selector, value) => {
    if (!data) return [];
    return data.filter(
      (item) => selector(item).toLowerCase() === value.toLowerCase()
    );
  };

  // Fetch data on mount
  useEffect(() => {
    fetchWeather();
  }, []);

  // Filter and sort data by state/territory
  useEffect(() => {
    if (rawData) {
      const sortByDate = (data) =>
        data.sort((a, b) => new Date(a.date) - new Date(b.date));

      setPerlisData(
        sortByDate(
          selectWhere(rawData, (item) => item.location?.location_name, 'Perlis')
        )
      );
      setKedahData(
        sortByDate(
          selectWhere(rawData, (item) => item.location?.location_name, 'Kedah')
        )
      );
      setPulauPinangData(
        sortByDate(
          selectWhere(
            rawData,
            (item) => item.location?.location_name,
            'Pulau Pinang'
          )
        )
      );
      setPerakData(
        sortByDate(
          selectWhere(rawData, (item) => item.location?.location_name, 'Perak')
        )
      );
      setKelantanData(
        sortByDate(
          selectWhere(
            rawData,
            (item) => item.location?.location_name,
            'Kelantan'
          )
        )
      );
      setTerengganuData(
        sortByDate(
          selectWhere(
            rawData,
            (item) => item.location?.location_name,
            'Terengganu'
          )
        )
      );
      setPahangData(
        sortByDate(
          selectWhere(rawData, (item) => item.location?.location_name, 'Pahang')
        )
      );
      setSelangorData(
        sortByDate(
          selectWhere(
            rawData,
            (item) => item.location?.location_name,
            'Selangor'
          )
        )
      );
      setWpKualaLumpurData(
        sortByDate(
          selectWhere(
            rawData,
            (item) => item.location?.location_name,
            'WP Kuala Lumpur'
          )
        )
      );
      setWpPutrajayaData(
        sortByDate(
          selectWhere(
            rawData,
            (item) => item.location?.location_name,
            'WP Putrajaya'
          )
        )
      );
      setNegeriSembilanData(
        sortByDate(
          selectWhere(
            rawData,
            (item) => item.location?.location_name,
            'Negeri Sembilan'
          )
        )
      );
      setMelakaData(
        sortByDate(
          selectWhere(rawData, (item) => item.location?.location_name, 'Melaka')
        )
      );
      setJohorData(
        sortByDate(
          selectWhere(rawData, (item) => item.location?.location_name, 'Johor')
        )
      );
      setSarawakData(
        sortByDate(
          selectWhere(
            rawData,
            (item) => item.location?.location_name,
            'Sarawak'
          )
        )
      );
      setSabahData(
        sortByDate(
          selectWhere(rawData, (item) => item.location?.location_name, 'Sabah')
        )
      );
      setWpLabuanData(
        sortByDate(
          selectWhere(
            rawData,
            (item) => item.location?.location_name,
            'WP Labuan'
          )
        )
      );
    }
  }, [rawData]);

  console.log(JSON.stringify(johorData));

  // Map state/territory data for rendering (reversed order)
  const stateDataMap = {
    'Perlis (St001)': perlisData,
    'Kedah (St002)': kedahData,
    'Pulau Pinang (St003)': pulauPinangData,
    'Perak (St004)': perakData,
    'Kelantan (St005)': kelantanData,
    'Terengganu (St006)': terengganuData,
    'Pahang (St007)': pahangData,
    'Selangor (St008)': selangorData,
    'WP Kuala Lumpur (St009)': wpKualaLumpurData,
    'WP Putrajaya (St010)': wpPutrajayaData,
    'Negeri Sembilan (St011)': negeriSembilanData,
    'Melaka (St012)': melakaData,
    'Johor (St013)': johorData,
    'Sarawak (St501)': sarawakData,
    'Sabah (St502)': sabahData,
    'WP Labuan (St503)': wpLabuanData,
  };

  return (
    <div className='h-screen w-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 overflow-auto'>
      <div className='h-full w-full max-w-full mx-auto flex flex-col'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold tracking-tight text-cyan-300'>
            Malaysia Weather Dashboard
          </h1>
          <div className='text-sm text-gray-400'>
            Updated: {new Date().toLocaleString()}
          </div>
        </div>

        {loading && (
          <div className='flex justify-center items-center flex-grow'>
            <div className='text-lg text-cyan-400 animate-pulse'>
              Loading weather data...
            </div>
          </div>
        )}
        {error && (
          <div className='bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center w-full'>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className='flex-grow overflow-y-auto space-y-4'>
            {Object.entries(stateDataMap).map(([state, data]) => (
              <div
                key={state}
                className='bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700'>
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-lg font-semibold text-cyan-300'>
                    {state.split(' (')[0]}
                  </h2>
                  <svg
                    className='w-6 h-6 text-cyan-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'
                    />
                  </svg>
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
                            <p className='flex items-center'>
                              <span className='mr-2'>🌅</span> Morning:{' '}
                              {item.morning_forecast}
                            </p>
                            <p className='flex items-center'>
                              <span className='mr-2'>☀️</span> Afternoon:{' '}
                              {item.afternoon_forecast}
                            </p>
                            <p className='flex items-center'>
                              <span className='mr-2'>🌙</span> Night:{' '}
                              {item.night_forecast}
                            </p>
                            <div className='flex justify-between mt-2'>
                              <span className='text-cyan-300'>
                                {item.max_temp}°C
                              </span>
                              <span className='text-gray-400'>
                                {item.min_temp}°C
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className='text-gray-400 text-sm italic'>
                    No weather data available for {state}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
