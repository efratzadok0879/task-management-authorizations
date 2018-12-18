import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Project, ProjectFilter, Global, CustomHttpClient } from '../../imports';

@Injectable()
export class ProjectService {

    //----------------PROPERTIRS-------------------

    basicURL: string = Global.HOST + `/project`;

    filterSubject: Subject<ProjectFilter>;

    //----------------CONSTRUCTOR------------------

    constructor(private http: CustomHttpClient) {
        this.filterSubject = new Subject<ProjectFilter>();
    }

    //----------------METHODS-------------------

    //POST
    addProject(project: Project): Observable<boolean> {
        let url: string = `${this.basicURL}/addProject`;
        return this.http.post<boolean>(url, project);
    }

    //GET
    getProjectById(projectId: number): Observable<Project> {
        let url: string = `${this.basicURL}/getProjectById?projectId=${projectId}`;
        return this.http.get<Project>(url);
    }

    //GET
    getAllProjects(): Observable<Project[]> {
        let url: string = `${this.basicURL}/getAllProjects`;
        return this.http.get<Project[]>(url);
    }

    //GET
    getProjectsByTeamLeaderId(teamLeaderId: number): Observable<Project[]> {
        let url: string = `${this.basicURL}/getProjectsByTeamLeaderId?teamLeaderId=${teamLeaderId}`;
        return this.http.get<Project[]>(url);
    }

    //GET
    getProjectsReports(): Observable<Project[]> {
        let url: string = `${this.basicURL}/getProjectsReports`;
        return this.http.get<Project[]>(url);
    }

    //GET
    hasProjects(teamLeaderId: number): Observable<boolean> {
        let url: string = `${this.basicURL}/hasProjects?teamLeaderId=${teamLeaderId}`;
        return this.http.get<boolean>(url);
    }

    //POST
    checkUniqueValidation(project: Project): Observable<{ val: string }> {
        let url: string = `${this.basicURL}/checkUniqueValidation`;
        return this.http.post<{ val: string }>(url, project);
    }

    initDates(projects: Project[]) {
        projects.forEach(project => {
            project.startDate = new Date(project.startDate);
            project.endDate = new Date(project.endDate);
            if (project.departmentsHours) {
                project.departmentsHours.forEach(departmentHours => {
                    if (departmentHours.department && departmentHours.department.workers) {
                        departmentHours.department.workers.forEach(worker => {
                            if (worker.presenceHours) {
                                worker.presenceHours.forEach(presenceHours => {
                                    presenceHours.startHour = new Date(presenceHours.startHour);
                                    presenceHours.endHour = new Date(presenceHours.endHour);
                                });
                            }
                        });
                    }
                })
            };
        });
    }
}