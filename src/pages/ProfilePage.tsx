import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Edit, Trash2, Eye, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import LostItemCard from '../components/LostItemCard';
import ItemDetailModal from '../components/ItemDetailModal';
import toast from 'react-hot-toast';

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

export default function ProfilePage() {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState<LostItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'closed'>('lost');

  useEffect(() => {
    if (user) {
      fetchUserItems();
    }
  }, [user, activeTab]);

  const fetchUserItems = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lost_items')
        .select(`
          *,
          categories (
            name,
            icon
          )
        `)
        .eq('user_id', user.id)
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserItems(data || []);
    } catch (error) {
      console.error('Error fetching user items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: 'lost' | 'found' | 'closed') => {
    try {
      const { error } = await supabase
        .from('lost_items')
        .update({ status: newStatus })
        .eq('id', itemId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Status berhasil diubah!');
      fetchUserItems();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Gagal mengubah status');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;

    try {
      const { error } = await supabase
        .from('lost_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Laporan berhasil dihapus!');
      fetchUserItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Gagal menghapus laporan');
    }
  };

  const tabs = [
    { key: 'lost' as const, label: 'Hilang', color: 'red' },
    { key: 'found' as const, label: 'Ditemukan', color: 'green' },
    { key: 'closed' as const, label: 'Ditutup', color: 'gray' },
  ];

  const getItemCount = (status: 'lost' | 'found' | 'closed') => {
    // This would typically come from a separate query, but for simplicity we'll use 0
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500">
              Bergabung sejak {user?.created_at && new Date(user.created_at).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                activeTab === tab.key
                  ? `text-${tab.color}-600 border-b-2 border-${tab.color}-500`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : userItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <LostItemCard
                    item={item}
                    onClick={setSelectedItem}
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 left-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {activeTab === 'lost' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(item.id, 'found');
                        }}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        title="Tandai Ditemukan"
                      >
                        <Package className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                Tidak ada laporan dengan status "{tabs.find(t => t.key === activeTab)?.label}"
              </p>
              <p className="text-sm text-gray-400">
                Laporan Anda akan muncul di sini
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isOwner={true}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}