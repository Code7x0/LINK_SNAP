import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, Loader, Copy, ExternalLink } from 'lucide-react';
import { ImageCompressor } from './ImageCompressor';
import toast from 'react-hot-toast';

export function UrlShortener() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<any[]>([]);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: urls, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch URLs');
    } else {
      setUrls(urls || []);
    }
  };

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const shortCode = generateShortCode();
      const { error } = await supabase
        .from('urls')
        .insert([{ 
          original_url: url, 
          short_code: shortCode,
          user_id: user.id 
        }]);

      if (error) throw error;
      
      toast.success('URL shortened successfully!');
      setUrl('');
      fetchUrls();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" size={20} />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your URL here"
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Shorten URL'}
          </button>
        </form>

        <div className="mt-8">
          <ImageCompressor />
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Your shortened URLs</h2>
          {urls.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="truncate flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.original_url}</p>
                  <p className="font-medium">{`${window.location.origin}/${item.short_code}`}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/${item.short_code}`)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Copy size={20} />
                  </button>
                  <a
                    href={item.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}