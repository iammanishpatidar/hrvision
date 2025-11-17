import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
  hasOne,
} from '@adonisjs/lucid/orm';
import * as relations from '@adonisjs/lucid/types/relations';
import Address from '../address/address.model.js';
import Compensation from '../compensation/compensation.model.js';
import Role from '../role/role.model.js';
import { DateTime } from 'luxon';
import Department from '#app/department/department.model';
import Location from '#app/location/location.model';
import Business from '#app/business/business.model';
import EmergencyContact from '#app/emergencyContacts/emergency_contacts.model'; // Adjust path accordingly
import Designation from '#app/designation/designation.model';

export default class Employee extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare email: string;

  @column()
  declare employee_id: string;

  @column()
  declare clerk_id: string;

  @column()
  declare religion: string;

  @column()
  declare contact_number: string;

  @column()
  declare permanent_address_id: string;

  @column()
  declare current_address_id: string;

  @column()
  declare business_id: string;

  @column()
  declare marital_status: string;

  @column()
  declare gender: string;

  @column.date()
  declare date_of_birth: DateTime;

  @column.dateTime()
  declare date_of_hire: DateTime;

  @column()
  declare designation: string;

  @column()
  declare designation_id: string;

  @column()
  declare is_active: boolean;

  @column()
  declare blood_group: string;

  @column()
  declare manager_id: string | null;

  @column()
  declare employment_type: string;

  @column.dateTime()
  declare last_working_date: DateTime;

  @column()
  declare department_id: string;

  @column()
  declare role_id: string;

  @column()
  declare location_id: string;

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime;

  @column.dateTime()
  declare deleted_at: DateTime;

  @belongsTo(() => Address, { foreignKey: 'permanent_address_id' })
  declare permanentAddress: relations.BelongsTo<typeof Address>;

  @belongsTo(() => Address, { foreignKey: 'current_address_id' })
  declare currentAddress: relations.BelongsTo<typeof Address>;

  @belongsTo(() => Employee, { foreignKey: 'manager_id' })
  declare manager: relations.BelongsTo<typeof Employee>;

  @belongsTo(() => Department, { foreignKey: 'department_id' })
  declare department: relations.BelongsTo<typeof Department>;

  @belongsTo(() => Role, { foreignKey: 'role_id' })
  declare role: relations.BelongsTo<typeof Role>;

  @belongsTo(() => Location, { foreignKey: 'location_id' })
  declare location: relations.BelongsTo<typeof Location>;

  @belongsTo(() => Business, { foreignKey: 'business_id' })
  declare business: relations.BelongsTo<typeof Business>;

  @belongsTo(() => Designation, { foreignKey: 'designation_id' })
  declare designationRecord: relations.BelongsTo<typeof Designation>;

  @hasMany(() => Compensation, { foreignKey: 'employee_id' })
  declare compensations: relations.HasMany<typeof Compensation>;

  // Define the emergency contact relationship
  @hasOne(() => EmergencyContact, { foreignKey: 'employee_id' })
  declare emergencyContact: relations.HasOne<typeof EmergencyContact>;
}
