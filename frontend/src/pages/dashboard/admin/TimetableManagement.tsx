import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { Clock, Plus, Trash2 } from 'lucide-react';

export const TimetableManagement: React.FC = () => {
  const [timetableSlots, setTimetableSlots] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  // Form states
  const [dayOfWeek, setDayOfWeek] = useState('MONDAY');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('09:45');
  const [roomNumber, setRoomNumber] = useState('Room 101');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');

  const loadData = async () => {
    try {
      const cls = await apiRequest('/classes');
      setClasses(cls);
      if (cls.length > 0 && !selectedClassId) {
        setSelectedClassId(cls[0].id);
      }

      const tchr = await apiRequest('/teachers');
      setTeachers(tchr);

      const subj = await apiRequest('/subjects');
      setSubjects(subj);

      if (selectedClassId) {
        const slots = await apiRequest(`/timetables/class/${selectedClassId}`);
        setTimetableSlots(slots);
      }
    } catch (err) {
      // Mock fallbacks
      const mockClasses = [
        { id: 'c1', name: 'Class 10', section: 'A' },
        { id: 'c2', name: 'Class 11', section: 'B' }
      ];
      setClasses(mockClasses);
      if (!selectedClassId) setSelectedClassId('c1');

      setTeachers([
        { id: 't1', user: { name: 'Ramesh Verma' } },
        { id: 't2', user: { name: 'Priya Nair' } }
      ]);
      setSubjects([
        { id: 's1', name: 'Mathematics', code: 'MATH101' },
        { id: 's2', name: 'English', code: 'ENG101' }
      ]);

      setTimetableSlots([
        { id: 'sl1', dayOfWeek: 'MONDAY', startTime: '08:30', endTime: '09:15', roomNumber: 'Room 101', subject: { name: 'Mathematics' }, teacher: { user: { name: 'Ramesh Verma' } } },
        { id: 'sl2', dayOfWeek: 'MONDAY', startTime: '09:15', endTime: '10:00', roomNumber: 'Room 101', subject: { name: 'English' }, teacher: { user: { name: 'Priya Nair' } } }
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedClassId]);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !subjectId || !teacherId) {
      alert('Please fill out all assignments.');
      return;
    }

    try {
      await apiRequest('/timetables', {
        method: 'POST',
        body: JSON.stringify({
          dayOfWeek,
          startTime,
          endTime,
          roomNumber,
          classId,
          subjectId,
          teacherId
        })
      });
      alert('Slot added successfully.');
      loadData();
    } catch (err) {
      alert('Failed to add slot.');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!window.confirm('Delete this timetable slot?')) return;
    try {
      await apiRequest(`/timetables/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert('Failed to delete slot.');
    }
  };

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Class Schedules & Timetables</h1>
        <p className="text-sm text-muted-foreground">Add and view periods slots configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scheduler Form */}
        <div className="border rounded-xl p-6 bg-card space-y-4 h-fit">
          <h3 className="font-bold text-lg flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Schedule New Slot</span>
          </h3>

          <form onSubmit={handleAddSlot} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Target Class *</label>
              <select required value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Day *</label>
                <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Classroom Room</label>
                <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="e.g. Room 101" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Start Time *</label>
                <input type="text" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="e.g. 09:00" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">End Time *</label>
                <input type="text" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm" placeholder="e.g. 09:45" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Subject Assignment *</label>
              <select required value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Assign Teacher *</label>
              <select required value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="w-full h-10 px-3 border rounded-md bg-background text-sm">
                <option value="">Select Teacher</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.user.name}</option>)}
              </select>
            </div>

            <button type="submit" className="w-full h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
              <Plus className="h-4 w-4 mr-2" /> Add Schedule Slot
            </button>
          </form>
        </div>

        {/* Weekly Timetable Sheet */}
        <div className="border rounded-xl p-6 bg-card space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-bold text-lg">Visual Timetable Grid</h3>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="h-10 px-3 border rounded-md bg-background text-sm w-44"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            {days.map(day => {
              const daySlots = timetableSlots.filter(s => s.dayOfWeek === day);

              return (
                <div key={day} className="text-left space-y-2 border-b pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-primary">{day}</h4>
                  
                  {daySlots.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No periods scheduled.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {daySlots.map(slot => (
                        <div key={slot.id} className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold block text-sm text-foreground">{slot.subject.name}</span>
                            <span className="text-muted-foreground block font-medium">Time: {slot.startTime} - {slot.endTime}</span>
                            <span className="text-muted-foreground block font-medium">Faculty: {slot.teacher.user.name} | Room: {slot.roomNumber}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="p-1 hover:bg-destructive/15 text-destructive rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
