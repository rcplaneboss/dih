function Navigation({ currentView, onViewChange }) {
  try {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'inventory', label: 'Inventory', icon: 'package' },
      { id: 'sales', label: 'Sales', icon: 'shopping-cart' },
      { id: 'reports', label: 'Reports', icon: 'chart-bar' }
    ];

    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border-color)] px-2 py-1" data-name="navigation" data-file="components/Navigation.js">
        <div className="flex justify-around">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            >
              <div className={`icon-${item.icon} text-lg mb-1`}></div>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    );
  } catch (error) {
    console.error('Navigation component error:', error);
    return null;
  }
}