import { Component, signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Appointment } from 'src/app/types/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styles: [`
  h2 {
      margin: 0;
      font-size: 16px;
    }
    
  ul {
      margin: 0;
      padding: 0 0 0 1.5em;
    }
    
    li {
      margin: 1.5em 0;
      padding: 0;
    }
    
    b { /* used for event dates/times */
      margin-right: 3px;
    }
    
    .demo-app {
      display: flex;
      min-height: 100%;
      font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
      font-size: 14px;
    }
    
    .demo-app-sidebar {
      width: 300px;
      line-height: 1.5;
      background: whitesmoke;
      border-right: 1px solid #d3e2e8;
    }
    
    .demo-app-sidebar-section {
      padding: 2em;
    }
    
    .demo-app-main {
      flex-grow: 1;
      padding: 3em;
    }
    
    .fc { /* the calendar root */
      max-width: 1000px;
      margin: 0 auto;
    }
    `]
})
export class CalendarComponent {
  selectedDateInfo: { start: string; end: string; allDay: boolean } = {
    start: '',
    end: '',
    allDay: false,
  };
  calendarApi: any;
  showModal: boolean = false;
  showDetailsModal: boolean = false;
  selectedAppointmentId: string = '';
  selectedAppointment: any;
  calendarVisible = signal(true);
  monthList: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  monthListInWords: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  yearRange: number[] = [2019, 2020, 2021, 2022, 2023, 2024];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  @ViewChild('fullCalendar') fullCalendar!: FullCalendarComponent;
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: '',
      right: '',
    },
    initialView: 'dayGridMonth',
    initialEvents: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.onDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(
    private changeDetector: ChangeDetectorRef,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.addAllAppointments();
    // this.updateCalendarView();
  }

  ngAfterViewInit() {
    this.updateCalendarView();
  }

  // onViewChange(event: Event) {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const view = selectElement.value;
  //   const calendarApi = this.fullCalendar.getApi();
  //   calendarApi.changeView(view);
  // }

  updateCalendarView() {
    const calendarApi = this.fullCalendar.getApi();
    if (calendarApi) {
      const date = new Date(this.selectedYear, this.selectedMonth);
      calendarApi.gotoDate(date);
    }
  }

  onMonthChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMonth = parseInt(selectElement.value, 10);
    this.updateCalendarView();
  }

  onYearChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedYear = parseInt(selectElement.value, 10);
    this.updateCalendarView();
  }

  toggleShowModal() {
    this.showModal = !this.showModal;
  }

  toggleShowDetails() {
    this.showDetailsModal = !this.showDetailsModal;
  }

  deleteAppointment() {
    this.selectedAppointment.remove();
    this.selectedAppointmentId = '';
  }

  openNewAppointmentModal() {
    this.selectedDateInfo = {
      start: '',
      end: '',
      allDay: false,
    };
    this.toggleShowModal();
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.mutate((options) => {
      options.weekends = !options.weekends;
    });
  }

  onDateSelect(selectInfo: DateSelectArg) {
    this.calendarApi = selectInfo.view.calendar;
    this.selectedDateInfo = {
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    };
    // this.toggleShowModal();
  }

  addNewAppointment(appointment: Appointment) {
    const calendarApi = this.fullCalendar.getApi();
    calendarApi.addEvent({
      title: appointment.name,
      start: appointment.start,
      end: appointment.end,
      allDay: appointment.allDay,
      id: appointment.id,
    });
  }

  addAllAppointments() {
    this.appointmentService.getAllAppointments().subscribe(
      (appointments: Appointment[]) => {
        const events = appointments.map((appointment) => {
          return {
            title: appointment.name,
            start: appointment.start,
            end: appointment.end,
            allDay: appointment.allDay,
            id: appointment.id,
          };
        });
        console.log(events);

        this.calendarOptions.update((options) => {
          return {
            ...options,
            events: events,
          };
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event);
    console.log(clickInfo.event.id);
    this.selectedAppointment = clickInfo.event;
    this.selectedAppointmentId = clickInfo.event.id;
    this.toggleShowDetails();
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}
