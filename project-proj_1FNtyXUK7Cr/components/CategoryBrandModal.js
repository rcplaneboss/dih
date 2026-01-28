function CategoryBrandModal({ onClose, onAddCategory, onAddBrand, categories, brands }) {
  try {
    const [activeTab, setActiveTab] = React.useState('category');
    const [newCategory, setNewCategory] = React.useState('');
    const [newBrand, setNewBrand] = React.useState('');

    const handleAddCategory = () => {
      if (newCategory.trim()) {
        onAddCategory(newCategory.trim().toUpperCase());
        setNewCategory('');
      }
    };

    const handleAddBrand = () => {
      if (newBrand.trim()) {
        onAddBrand(newBrand.trim().toUpperCase());
        setNewBrand('');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-name="category-brand-modal" data-file="components/CategoryBrandModal.js">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Categories & Brands</h2>
              <button onClick={onClose} className="text-gray-500">
                <div className="icon-x text-xl"></div>
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Tab Navigation */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('category')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'category' 
                    ? 'bg-white text-[var(--primary-color)] shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setActiveTab('brand')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'brand' 
                    ? 'bg-white text-[var(--primary-color)] shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Brands
              </button>
            </div>

            {/* Category Tab */}
            {activeTab === 'category' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Add New Category</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="input-field flex-1"
                      placeholder="Enter category name"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <button onClick={handleAddCategory} className="btn-primary">
                      <div className="icon-plus text-sm"></div>
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Current Categories ({categories.length})</p>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {categories.map(category => (
                      <div key={category} className="text-sm p-2 bg-gray-50 rounded">
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Brand Tab */}
            {activeTab === 'brand' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Add New Brand</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="input-field flex-1"
                      placeholder="Enter brand name"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddBrand()}
                    />
                    <button onClick={handleAddBrand} className="btn-primary">
                      <div className="icon-plus text-sm"></div>
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Current Brands ({brands.length})</p>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {brands.map(brand => (
                      <div key={brand} className="text-sm p-2 bg-gray-50 rounded">
                        {brand}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--border-color)]">
            <button onClick={onClose} className="btn-secondary w-full">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('CategoryBrandModal component error:', error);
    return null;
  }
}