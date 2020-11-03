export class SearchModel {
    public limit: number;
    public offset: number;
    public orgId: any;
    public sortDirection: string;
    public sortField: string;
    public searchString: string;

    constructor(limit, offset, orgId, sortDirection, sortField) {
        this.limit = limit;
        this.offset = offset;
        this.orgId = orgId;
        this.sortDirection = sortDirection;
        this.sortField = sortField;
    }
}