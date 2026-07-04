import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { BookOpen, Plus, FileText, CheckCircle } from 'lucide-react';

export const LibraryManagement: React.FC = () => {
  const toast = useToast();
  const [books, setBooks] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Add Book Form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('Rack A, Shelf 2');

  // Issue Book Form
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const loadData = async () => {
    try {
      const bks = await apiRequest('/library/books');
      setBooks(bks);

      const is = await apiRequest('/library/issues');
      setIssues(is);

      const std = await apiRequest('/students');
      setStudents(std);
    } catch (err) {
      // Mock fallbacks
      setBooks([
        { id: 'b1', title: 'Concepts of Physics - Vol 1', author: 'H.C. Verma', isbn: '978-8177091878', quantity: 5, availableQuantity: 4, location: 'Rack A, Shelf 2' }
      ]);
      setIssues([
        { id: 'is1', book: { title: 'Concepts of Physics - Vol 1' }, student: { user: { name: 'Rahul Gupta' } }, dueDate: '2026-07-20T00:00:00.000Z', status: 'ISSUED', fineAmount: 0.0 }
      ]);
      setStudents([
        { id: 'st1', user: { name: 'Rahul Gupta' } }
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !isbn || !quantity) {
      toast.warning('Required book fields are missing.');
      return;
    }

    try {
      await apiRequest('/library/books', {
        method: 'POST',
        body: JSON.stringify({ title, author, isbn, quantity, location })
      });
      toast.success('Book catalog added successfully.');
      setTitle('');
      setAuthor('');
      setIsbn('');
      setQuantity('');
      loadData();
    } catch (err) {
      toast.error('Failed to add book catalog.');
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedStudentId || !dueDate) {
      toast.warning('Select book, student, and due date.');
      return;
    }

    try {
      await apiRequest('/library/issues', {
        method: 'POST',
        body: JSON.stringify({ bookId: selectedBookId, studentId: selectedStudentId, dueDate })
      });
      toast.success('Book issued successfully.');
      loadData();
    } catch (err) {
      toast.error('Failed to issue book.');
    }
  };

  const handleReturnBook = async (issueId: string) => {
    if (!window.confirm('Mark this book as returned?')) return;
    try {
      const data = await apiRequest(`/library/issues/${issueId}/return`, {
        method: 'PUT'
      });
      toast.success(`Book returned! Fine calculated: ₹${data.fineAmount}`);
      loadData();
    } catch (err) {
      toast.error('Failed to process book return.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Library Catalog & Lendings</h1>
        <p className="text-sm text-muted-foreground">Manage library assets, book distributions, and fine payments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Catalog registration */}
        <div className="border rounded-xl p-6 bg-card space-y-4 h-fit">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <Plus className="h-5 w-5 text-primary" />
            <span>Add Book to Catalog</span>
          </h3>

          <form onSubmit={handleCreateBook} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Book Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="e.g. Concepts of Physics" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Author Name *</label>
              <input type="text" required value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="e.g. H.C. Verma" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">ISBN Code *</label>
                <input type="text" required value={isbn} onChange={(e) => setIsbn(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="ISBN-13" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Quantity *</label>
                <input type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="10" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Library Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="e.g. Rack A, Shelf 2" />
            </div>

            <button type="submit" className="w-full h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
              Register Book Catalog
            </button>
          </form>
        </div>

        {/* Issue Book Form */}
        <div className="border rounded-xl p-6 bg-card space-y-4 h-fit">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Issue Library Book</span>
          </h3>

          <form onSubmit={handleIssueBook} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Select Book *</label>
              <select required value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                <option value="">Select Book</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title} ({b.availableQuantity} left)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Select Student *</label>
              <select required value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.user?.name || s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Return Due Date *</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" />
            </div>

            <button type="submit" className="w-full h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
              Process Checkout
            </button>
          </form>
        </div>

        {/* Active Issues grid */}
        <div className="border rounded-xl p-6 bg-card space-y-4">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Active Checkout Records</span>
          </h3>

          <div className="space-y-3">
            {issues.map(item => (
              <div key={item.id} className="p-3 border rounded-lg bg-muted/20 text-left text-xs space-y-1 relative group">
                <span className="font-bold block text-sm">{item.book.title}</span>
                <span className="text-muted-foreground block font-medium">Lent to: {item.student.user?.name || 'Rahul Gupta'}</span>
                <span className="text-muted-foreground block font-medium">Due Date: {new Date(item.dueDate).toLocaleDateString('en-IN')}</span>
                
                {item.status === 'ISSUED' ? (
                  <button
                    onClick={() => handleReturnBook(item.id)}
                    className="absolute right-3 top-3 inline-flex items-center text-xs text-primary font-bold hover:underline"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Return Book
                  </button>
                ) : (
                  <span className="absolute right-3 top-3 text-[10px] uppercase font-bold border border-green-500/30 text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                    Returned
                  </span>
                )}
                
                {item.fineAmount > 0 && (
                  <span className="text-destructive font-bold block pt-1">
                    Pending Overdue Fine: ₹{item.fineAmount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
