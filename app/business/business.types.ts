export type AddressInput = {
  line1: string;
  city: string;
  state: string;
  country: string;
  zipcode: number;
};

export type EmergencyContactInput = {
  name: string;
  relationship: string;
  contact_number: string;
  address: AddressInput;
};

export type AdminInput = {
  clerk_id: string;
  email: string;
  date_of_birth: string;
  blood_group: 'a+' | 'a-' | 'b+' | 'b-' | 'ab+' | 'ab-' | 'o+' | 'o-';
  gender: 'male' | 'female' | 'other';
  contact_number: string;
  marital_status: string;
  name: string;
  religion?: string;
  permanent_address: AddressInput;
  current_address: AddressInput;
  emergency_contact?: EmergencyContactInput;
};

export type CreateBusinessPayload = {
  name: string;
  email: string;
  contact_number: string;
  website?: string;
  business_sector: string;
  address: AddressInput;
  admin: AdminInput;
};

export type UpdateBusinessPayload = {
  name?: string;
  email?: string;
  contact_number?: string;
  website?: string;
  logo?: string;
  business_sector?: string;
  primary_color?: string;
  secondary_color?: string;
  time_off_cycle_start_date?: string;
  time_off_cycle_end_date?: string;
};

export type BusinessMeta = {
  total: number;
  page: number;
  limit: number;
};
