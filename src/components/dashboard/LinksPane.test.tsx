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
    { id: '1', title: 'Google', url: 'https://google.com' },
    { id: '2', title: 'GitHub', url: 'https://github.com' },
  ];

  beforeEach(() => {
    vi.mocked(useLocalStorage).mockReturnValue([initialLinks, mockSetLinks]);
    vi.clearAllMocks();
  });

  it('should render initial links', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" />);
    expect(screen.getAllByText(/Google/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/GitHub/i).length).toBeGreaterThan(0);
  });

  it('should call setLinks when adding a new link', () => {
    render(<LinksPane isAdding={true} setIsAdding={mockSetIsAdding} searchTerm="" />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    const urlInput = screen.getByPlaceholderText('URL (https://...)');
    const saveButton = screen.getByText('Save');

    fireEvent.change(titleInput, { target: { value: 'Vercel' } });
    fireEvent.change(urlInput, { target: { value: 'https://vercel.com' } });
    fireEvent.click(saveButton);

    expect(mockSetLinks).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Vercel', url: 'https://vercel.com' }),
      ])
    );
    
    expect(mockSetIsAdding).toHaveBeenCalledWith(false);
  });

  it('should filter links based on searchTerm prop', () => {
    const { rerender } = render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="Google" />);
    
    expect(screen.getAllByText(/Google/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/GitHub/i)).toBeNull();
    
    rerender(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="git" />);
    expect(screen.getAllByText(/GitHub/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Google/i)).toBeNull();
  });

  it('should call setLinks when deleting a link', () => {
    render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" />);
    const deleteButtons = screen.getAllByLabelText(/delete/i);
    fireEvent.click(deleteButtons[0]);
    expect(mockSetLinks).toHaveBeenCalledWith([initialLinks[1]]);
  });

  it('should call setLinks when editing a link', () => {
    const { rerender } = render(<LinksPane isAdding={false} setIsAdding={mockSetIsAdding} searchTerm="" />);
    const editButtons = screen.getAllByLabelText(/edit/i);
    fireEvent.click(editButtons[0]);

    expect(mockSetIsAdding).toHaveBeenCalledWith(true);
    
    // Rerender with isAdding true to show the form
    rerender(<LinksPane isAdding={true} setIsAdding={mockSetIsAdding} searchTerm="" />);

    const titleInput = screen.getByPlaceholderText('Title');
    fireEvent.change(titleInput, { target: { value: 'Google Updated' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockSetLinks).toHaveBeenCalledWith([
      { id: '1', title: 'Google Updated', url: 'https://google.com' },
      { id: '2', title: 'GitHub', url: 'https://github.com' },
    ]);
  });
});