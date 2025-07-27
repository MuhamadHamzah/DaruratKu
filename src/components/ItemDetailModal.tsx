import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  MapPin,
  Phone,
  Gift,
  Package,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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

interface ItemDetailModalProps {
  item: LostItem;
  onClose: () => void;
  isOwner?: boolean;
  onStatusChange?: (
    itemId: string,
    newStatus: "lost" | "found" | "closed"
  ) => void;
  onDelete?: (itemId: string) => void;
}

export default function ItemDetailModal({
  item,
  onClose,
  isOwner = false,
  onStatusChange,
  onDelete,
}: ItemDetailModalProps) {
  const statusColors = {
    lost: "bg-red-100 text-red-700 border-red-200",
    found: "bg-green-100 text-green-700 border-green-200",
    closed: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const statusText = {
    lost: "Hilang",
    found: "Ditemukan",
    closed: "Ditutup",
  };

  const handleCall = () => {
    window.open(`tel:${item.contact_phone}`, "_self");
  };

  const handleWhatsApp = () => {
    const message = `Halo, saya melihat laporan barang hilang "${item.title}" di DaruratKu. Apakah masih tersedia atau sudah ditemukan?`;
    window.open(
      `https://wa.me/${item.contact_phone.replace(
        /^0/,
        "62"
      )}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-t-2xl flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium border ${
                statusColors[item.status]
              }`}
            >
              {statusText[item.status]}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h2>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {item.categories.name}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {item.description}
            </p>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-red-500" />
                <span>{item.location}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                <span>
                  Hilang pada{" "}
                  {format(new Date(item.date_lost), "dd MMMM yyyy", {
                    locale: id,
                  })}
                </span>
              </div>

              {item.reward_amount && item.reward_amount > 0 && (
                <div className="flex items-center text-green-600">
                  <Gift className="w-5 h-5 mr-3" />
                  <span className="font-medium">
                    Reward: Rp {item.reward_amount.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!isOwner && (
                <>
                  <button
                    onClick={handleCall}
                    className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Telepon</span>
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </button>
                </>
              )}

              {isOwner && onStatusChange && (
                <div className="flex flex-col sm:flex-row gap-2">
                  {item.status === "lost" && (
                    <button
                      onClick={() => onStatusChange(item.id, "found")}
                      className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Tandai Ditemukan</span>
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
              Dilaporkan pada{" "}
              {format(new Date(item.created_at), "dd MMMM yyyy, HH:mm", {
                locale: id,
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
