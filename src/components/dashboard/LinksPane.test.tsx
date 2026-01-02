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
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, mockSetLinks]);
    vi.clearAllMocks();
  });

  it('should render initial links', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} />);
    expect(screen.getAllByText(/Google/i).length).toBeGreaterThan(0);
  });

  it('should call setLinks when adding a new link', () => {
    render(<LinksPane isAdding={true} setIsAdding={mockSetIsAdding} />);
    
    // Form should be visible because isAdding is true
    const titleInput = screen.getByPlaceholderText('Title');
    const urlInput = screen.getByPlaceholderText('URL (https://...)');
    const saveButton = screen.getByText('Save');

    fireEvent.change(titleInput, { target: { value: 'GitHub' } });
    fireEvent.change(urlInput, { target: { value: 'https://github.com' } });
    fireEvent.click(saveButton);

    expect(mockSetLinks).toHaveBeenCalledWith([
      ...initialLinks,
      { title: 'GitHub', url: 'https://github.com' },
    ]);
    
    // Should verify setIsAdding(false) was called
    expect(mockSetIsAdding).toHaveBeenCalledWith(false);
  });
});
