function ExpenseModal({ onClose, onAdd }) {
  try {
    const [formData, setFormData] = React.useState({
      description: '',
      amount: '',
      category: '',
      paymentMethod: 'cash',
      notes: ''
    });

    const expenseCategories = [
      'Rent', 'Utilities', 'Transportation', 'Supplies', 'Marketing',
      'Equipment', 'Maintenance', 'Insurance', 'Food & Drinks',
      'Staff Salary', 'Internet', 'Phone Bills', 'Other'
    ];

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
      if (!formData.description || !formData.amount || !formData.category) {
        alert('Please fill in all required fields');
        return;
      }

      const expense = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      onAdd(expense);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-name="expense-modal" data-file="components/ExpenseModal.js">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Expense</h2>
              <button onClick={onClose} className="text-gray-500">
                <div className="icon-x text-xl"></div>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input-field"
                placeholder="e.g., Office rent, Electricity bill"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="input-field"
              >
                <option value="">Select Category</option>
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="input-field"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="input-field"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Bank Transfer</option>
                <option value="mobile">Mobile Money</option>
                <option value="check">Check</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="input-field"
                rows="3"
                placeholder="Additional details about this expense..."
              ></textarea>
            </div>
          </div>

          <div className="p-4 border-t border-[var(--border-color)] flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn-primary flex-1">
              Add Expense
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ExpenseModal component error:', error);
    return null;
  }
}