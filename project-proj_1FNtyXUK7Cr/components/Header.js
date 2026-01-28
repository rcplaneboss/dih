function Header() {
  try {
    return (
      <header className="fixed top-0 left-0 right-0 h-[var(--header-height)] bg-white shadow-sm border-b border-[var(--border-color)] z-40" data-name="header" data-file="components/Header.js">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <img 
              src="https://app.trickle.so/storage/public/images/usr_1377d47ce0000001/1ffb07a7-8ef5-4a1e-a63b-e81adb108420.png" 
              alt="DIH Accessories&Gadgets Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">DIH Accessories&Gadgets</h1>
              <p className="text-xs text-[var(--text-secondary)]">Professional Store Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-[var(--text-primary)]">{new Date().toLocaleDateString()}</p>
              <p className="text-xs text-[var(--text-secondary)]">{new Date().toLocaleTimeString()}</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="icon-search text-lg text-[var(--primary-color)]"></div>
            </button>
            <button className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="icon-bell text-lg text-[var(--primary-color)]"></div>
            </button>
            <button className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="icon-settings text-lg text-[var(--primary-color)]"></div>
            </button>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
