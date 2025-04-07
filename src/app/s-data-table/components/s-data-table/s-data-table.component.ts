import { Component, ContentChild, 
  EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ValidationResult } from '../../models/validation-result.model';
import { errorsMessages } from '../../models/errors-messages.model';
import { PropertyConf } from '../../models/property-configuration.model';
import {  DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 's-data-table',
  standalone: false,
  templateUrl: './s-data-table.component.html',
  styleUrl: './s-data-table.component.css'
})
export class SDataTableComponent implements OnInit, OnDestroy{
  // expanded
  @ContentChild('expandContent', { read: TemplateRef }) expandContent!: TemplateRef<any>;

  // source
  @Input() clazz: { new(...any:any): any } | null = null;
  @Input() data: Record<string, any>[] = [];
  @Input() dataSource: BehaviorSubject<any[]> | null = null;
  @Input() propertiesToIgnore: string[] = [];
  @Input() keyProperty: string | undefined = undefined;
  @Input() inputPropertiesConf: PropertyConf[] = [];
  @Input() defaultPropertyForCompositions: string = "";

  sub: Subscription | null = null;

  propertiesConf: PropertyConf[] = [];

  // pagination
  @Input() usePagination: boolean = false;
  @Input() pageMaxSize: number | undefined = undefined;
  @Output() nextPageEvent: EventEmitter<void> = new EventEmitter();
  @Output() previousPageEvent: EventEmitter<void> = new EventEmitter();

  labelActualPage: string = "";
  labelTotalPages: string = "";
  labelTotalElements: string = "";
  page: number = 1;

  // expand
  @Input() useExpand: boolean = false;
  @Input() expandContentProperty: string = "";

  lastExpandedKey: any = undefined;
  expandendContent: SafeHtml | undefined;

  // row clicked action
  @Input() useClick: boolean = false;
  @Output() rowClickedEvent: EventEmitter<any> = new EventEmitter();

  // Life Cycle

  constructor(private sanitizer: DomSanitizer, private validation: ValidationService) {
  }

  ngOnInit(): void {
    if (!this.clazz) {
      console.error(errorsMessages.noClass);
      return;
    }

    if (this.useClick && this.useExpand) {
      console.error(errorsMessages.useClickAndUseExpand);
      return;
    }

    if (this.useClick && !this.keyProperty) {
      console.error(errorsMessages.useClickButNoKeyProperty);
      return;
    }

    if (this.useExpand && !this.keyProperty) {
      console.error(errorsMessages.useExpandButNoKeyProperty);
    }

    this.propertiesConf.push(...this.preparePropertyConf(this.inputPropertiesConf, this.clazz), 
    ...this.preparePropertyConf(this.obtainColumnsFromClazz(this.clazz), this.clazz));

    if (this.dataSource)
      this.updateDataFromDynamicSource(this.dataSource);
  }

  ngOnDestroy(): void {
    if (this.sub)
      this.sub.unsubscribe();
  }

  // Source

  preparePropertyConf = (propertyConfs: PropertyConf[], clazz: { new(): any }): PropertyConf[] => {
    const instanceOfClass: Record<string, any> = new clazz();

    propertyConfs.forEach((p) => {
      if (!p.columnName)
        p.columnName = p.propertyName;

      if (!p.propertyForComposition)
        p.propertyForComposition = this.defaultPropertyForCompositions;

      if (typeof instanceOfClass[p.propertyName] != "object" || Array.isArray(instanceOfClass[p.propertyName])) 
        p.propertyType = "value";
      else 
        p.propertyType = "object"
      });

      return propertyConfs;
  }

  // Gets every property of the clazz that isn't a method
  obtainColumnsFromClazz = (clazz: { new(): any }): PropertyConf[] => {
    const instanceOfClass: Record<string, any> = new clazz();
    const propertiesConfFromInstance: PropertyConf[] = [];

    for (const key in instanceOfClass) 
      if (!this.validation.validateKeyForNewColumnConfig(instanceOfClass, key, 
        this.propertiesToIgnore, this.inputPropertiesConf, this.expandContentProperty).error) 
          propertiesConfFromInstance.push({
            propertyName: key});
  
    return propertiesConfFromInstance;
  } 

