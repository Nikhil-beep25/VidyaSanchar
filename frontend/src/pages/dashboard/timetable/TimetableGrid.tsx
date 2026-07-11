import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Clock, Calendar, MapPin, User, BookOpen } from 'lucide-react';

export const TimetableGrid: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [timetableSlots, setTimetableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChildName, setSelectedChildName] = useState<string>('ALL');

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/timetables/my');
      if (Array.isArray(data)) {
        setTimetableSlots(data);
      }
    } catch (err) {
      toast.error('Failed to load timetable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  // Identify linked kids for parent filters
  const uniqueChildren = Array.from(new Set(timetableSlots.map(s => s.childName).filter(Boolean)));

  const filteredSlots = timetableSlots.filter(s => {
    if (user?.role !== 'PARENT' || selectedChildName === 'ALL') return true;
    return s.childName === selectedChildName;
  });

  const slotsByDay = (day: string) => {
    return filteredSlots
      .filter(s => s.dayOfWeek.toUpperCase() === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" /> Weekly Timetable
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Weekly periods mapped by timing schedule, subject, and instructor.
          </p>
        </div>

        {/* Parent-specific child selector */}
        {user?.role === 'PARENT' && uniqueChildren.length > 1 && (
          <div className="flex items-center space-x-2 bg-card border p-2 rounded-xl shadow-sm self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Child Schedule:</span>
            <select
              value={selectedChildName}
              onChange={(e) => setSelectedChildName(e.target.value)}
              className="h-8 px-2 pr-6 rounded bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 border-0 focus:ring-0 cursor-pointer"
            >
              <option value="ALL">All Children Combined</option>
              {uniqueChildren.map((name: any) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {days.map((day) => {
            const slots = slotsByDay(day);

            return (
              <div key={day} className="border rounded-2xl bg-card shadow-sm overflow-hidden flex flex-col md:flex-row">
                {/* Left Day Indicator Column */}
                <div className="md:w-40 bg-slate-50 dark:bg-slate-800/40 p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
                  <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 tracking-wider uppercase flex items-center gap-2 md:flex-col">
                    <Calendar className="h-4.5 w-4.5 text-primary" />
                    {day.toLowerCase()}
                  </span>
                </div>

                {/* Slots Column */}
                <div className="flex-grow p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-4 border rounded-xl bg-slate-50/50 dark:bg-slate-800/20 text-left space-y-2 hover:border-primary/30 transition-colors relative"
                      >
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {slot.startTime} - {slot.endTime}
                          </span>
                          {slot.childName && (
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px]">
                              {slot.childName}
                            </span>
                          )}
                        </div>

                        <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-primary/75" />
                          {slot.subject?.name || 'Class Period'}
                        </h4>

                        <div className="pt-1 flex flex-col gap-1 text-[10px] text-slate-500">
                          {slot.teacher?.user?.name && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {slot.teacher.user.name}
                            </span>
                          )}
                          {slot.roomNumber && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              Room: {slot.roomNumber}
                            </span>
                          )}
                          {slot.timetableClass?.name && (
                            <span className="text-slate-400 font-bold block pt-0.5">
                              Class: {slot.timetableClass.name}-{slot.timetableClass.section}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {slots.length === 0 && (
                      <div className="sm:col-span-2 lg:col-span-3 py-6 text-slate-400 text-xs font-semibold text-center">
                        No scheduled classes.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default TimetableGrid;
