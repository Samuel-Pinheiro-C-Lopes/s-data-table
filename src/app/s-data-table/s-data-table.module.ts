import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SDataTableComponent } from './components/s-data-table/s-data-table.component';
import { FormsModule } from '@angular/forms';

export { PropertyConf } from './models/property-configuration.model';

@NgModule({
  declarations: [
    SDataTableComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [
    SDataTableComponent
  ]
})
export class SDataTableModule { }
