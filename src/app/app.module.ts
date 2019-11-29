import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionService } from './services/question.service';


function getNavigator() {
    return (window && window.navigator) ? window.navigator : null;
}

function getWindow() {
  return (window) ? window : null;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    QuestionService,
    { provide: 'NAVIGATOR', useFactory: getNavigator },
    { provide: 'WINDOW', useFactory: getWindow }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
