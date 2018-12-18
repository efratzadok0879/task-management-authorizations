import { Pipe, PipeTransform } from '@angular/core';
import { Project, ProjectFilter } from '../../imports';

@Pipe({
  name: 'projectFilter'
})
export class ProjectFilterPipe implements PipeTransform {

  transform(projects: Project[], conditions: ProjectFilter): Project[] {
    if (!projects)
      return null;
    if (!conditions)
      return projects;
    return projects.filter(project =>
      (!conditions.monthId || project.startDate.getMonth() <= conditions.monthId && project.endDate.getMonth() >= conditions.monthId) &&
      (!conditions.workerId || project.departmentsHours.some(departmentHours => departmentHours.department.workers.some(worker => worker.userId == conditions.workerId))) &&
      (!conditions.teamLeaderId || project.teamLeaderId == conditions.teamLeaderId) &&
      (!conditions.projectId || project.projectId == conditions.projectId))
  }

}
