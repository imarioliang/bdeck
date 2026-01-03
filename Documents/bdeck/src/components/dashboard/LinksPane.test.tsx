import { render, screen, fireEvent, act } from '@testing-library/react';
import { LinksPane } from './LinksPane';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSkin } from '@/hooks/useSkin';
import { vi } from 'vitest';

// Mock useLocalStorage
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

// Mock useSkin
vi.mock('@/hooks/useSkin', () => ({
  useSkin: vi.fn(),
}));

describe('LinksPane', () => {
  const mockSetLinks = vi.fn();
  const mockSetIsAdding = vi.fn();
  const initialLinks = [
    { id: '1', title: 'Google', url: 'https://google.com', isPinned: false },
    { id: '2', title: 'GitHub', url: 'https://github.com', isPinned: false },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, mockSetLinks]);
    vi.mocked(useSkin).mockReturnValue('modern');
    vi.clearAllMocks();
  });

  it('should render initial links', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    expect(screen.getAllByText(/Google/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/GitHub/i).length).toBeGreaterThan(0);
  });

  it('should render retro style links when skin is retro', () => {
    vi.mocked(useSkin).mockReturnValue('retro');
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    // In retro mode, we show first 2 chars of title
    expect(screen.getByText('GO')).toBeDefined(); // GOogle
    expect(screen.getByText('GI')).toBeDefined(); // GIthub
    expect(screen.getByText('[ADD]')).toBeDefined(); // Retro add button
  });

  it('should call setLinks when adding a new link', () => {
    render(<LinksPane isAdding={true} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    
    const titleInput = screen.getByPlaceholderText(/MODULE_NAME/i);
    const urlInput = screen.getByPlaceholderText(/PROTOCOL_PATH/i);
    const saveButton = screen.getByText(/Execute/i);

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
    const deleteButtons = screen.getAllByTitle(/Delete/i);
    fireEvent.click(deleteButtons[0]);
    expect(mockSetLinks).toHaveBeenCalled();
  });

  it('should call setLinks when editing a link', () => {
    const { rerender } = render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    const editButtons = screen.getAllByTitle(/Edit/i);
    fireEvent.click(editButtons[0]);

    expect(mockSetIsAdding).toHaveBeenCalledWith(true);
    
    rerender(<LinksPane isAdding={true} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);

    const titleInput = screen.getByPlaceholderText(/MODULE_NAME/i);
    fireEvent.change(titleInput, { target: { value: 'Google Updated' } });
    const saveButton = screen.getByText(/Execute/i);
    fireEvent.click(saveButton);

    expect(mockSetLinks).toHaveBeenCalled();
  });

  it('should call setLinks when toggling pin', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" activeCategory="ALL SYSTEMS" />);
    const pinButtons = screen.getAllByTitle(/Pin/i);
    fireEvent.click(pinButtons[0]);
    
    expect(mockSetLinks).toHaveBeenCalled();
  });
});
