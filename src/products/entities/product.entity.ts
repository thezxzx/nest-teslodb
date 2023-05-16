// entity = tabla de la base de datos

import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ProductImage } from './';

@Entity({ name: 'products' })
export class Product {
  // Id de la tabla
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Creación de una columna que será único
  @Column('text', {
    unique: true,
  })
  @ApiProperty()
  title: string;

  @Column('float', {
    default: 0,
  })
  @ApiProperty()
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  @ApiProperty()
  description: string;

  @Column('text', {
    unique: true,
  })
  @ApiProperty()
  slug: string;

  @Column('int', {
    default: 0,
  })
  @ApiProperty()
  stock: number;

  @Column('text', {
    array: true,
  })
  @ApiProperty()
  sizes: string[];

  @Column('text')
  @ApiProperty()
  gender: string;

  @Column('text', {
    array: true,
    default: [],
  })
  @ApiProperty()
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
  @ApiProperty()
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

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
