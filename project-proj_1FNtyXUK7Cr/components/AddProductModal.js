function AddProductModal({ onClose, onAdd, categories, brands }) {
  try {
    const [formData, setFormData] = React.useState({
      name: '',
      brand: '',
      category: '',
      price: '',
      cost: '',
      quantity: '',
      lowStockThreshold: '10',
      barcode: '',
      description: ''
    });

    // Use the passed categories and brands props

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
      if (!formData.name || !formData.brand || !formData.category || !formData.price) {
        alert('Please fill in all required fields');
        return;
      }

      const product = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost) || 0,
        quantity: parseInt(formData.quantity) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10
      };

      onAdd(product);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-name="add-product-modal" data-file="components/AddProductModal.js">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={onClose} className="text-gray-500">
                <div className="icon-x text-xl"></div>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field"
                placeholder="e.g., 10000mAh Power Bank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  handleInputChange('category', e.target.value);
                  handleInputChange('brand', '');
                }}
                className="input-field"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand *</label>
              <select
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="input-field"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Selling Price *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="input-field"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cost Price</label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  className="input-field"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  className="input-field"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Low Stock Alert</label>
                <input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                  className="input-field"
                  placeholder="10"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[var(--border-color)] flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn-primary flex-1">
              Add Product
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AddProductModal component error:', error);
    return null;
  }
}
