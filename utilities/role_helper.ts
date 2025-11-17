export const getUserRole = async (employeeId: string): Promise<string | null> => {
    const { default: Employee } = await import('#app/employee/employee.model')
    const { default: Role } = await import('#app/role/role.model')

    const employee = await Employee.find(employeeId)
    if (!employee || !employee.role_id) return null

    const role = await Role.find(employee.role_id)
    return role ? role.role : null
}