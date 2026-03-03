export type Gender = 'male' | 'female';

export interface FamilyMember {
  id: string;
  name: string;
  gender: Gender;
  birthDate: string;
  deathDate?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
  parentId?: string;
  spouseId?: string;
  spouseRelationship?: 'married' | 'separated';
  generation: number;
}
