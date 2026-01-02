'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Link {
  title: string;
  url: string;
}

export const LinksPane = () => {
  const [links, setLinks] = useLocalStorage<Link[]>('bdeck-links', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const addLink = () => {
    if (newTitle.trim() && newUrl.trim()) {
      let formattedUrl = newUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }
      setLinks([...links, { title: newTitle.trim(), url: formattedUrl }]);
      setNewTitle('');
      setNewUrl('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {links.length === 0 && !isAdding && (
          <div className="p-2 border-2 border-dashed border-black bg-gray-50">
            <p className="text-xs italic text-gray-500">No links found. Add your first link below.</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {links.map((link, i) => (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 border-2 border-black text-xs font-bold hover:bg-black hover:text-white cursor-pointer transition-colors text-center uppercase truncate block"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-black pt-4">
        {isAdding ? (
          <div className="space-y-2 bg-gray-50 p-2 border-2 border-black">
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title" 
              className="w-full text-xs border-b-2 border-black focus:outline-none bg-transparent" 
            />
            <input 
              type="text" 
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL (https://...)" 
              className="w-full text-xs border-b-2 border-black focus:outline-none bg-transparent" 
            />
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setIsAdding(false)}
                className="text-[10px] font-bold uppercase underline"
              >
                Cancel
              </button>
              <button 
                onClick={addLink}
                className="text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full p-1 border-2 border-black text-xs font-bold uppercase hover:bg-gray-100"
          >
            Add Link
          </button>
        )}
      </div>
    </div>
  );
};