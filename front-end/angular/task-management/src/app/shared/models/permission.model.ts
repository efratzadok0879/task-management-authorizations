import { User,Project } from '../../imports';

export class Permission {
    constructor(
        public permissionId:number,
        public workerId:number,
        public projectId:number,
        public isActive:boolean,
        public worker?:User,
        public project?:Project
    ) { }
}