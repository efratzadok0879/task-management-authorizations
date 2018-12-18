import { User,DepartmentHours } from '../../imports';

export class Department {
    constructor(
        public departmentId: number,
        public departmentName: string,
        public workers?:User[],
        public departmentHours?:DepartmentHours[]
    ) { }
}