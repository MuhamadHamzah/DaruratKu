import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  MapPin,
  Calendar,
  Gift,
  Phone,
  FileText,
  Package,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    location: "",
    date_lost: "",
    contact_phone: "",
    reward_amount: "",
    image_url: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("lost_items").insert([
        {
          ...formData,
          user_id: user.id,
          reward_amount: formData.reward_amount
            ? parseInt(formData.reward_amount)
            : null,
        },
      ]);

      if (error) throw error;

      toast.success("Laporan berhasil dibuat!");
      navigate("/profile");
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("Gagal membuat laporan");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image_url: reader.result as string, // ini yang hasil base64 data URL
        }));
        toast.success("Foto berhasil diunggah!");
      };
      reader.readAsDataURL(file); // terus  ini membaca file jadi base64 data URL
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Laporkan Barang Hilang
          </h1>
          <p className="text-gray-600">
            Isi form di bawah untuk melaporkan barang yang hilang
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Judul Laporan *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Contoh: iPhone 13 Pro Max Warna Biru"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Detail *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Jelaskan ciri-ciri khusus, warna, merek, atau detail lainnya..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Barang *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category_id: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Lokasi Hilang *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Contoh: Mall Taman Anggrek, Jakarta"
                required
              />
            </div>

            {/* Date Lost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Tanggal Hilang *
              </label>
              <input
                type="date"
                value={formData.date_lost}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    date_lost: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                Nomor Telepon *
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact_phone: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="081234567890"
                required
              />
            </div>

            {/* Reward Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Gift className="inline w-4 h-4 mr-1" />
                Reward (Opsional)
              </label>
              <input
                type="number"
                value={formData.reward_amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reward_amount: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="500000"
                min="0"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="inline w-4 h-4 mr-1" />
              Foto Barang (Opsional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload foto</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pl-1">atau drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF hingga 10MB
                </p>
              </div>
            </div>
            {formData.image_url && (
              <div className="mt-4">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Memproses...
              </div>
            ) : (
              "Buat Laporan"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
