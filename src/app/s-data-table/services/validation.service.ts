import { Injectable } from '@angular/core';
import { ValidationResult } from '../models/validation-result.model';
import { errorsMessages } from '../models/errors-messages.model';
import { PropertyConf } from '../s-data-table.module';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

    validateKeyForNewColumnConfig = (instanceOfClass: Record<string, any>, key: string,
      propertiesToIgnore: string[], inputPropertiesConf:PropertyConf[], 
      expandContentProperty: string): ValidationResult => {
        if (typeof instanceOfClass[key] != "function" 
          && !propertiesToIgnore.includes(key) 
          && inputPropertiesConf.find(p => p.propertyName == key) == undefined
          && key != expandContentProperty) 
          return new ValidationResult();
        else 
          return new ValidationResult(true);
    }

    validateUniquenessOfKeyProperty = (data: Record<string, any>[], keyProperty: string | undefined): ValidationResult => {
      const keys: Set<any> = new Set();
      if (keyProperty == undefined)
        return new ValidationResult();
      for (let i = 0; i < data.length; i++) 
        keys.add(data[i][keyProperty])
      if (keys.size != data.length)
        return new ValidationResult(true, errorsMessages.multipleElementsWithSameKey);
      else 
        return new ValidationResult();
    } 
  
    validateDataFromDynamicSource = (data: any[]):ValidationResult => {
      if (data.find(obj => typeof obj != "object") != undefined)
        return new ValidationResult(true, errorsMessages.dataFromSourceIsntObject);
  
      return new ValidationResult(false);
    }
}
