
import React from 'react';
import { Home, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-green-600 text-white py-4 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">🛠️ Printer Repair System</h1>

        <nav className="flex gap-4">
          <Link to="/home" className="flex items-center gap-2 hover:text-gray-100">
            <Home className="w-5 h-5" />
            Home
          </Link>

          <Link to="/view_jb" className="flex items-center gap-2 hover:text-gray-100">
            <Eye className="w-5 h-5" />
            View Job Sheets
          </Link>

          <Link to="/Add_jb" className="flex items-center gap-2 hover:text-gray-100">
            <Plus className="w-5 h-5" />
            Add Job Sheet
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
