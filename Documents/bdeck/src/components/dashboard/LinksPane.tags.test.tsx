import { render, screen, fireEvent } from '@testing-library/react';
import { LinksPane } from './LinksPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSkin } from '@/hooks/useSkin';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock hooks
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

describe('LinksPane Tag Functions', () => {
  const mockSetLinks = vi.fn();
  const mockSetIsAdding = vi.fn();
  
  // Link without tags (backward compatibility)
  const initialLinks = [
    { id: '1', title: 'Old Link', url: 'https://old.com', category: 'SYSTEM', isPinned: false },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, mockSetLinks]);
    vi.mocked(useSkin).mockReturnValue('retro');
    vi.clearAllMocks();
  });

  it('should allow adding tags via the modal', () => {
    render(<LinksPane isAdding={true} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    // Find the new tags input (to be implemented)
    const tagsInput = screen.getByPlaceholderText(/TAGS \(COMMA SEPARATED\)/i);
    const titleInput = screen.getByPlaceholderText(/MODULE_NAME/i);
    const urlInput = screen.getByPlaceholderText(/PROTOCOL_PATH/i);
    const saveButton = screen.getByText(/Execute/i);

    fireEvent.change(titleInput, { target: { value: 'New Module' } });
    fireEvent.change(urlInput, { target: { value: 'https://new.com' } });
    fireEvent.change(tagsInput, { target: { value: 'work, dev, tools' } });
    fireEvent.click(saveButton);

    // Verify setLinks was called. Since it uses a functional updater, we check the first call's first argument.
    const updater = mockSetLinks.mock.calls.find(call => typeof call[0] === 'function')?.[0];
    expect(updater).toBeDefined();
    
    const newState = updater(initialLinks);
    expect(newState).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'New Module',
        tags: ['work', 'dev', 'tools']
      })
    ]));
  });

  it('should display tags in the list (Retro Mode)', () => {
    const linksWithTags = [
      { id: '2', title: 'Tagged Link', url: 'https://tags.com', category: 'DEVELOPMENT', isPinned: false, tags: ['work', 'important'] }
    ];
    vi.mocked(useLocalStorage).mockReturnValue([linksWithTags, mockSetLinks]);
    
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    // SIZE column should show tags
    expect(screen.getByText(/work/i)).toBeDefined();
    expect(screen.getByText(/important/i)).toBeDefined();
  });
});
