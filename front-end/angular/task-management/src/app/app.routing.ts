import { Routes, RouterModule } from '@angular/router';

import {
    LoginComponent,
    ManagerComponent,
    UserManagementComponent,
    UserListComponent,
    AddUserComponent,
    EditUserComponent,
    PermissionsComponent,
    ProjectManagementComponent,
    AddProjectComponent,
    ReportComponent,
    TeamsManagementComponent,
    TeamManagementComponent,
    TeamLeaderComponent,
    WorkerHoursManagementComponent,
    TeamLeaderGraphComponent,
    ProjectHoursListComponent,
    WorkersHoursComponent,
    WorkerComponent,
    HomeComponent,
    ProjectListComponent,
    AuthGuard,
    Resolver
} from './imports';
import { MainComponent } from './components/main/main.component';

const appRoutes: Routes = [
    {
        path: 'taskManagement', children: [
            {
                path: 'login', component: LoginComponent, canActivate: [AuthGuard],
            },
            {
                path: 'main', component: MainComponent, children: [
                    {
                        path: 'manager', component: ManagerComponent, canActivate: [AuthGuard], children: [

                            {
                                path: 'userManagement', component: UserManagementComponent, resolve: [Resolver], children: [
                                    {
                                        path: 'userList', component: UserListComponent
                                    },
                                    {
                                        path: 'addUser', component: AddUserComponent
                                    },
                                    {
                                        path: 'editUser/:id', component: EditUserComponent
                                    },
                                    {
                                        path: 'permissions/:id', component: PermissionsComponent
                                    },
                                    {
                                        path: '**', component: UserListComponent
                                    },
                                ]
                            },
                            {
                                path: 'projectManagement', component: ProjectManagementComponent, resolve: [Resolver], children: [
                                    {
                                        path: 'addProject', component: AddProjectComponent
                                    },
                                    {
                                        path: 'reports', component: ReportComponent
                                    },
                                    {
                                        path: '**', component: AddProjectComponent
                                    }
                                ]
                            },
                            {
                                path: 'teamsManagement', component: TeamsManagementComponent, resolve: [Resolver], children: [
                                    {
                                        path: 'teamLeaderList', component: UserListComponent
                                    },

                                    {
                                        path: 'teamManagement/:teamLeaderId', component: TeamManagementComponent
                                    },
                                    {
                                        path: '**', component: UserListComponent
                                    },
                                ]
                            },
                            {
                                path: '**', component: UserManagementComponent
                            }
                        ]
                    },
                    {
                        path: 'teamLeader', component: TeamLeaderComponent, canActivate: [AuthGuard], children: [
                            {
                                path: 'workerHoursManagement', component: WorkerHoursManagementComponent, children: [
                                    {
                                        path: 'projectHoursList', component: ProjectHoursListComponent, resolve: [Resolver]
                                    },
                                    {
                                        path: 'workersHours/:projectId', component: WorkersHoursComponent, resolve: [Resolver]
                                    },
                                ]
                            },

                            {
                                path: 'ProjectList', component: ProjectListComponent, resolve: [Resolver]
                            },

                            {
                                path: 'workersHoursStatus', component: TeamLeaderGraphComponent, resolve: [Resolver]
                            },
                        ]
                    },
                    {
                        path: 'worker', component: WorkerComponent, canActivate: [AuthGuard], children: [
                            {
                                path: 'home', component: HomeComponent, resolve: [Resolver]
                            },
                            {
                                path: '**', component: HomeComponent
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // otherwise redirect to LoginComponent
    { path: '**', component: LoginComponent, canActivate: [AuthGuard] }
];

export const routing = RouterModule.forRoot(appRoutes);