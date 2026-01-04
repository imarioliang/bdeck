import { render, screen, fireEvent } from '@testing-library/react';
import { LinksPane } from './LinksPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { vi } from 'vitest';

// Mock useLocalStorage
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

describe('LinksPane', () => {
  const mockSetLinks = vi.fn();
  const mockSetIsAdding = vi.fn();
  const initialLinks = [
    { id: '1', title: 'Google', url: 'https://google.com', isPinned: false, category: 'SYSTEM', tags: [] },
    { id: '2', title: 'GitHub', url: 'https://github.com', isPinned: false, category: 'SYSTEM', tags: [] },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, mockSetLinks]);
    vi.clearAllMocks();
  });

  it('should render initial links in retro list format', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    expect(screen.getByText('Google')).toBeDefined();
    expect(screen.getByText('GitHub')).toBeDefined();
    expect(screen.getByText('FILENAME')).toBeDefined();
    expect(screen.getByText('EXT')).toBeDefined();
    expect(screen.getByText('TAGS')).toBeDefined();
    expect(screen.getByText('STATUS')).toBeDefined();
    expect(screen.getByText(/ADD_NEW_MODULE/i)).toBeDefined();
  });

  it('should call setLinks when adding a new link via modal', () => {
    render(<LinksPane isAdding={true} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    const titleInput = screen.getByPlaceholderText(/TITLE\.\.\./i);
    const urlInput = screen.getByPlaceholderText(/https:\/\/\.\.\./i);
    const saveButton = screen.getByText(/\[ EXECUTE \]/i);

    fireEvent.change(titleInput, { target: { value: 'Vercel' } });
    fireEvent.change(urlInput, { target: { value: 'https://vercel.com' } });
    fireEvent.click(saveButton);

    expect(mockSetLinks).toHaveBeenCalled();
  });

  it('should filter links based on searchTerm prop', () => {
    const { rerender } = render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="Google" activeCategory="ALL SYSTEMS" />);
    
    expect(screen.getAllByText(/Google/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/GitHub/i)).toBeNull();
    
    rerender(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="git" activeCategory="ALL SYSTEMS" />);
    expect(screen.getAllByText(/GitHub/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Google/i)).toBeNull();
  });

  it('should call setLinks when deleting a link', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    const deleteButtons = screen.getAllByText('DEL');
    fireEvent.click(deleteButtons[0]);
    expect(mockSetLinks).toHaveBeenCalled();
  });

  it('should call setLinks when editing a link', () => {
    const { rerender } = render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    const editButtons = screen.getAllByText('EDIT');
    fireEvent.click(editButtons[0]);

    expect(mockSetIsAdding).toHaveBeenCalledWith(true);
    
    rerender(<LinksPane isAdding={true} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);

    const titleInput = screen.getByPlaceholderText(/TITLE\.\.\./i);
    fireEvent.change(titleInput, { target: { value: 'Google Updated' } });
    const saveButton = screen.getByText(/\[ EXECUTE \]/i);
    fireEvent.click(saveButton);

    expect(mockSetLinks).toHaveBeenCalled();
  });

  it('should call setLinks when toggling pin', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    const pinButtons = screen.getAllByText('PIN');
    fireEvent.click(pinButtons[0]);
    
    expect(mockSetLinks).toHaveBeenCalled();
  });
});
