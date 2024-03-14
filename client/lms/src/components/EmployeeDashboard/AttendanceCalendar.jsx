import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const AttendanceCalendar = ({ events }) => {

  const holidays = [
    { date: '2024-02-04', type: 'National Holiday', note: 'Republic Day' },
  ];

  const eventRender = ({ event, el }) => {
    const isHoliday = holidays.some(holiday => holiday.date === event.startStr);

    if (isHoliday) {
      el.style.backgroundColor = 'red';
      el.style.color = 'white';
    }
  };

  return (
    <div className="flex-wrap calendar-container">
      {events ? (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          themeSystem='bootstrap'
          height={'795px'}
          events={events}
          eventRender={eventRender}
        />
      ) : (
        <h1> Loading </h1>
      )}
    </div>
  );
};

export default AttendanceCalendar;
