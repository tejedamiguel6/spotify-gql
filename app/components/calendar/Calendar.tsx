'use client'
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  getDay,
  isToday,
} from 'date-fns'
import clsx from 'clsx'

export default function Calendar() {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const currentDate = new Date()
  const firstDayOfMonth = startOfMonth(currentDate)
  const lastDayOfMonth = endOfMonth(currentDate)

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  })

  const startingDayIndex = getDay(firstDayOfMonth)

  return (
    <div className='self-center hidden w-auto pb-5 mx-auto mt-[20.5rem] border border-red-300 rounded-md sm:grid'>
      <div className='pt-4 mb-4'>
        <h2 className='text-center'>{format(currentDate, 'MMMM yyyy')}</h2>
      </div>
      <div className='grid gap-2 p-4 border-2 sm:grid-cols-2 md:grid-cols-7 sm:grid'>
        {weekdays.map((day, index) => {
          return (
            <div key={index} className='text-center '>
              {day}
            </div>
          )
        })}
        {Array.from({ length: startingDayIndex }).map((_, index) => {
          return (
            <div
              key={`empty-${index}`}
              className='p-2 text-center border rounded-md '
            />
          )
        })}
        {daysInMonth.map((day, index) => {
          return (
            <div
              key={index}
              className={clsx(
                'text-center border text-zinc-950 border-teal-300 rounded-md p-8 bg-teal-300 opacity-70',
                {
                  'bg-yellow-900': isToday(day),
                  'text-yellow-100': isToday(day),
                }
              )}
            >
              {format(day, 'd')}
            </div>
          )
        })}
      </div>
    </div>
  )
}
