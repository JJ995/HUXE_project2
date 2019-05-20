import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoggedInComponent } from './components/logged-in/logged-in.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NotFoundComponent, LoggedInComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [LoggedInComponent]
})
export class GeneralModule { }
