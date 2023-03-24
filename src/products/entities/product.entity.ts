// entity = tabla de la base de datos

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  // Id de la tabla
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Creación de una columna que será único
  @Column('text', {
    unique: true,
  })
  title: string;
}
