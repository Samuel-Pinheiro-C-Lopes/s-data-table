export class errorsMessages {
    static noClass: string = "No class provided for the s-data-table component. Please provide a valid class";
    static dataFromSourceIsntObject: string = "Some data provided by the data source wasn't an object array. Please verify the integrity of the source provided.";
    static dataFromSourceIsntRecordStringAny: string ="Some data provided by the data source couldn't be handled as a Record<string, any> array. Please verify the integrity of the source provided";
    static rowClickedWithoutKeyPropertyDefined: string = "Tried to emit click event of table row without a specified key to emit from it. Please verify if a valid unique key was defined.";
    static multipleElementsWithSameKey: string = "There's more than one element with the same key value. The property key should be unique to assure expected behavior. Please check the key provided to the table.";
    static useClickButNoKeyProperty: string = "The 'UseClick' feature requires a key property to be provided. Please add a valid [keyProperty] to the table with the value of the property name that represents an unique key";
    static useExpandButNoKeyProperty: string = "The 'UseExpand' feature requires a key property to be provided. Please assure that a valid [KeyProperty] is being assigned with the property name of the unique field the class is meant to have";
    static  useClickAndUseExpand: string = "For now this table doesn't support both 'useClick' and 'useExpand' feature simultaneosly.";
}