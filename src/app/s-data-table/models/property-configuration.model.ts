/*
export class PropertyConf {
    public columnName?: string;
    public propertyName: string;
    public propertyForComposition?: string;
    public propertyType?: string;

    constructor(propertyName: string, propertyForComposition: string | undefined = undefined,
         columnName: string | undefined = undefined) {
        this.propertyName = propertyName;
        this.propertyForComposition = propertyForComposition;
        this.columnName = columnName;
    }
}
*/

export interface PropertyConf {
    columnName?: string;
    propertyName: string;
    propertyForComposition?: string;
    propertyType?: string;
};