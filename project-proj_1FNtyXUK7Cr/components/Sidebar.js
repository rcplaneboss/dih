function Sidebar({ currentView, onViewChange }) {
  try {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'inventory', label: 'Inventory', icon: 'package' },
      { id: 'daily-sales', label: 'Daily Sales', icon: 'clipboard-list' },
      { id: 'sales', label: 'Sales History', icon: 'shopping-cart' },
      { id: 'expenses', label: 'Expenses', icon: 'credit-card' },
      { id: 'categories', label: 'Categories', icon: 'tags' },
      { id: 'reports', label: 'Reports', icon: 'chart-bar' }
    ];

    return (
      <aside className="fixed left-0 top-[var(--header-height)] w-[var(--sidebar-width)] h-[calc(100vh-var(--header-height))] bg-white border-r border-[var(--border-color)] z-30" data-name="sidebar" data-file="components/Sidebar.js">
        <div className="p-4">
          <nav className="space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`sidebar-nav-item w-full ${currentView === item.id ? 'active' : ''}`}
              >
                <div className={`icon-${item.icon} text-lg`}></div>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="sidebar-nav-item w-full">
                <div className="icon-plus text-lg"></div>
                <span>Add Product</span>
              </button>
              <button className="sidebar-nav-item w-full">
                <div className="icon-scan text-lg"></div>
                <span>Scan Barcode</span>
              </button>
              <button className="sidebar-nav-item w-full">
                <div className="icon-download text-lg"></div>
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  } catch (error) {
    console.error('Sidebar component error:', error);
    return null;
  }
}