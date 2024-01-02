import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from '../types/appointment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  readonly baseURL =
    'https://assessment-of-selise-server-production.up.railway.app/api/appointments';

  constructor(private http: HttpClient) {}

  createNewAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseURL, appointment);
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseURL);
  }

  findAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseURL}/${id}`);
  }

  deleteAppointmentById(id: string): Observable<Appointment> {
    return this.http.delete<Appointment>(`${this.baseURL}/${id}`);
  }
}
