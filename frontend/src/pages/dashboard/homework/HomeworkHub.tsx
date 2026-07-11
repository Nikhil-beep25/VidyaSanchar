import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import {
  ClipboardList,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  AlertCircle,
  Paperclip,
  Download,
  X,
  FileText,
  FileCheck
} from 'lucide-react';

export const HomeworkHub: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [homework, setHomework] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Submissions lists for teachers
  const [activeHomework, setActiveHomework] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Create Homework Form State
  const [createModal, setCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [attachment, setAttachment] = useState('');

  // Submit Homework Form State
  const [submitModal, setSubmitModal] = useState(false);
  const [submitHomeworkId, setSubmitHomeworkId] = useState('');
  const [submissionFile, setSubmissionFile] = useState('');
  const [uploading, setUploading] = useState(false);

  // Grade Form State
  const [gradeModal, setGradeModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<any>(null);
  const [marksObtained, setMarksObtained] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadHomework = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/homework');
      if (Array.isArray(data)) {
        setHomework(data);
      }
    } catch (err) {
      toast.error('Failed to load homework log.');
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    if (user?.role === 'TEACHER') {
      try {
        const cls = await apiRequest('/classes');
        const sub = await apiRequest('/subjects');
        if (Array.isArray(cls)) setClasses(cls);
        if (Array.isArray(sub)) setSubjects(sub);
      } catch (err) {
        console.error('Failed to load classes or subjects', err);
      }
    }
  };

  useEffect(() => {
    loadHomework();
    loadFilterOptions();
  }, []);

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !classId || !subjectId) {
      toast.error('Please enter all required fields.');
      return;
    }
    try {
      await apiRequest('/homework', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          dueDate,
          classId,
          subjectId,
          attachment: attachment || undefined
        })
      });
      toast.success('Homework created successfully.');
      setCreateModal(false);
      // Reset
      setTitle('');
      setDescription('');
      setDueDate('');
      setClassId('');
      setSubjectId('');
      setAttachment('');
      loadHomework();
    } catch (err) {
      toast.error('Failed to publish homework.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        const data = await apiRequest('/upload', {
          method: 'POST',
          body: JSON.stringify({
            base64Data: reader.result as string,
            fileName: file.name,
            mimeType: file.type
          })
        });
        if (data.fileUrl) {
          setSubmissionFile(data.fileUrl);
          toast.success('Submission file uploaded.');
        }
      } catch (err: any) {
        toast.error(err.message || 'File upload failed.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionFile) {
      toast.error('Please upload an attachment first.');
      return;
    }
    try {
      await apiRequest(`/homework/${submitHomeworkId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ filePath: submissionFile })
      });
      toast.success('Homework submitted successfully.');
      setSubmitModal(false);
      setSubmissionFile('');
      loadHomework();
    } catch (err) {
      toast.error('Failed to deliver submission.');
    }
  };

  const viewSubmissions = async (hw: any) => {
    setActiveHomework(hw);
    try {
      const data = await apiRequest(`/homework/${hw.id}/submissions`);
      if (Array.isArray(data)) {
        setSubmissions(data);
      }
    } catch (err) {
      toast.error('Failed to load student submissions.');
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marksObtained) {
      toast.error('Marks are required.');
      return;
    }
    try {
      await apiRequest(`/homework/submissions/${gradingSubmission.id}/grade`, {
        method: 'PATCH',
        body: JSON.stringify({
          marksObtained,
          feedback
        })
      });
      toast.success('Submission graded successfully.');
      setGradeModal(false);
      setGradingSubmission(null);
      setMarksObtained('');
      setFeedback('');
      // Reload submissions
      if (activeHomework) {
        viewSubmissions(activeHomework);
      }
    } catch (err) {
      toast.error('Failed to save score.');
    }
  };

  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';
  const isParent = user?.role === 'PARENT';

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" /> Homework Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage, submit, track, and grade homework assignments.
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setCreateModal(true)}
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Assign Homework
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Main assignments listing */}
          <div className={`space-y-4 ${isTeacher && activeHomework ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homework.map((hw) => {
                const isOverdue = new Date() > new Date(hw.dueDate);
                return (
                  <div
                    key={hw.id}
                    className="p-5 border rounded-2xl bg-card shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">
                          {hw.subject?.name || 'Classwork'}
                        </span>
                        <span className={`text-[10px] font-bold ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
                          Due: {new Date(hw.dueDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{hw.title}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{hw.description}</p>
                    </div>

                    <div className="border-t pt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>Class: {hw.homeworkClass?.name || 'All'}</span>
                      <div className="flex items-center gap-3">
                        {hw.attachment && (
                          <a
                            href={hw.attachment}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-primary hover:underline"
                          >
                            <Paperclip className="h-3 w-3 mr-1" /> File
                          </a>
                        )}
                        {isTeacher && (
                          <button
                            onClick={() => viewSubmissions(hw)}
                            className="inline-flex items-center text-primary hover:underline"
                          >
                            Submissions ({hw.submissions?.length || 0})
                          </button>
                        )}
                        {isStudent && (
                          <div className="flex items-center">
                            {hw.submissions?.length > 0 ? (
                              <span className="text-emerald-500 flex items-center gap-1">
                                <CheckCircle className="h-3.5 w-3.5" /> Submitted
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setSubmitHomeworkId(hw.id);
                                  setSubmitModal(true);
                                }}
                                className="text-primary hover:underline"
                              >
                                Submit Upload
                              </button>
                            )}
                          </div>
                        )}
                        {isParent && (
                          <div>
                            {hw.childSubmissions?.map((cs: any, idx: number) => (
                              <div key={idx} className="flex flex-col text-right">
                                <span className="text-slate-500">{cs.childName}:</span>
                                <span className={`text-[9px] font-extrabold ${cs.status === 'GRADED' ? 'text-emerald-500' : 'text-primary'}`}>
                                  {cs.status}
                                </span>
                              </div>
                            ))}
                            {(!hw.childSubmissions || hw.childSubmissions.length === 0) && (
                              <span className="text-rose-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Pending Child Action
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {homework.length === 0 && (
                <div className="md:col-span-2 text-center p-12 border rounded-2xl bg-card text-slate-400 text-xs">
                  No homework assignments posted.
                </div>
              )}
            </div>
          </div>

          {/* Submissions sidepanel for teachers */}
          {isTeacher && activeHomework && (
            <div className="border rounded-2xl bg-card shadow-sm p-5 space-y-4 h-fit sticky top-24">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Submissions Log</h3>
                <button onClick={() => setActiveHomework(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{activeHomework.title}</p>

              <div className="divide-y divide-border overflow-y-auto max-h-[300px]">
                {submissions.map((sub) => (
                  <div key={sub.id} className="py-3 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-300">{sub.student.user.name}</h4>
                        <span className="text-[9px] text-slate-400">
                          {new Date(sub.submissionDate).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        sub.status === 'GRADED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-bold">
                      {sub.filePath && (
                        <a
                          href={sub.filePath}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-primary hover:underline"
                        >
                          <Download className="h-3 w-3 mr-1" /> File Attachment
                        </a>
                      )}
                      {sub.status !== 'GRADED' ? (
                        <button
                          onClick={() => {
                            setGradingSubmission(sub);
                            setGradeModal(true);
                          }}
                          className="px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/95 text-[9px]"
                        >
                          Grade Score
                        </button>
                      ) : (
                        <span className="text-slate-500">Score: {sub.marksObtained} Marks</span>
                      )}
                    </div>
                  </div>
                ))}
                {submissions.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">No student submissions yet.</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Teacher create Homework Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-muted/20">
              <h3 className="font-bold text-sm text-foreground">Distribute New Homework Assignment</h3>
              <button onClick={() => setCreateModal(false)} className="p-1 rounded-lg hover:bg-accent text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateHomework} className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. Algebra Exercise 4.2"
                  className="w-full px-3 h-10 border rounded-lg bg-transparent text-sm focus-visible:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Description / Directions</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write assignment instructions..."
                  className="w-full p-3 border rounded-lg bg-transparent text-sm focus-visible:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Target Class</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                    className="w-full px-3 h-10 border rounded-lg bg-transparent text-sm"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}-{cls.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Subject Mapping</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    required
                    className="w-full px-3 h-10 border rounded-lg bg-transparent text-sm"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 h-10 border rounded-lg bg-transparent text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Attachment URL (Optional)</label>
                  <input
                    type="text"
                    value={attachment}
                    onChange={(e) => setAttachment(e.target.value)}
                    placeholder="https://example.com/homework.pdf"
                    className="w-full px-3 h-10 border rounded-lg bg-transparent text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  className="px-4 h-10 border rounded-xl hover:bg-accent text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Submit Homework Modal */}
      {submitModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-muted/20">
              <h3 className="font-bold text-sm text-foreground">Upload Homework Submission</h3>
              <button onClick={() => setSubmitModal(false)} className="p-1 rounded-lg hover:bg-accent text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitHomework} className="p-6 space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase block">Upload File (PDF/DOCX/Image)</label>
                <input
                  type="file"
                  required
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              {submissionFile && (
                <div className="p-2 border rounded bg-slate-50 text-[10px] text-slate-500 flex items-center gap-1">
                  <FileCheck className="h-4 w-4 text-emerald-500" /> File uploaded and ready: <strong className="truncate max-w-[150px]">{submissionFile}</strong>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSubmitModal(false)}
                  className="px-4 h-10 border rounded-xl hover:bg-accent text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !submissionFile}
                  className="px-4 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Submit Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher grade Modal */}
      {gradeModal && gradingSubmission && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-muted/20">
              <h3 className="font-bold text-sm text-foreground">Grade Submission</h3>
              <button onClick={() => setGradeModal(false)} className="p-1 rounded-lg hover:bg-accent text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleGradeSubmission} className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Student Name</label>
                <input
                  type="text"
                  disabled
                  value={gradingSubmission.student.user.name}
                  className="w-full px-3 h-10 border rounded-lg bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Score Obtained (Marks)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={marksObtained}
                  onChange={(e) => setMarksObtained(e.target.value)}
                  placeholder="E.g. 18.5"
                  className="w-full px-3 h-10 border rounded-lg bg-transparent text-sm focus-visible:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Remarks & Feedback</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Excellent work, keep it up..."
                  className="w-full p-3 border rounded-lg bg-transparent text-sm focus-visible:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setGradeModal(false)}
                  className="px-4 h-10 border rounded-xl hover:bg-accent text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default HomeworkHub;
