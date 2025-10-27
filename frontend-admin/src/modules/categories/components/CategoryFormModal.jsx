import React, { useState, useEffect } from "react";
import { X, Smile, Palette, AlertCircle } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { HexColorPicker } from "react-colorful";

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  category,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emoji: "📦",
    color: "#6366f1",
    parent_id: null,
  });
  const [errors, setErrors] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        emoji: category.emoji || "📦",
        color: category.color || "#6366f1",
        parent_id: category.parent_id || null,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        emoji: "📦",
        color: "#6366f1",
        parent_id: null,
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.emoji) {
      newErrors.emoji = "Selecciona un emoji";
    }

    if (!formData.color) {
      newErrors.color = "Selecciona un color";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleEmojiClick = (emojiData) => {
    handleChange("emoji", emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleClose = () => {
    setShowEmojiPicker(false);
    setShowColorPicker(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {category ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Preview */}
            <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: `${formData.color}15`,
                  color: formData.color,
                  border: `2px solid ${formData.color}30`,
                }}
              >
                {formData.emoji}
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors ${
                  errors.name
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Ej: Electrónica"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none transition-colors"
                placeholder="Describe esta categoría..."
              />
            </div>

            {/* Emoji and Color */}
            <div className="grid grid-cols-2 gap-4">
              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emoji <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowColorPicker(false);
                    }}
                    className={`w-full px-4 py-3 border rounded-lg flex items-center justify-between bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors ${
                      errors.emoji
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <span className="text-2xl">{formData.emoji}</span>
                    <Smile className="h-5 w-5 text-gray-400" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute top-full left-0 mt-2 z-50">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme="auto"
                        width={320}
                        height={400}
                      />
                    </div>
                  )}
                  {errors.emoji && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.emoji}
                    </p>
                  )}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowColorPicker(!showColorPicker);
                      setShowEmojiPicker(false);
                    }}
                    className={`w-full px-4 py-3 border rounded-lg flex items-center justify-between bg-white dark:bg-gray-900 transition-colors ${
                      errors.color
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: formData.color }}
                      />
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        {formData.color}
                      </span>
                    </div>
                    <Palette className="h-5 w-5 text-gray-400" />
                  </button>
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-2 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                      <HexColorPicker
                        color={formData.color}
                        onChange={(color) => handleChange("color", color)}
                      />
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) =>
                            handleChange("color", e.target.value)
                          }
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                          placeholder="#000000"
                        />
                      </div>
                      {/* Colores predefinidos no saturados */}
                      <div className="mt-3 grid grid-cols-6 gap-2">
                        {[
                          "#6366f1", // Indigo
                          "#8b5cf6", // Purple
                          "#ec4899", // Pink
                          "#ef4444", // Red
                          "#f59e0b", // Amber
                          "#10b981", // Emerald
                          "#06b6d4", // Cyan
                          "#3b82f6", // Blue
                          "#64748b", // Slate
                          "#78716c", // Stone
                          "#14b8a6", // Teal
                          "#a855f7", // Violet
                        ].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleChange("color", color)}
                            className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.color && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.color}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Guardando..." : category ? "Actualizar" : "Crear"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
