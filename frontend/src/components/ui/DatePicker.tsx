import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Search, RotateCcw, Sparkles } from 'lucide-react';

export interface DatePickerProps {
  value?: string; // Internal format: ISO string YYYY-MM-DD or empty
  onChange?: (dateIso: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  minYear?: number;
  maxDate?: Date;
  minDate?: Date;
  initialMode?: 'year' | 'month' | 'date';
  isDobMode?: boolean;
  className?: string;
  inputClassName?: string;
  id?: string;
  name?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Utility functions
const toIsoString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDisplayDate = (isoStr?: string): string => {
  if (!isoStr) return '';
  const parts = isoStr.split('-');
  if (parts.length !== 3) return isoStr;
  const [y, m, d] = parts;
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
};

const parseIsoStr = (isoStr?: string): Date | null => {
  if (!isoStr) return null;
  const parts = isoStr.split('-');
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  const dt = new Date(y, m, d);
  return isNaN(dt.getTime()) ? null : dt;
};

const parseDisplayStr = (dispStr: string): Date | null => {
  if (!dispStr) return null;
  const clean = dispStr.trim();
  // Support DD/MM/YYYY or DD-MM-YYYY
  let match = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match) {
    const d = parseInt(match[1], 10);
    const m = parseInt(match[2], 10) - 1;
    const y = parseInt(match[3], 10);
    if (m >= 0 && m < 12 && d >= 1 && d <= 31) {
      const dt = new Date(y, m, d);
      if (!isNaN(dt.getTime()) && dt.getDate() === d && dt.getMonth() === m) {
        return dt;
      }
    }
  }
  // Support YYYY-MM-DD
  match = clean.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (match) {
    const y = parseInt(match[1], 10);
    const m = parseInt(match[2], 10) - 1;
    const d = parseInt(match[3], 10);
    if (m >= 0 && m < 12 && d >= 1 && d <= 31) {
      const dt = new Date(y, m, d);
      if (!isNaN(dt.getTime()) && dt.getDate() === d && dt.getMonth() === m) {
        return dt;
      }
    }
  }
  return null;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value = '',
  onChange,
  label,
  placeholder = 'DD/MM/YYYY',
  error,
  helperText,
  disabled = false,
  required = false,
  minYear = 1950,
  maxDate = new Date(),
  minDate,
  initialMode,
  isDobMode = false,
  className = '',
  inputClassName = '',
  id,
  name,
}) => {
  const defaultMode: 'year' | 'month' | 'date' = initialMode || (isDobMode ? 'year' : 'date');
  const currentToday = new Date();

  // Resolved parsed date
  const parsedValueDate = useMemo(() => parseIsoStr(value), [value]);

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'year' | 'month' | 'date'>(defaultMode);
  
  // Display string inside text input
  const [inputText, setInputText] = useState(formatDisplayDate(value));

  // Calendar View month & year
  const [viewYear, setViewYear] = useState<number>(() => {
    if (parsedValueDate) return parsedValueDate.getFullYear();
    if (isDobMode) return 2000; // Sensible default for birth dates
    return currentToday.getFullYear();
  });

  const [viewMonth, setViewMonth] = useState<number>(() => {
    if (parsedValueDate) return parsedValueDate.getMonth();
    return currentToday.getMonth();
  });

  // Year search query inside Year Mode
  const [yearSearch, setYearSearch] = useState('');

  // Container refs for focus and click outside
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  // Sync internal input text when value prop changes externally
  useEffect(() => {
    setInputText(formatDisplayDate(value));
    if (parsedValueDate) {
      setViewYear(parsedValueDate.getFullYear());
      setViewMonth(parsedValueDate.getMonth());
    }
  }, [value, parsedValueDate]);

  // Scroll active year into view when entering year mode
  useEffect(() => {
    if (isOpen && mode === 'year') {
      setTimeout(() => {
        if (selectedYearRef.current) {
          selectedYearRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }, 50);
    }
  }, [isOpen, mode]);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle opening picker
  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
    const targetMode = initialMode || (isDobMode ? 'year' : 'date');
    setMode(targetMode);
    
    if (parsedValueDate) {
      setViewYear(parsedValueDate.getFullYear());
      setViewMonth(parsedValueDate.getMonth());
    } else if (isDobMode) {
      setViewYear(2000);
      setViewMonth(0);
    }
  };

  // Handle user manual input in input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);

    if (!text.trim()) {
      onChange?.('');
      return;
    }

    const dt = parseDisplayStr(text);
    if (dt) {
      const iso = toIsoString(dt);
      const isTooFuture = maxDate && dt.getTime() > new Date(maxDate.setHours(23, 59, 59, 999)).getTime();
      const isTooOld = dt.getFullYear() < minYear;
      const isTooEarly = minDate && dt.getTime() < new Date(minDate.setHours(0, 0, 0, 0)).getTime();

      if (!isTooFuture && !isTooOld && !isTooEarly) {
        onChange?.(iso);
        setViewYear(dt.getFullYear());
        setViewMonth(dt.getMonth());
      }
    }
  };

  // Select Date
  const handleSelectDate = (date: Date) => {
    if (isDateDisabled(date)) return;
    const iso = toIsoString(date);
    onChange?.(iso);
    setInputText(formatDisplayDate(iso));
    setIsOpen(false);
  };

  // Clear date
  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange?.('');
    setInputText('');
  };

  // Quick Action: Today
  const handleSelectToday = () => {
    const today = new Date();
    if (!isDateDisabled(today)) {
      handleSelectDate(today);
    }
  };

  // Quick Action: Jump Current Month
  const handleJumpCurrentMonth = () => {
    setViewYear(currentToday.getFullYear());
    setViewMonth(currentToday.getMonth());
    setMode('date');
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Date disabled checker
  const isDateDisabled = (dt: Date): boolean => {
    if (dt.getFullYear() < minYear) return true;
    if (maxDate) {
      const endOfMaxDate = new Date(maxDate);
      endOfMaxDate.setHours(23, 59, 59, 999);
      if (dt.getTime() > endOfMaxDate.getTime()) return true;
    }
    if (minDate) {
      const startOfMinDate = new Date(minDate);
      startOfMinDate.setHours(0, 0, 0, 0);
      if (dt.getTime() < startOfMinDate.getTime()) return true;
    }
    return false;
  };

  // Generate Year Array
  const maxYearAllowed = maxDate ? maxDate.getFullYear() : currentToday.getFullYear();
  const yearsList = useMemo(() => {
    const years: number[] = [];
    for (let y = maxYearAllowed; y >= minYear; y--) {
      years.push(y);
    }
    return years;
  }, [minYear, maxYearAllowed]);

  // Filtered Years
  const filteredYears = useMemo(() => {
    if (!yearSearch.trim()) return yearsList;
    return yearsList.filter((y) => y.toString().includes(yearSearch.trim()));
  }, [yearsList, yearSearch]);

  // Calendar Days Grid Construction
  const daysInViewMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonthDays = useMemo(() => {
    const days = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(viewYear, viewMonth - 1, daysInPrevMonth - i));
    }
    return days;
  }, [viewYear, viewMonth, firstDayOfWeek, daysInPrevMonth]);

  const currentMonthDays = useMemo(() => {
    const days = [];
    for (let d = 1; d <= daysInViewMonth; d++) {
      days.push(new Date(viewYear, viewMonth, d));
    }
    return days;
  }, [viewYear, viewMonth, daysInViewMonth]);

  const totalGridCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalGridCells % 7 === 0 ? 0 : 7 - (totalGridCells % 7);
  const nextMonthDays = useMemo(() => {
    const days = [];
    for (let d = 1; d <= nextMonthDaysCount; d++) {
      days.push(new Date(viewYear, viewMonth + 1, d));
    }
    return days;
  }, [viewYear, viewMonth, nextMonthDaysCount]);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {label}
        </label>
      )}

      {/* Input Group */}
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onClick={handleOpen}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full h-10 pl-10 pr-10 rounded-xl border bg-background text-sm text-foreground placeholder-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            error ? 'border-destructive focus:ring-destructive' : 'border-border hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-muted' : 'cursor-pointer'} ${inputClassName}`}
        />

        {/* Left Calendar Icon */}
        <button
          type="button"
          onClick={handleOpen}
          disabled={disabled}
          className="absolute left-3 text-muted-foreground hover:text-primary transition-colors"
          tabIndex={-1}
        >
          <CalendarIcon className="w-4 h-4 text-primary" />
        </button>

        {/* Right Clear Icon / Status Indicator */}
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Clear date"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <span className="absolute right-3 text-xs text-muted-foreground pointer-events-none">
            {isDobMode ? 'DOB' : ''}
          </span>
        )}
      </div>

      {/* Error & Helper Messages */}
      {error && <p className="mt-1 text-xs text-destructive font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>}

      {/* Calendar Modal / Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] sm:hidden"
            />

            {/* Calendar Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed sm:absolute left-0 right-0 sm:left-0 sm:right-auto bottom-0 sm:bottom-auto sm:top-full mt-2 z-[100] w-full sm:w-[330px] bg-popover text-popover-foreground border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden ring-1 ring-border/50"
              style={{ maxHeight: '85vh' }}
            >
              {/* Mobile Drag Handle */}
              <div className="w-full py-2 flex justify-center items-center sm:hidden bg-muted/40 border-b border-border">
                <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* Top Mode Header / Tabs */}
              <div className="p-3 bg-muted/40 border-b border-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isDobMode ? 'Birth Date' : 'Select Date'}
                  </span>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex items-center bg-background p-1 rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setMode('year')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      mode === 'year'
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Year
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('month')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      mode === 'month'
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('date')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      mode === 'date'
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Date
                  </button>
                </div>
              </div>

              {/* Dynamic View Body */}
              <div className="p-3">
                {/* STAGE 1: YEAR SELECTION MODE */}
                {mode === 'year' && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={yearSearch}
                        onChange={(e) => setYearSearch(e.target.value)}
                        placeholder="Search year..."
                        className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {yearSearch && (
                        <button
                          type="button"
                          onClick={() => setYearSearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                      {filteredYears.map((yr) => {
                        const isSelected = viewYear === yr;
                        const isCurrentYr = currentToday.getFullYear() === yr;

                        return (
                          <button
                            key={yr}
                            type="button"
                            ref={isSelected ? selectedYearRef : null}
                            onClick={() => {
                              setViewYear(yr);
                              setMode('month');
                            }}
                            className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                              isSelected
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105 font-bold'
                                : 'bg-muted/50 text-foreground hover:bg-primary/10 hover:text-primary border border-border/60'
                            } ${isCurrentYr && !isSelected ? 'border-primary/50 text-primary' : ''}`}
                          >
                            {yr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STAGE 2: MONTH SELECTION MODE */}
                {mode === 'month' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1 pb-1">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Select Month for <span className="text-primary font-bold">{viewYear}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setMode('year')}
                        className="text-xs text-primary hover:underline font-semibold"
                      >
                        Change Year
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {SHORT_MONTH_NAMES.map((mn, idx) => {
                        const isSelected = viewMonth === idx;
                        const isCurrentMo = currentToday.getMonth() === idx && currentToday.getFullYear() === viewYear;
                        const monthDate = new Date(viewYear, idx, 1);
                        const isMonthDisabled = maxDate && monthDate.getTime() > new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0).getTime();

                        return (
                          <button
                            key={mn}
                            type="button"
                            disabled={!!isMonthDisabled}
                            onClick={() => {
                              setViewMonth(idx);
                              setMode('date');
                            }}
                            className={`py-3 rounded-lg text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-bold'
                                : isMonthDisabled
                                ? 'bg-muted/30 text-muted-foreground/40 opacity-40 cursor-not-allowed border border-transparent'
                                : 'bg-muted/50 text-foreground hover:bg-primary/10 hover:text-primary border border-border/60'
                            } ${isCurrentMo && !isSelected ? 'border-primary/50 text-primary' : ''}`}
                          >
                            {mn}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STAGE 3: DATE SELECTION MODE */}
                {mode === 'date' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-muted/40 p-1.5 rounded-xl border border-border">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Previous month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setMode('month')}
                          className="px-2 py-1 rounded-lg text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {MONTH_NAMES[viewMonth]}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMode('year')}
                          className="px-2 py-1 rounded-lg text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                        >
                          {viewYear}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Next month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 text-center">
                      {WEEKDAY_NAMES.map((wd) => (
                        <span key={wd} className="text-[11px] font-bold text-muted-foreground py-1">
                          {wd}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {prevMonthDays.map((dt, idx) => (
                        <span
                          key={`prev-${idx}`}
                          className="h-8 flex items-center justify-center text-xs text-muted-foreground/30 select-none"
                        >
                          {dt.getDate()}
                        </span>
                      ))}

                      {currentMonthDays.map((dt) => {
                        const iso = toIsoString(dt);
                        const isSelected = value === iso;
                        const disabledDay = isDateDisabled(dt);
                        const isToday = toIsoString(currentToday) === iso;

                        return (
                          <button
                            key={iso}
                            type="button"
                            disabled={disabledDay}
                            onClick={() => handleSelectDate(dt)}
                            className={`h-8 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-center ${
                              isSelected
                                ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 scale-105'
                                : disabledDay
                                ? 'text-muted-foreground/30 opacity-30 cursor-not-allowed line-through'
                                : 'text-foreground hover:bg-primary/10 hover:text-primary'
                            } ${isToday && !isSelected ? 'border border-primary text-primary font-bold' : ''}`}
                          >
                            {dt.getDate()}
                          </button>
                        );
                      })}

                      {nextMonthDays.map((dt, idx) => (
                        <span
                          key={`next-${idx}`}
                          className="h-8 flex items-center justify-center text-xs text-muted-foreground/30 select-none"
                        >
                          {dt.getDate()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Quick Actions */}
              <div className="p-3 bg-muted/30 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSelectToday}
                    className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors font-semibold"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={handleJumpCurrentMonth}
                    className="px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Current Month
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMode('year')}
                    className="px-2 py-1 rounded-lg text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Birth Year
                  </button>
                  {value && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-2.5 py-1 rounded-lg text-destructive hover:bg-destructive/10 transition-colors font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
