import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface CompressedImage {
  originalSize: number;
  compressedSize: number;
  compressedDataUrl: string;
}

export function ImageCompressor() {
  const [loading, setLoading] = useState(false);
  const [compressedImage, setCompressedImage] = useState<CompressedImage | null>(null);
  const [quality, setQuality] = useState(70);

  const compressImage = useCallback((file: File): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Calculate new dimensions while maintaining aspect ratio
          const maxWidth = 1200;
          const maxHeight = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas with new dimensions
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          
          resolve({
            originalSize: file.size,
            compressedSize: Math.round((compressedDataUrl.length * 3) / 4),
            compressedDataUrl
          });
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  }, [quality]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setLoading(true);
    try {
      const compressed = await compressImage(file);
      setCompressedImage(compressed);
      toast.success('Image compressed successfully!');
    } catch (error) {
      toast.error('Failed to compress image');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ImageIcon size={24} />
          Image Compressor
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Compress your images before sharing them
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Compression Quality: {quality}%</span>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2"
          />
        </label>

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-input"
            disabled={loading}
          />
          <label
            htmlFor="image-input"
            className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-500 transition-colors"
          >
            {loading ? (
              <Loader className="animate-spin" size={24} />
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload size={24} />
                <span className="text-sm">Click to upload an image</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Max file size: 10MB
                </span>
              </div>
            )}
          </label>
        </div>

        {compressedImage && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Original size: {formatSize(compressedImage.originalSize)}</span>
              <span>Compressed size: {formatSize(compressedImage.compressedSize)}</span>
            </div>
            
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
              <img
                src={compressedImage.compressedDataUrl}
                alt="Compressed preview"
                className="object-contain w-full h-full"
              />
            </div>

            <div className="flex justify-end">
              <a
                href={compressedImage.compressedDataUrl}
                download="compressed-image.jpg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Download Compressed Image
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}