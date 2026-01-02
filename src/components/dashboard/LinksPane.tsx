'use client';

import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Pencil, Trash2 } from 'lucide-react';

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
      
      if (editingIndex !== null) {
        const updatedLinks = links.map((link, i) => 
          i === editingIndex ? { title: newTitle.trim(), url: formattedUrl } : link
        );
        setLinks(updatedLinks);
        setEditingIndex(null);
      } else {
        setLinks([...links, { title: newTitle.trim(), url: formattedUrl }]);
      }
      
      setNewTitle('');
      setNewUrl('');
      setIsAdding(false);
    }
  };

  const startEditing = (index: number) => {
    const link = links[index];
    setNewTitle(link.title);
    setNewUrl(link.url);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const deleteLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  const cancelAction = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setNewTitle('');
    setNewUrl('');
  };

  return (
    <div className="h-full flex flex-col pt-2">
      <div className="mb-4">
        {isAdding && (
          <div className="mb-4 space-y-2 bg-gray-50 p-2 border-2 border-black">
            <p className="text-[10px] font-bold uppercase">{editingIndex !== null ? 'Edit Link' : 'Add New Link'}</p>
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
                onClick={cancelAction}
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
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredLinks.length === 0 && !isAdding && (
          <div className="p-2 border-2 border-dashed border-black bg-gray-50 mb-4">
            <p className="text-xs italic text-gray-500">
              {links.length === 0 ? "No links found. Add your first link using the '+' button." : "No matches found."}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          {filteredLinks.map((link, i) => {
            const actualIndex = links.findIndex(l => l === link);
            return (
              <div key={i} className="relative group w-20 h-20 md:w-24 md:h-24">
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-full border-4 border-black flex flex-col items-center justify-center text-center hover:bg-black hover:text-white transition-colors p-2"
                  title={link.title}
                >
                  <span className="text-[10px] md:text-xs font-bold uppercase break-all line-clamp-2 leading-tight">
                    {link.title}
                  </span>
                </a>
                <div className="absolute top-0 right-0 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity bg-white border-l-2 border-b-2 border-black">
                  <button 
                    onClick={() => startEditing(actualIndex)}
                    className="p-1 hover:bg-black hover:text-white border-b-2 border-black"
                    aria-label="Edit"
                  >
                    <Pencil size={10} />
                  </button>
                  <button 
                    onClick={() => deleteLink(actualIndex)}
                    className="p-1 hover:bg-black hover:text-white"
                    aria-label="Delete"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};