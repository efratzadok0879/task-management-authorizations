import { User, Customer, DepartmentHours, WorkerHours, PresenceHours, Permission } from '../../imports';

export class Project {
    constructor(
        public projectId: number,
        public projectName: string,
        public managerId: number,
        public customerId: number,
        public teamLeaderId: number,
        public totalHours: number,
        public startDate: Date,
        public endDate: Date,
        public isComplete:boolean,
        public manager?: User,
        public customer?: Customer,
        public teamLeader?: User,
        public departmentsHours?: DepartmentHours[],
        public workersHours?: WorkerHours[],
        public presenceHours?: PresenceHours[],
        public permissions?: Permission[],
    ) { }
}