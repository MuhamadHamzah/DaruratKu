import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, Gift, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface LostItem {
  id: string;
  title: string;
  description: string;
  location: string;
  date_lost: string;
  image_url: string | null;
  contact_phone: string;
  reward_amount: number | null;
  status: 'lost' | 'found' | 'closed';
  created_at: string;
  categories: {
    name: string;
    icon: string;
  };
}

interface LostItemCardProps {
  item: LostItem;
  onClick: (item: LostItem) => void;
}

export default function LostItemCard({ item, onClick }: LostItemCardProps) {
  const statusColors = {
    lost: 'bg-red-100 text-red-700 border-red-200',
    found: 'bg-green-100 text-green-700 border-green-200',
    closed: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const statusText = {
    lost: 'Hilang',
    found: 'Ditemukan',
    closed: 'Ditutup',
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer group"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(item)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-green-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <Eye className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[item.status]}`}>
          {statusText[item.status]}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            <span>{item.location}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span>
              {format(new Date(item.date_lost), 'dd MMMM yyyy', { locale: id })}
            </span>
          </div>

          {item.reward_amount && item.reward_amount > 0 && (
            <div className="flex items-center text-green-600">
              <Gift className="w-4 h-4 mr-2" />
              <span className="font-medium">
                Reward: Rp {item.reward_amount.toLocaleString('id-ID')}
              </span>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {item.categories.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}