import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SymplTextComponent } from './sympl-text/sympl-text.component';
import {FormsModule} from '@angular/forms';
import {QuillModule} from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    SymplTextComponent
  ],
  imports: [
    BrowserModule, FormsModule, QuillModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