  updateDataFromDynamicSource = (dynamicData: BehaviorSubject<any[]>) => this.sub = dynamicData.subscribe({
    next: (dataToUpdate) =>  {
      const dynamicValidation: ValidationResult = this.validation.validateDataFromDynamicSource(dataToUpdate);
      if (dynamicValidation.error) {
        console.error(dynamicValidation.errorMessage);
        return;
      } 
      
      const uniqueKeyValidation: ValidationResult = this.validation.validateUniquenessOfKeyProperty(
        dataToUpdate, this.keyProperty);
      if (uniqueKeyValidation.error) {
        console.error(uniqueKeyValidation.errorMessage);
        return;
      }

      this.labelActualPage = "Página: " + this.page;
      this.labelTotalElements = "Registros na Página: " +  dataToUpdate.length;
      this.data = dataToUpdate;
      
    },
    error: (err) => console.error(err)
  });

  // Pagination

  previousPage = () => this.page != 1 ? (this.page--, this,this.previousPageEvent.emit()) : undefined;
  
  nextPage = () => this.data.length > 0 && 
    (this.pageMaxSize == undefined || this.data.length == this.pageMaxSize) ? 
    (this.page++, this,this.previousPageEvent.emit()) : undefined;

  // Row clicked / expansion

  rowClicked = (element: Record<string, any>) => {
    if (this.useExpand)
      this.expand(element);
    else if (this.useClick)
      this.target(element);
  } 

  target = (element: Record<string, any>) => {
    if (this.keyProperty)
      this.rowClickedEvent.emit(element[this.keyProperty]);
    else 
      console.log(errorsMessages.rowClickedWithoutKeyPropertyDefined);
  }

  expand = (element: Record<string, any>) => {
    let wasExpanded:HTMLElement | null = null;

    if (!this.keyProperty)
      return;
    
    const toBeExpanded:HTMLElement | null = document.querySelector(`[keyValue="${element[this.keyProperty]}"]`);
    this.expandendContent = this.sanitizer.bypassSecurityTrustHtml("");
    // const toBeExpanded:HTMLElement | null = this.renderer.selectRootElement(`[keyValue="${element[this.keyProperty]}"]`, false);
    if (this.lastExpandedKey)
      wasExpanded = document.querySelector(`[keyValue="${this.lastExpandedKey}"]`);
     //wasExpanded = this.renderer.selectRootElement(`[keyValue="${this.lastExpandedKey}"]`, false);
    
    if (!toBeExpanded) {
      console.error(`the key: ${element[this.keyProperty]} couldn't be found`);
      return;
    }

    if (wasExpanded) {
      wasExpanded.classList.add("minimized");
      wasExpanded.classList.remove("visible");
      setTimeout(() => {
        wasExpanded.classList.remove("minimized");
      }, 250);
      //this.renderer.addClass(wasExpanded, "minimized");
      //this.renderer.removeClass(wasExpanded, "visible");
      //setTimeout(() => this.renderer.removeClass(wasExpanded, "minimized"), 250);
    }

    toBeExpanded.classList.add("minimized");
    this.expandendContent = this.sanitizer.bypassSecurityTrustHtml(element[this.expandContentProperty]);
    if (wasExpanded != toBeExpanded) {
      this.lastExpandedKey = element[this.keyProperty];
      toBeExpanded.classList.add("minimized");
      setTimeout(() => {
        toBeExpanded.classList.add("visible");
      }, 10);
      //this.renderer.addClass(toBeExpanded, "minimized");
      //setTimeout(() => this.renderer.addClass(toBeExpanded, "visible"), 10);
    } else {
      this.lastExpandedKey = null;
    }
  }

}
