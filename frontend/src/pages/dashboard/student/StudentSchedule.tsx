import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../lib/api';
import { Clock } from 'lucide-react';

export const StudentSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const data = await apiRequest('/timetables/class/c1');
        setSchedule(data);
      } catch (err) {
        setSchedule([
          { id: 'sc1', dayOfWeek: 'MONDAY', startTime: '08:30', endTime: '09:15', roomNumber: 'Room 101', subject: { name: 'Mathematics', code: 'MATH101' }, teacher: { user: { name: 'Ramesh Verma' } } },
          { id: 'sc2', dayOfWeek: 'MONDAY', startTime: '09:15', endTime: '10:00', roomNumber: 'Room 101', subject: { name: 'Communicative English', code: 'ENG101' }, teacher: { user: { name: 'Priya Nair' } } }
        ]);
      }
    }
    loadSchedule();
  }, []);

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight">Class Timetable</h1>
        <p className="text-sm text-muted-foreground">Weekly lecture period schedule.</p>
      </div>

      <div className="border rounded-xl p-6 bg-card space-y-6">
        {days.map(day => {
          const daySlots = schedule.filter(s => s.dayOfWeek === day);

          return (
            <div key={day} className="text-left space-y-2 border-b pb-4 last:border-b-0 last:pb-0">
              <h4 className="font-bold text-xs uppercase tracking-wider text-primary">{day}</h4>
              
              {daySlots.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No classes scheduled.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {daySlots.map(slot => (
                    <div key={slot.id} className="p-3 border rounded-lg bg-muted/20 flex items-center space-x-3 text-xs">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold block text-sm text-foreground">{slot.subject.name}</span>
                        <span className="text-muted-foreground block font-medium">Time: {slot.startTime} - {slot.endTime}</span>
                        <span className="text-muted-foreground block font-medium">
                          Faculty: {slot.teacher.user.name} | Room: {slot.roomNumber}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
