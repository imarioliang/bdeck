'use client';

import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Link {
  title: string;
  url: string;
}

interface LinksPaneProps {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
  searchTerm: string;
}

export const LinksPane = ({ isAdding, setIsAdding, searchTerm }: LinksPaneProps) => {
  const [links, setLinks] = useLocalStorage<Link[]>('bdeck-links', []);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const filteredLinks = useMemo(() => {
    return links.filter(link => 
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      link.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [links, searchTerm]);

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
    <div className="h-full flex flex-col pt-2">
      {isAdding && (
        <div className="mb-4 space-y-2 bg-gray-50 p-2 border-2 border-black">
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
      )}

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredLinks.length === 0 && (
          <div className="p-2 border-2 border-dashed border-black bg-gray-50 mb-4">
            <p className="text-xs italic text-gray-500">
              {links.length === 0 ? "No links found. Add your first link using the '+' button." : "No matches found."}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          {filteredLinks.map((link, i) => (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-20 h-20 md:w-24 md:h-24 border-4 border-black flex flex-col items-center justify-center text-center hover:bg-black hover:text-white transition-colors group p-2"
              title={link.title}
            >
              <span className="text-[10px] md:text-xs font-bold uppercase break-all line-clamp-2 leading-tight">
                {link.title}
              </span>
              <span className="mt-1 text-[8px] opacity-0 group-hover:opacity-70 transition-opacity truncate w-full px-1">
                {link.url.replace(/^https?:\/\//, '')}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
