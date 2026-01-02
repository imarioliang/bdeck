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
    { title: 'Google', url: 'https://google.com' },
    { title: 'GitHub', url: 'https://github.com' },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, mockSetLinks]);
    vi.clearAllMocks();
  });

  it('should render initial links', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} />);
    expect(screen.getAllByText(/Google/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/GitHub/i).length).toBeGreaterThan(0);
  });

  it('should call setLinks when adding a new link', () => {
    render(<LinksPane isAdding={true} setIsAdding={mockSetIsAdding} />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    const urlInput = screen.getByPlaceholderText('URL (https://...)');
    const saveButton = screen.getByText('Save');

    fireEvent.change(titleInput, { target: { value: 'Vercel' } });
    fireEvent.change(urlInput, { target: { value: 'https://vercel.com' } });
    fireEvent.click(saveButton);

    expect(mockSetLinks).toHaveBeenCalledWith([
      ...initialLinks,
      { title: 'Vercel', url: 'https://vercel.com' },
    ]);
    
    expect(mockSetIsAdding).toHaveBeenCalledWith(false);
  });

  it('should filter links based on search input', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    
    // Search for "Google"
    fireEvent.change(searchInput, { target: { value: 'Google' } });
    
    expect(screen.getAllByText(/Google/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/GitHub/i)).toBeNull();
    
    // Search for "git"
    fireEvent.change(searchInput, { target: { value: 'git' } });
    expect(screen.getAllByText(/GitHub/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Google/i)).toBeNull();
  });
});