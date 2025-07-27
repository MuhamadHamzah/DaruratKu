import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LostItemCard from '../components/LostItemCard';
import ItemDetailModal from '../components/ItemDetailModal';

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

interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function SearchPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [searchQuery, selectedCategory, selectedStatus]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('lost_items')
        .select(`
          *,
          categories (
            name,
            icon
          )
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%, location.ilike.%${searchQuery}%`);
      }

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      if (selectedStatus) {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cari Barang Hilang
        </h1>
        <p className="text-gray-600">
          Temukan barang yang hilang atau bantu orang lain menemukan barangnya
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Cari berdasarkan nama barang, deskripsi, atau lokasi..."
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          
          {(selectedCategory || selectedStatus) && (
            <button
              onClick={clearFilters}
              className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
            >
              Hapus Filter
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Semua Status</option>
                <option value="lost">Hilang</option>
                <option value="found">Ditemukan</option>
                <option value="closed">Ditutup</option>
              </select>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Hasil Pencarian ({items.length})
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <LostItemCard
                  item={item}
                  onClick={setSelectedItem}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-12 bg-white/50 rounded-xl border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Tidak ada barang yang ditemukan</p>
            <p className="text-sm text-gray-400">
              Coba ubah kata kunci pencarian atau filter
            </p>
          </motion.div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}