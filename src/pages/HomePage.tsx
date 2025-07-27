import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  PlusCircle,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LostItemCard from "../components/LostItemCard";
import ItemDetailModal from "../components/ItemDetailModal";

interface LostItem {
  id: string;
  title: string;
  description: string;
  location: string;
  date_lost: string;
  image_url: string | null;
  contact_phone: string;
  reward_amount: number | null;
  status: "lost" | "found" | "closed";
  created_at: string;
  categories: {
    name: string;
    icon: string;
  };
}

interface Stats {
  total_items: number;
  found_items: number;
  recent_items: number;
}

export default function HomePage() {
  const [recentItems, setRecentItems] = useState<LostItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_items: 0,
    found_items: 0,
    recent_items: 0,
  });
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentItems();
    fetchStats();
  }, []);

  const fetchRecentItems = async () => {
    try {
      const { data, error } = await supabase
        .from("lost_items")
        .select(
          `
          *,
          categories (
            name,
            icon
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      setRecentItems(data || []);
    } catch (error) {
      console.error("Error fetching recent items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: totalData } = await supabase
        .from("lost_items")
        .select("id", { count: "exact" });

      const { data: foundData } = await supabase
        .from("lost_items")
        .select("id", { count: "exact" })
        .eq("status", "found");

      const { data: recentData } = await supabase
        .from("lost_items")
        .select("id", { count: "exact" })
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        );

      setStats({
        total_items: totalData?.length || 0,
        found_items: foundData?.length || 0,
        recent_items: recentData?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statsCards = [
    {
      title: "Total Laporan",
      value: stats.total_items,
      icon: AlertTriangle,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Berhasil Ditemukan",
      value: stats.found_items,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Laporan Minggu Ini",
      value: stats.recent_items,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <AlertTriangle className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
          DaruratKu
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Platform pelaporan kehilangan barang selalu membantu untuk menemukan
          barang anda yang hilang
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/report">
            <motion.button
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-600 hover:to-green-600 transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Laporkan Barang Hilang</span>
            </motion.button>
          </Link>

          <Link to="/search">
            <motion.button
              className="flex items-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all border border-gray-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5" />
              <span>Cari Barang</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Items */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Laporan Terbaru</h2>
          <Link
            to="/search"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Lihat Semua →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg border border-gray-200 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LostItemCard item={item} onClick={setSelectedItem} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-12 bg-white/50 rounded-xl border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada laporan barang hilang</p>
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
