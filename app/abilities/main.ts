import { Bouncer } from '@adonisjs/bouncer'
import { getUserRole } from '../../utilities/role_helper.js'


export const before = Bouncer.ability(async (user: { id: string }) => {
  const role = await getUserRole(user.id)
  if (role === 'SUPER_ADMIN') {
    return true
  }
  return false
})

export const manage = Bouncer.ability(async (user: { id: string }) => {
  const role = await getUserRole(user.id)
  return ['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(role || '')
})

export const view = Bouncer.ability(async (user: { id: string }) => {
  const role = await getUserRole(user.id)
  return ['ADMIN', 'MANAGER', 'EMPLOYEE', 'SUPER_ADMIN'].includes(role || '')
})

export const deleteResource = Bouncer.ability(async (user: { id: string }) => {
  const role = await getUserRole(user.id)
  return ['ADMIN', 'SUPER_ADMIN'].includes(role || '')
})

export const updateEmployee = Bouncer.ability(async (user: { id: string }, employee: any) => {
  const role = await getUserRole(user.id)
  
  // Super admin can update anyone
  if (role === 'SUPER_ADMIN') return true
  
  // Admin and Manager can update employees
  if (['ADMIN', 'MANAGER'].includes(role || '')) return true
  
  // Employee can only update their own profile
  if (role === 'EMPLOYEE' && user.id === employee.id) return true
  
  return false
})

export const abilities = {
  before,
  manage,
  view,
  deleteResource,
  updateEmployee
}