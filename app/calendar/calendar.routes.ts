import router from '@adonisjs/core/services/router';

const CalendarController = () => import('#app/calendar/calendar.controller');

router.group(() => {
    router.post('/create', [CalendarController, 'createCalendarEvent'])
    router.get('/fetch', [CalendarController, 'fetchCalendarEvents'])
    router.put('/update', [CalendarController, 'updateCalendarEvent'])
    router.delete('/delete', [CalendarController, 'deleteCalendarEvent'])
})
    .prefix('/calendar');