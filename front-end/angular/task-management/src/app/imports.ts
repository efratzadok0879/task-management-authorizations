//----------------SHARED-------------------

//models
export { Customer } from './shared/models/customer.model';
export { DepartmentHours } from './shared/models/department-hours.model';
export { Department } from './shared/models/department.model';
export { Permission } from './shared/models/permission.model';
export { PresenceHours } from './shared/models/presense-hours.model';
export { Project } from './shared/models/project.model';
export { User } from './shared/models/user.model';
export { WorkerHours } from './shared/models/worker-hours.model';
export { ChangePassword } from './shared/models/change-password.model';

//models/help
export { eListKind } from './shared/models/help/e-list-kind.model';
export { eStatus } from './shared/models/help/e-status.model';
export { Email } from './shared/models/help/email.model';
export { Login } from './shared/models/help/login.model';
export { MenuItem } from './shared/models/help/menu-item.model';
export { PresenceStatus } from './shared/models/help/presence-status.model';
export { ProjectFilter } from './shared/models/help/project-filter.model';

export { CustomHttpClient } from './shared/custom-http-client'

//services
export { BaseService } from './shared/services/base.service';
export { CustomerService } from './shared/services/customer.service';
export { DepartmentService } from './shared/services/department.service';
export { ExcelService } from './shared/services/excel.service';
export { MenuService } from './shared/services/menu.service';
export { PermissionService } from './shared/services/permission.service';
export { PresenceHoursService } from './shared/services/presence-hours.service';
export { ProjectService } from './shared/services/project.service';
export { UserService } from './shared/services/user.service';
export { WorkerHoursService } from './shared/services/worker-hours.service';
export { ValidatorsService } from './shared/services/validators.service';

//pipes
export { ProjectFilterPipe } from './shared/pipes/project-filter.pipe';

export { AuthGuard } from './shared/auth.guard';
export { Resolver } from './shared/resolver';
export { Global } from './shared/global';

//----------------COMPONENTS-------------------

export { AppComponent } from './app.component';
export { HeaderComponent } from './components/header/header.component';
export { FooterComponent } from './components/footer/footer.component';
export { MainComponent } from './components/main/main.component';
export { MenuComponent } from './components/menu/menu.component';
export { InputComponent } from './components/input/input.component';
export { SelectComponent } from './components/select/select.component';
export { TextareaComponent } from './components/textarea/textarea.component';
export { CheckBoxComponent } from './components/check-box/check-box.component';
export { LoginComponent } from './components/login/login.component';
export { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

//----------------MANAGER SCREENS-------------------

export { ManagerComponent } from './components/manager/manager.component';
// UserManagement
export { UserManagementComponent } from './components/user-management/user-management.component';
export { UserListComponent } from './components/user-list/user-list.component';
export { UserFormComponent } from './components/user-form/user-form.component';
export { AddUserComponent } from './components/add-user/add-user.component';
export { EditUserComponent } from './components/edit-user/edit-user.component';
export { UploadImgComponent } from './components/upload-img/upload-img.component';
export { PermissionsComponent } from './components/permissions/permissions.component';
export { PermissionListComponent } from './components/permission-list/permission-list.component';
export { TmpPermissionComponent } from './components/tmp-permission/tmp-permission.component';
export { AddPermissionComponent } from './components/add-permission/add-permission.component';
// ProjectManagement
export { ProjectManagementComponent } from './components/project-management/project-management.component';
export { AddProjectComponent } from './components/add-project/add-project.component';
export { ReportComponent } from './components/report/report.component';
export { ProjectReportListComponent } from './components/project-report-list/project-report-list.component';
export { FilterReportComponent } from './components/filter-report/filter-report.component';

//TeamsManagement
export { TeamsManagementComponent } from './components/teams-management/teams-management.component';
export { TeamManagementComponent } from './components/team-management/team-management.component';

// for UserList and TeamsManagement
export { TmpUserComponent } from './components/tmp-user/tmp-user.component';
// for AddProject-add permission and TeamManagement-belong worker to team
export { SelectWorkersComponent } from './components/select-workers/select-workers.component';

//----------------TEAM-LEADER SCREENS-------------------

export { TeamLeaderComponent } from './components/team-leader/team-leader.component';
export { TeamLeaderGraphComponent } from './components/team-leader-graph/team-leader-graph.component';

export { ProjectListComponent } from './components/project-list/project-list.component';
export { TmpProjectComponent } from './components/tmp-project/tmp-project.component';


export { WorkerHoursManagementComponent } from './components/worker-hours-management/worker-hours-management.component';
export { ProjectHoursListComponent } from './components/project-hours-list/project-hours-list.component';
export { TmpProjectHoursComponent } from './components/tmp-project-hours/tmp-project-hours.component';
export { WorkersHoursComponent } from './components/workers-hours/workers-hours.component';
export { UpdateHoursDialogComponent } from './components/update-hours-dialog/update-hours-dialog.component';

//----------------WORKER SCREENS-------------------

export { WorkerComponent } from './components/worker/worker.component';
export { HomeComponent } from './components/home/home.component';
export { SendEmailComponent } from './components/send-email/send-email.component';
export { DateAndTimeComponent } from './components/date-and-time/date-and-time.component';
export { WorkerTaskListComponent } from './components/worker-task-list/worker-task-list.component';
export { TmpWorkerTaskComponent } from './components/tmp-worker-task/tmp-worker-task.component';
export { TimerComponent } from './components/timer/timer.component';
export { WorkerGraphComponent } from './components/worker-graph/worker-graph.component';

export { GraphChartComponent } from './components/graph-chart/graph-chart.component';
export { DatePickerComponent } from './components/date-picker/date-picker.component';
export { TreeTableComponent } from './components/tree-table/tree-table.component';

//routing
export { routing } from './app.routing';