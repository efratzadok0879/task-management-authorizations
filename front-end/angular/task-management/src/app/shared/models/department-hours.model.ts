import { Project,Department } from '../../imports';

export class DepartmentHours {
    constructor(
        public departmentHoursId: number,
        public projectId: number,
        public departmentId: number,
        public numHours: number,
        public project?:Project,
        public department?:Department
    ) { }
}
