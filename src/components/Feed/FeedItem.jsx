import { Heart, MessageCircle, Trash2, Sparkles } from 'lucide-react';
import { getInitials, formatRelativeTime } from '../../utils/helpers';
import { ACTIVITY_TYPES } from '../../utils/constants';


const FeedItem = ({ activity }) => {
  const getActivityInfo = () => {
    switch (activity.type) {
      case ACTIVITY_TYPES.EMOJI_ADDED:
        return {
          icon: <Sparkles className="w-4 h-4" />,
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          message: 'reacted with',
          emoji: activity.emoji
        };
      case ACTIVITY_TYPES.COMMENT_ADDED:
        return {
          icon: <MessageCircle className="w-4 h-4" />,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          message: 'commented:',
          comment: activity.commentText
        };
      case ACTIVITY_TYPES.EMOJI_REMOVED:
        return {
          icon: <Trash2 className="w-4 h-4" />,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          message: 'removed reaction',
          emoji: activity.emoji
        };
      case ACTIVITY_TYPES.COMMENT_DELETED:
        return {
          icon: <Trash2 className="w-4 h-4" />,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          message: 'deleted a comment'
        };
      default:
        return {
          icon: <Heart className="w-4 h-4" />,
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          message: 'interacted'
        };
    }
  };

  const info = getActivityInfo();

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-slate-50/80 transition-all duration-200 animate-slide-up">
      <div className={`p-2.5 rounded-xl ${info.iconBg} ${info.iconColor} flex-shrink-0 shadow-sm border border-slate-200/50`}>
        {info.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-2">
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm ring-2 ring-white"
            style={{ backgroundColor: activity.userColor }}
          >
            {getInitials(activity.username)}
          </div>

          <span className="font-semibold text-slate-800 text-sm">
            {activity.username}
          </span>

          <span className="text-xs text-slate-500 font-medium">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>

        <p className="text-sm text-slate-700 font-medium">
          {info.message}
          {info.emoji && <span className="ml-1.5 text-lg">{info.emoji}</span>}
        </p>

        {info.comment && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200/60">
            <p className="text-sm text-slate-700 line-clamp-2 italic leading-relaxed">
              "{info.comment}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedItem;