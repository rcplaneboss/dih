function ReceiptModal({ sale, onClose }) {
  try {
    const handlePrint = () => {
      const printContent = document.getElementById('receipt-content');
      const printWindow = window.open('', '', 'height=600,width=400');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${sale.receiptNumber || `RCP-${sale.id}`}</title>
            <style>
              body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 20px; }
              .receipt { max-width: 300px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
              .logo { width: 60px; height: 60px; margin: 0 auto 10px; }
              .store-name { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
              .store-info { font-size: 10px; line-height: 1.3; }
              .receipt-info { margin: 15px 0; font-size: 11px; }
              .items { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; }
              .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .total-section { margin-top: 10px; }
              .total-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
              .final-total { border-top: 1px solid #000; padding-top: 5px; font-weight: bold; font-size: 14px; }
              .footer { text-align: center; margin-top: 20px; font-size: 10px; border-top: 1px dashed #000; padding-top: 10px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    const handleDownload = () => {
      const receiptContent = document.getElementById('receipt-content').innerHTML;
      const blob = new Blob([`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - ${sale.receiptNumber || `RCP-${sale.id}`}</title>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 20px; }
              .receipt { max-width: 300px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
              .logo { width: 60px; height: 60px; margin: 0 auto 10px; }
              .store-name { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
              .store-info { font-size: 10px; line-height: 1.3; }
              .receipt-info { margin: 15px 0; font-size: 11px; }
              .items { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; }
              .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .total-section { margin-top: 10px; }
              .total-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
              .final-total { border-top: 1px solid #000; padding-top: 5px; font-weight: bold; font-size: 14px; }
              .footer { text-align: center; margin-top: 20px; font-size: 10px; border-top: 1px dashed #000; padding-top: 10px; }
            </style>
          </head>
          <body>
            ${receiptContent}
          </body>
        </html>
      `], { type: 'text/html' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${sale.receiptNumber || sale.id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-name="receipt-modal" data-file="components/ReceiptModal.js">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Customer Receipt</h2>
              <button onClick={onClose} className="text-gray-500">
                <div className="icon-x text-xl"></div>
              </button>
            </div>
          </div>

          <div className="p-4">
            <div id="receipt-content" className="receipt bg-white p-4 border rounded-lg font-mono text-sm">
              <div className="header">
                <img 
                  src="https://app.trickle.so/storage/public/images/usr_1377d47ce0000001/1ffb07a7-8ef5-4a1e-a63b-e81adb108420.png" 
                  alt="DIH Logo" 
                  className="logo"
                />
                <div className="store-name">DIH ACCESSORIES & GADGETS</div>
                <div className="store-info">
                  Professional Phone Accessories<br/>
                  Quality Products • Affordable Prices<br/>
                  Tel: +234 XXX XXX XXXX
                </div>
              </div>

              <div className="receipt-info">
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Receipt #:</span>
                  <span>{sale.receiptNumber || `RCP-${sale.id}`}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Date:</span>
                  <span>{new Date(sale.timestamp).toLocaleDateString()}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Time:</span>
                  <span>{new Date(sale.timestamp).toLocaleTimeString()}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Payment:</span>
                  <span>{sale.paymentMethod.toUpperCase()}</span>
                </div>
              </div>

              <div className="items">
                <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '8px'}}>
                  <span>ITEM</span>
                  <span>AMOUNT</span>
                </div>
                <div className="item-row">
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: 'bold'}}>{sale.productName}</div>
                    <div style={{fontSize: '10px', color: '#666'}}>{sale.brand}</div>
                    <div style={{fontSize: '10px'}}>₦{sale.price} x {sale.quantity}</div>
                  </div>
                  <div>₦{sale.subtotal?.toFixed(2) || sale.total.toFixed(2)}</div>
                </div>
              </div>

              <div className="total-section">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₦{sale.subtotal?.toFixed(2) || sale.total.toFixed(2)}</span>
                </div>
                {sale.discount > 0 && (
                  <div className="total-row" style={{color: '#e53e3e'}}>
                    <span>Discount:</span>
                    <span>-₦{sale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row final-total">
                  <span>TOTAL:</span>
                  <span>₦{sale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="footer">
                <div>Thank you for your business!</div>
                <div style={{marginTop: '5px'}}>Visit us again soon</div>
                <div style={{marginTop: '10px', fontSize: '9px'}}>
                  * No returns without receipt<br/>
                  * Warranty as per manufacturer terms
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[var(--border-color)] flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Close
            </button>
            <button onClick={handleDownload} className="btn-secondary flex-1">
              <div className="icon-download text-sm mr-2"></div>
              Download
            </button>
            <button onClick={handlePrint} className="btn-primary flex-1">
              <div className="icon-printer text-sm mr-2"></div>
              Print
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ReceiptModal component error:', error);
    return null;
  }
}