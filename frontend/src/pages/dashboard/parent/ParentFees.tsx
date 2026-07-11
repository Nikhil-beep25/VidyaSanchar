import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { CreditCard, Receipt, Clock, CheckCircle, AlertTriangle, User, Download, Check, XCircle } from 'lucide-react';

export const ParentFees: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [ledger, setLedger] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [processingFeeId, setProcessingFeeId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<{ status: 'success' | 'failure'; message: string; paymentId?: string } | null>(null);
  const [mockPaymentModal, setMockPaymentModal] = useState<{ isOpen: boolean; fee: any; orderData: any } | null>(null);

  const handleSimulatePayment = async (success: boolean) => {
    if (!mockPaymentModal) return;
    const { fee, orderData } = mockPaymentModal;
    setMockPaymentModal(null);
    setProcessingFeeId(fee.id);

    if (success) {
      try {
        const mockPaymentId = `pay_mock_${Date.now()}`;
        const verificationResult = await apiRequest('/payments/verify', {
          method: 'POST',
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: 'mock_signature_success',
          }),
        });

        if (verificationResult && verificationResult.success) {
          setPaymentStatus({
            status: 'success',
            message: `Payment of ₹${fee.balance.toLocaleString('en-IN')} was successfully processed in Sandbox mode.`,
            paymentId: verificationResult.paymentId
          });
          await loadLedger(selectedChildId);
          await loadHistory(selectedChildId);
        } else {
          setPaymentStatus({
            status: 'failure',
            message: 'Sandbox verification failed.',
          });
        }
      } catch (err) {
        setPaymentStatus({
          status: 'failure',
          message: 'An error occurred during sandbox verification.',
        });
      } finally {
        setProcessingFeeId(null);
      }
    } else {
      setPaymentStatus({
        status: 'failure',
        message: 'Sandbox transaction was cancelled or declined.',
      });
      setProcessingFeeId(null);
    }
  };

  // 1. Fetch parent children context
  useEffect(() => {
    async function loadParentContext() {
      try {
        const summary = await apiRequest('/analytics/summary');
        if (summary && summary.children && summary.children.length > 0) {
          setChildren(summary.children);
          setSelectedChildId(summary.children[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching parent student context:', err);
        setLoading(false);
      }
    }
    loadParentContext();
  }, []);

  // 2. Fetch ledger and payment history on student changes
  useEffect(() => {
    if (!selectedChildId) return;
    setLoading(true);
    setPaymentStatus(null);
    
    Promise.all([
      loadLedger(selectedChildId),
      loadHistory(selectedChildId)
    ]).finally(() => setLoading(false));
  }, [selectedChildId]);

  const loadLedger = async (studentId: string) => {
    try {
      const data = await apiRequest(`/fees/student/${studentId}`);
      setLedger(data || []);
    } catch (err) {
      console.error('Failed to load ledger:', err);
    }
  };

  const loadHistory = async (studentId: string) => {
    try {
      const data = await apiRequest(`/payments/history?studentId=${studentId}`);
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  // Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Launch payment checkout
  const handlePayNow = async (fee: any) => {
    try {
      setProcessingFeeId(fee.id);
      setPaymentStatus(null);
      
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway checkout SDK. Please check your internet connection.');
        setProcessingFeeId(null);
        return;
      }

      // 1. Create order on backend
      const orderData = await apiRequest('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          studentId: selectedChildId,
          feeId: fee.id,
          amount: fee.balance,
        }),
      });

      if (!orderData || !orderData.orderId) {
        alert('Failed to create payment checkout order.');
        setProcessingFeeId(null);
        return;
      }

      // Check if it's a mock order (sandbox mode bypass)
      if (orderData.orderId.startsWith('order_mock_')) {
        setMockPaymentModal({ isOpen: true, fee, orderData });
        setProcessingFeeId(null);
        return;
      }

      const activeChild = children.find(c => c.id === selectedChildId);

      // 2. Configure Razorpay checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'VidyaSanchar School ERP',
        description: `School Fees: ${fee.title}`,
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify signature on backend
            const verificationResult = await apiRequest('/payments/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verificationResult && verificationResult.success) {
              setPaymentStatus({
                status: 'success',
                message: `Payment of ₹${fee.balance.toLocaleString('en-IN')} was successfully processed.`,
                paymentId: verificationResult.paymentId
              });
              // Refresh stats
              await loadLedger(selectedChildId);
              await loadHistory(selectedChildId);
            } else {
              setPaymentStatus({
                status: 'failure',
                message: 'Payment verification failed. Please contact school administration.',
              });
            }
          } catch (err) {
            setPaymentStatus({
              status: 'failure',
              message: 'An error occurred during verification. Please contact support.',
            });
          } finally {
            setProcessingFeeId(null);
          }
        },
        prefill: {
          name: activeChild?.user?.name || 'Parent User',
          email: 'parent@sms.edu.in',
        },
        theme: {
          color: '#7C3AED',
        },
        modal: {
          ondismiss: function () {
            setProcessingFeeId(null);
          }
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed.');
      setProcessingFeeId(null);
    }
  };

  // Secure download PDF blob receipt
  const handleDownloadReceipt = async (paymentId: string, receiptNumber: string) => {
    try {
      let apiBase = (import.meta.env.VITE_API_URL as string) || '';
      if (apiBase.endsWith('/')) {
        apiBase = apiBase.slice(0, -1);
      }
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${apiBase}/api/payments/${paymentId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Receipt generation failed.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt_${receiptNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading receipt PDF.');
    }
  };

  // Calculations
  const totalOutstanding = ledger.reduce((sum, item) => sum + item.balance, 0);
  const totalPaid = ledger.reduce((sum, item) => sum + item.paidAmount, 0);
  const activeChild = children.find(c => c.id === selectedChildId);

  if (loading && children.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
          <p className="text-sm text-muted-foreground">Monitor quarterly billing and pay outstanding school dues online.</p>
        </div>

        {/* Children selector dropdown */}
        {children.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Child:</span>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="h-10 px-3 rounded-md border bg-card text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
            >
              {children.map(c => (
                <option key={c.id} value={c.id}>{c.user.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeChild && (
        <div className="p-4 border border-violet-100 rounded-xl bg-violet-50/15 flex items-center space-x-4 text-left shadow-sm">
          <div className="p-2.5 rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">{activeChild.user.name}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Classroom: <span className="font-semibold">{activeChild.studentClass?.name}-{activeChild.studentClass?.section}</span> | Roll Number: <span className="font-semibold">{activeChild.rollNumber}</span>
            </p>
          </div>
        </div>
      )}

      {/* 3. Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-violet-100/50 rounded-xl p-5 bg-card text-left shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Total Paid Fees</span>
            <span className="text-2xl font-bold text-emerald-600">₹{totalPaid.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="border border-violet-100/50 rounded-xl p-5 bg-card text-left shadow-sm flex items-center space-x-4">
          <div className="p-3.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Outstanding Balance Dues</span>
            <span className={`text-2xl font-bold ${totalOutstanding > 0 ? 'text-destructive' : 'text-emerald-500'}`}>
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Payment Success/Failure Notification Pages */}
      {paymentStatus && (
        <div className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center space-y-3 ${
          paymentStatus.status === 'success' 
            ? 'bg-emerald-50/30 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50/30 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center space-x-2">
            {paymentStatus.status === 'success' ? (
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            ) : (
              <XCircle className="h-6 w-6 text-rose-500" />
            )}
            <h3 className="font-bold text-sm">
              {paymentStatus.status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground max-w-lg">{paymentStatus.message}</p>
          {paymentStatus.status === 'success' && paymentStatus.paymentId && (
            <button
              onClick={() => handleDownloadReceipt(paymentStatus.paymentId!, 'Receipt')}
              className="inline-flex items-center text-xs text-primary font-bold hover:underline bg-white border border-violet-100 px-4 py-2 rounded-lg shadow-sm"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download Receipt (PDF)
            </button>
          )}
        </div>
      )}

      {/* 5. Tuition Ledger List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-left tracking-tight">Tuition Dues & Bills</h2>
        {ledger.length === 0 ? (
          <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground text-sm">
            No bills registered for this student.
          </div>
        ) : (
          ledger.map((fee) => (
            <div key={fee.id} className="border border-violet-100/50 rounded-xl bg-card overflow-hidden shadow-sm flex flex-col md:flex-row justify-between text-left">
              <div className="p-6 flex-grow space-y-3">
                <h3 className="font-bold text-base text-foreground">{fee.title}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block">Total Amount</span>
                    <span className="font-semibold text-sm">₹{fee.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Amount Paid</span>
                    <span className="font-semibold text-sm text-green-500 font-mono">₹{fee.paidAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Outstanding Balance</span>
                    <span className={`font-semibold text-sm font-mono ${fee.balance > 0 ? 'text-destructive' : 'text-green-500'}`}>
                      ₹{fee.balance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Due Date</span>
                    <span className="font-semibold text-sm text-primary">{new Date(fee.dueDate).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t md:border-t-0 md:border-l border-violet-100/30 bg-violet-50/5 flex flex-col justify-center items-center md:w-56 space-y-3">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border ${
                  fee.status === 'PAID'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    : fee.status === 'PARTIAL'
                      ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                      : 'bg-destructive/10 text-destructive border-destructive/30'
                }`}>
                  {fee.status.toLowerCase()}
                </span>

                {fee.balance > 0 ? (
                  <button
                    onClick={() => handlePayNow(fee)}
                    disabled={processingFeeId !== null}
                    className="w-full h-9 inline-flex items-center justify-center rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {processingFeeId === fee.id ? 'Processing...' : 'Pay Now'}
                  </button>
                ) : (
                  <div className="flex items-center text-xs text-emerald-600 font-medium space-x-1.5">
                    <CheckCircle className="h-4 w-4" />
                    <span>Fully Paid</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 6. Payment Transaction History */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-left tracking-tight">Online Payment History</h2>
        {history.length === 0 ? (
          <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground text-sm">
            No completed online payment transactions found.
          </div>
        ) : (
          <div className="border border-violet-100/50 rounded-xl bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-4 font-semibold">Receipt No</th>
                    <th className="p-4 font-semibold">Particulars</th>
                    <th className="p-4 font-semibold">Method</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Amount Paid</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((pay) => (
                    <tr key={pay.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-mono text-xs font-semibold">{pay.receiptNumber}</td>
                      <td className="p-4 font-medium text-xs">{pay.fee?.title || 'Quarterly Fees'}</td>
                      <td className="p-4 text-xs">
                        <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-700 text-[10px] font-bold">
                          Online
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {new Date(pay.paidAt || pay.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="p-4 text-xs font-bold text-emerald-600 font-mono">
                        ₹{pay.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDownloadReceipt(pay.id, pay.receiptNumber)}
                          className="inline-flex items-center text-xs text-primary font-bold hover:underline bg-muted/40 hover:bg-muted/70 px-2.5 py-1.5 rounded-md border"
                          title="Download Receipt PDF"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Local Sandbox Payment Mock Modal */}
      {mockPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-violet-100 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in fade-in zoom-in duration-200">
            <div className="flex items-center space-x-3 text-violet-700">
              <span className="p-2 bg-violet-100 rounded-xl text-lg">🛠️</span>
              <div>
                <h3 className="font-bold text-base">Local Sandbox Gateway</h3>
                <p className="text-[10px] text-muted-foreground">Simulated payment process for testing</p>
              </div>
            </div>

            <div className="border border-dashed border-violet-100 rounded-xl p-4 bg-muted/30 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Particulars:</span>
                <span className="font-semibold">{mockPaymentModal.fee.title}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-semibold">{mockPaymentModal.orderData.orderId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Dues:</span>
                <span className="font-bold text-violet-700">₹{mockPaymentModal.fee.balance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleSimulatePayment(true)}
                className="h-10 inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shadow-sm transition-colors"
              >
                Simulate Success
              </button>
              <button
                onClick={() => handleSimulatePayment(false)}
                className="h-10 inline-flex items-center justify-center rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold shadow-sm transition-colors"
              >
                Simulate Failure
              </button>
            </div>

            <button
              onClick={() => setMockPaymentModal(null)}
              className="w-full h-9 inline-flex items-center justify-center rounded-lg border text-xs font-medium hover:bg-muted transition-colors text-muted-foreground"
            >
              Cancel Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
