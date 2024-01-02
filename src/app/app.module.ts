import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LandingComponent } from './pages/landing/landing.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';



@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    CalendarComponent,
    AppointmentFormComponent,
    AppointmentDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
