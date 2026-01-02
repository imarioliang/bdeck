export const LinksPane = () => (
  <div className="space-y-2">
    <div className="mt-4 p-2 border-2 border-dashed border-black bg-gray-50">
      <p className="text-xs italic text-gray-500">No links found. Add your first link using the Omnibar.</p>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-4">
      {['Github', 'Vercel', 'Jira', 'Docs'].map(link => (
        <div key={link} className="p-2 border-2 border-black text-xs font-bold hover:bg-black hover:text-white cursor-pointer transition-colors text-center">
          {link.toUpperCase()}
        </div>
      ))}
    </div>
  </div>
);
