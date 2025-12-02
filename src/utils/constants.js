export const userRolesEnum = {
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER: "member"
}
export const taskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done"
}
export const availUserRoles = Object.values(userRolesEnum);
export const availTaskStatues = Object.values(taskStatusEnum); 