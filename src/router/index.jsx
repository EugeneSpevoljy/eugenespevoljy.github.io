import { Routes, Route, Link } from 'react-router-dom';
import App from '../App';
import FuelPrice from '../pages/FuelPrice';

export default function Router() {
  return (
    <div className='h-screen w-screen bg-gray-900 text-gray-100 flex flex-col'>
      {/* Simple Nav */}
      <nav className='bg-gray-800 px-6 py-3 flex gap-6 text-cyan-300'>
        <Link
          to='/'
          className='hover:text-white'>
          Weather
        </Link>
        <Link
          to='/fuel'
          className='hover:text-white'>
          Fuel Price
        </Link>
      </nav>

      {/* Main Page Content */}
      <div className='flex-1 overflow-auto'>
        <Routes>
          <Route
            path='/'
            element={<App />}
          />
          <Route
            path='/fuel'
            element={<FuelPrice />}
          />
        </Routes>
      </div>
    </div>
  );
}
