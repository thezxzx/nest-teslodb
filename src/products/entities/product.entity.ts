// entity = tabla de la base de datos

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './';

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

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // Relación
  // images
  @OneToMany(
    () => ProductImage, // Relacionar con la tabla ProductImage
    (productImage) => productImage.product, // Campo con el que se va a relacionar
    {
      cascade: true, // Operaciones en cascada | eliminación
      eager: true, // Cada vez que se use el método find va a cargar las relaciones
    },
  )
  images?: ProductImage[];

  // Acción a ejecutar antes de la inserción
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  // Acción a ejecutar antes de actualizar
  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
