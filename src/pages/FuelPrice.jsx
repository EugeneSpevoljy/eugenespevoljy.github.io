import { useEffect, useState } from 'react';

export default function FuelPrice() {
  const [fuelData, setFuelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fuelUrl =
    'https://api.data.gov.my/data-catalogue/?id=fuelprice&limit=1';

  useEffect(() => {
    const fetchFuel = async () => {
      try {
        setLoading(true);
        const response = await fetch(fuelUrl);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const json = await response.json();
        setFuelData(json[0]); // only one item
      } catch (err) {
        console.error('Error fetching fuel:', err);
        setError('Failed to fetch fuel prices, refresh after 1 minute');
      } finally {
        setLoading(false);
      }
    };

    fetchFuel();
  }, []);

  const renderCard = (data) => (
    <div className='bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 max-w-md mx-auto'>
      <h2 className='text-xl font-bold text-cyan-300 mb-4'>
        Fuel Price (Updated: {data.date})
      </h2>
      <div className='space-y-2 text-gray-200'>
        <p>
          <span className='font-semibold text-yellow-400'>RON95:</span> RM
          {data.ron95.toFixed(2)}
        </p>
        <p>
          <span className='font-semibold text-green-400'>RON97:</span> RM
          {data.ron97.toFixed(2)}
        </p>
        <p>
          <span className='font-semibold text-blue-400'>Diesel:</span> RM
          {data.diesel.toFixed(2)}
        </p>
        <p>
          <span className='font-semibold text-purple-400'>
            Diesel (East Msia):
          </span>{' '}
          RM{data.diesel_eastmsia.toFixed(2)}
        </p>
      </div>
    </div>
  );

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold tracking-tight text-cyan-300 mb-6'>
        Malaysia Fuel Price
      </h1>

      {loading ? (
        <div className='text-cyan-400 animate-pulse text-center'>
          Loading fuel prices...
        </div>
      ) : error ? (
        <div className='bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center'>
          {error}
        </div>
      ) : fuelData ? (
        renderCard(fuelData)
      ) : (
        <p className='text-gray-400'>No fuel data available</p>
      )}
    </div>
  );
}
