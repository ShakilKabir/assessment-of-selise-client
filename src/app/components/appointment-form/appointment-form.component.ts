import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppointmentService } from 'src/app/services/appointment.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styles: [],
})
export class AppointmentFormComponent {
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() newAppointment = new EventEmitter<any>();
  @Input() selectedDateInfo: { start: string; end: string; allDay: boolean } = {
    start: '',
    end: '',
    allDay: false,
  };
  appointmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService
  ) {
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      age: [null, Validators.required],
      date: ['', Validators.required], 
      time: ['', Validators.required],
      allDay: [false],
    });
  }


  closeModal() {
    this.close.emit();
  }

  createAppointment() {
   if (this.appointmentForm.valid) {
    const formData = this.appointmentForm.value;
    
    const startTime = new Date(formData.date + 'T' + formData.time);

    const timezoneOffset = startTime.getTimezoneOffset() * 60000;
    const localStartTime = new Date(startTime.getTime() - timezoneOffset);
    const localEndTime = new Date(localStartTime.getTime() + 30 * 60000);

    const startISO = localStartTime.toISOString();
    const endISO = localEndTime.toISOString();

    const newAppointment = {
      name: formData.name,
      gender: formData.gender,
      age: formData.age,
      start: startISO,
      end: endISO,
      allDay: false,
      id: uuidv4()
    };
      this.appointmentService.createNewAppointment(newAppointment).subscribe(
        (res) => {
          console.log(res);
          this.newAppointment.emit(res);
          this.closeModal();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      console.log('The form is not valid');
    }
  }
}
