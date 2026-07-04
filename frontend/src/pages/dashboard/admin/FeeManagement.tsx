import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { CreditCard, Plus, Receipt } from 'lucide-react';

export const FeeManagement: React.FC = () => {
  const toast = useToast();
  const [fees, setFees] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  // Create Fee Form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState<any[]>([]);

  // Collect Payment Form
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedFeeId, setSelectedFeeId] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const loadData = async () => {
    try {
      const fs = await apiRequest('/fees');
      setFees(fs);

      const cls = await apiRequest('/classes');
      setClasses(cls);

      const std = await apiRequest('/students');
      setStudents(std);
    } catch (err) {
      // Mock fallbacks
      setClasses([{ id: 'c1', name: 'Class 10', section: 'A' }]);
      setStudents([
        { id: 'st1', user: { name: 'Rahul Gupta' } },
        { id: 'st2', user: { name: 'Snigdha Das' } }
      ]);
      setFees([
        { id: 'f1', title: 'First Quarter Tuition Fee (2026-27)', amount: 32000, dueDate: '2026-07-31T00:00:00.000Z', feeClass: { name: 'Class 10', section: 'A' } }
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !dueDate || !classId) {
      toast.warning('All fields are required.');
      return;
    }

    try {
      await apiRequest('/fees', {
        method: 'POST',
        body: JSON.stringify({ title, amount, dueDate, classId })
      });
      toast.success('Fee structure created successfully.');
      setTitle('');
      setAmount('');
      setDueDate('');
      loadData();
    } catch (err) {
      toast.error('Failed to create fee structure.');
    }
  };

  const handleCollectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedFeeId || !amountPaid) {
      toast.warning('Please select student, fee, and enter amount.');
      return;
    }

    try {
      const data = await apiRequest('/fees/payment', {
        method: 'POST',
        body: JSON.stringify({
          feeId: selectedFeeId,
          studentId: selectedStudentId,
          amountPaid,
          paymentMethod
        })
      });
      toast.success(`Payment recorded successfully! Receipt Reference: ${data.payment.receiptNumber}`);
      setAmountPaid('');
      loadData();
    } catch (err) {
      toast.error('Failed to record payment.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Fee & Payment Management</h1>
        <p className="text-sm text-muted-foreground">Manage fee categories, collect UPI/Cash dues, and track receipt logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Fee card */}
        <div className="border rounded-xl p-6 bg-card space-y-4 h-fit">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <Plus className="h-5 w-5 text-primary" />
            <span>New Fee Head</span>
          </h3>

          <form onSubmit={handleCreateFee} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Fee Description *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="e.g. Term 1 Tuition Fee" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Amount (INR) *</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="e.g. 25000" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Due Date *</label>
                <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Target Class Assign *</label>
              <select required value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
              </select>
            </div>

            <button type="submit" className="w-full h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
              Create Fee Structure
            </button>
          </form>
        </div>

        {/* Collect Dues Card */}
        <div className="border rounded-xl p-6 bg-card space-y-4 h-fit">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Collect UPI/Cash Payment</span>
          </h3>

          <form onSubmit={handleCollectPayment} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Select Student *</label>
              <select required value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.user?.name || s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Select Fee Bill *</label>
              <select required value={selectedFeeId} onChange={(e) => setSelectedFeeId(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                <option value="">Select Bill</option>
                {fees.map(f => <option key={f.id} value={f.id}>{f.title} (₹{f.amount})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Paid Amount *</label>
                <input type="number" required value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="e.g. 15000" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Method *</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                  <option value="UPI">UPI (GPay/PhonePe)</option>
                  <option value="Cash">Cash</option>
                  <option value="NetBanking">NetBanking</option>
                  <option value="Card">Credit/Debit Card</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
              Record Payment Dues
            </button>
          </form>
        </div>

        {/* Existing Bills catalog */}
        <div className="border rounded-xl p-6 bg-card space-y-4">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-primary" />
            <span>Active Fee Bills Catalog</span>
          </h3>

          <div className="space-y-3">
            {fees.map(f => (
              <div key={f.id} className="p-3 border rounded-lg bg-muted/20 text-left text-xs space-y-1">
                <span className="font-bold block text-sm">{f.title}</span>
                <span className="text-muted-foreground block font-medium">Target: {f.feeClass?.name || 'Class 10'}-{f.feeClass?.section || 'A'}</span>
                <div className="flex justify-between items-center pt-1 font-semibold text-primary">
                  <span>Amount: ₹{f.amount.toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground text-[10px]">Due: {new Date(f.dueDate).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
