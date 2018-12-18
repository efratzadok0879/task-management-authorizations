import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import AsEnumerable from 'linq-es2015';
import { PresenceHours, Project, Department, User, PresenceStatus, Global, CustomHttpClient } from '../../imports';

@Injectable()
export class PresenceHoursService {

    //----------------PROPERTIRS-------------------

    basicURL: string = Global.HOST + `/presenceHours`;
    UpdatePresenceSubject: Subject<void>;

    //----------------CONSTRUCTOR------------------

    constructor(private http: CustomHttpClient) {
        this.UpdatePresenceSubject = new Subject<void>();
    }

    //----------------METHODS-------------------

    //POST
    addPresenceHours(presenceHours: PresenceHours): Observable<number> {
        let url: string = `${this.basicURL}/addPresenceHours`;
        return this.http.post<number>(url, presenceHours);
    }

    //POST
    editPresenceHours(presenceHours: PresenceHours): Observable<boolean> {
        let url: string = `${this.basicURL}/editPresenceHours`;
        return this.http.post<boolean>(url, presenceHours);
    }

    //GET
    getPresenceStatusPerWorkers(teamLeaderId: number): Observable<PresenceStatus[]> {
        let url: string = `${this.basicURL}/getPresenceStatusPerWorkers?teamLeaderId=${teamLeaderId}`;
        return this.http.get<PresenceStatus[]>(url);
    }

    //GET
    getPresenceStatusPerProjects(workerId: number): Observable<PresenceStatus[]> {
        let url: string = `${this.basicURL}/getPresenceStatusPerProjects?workerId=${workerId}`;
        return this.http.get<PresenceStatus[]>(url);
    }

    //GET
    getPresenceHoursSum(projectId: number, workerId: number): Observable<number> {
        let url: string = `${this.basicURL}/getPresenceHoursSum?projectId=${projectId}&workerId=${workerId}`;
        return this.http.get<number>(url);
    }

    getPresenceHoursForProject(project: Project): number {
        return AsEnumerable(project.departmentsHours).Sum(departmentHours =>
            this.getPresenceHoursForDepartment(departmentHours.department));
    }

    getPercentHoursForProject(project: Project): number {
        return AsEnumerable(project.departmentsHours).Average(departmentHours =>
            departmentHours.numHours != 0 ?
                (this.getPresenceHoursForDepartment(departmentHours.department) / departmentHours.numHours <= 1 ?
                    this.getPresenceHoursForDepartment(departmentHours.department) / departmentHours.numHours : 1) : 1
        );
    }

    getPresenceHoursForDepartment(department: Department): number {
        return AsEnumerable(department.workers).Sum(worker => this.getPresenceHoursForWorker(worker));
    }

    getPresenceHoursForWorker(worker: User): number {
        return AsEnumerable(worker.presenceHours).Sum(presenceHours => (presenceHours.endHour.getTime() - presenceHours.startHour.getTime()) / 36e5);
    }

}