import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  fullName: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean; // No eliminar usuarios físicametne de la base de datos, cambiar el activo a falso

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];
}
