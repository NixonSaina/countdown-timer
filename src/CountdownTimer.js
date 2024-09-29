// CountdownTimer.js
import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

const CountdownTimer = () => {
  const [targetDate, setTargetDate] = useState('');
  const [timeLeft, setTimeLeft] = useState({});
  
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { expired: true };
    }

    return timeLeft;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (targetDate) {
        setTimeLeft(calculateTimeLeft());
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [targetDate]);

  const handleDateChange = (event) => {
    setTargetDate(event.target.value);
  };

  const timerComponents = [];

  if (timeLeft.expired) {
    return <h1>Event has already occurred!</h1>;
  }

  Object.keys(timeLeft).forEach((interval) => {
    if (timeLeft[interval]) {
      timerComponents.push(
        <span key={interval}>
          {timeLeft[interval]} {interval}{" "}
        </span>
      );
    }
  });

  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Get first and last day of the current month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = [];
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      daysInMonth.push(day);
    }

    const startDay = firstDayOfMonth.getDay(); // Get weekday index (0-6)

    const calendarRows = [];
    let currentWeek = new Array(startDay).fill(null); // Fill initial empty slots

    // Highlight the selected target date in the calendar
    const eventDay = targetDate ? new Date(targetDate).getDate() : null;

    daysInMonth.forEach((day, index) => {
      if (currentWeek.length < 7) {
        currentWeek.push(day);
      }

      if (currentWeek.length === 7 || day === lastDayOfMonth.getDate()) {
        calendarRows.push(currentWeek);
        currentWeek = [];
      }
    });

    return (
      <div className="calendar">
        <div className="calendar-row header">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        {calendarRows.map((week, rowIndex) => (
          <div className="calendar-row" key={rowIndex}>
            {week.map((day, dayIndex) => (
              <div
                className={`calendar-cell ${
                  day === today.getDate() && !eventDay ? 'today' : ''} ${
                  day === eventDay ? 'event-day' : ''
                }`}
                key={dayIndex}
              >
                {day || ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2>Select an Event Date:</h2>
      <input type="date" value={targetDate} onChange={handleDateChange} />
      
      {timerComponents.length > 0 && (
        <div>
          <h3>Countdown:</h3>
          <div>{timerComponents}</div>
        </div>
      )}

      {targetDate && (
        <>
          <h3>Calendar Progress</h3>
          {renderCalendar()}
        </>
      )}
    </div>
  );
};

export default CountdownTimer;
