import { Project, User } from '../../imports';

export class WorkerHours {
    constructor(
        public workerHoursId: number,
        public projectId: number,
        public workerId: number,
        public numHours: number,
        public project?: Project,
        public worker?: User
    ) { }
}