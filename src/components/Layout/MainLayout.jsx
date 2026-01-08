
import { useState } from 'react';
import Header from './Header';
import { LayoutGrid, Activity } from 'lucide-react';

const MainLayout = ({ children, feedSection }) => {
  const [showFeed, setShowFeed] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:hidden mb-6 flex space-x-3">
          <button
            onClick={() => setShowFeed(false)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-150 ${
              !showFeed 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <LayoutGrid className="w-5 h-5 inline mr-2" />
            Gallery
          </button>
          <button
            onClick={() => setShowFeed(true)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-150 ${
              showFeed 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Activity className="w-5 h-5 inline mr-2" />
            Feed
          </button>
        </div>

        <div className="hidden lg:grid lg:grid-cols-12 gap-6 xl:gap-8">
          <div className="lg:col-span-8">
            {children}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28">
              {feedSection}
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          {!showFeed ? children : feedSection}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;