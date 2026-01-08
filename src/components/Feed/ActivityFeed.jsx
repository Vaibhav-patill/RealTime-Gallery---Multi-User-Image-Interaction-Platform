import { useEffect, useRef } from 'react';
import { Activity, Zap } from 'lucide-react';
import FeedItem from './FeedItem';
import useInteractions from '../../hooks/useInteractions';


const ActivityFeed = () => {
  const { activities, isLoading } = useInteractions();
  const feedEndRef = useRef(null);
  const prevActivityCountRef = useRef(0);

  useEffect(() => {
    if (activities.length > prevActivityCountRef.current) {
      feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevActivityCountRef.current = activities.length;
  }, [activities.length]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
        <div className="flex items-center justify-center space-x-3 py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-indigo-600"></div>
          <p className="text-slate-600 font-medium">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/10 text-indigo-700 rounded-lg border border-indigo-600/15">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Live Feed</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time activity stream</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-700">LIVE</span>
          </div>
        </div>

        <div className="mt-3 flex items-center space-x-3 text-sm text-slate-600">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <Zap className="w-4 h-4" />
            <span className="font-semibold">{activities.length} {activities.length === 1 ? 'activity' : 'activities'}</span>
          </div>
        </div>
      </div>

      <div className="max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="bg-slate-100 p-5 rounded-2xl mb-5">
              <Activity className="w-14 h-14 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              No activity yet
            </h3>
            <p className="text-slate-500 text-sm max-w-xs font-medium">
              Interactions will appear here in real-time as users react and comment on images
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map((activity) => (
              <FeedItem key={activity.id} activity={activity} />
            ))}
            <div ref={feedEndRef} />
          </div>
        )}
      </div>

      {activities.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50/50 p-4 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Updates automatically • {activities.length} total {activities.length === 1 ? 'activity' : 'activities'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;