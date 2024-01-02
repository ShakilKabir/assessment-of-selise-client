import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/types/appointment';


@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styles: [
  ]
})
export class AppointmentDetailsComponent {
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() selectedAppointmentId: string = '';
  @Output() delete = new EventEmitter<void>();
  appointment: Appointment = {} as Appointment;

  constructor(private appointmentService:AppointmentService) { }

  ngOnChanges() {
    this.getAppointmentDetails();
  }

  getAppointmentDetails() {
    this.appointmentService.findAppointmentById(this.selectedAppointmentId).subscribe(
      (res) => {
        this.appointment = res;
        console.log(res)
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteAppointment() {
    this.appointmentService.deleteAppointmentById(this.selectedAppointmentId).subscribe(
      (res) => {
        console.log(res);
        this.delete.emit();
        this.closeModal();
      },
      (err) => {
        console.log(err);
      }
    );
    console.log('delete appointment');
  }



  closeModal() {
    this.close.emit();
  }

}
