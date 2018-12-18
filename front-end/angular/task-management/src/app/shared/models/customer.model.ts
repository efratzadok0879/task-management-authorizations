import { Project } from '../../imports';

export class Customer {
    constructor(
        public customerId: number,
        public customerName: string,
        public orderedProjects?:Project[]
    ) { }
}