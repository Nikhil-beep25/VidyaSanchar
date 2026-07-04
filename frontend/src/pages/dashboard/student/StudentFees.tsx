import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { CreditCard, Receipt, FileDown } from 'lucide-react';

export const StudentFees: React.FC = () => {
  const [ledger, setLedger] = useState<any[]>([]);

  useEffect(() => {
    async function loadLedger() {
      try {
        const data = await apiRequest('/fees/student/s1');
        setLedger(data);
      } catch (err) {
        setLedger([
          {
            id: 'l1',
            title: 'First Quarter Tuition Fee (2026-27)',
            totalAmount: 32000,
            dueDate: '2026-07-31T00:00:00.000Z',
            paidAmount: 32000,
            balance: 0,
            status: 'PAID',
            payments: [
              { id: 'pay1', amountPaid: 32000, paymentDate: '2026-07-02T10:00:00.000Z', paymentMethod: 'UPI', receiptNumber: 'REC-2026-0941' }
            ]
          },
          {
            id: 'l2',
            title: 'Annual Sports & Gymkhana Fee',
            totalAmount: 4500,
            dueDate: '2026-08-15T00:00:00.000Z',
            paidAmount: 0,
            balance: 4500,
            status: 'UNPAID',
            payments: []
          }
        ]);
      }
    }
    loadLedger();
  }, []);

  const handlePrintMockReceipt = (receipt: any) => {
    alert(`----------------------------------------
       FEE PAYMENT RECEIPT
----------------------------------------
Receipt No: ${receipt.receiptNumber}
Date: ${new Date(receipt.paymentDate).toLocaleDateString('en-IN')}
Method: ${receipt.paymentMethod}
Amount Paid: INR ${receipt.amountPaid.toLocaleString('en-IN')}
Status: Fully Logged
----------------------------------------
Thank you for your payment!
----------------------------------------`);
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Tuition Dues & Receipts</h1>
        <p className="text-sm text-muted-foreground">Check pending term fee bills, payments ledger, and print receipts.</p>
      </div>

      {/* Ledger list */}
      <div className="space-y-4">
        {ledger.map((fee) => (
          <div key={fee.id} className="border rounded-xl bg-card overflow-hidden shadow-sm flex flex-col md:flex-row justify-between text-left">
            <div className="p-6 flex-grow space-y-3">
              <h3 className="font-bold text-lg">{fee.title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block">Total Amount</span>
                  <span className="font-semibold text-sm">₹{fee.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Amount Paid</span>
                  <span className="font-semibold text-sm text-green-500">₹{fee.paidAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Remaining Dues</span>
                  <span className={`font-semibold text-sm ${fee.balance > 0 ? 'text-destructive' : 'text-green-500'}`}>
                    ₹{fee.balance.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Due Date</span>
                  <span className="font-semibold text-sm text-primary">{new Date(fee.dueDate).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t md:border-t-0 md:border-l bg-muted/20 flex flex-col justify-center items-center md:w-56 space-y-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                fee.status === 'PAID'
                  ? 'bg-green-500/10 text-green-500 border-green-500/30'
                  : fee.status === 'PARTIAL'
                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                    : 'bg-destructive/10 text-destructive border-destructive/30'
              }`}>
                {fee.status.toLowerCase()}
              </span>

              {fee.payments.length > 0 && (
                <div className="space-y-1.5 w-full text-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Receipts</span>
                  {fee.payments.map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() => handlePrintMockReceipt(p)}
                      className="inline-flex items-center text-xs text-primary font-semibold hover:underline bg-card border px-2.5 py-1 rounded w-full justify-center"
                    >
                      <Receipt className="h-3 w-3 mr-1" />
                      Receipt Reference
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {ledger.length === 0 && (
          <div className="border rounded-xl p-8 bg-card shadow-sm text-center text-muted-foreground">
            No fee bills mapped to your classroom yet.
          </div>
        )}
      </div>
    </div>
  );
};
