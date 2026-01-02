'use client';

import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Pencil, Trash2, GripHorizontal } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Link {
  id: string;
  title: string;
  url: string;
}

interface LinksPaneProps {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
  searchTerm: string;
}

interface SortableLinkItemProps {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
  isReorderable: boolean;
}

const SortableLinkItem = ({ link, onEdit, onDelete, isReorderable }: SortableLinkItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id, disabled: !isReorderable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="relative group w-20 h-20 md:w-24 md:h-24 bg-white"
    >
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
      
      <div className="absolute top-0 right-0 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity bg-white border-l-2 border-b-2 border-black z-10">
        {isReorderable && (
          <button 
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-black hover:text-white border-b-2 border-black cursor-grab active:cursor-grabbing"
            aria-label="Reorder"
          >
            <GripHorizontal size={10} />
          </button>
        )}
        <button 
          onClick={onEdit}
          className="p-1 hover:bg-black hover:text-white border-b-2 border-black"
          aria-label="Edit"
        >
          <Pencil size={10} />
        </button>
        <button 
          onClick={onDelete}
          className="p-1 hover:bg-black hover:text-white"
          aria-label="Delete"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
};

export const LinksPane = ({ isAdding, setIsAdding, searchTerm }: LinksPaneProps) => {
  const [links, setLinks] = useLocalStorage<Link[]>('bdeck-links', []);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      
      if (editingId !== null) {
        setLinks(links.map(link => 
          link.id === editingId ? { ...link, title: newTitle.trim(), url: formattedUrl } : link
        ));
        setEditingId(null);
      } else {
        const id = Date.now().toString();
        setLinks([...links, { id, title: newTitle.trim(), url: formattedUrl }]);
      }
      
      setNewTitle('');
      setNewUrl('');
      setIsAdding(false);
    }
  };

  const startEditing = (id: string) => {
    const link = links.find(l => l.id === id);
    if (link) {
      setNewTitle(link.title);
      setNewUrl(link.url);
      setEditingId(id);
      setIsAdding(true);
    }
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const cancelAction = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewTitle('');
    setNewUrl('');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      setLinks(arrayMove(links, oldIndex, newIndex));
    }
  };

  // Ensure links have IDs (migration)
  const sanitizedLinks = links.map((link, index) => ({
    ...link,
    id: link.id || `link-${index}-${Date.now()}`
  }));

  const isReorderable = searchTerm === '';

  return (
    <div className="h-full flex flex-col pt-2">
      <div className="mb-4">
        {isAdding && (
          <div className="mb-4 space-y-2 bg-gray-50 p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[10px] font-bold uppercase">{editingId !== null ? 'Edit Link' : 'Add New Link'}</p>
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
        {(isReorderable ? sanitizedLinks : filteredLinks).length === 0 && !isAdding && (
          <div className="p-2 border-2 border-dashed border-black bg-gray-50 mb-4">
            <p className="text-xs italic text-gray-500">
              {links.length === 0 ? "No links found. Add your first link using the '+' button." : "No matches found."}
            </p>
          </div>
        )}
        
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={(isReorderable ? sanitizedLinks : filteredLinks).map(l => l.id)}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-wrap gap-4">
              {(isReorderable ? sanitizedLinks : filteredLinks).map((link) => (
                <SortableLinkItem 
                  key={link.id} 
                  link={link}
                  onEdit={() => startEditing(link.id)}
                  onDelete={() => deleteLink(link.id)}
                  isReorderable={isReorderable}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
