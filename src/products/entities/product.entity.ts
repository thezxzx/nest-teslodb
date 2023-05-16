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
  @ApiProperty({
    example: 'c9e8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Creación de una columna que será único
  @Column('text', {
    unique: true,
  })
  @ApiProperty({
    example: 'Nike Air Force 1',
    description: 'Product title',
    uniqueItems: true,
  })
  title: string;

  @Column('float', {
    default: 0,
  })
  @ApiProperty({
    example: 0,
    description: 'Product price',
    default: 0,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  @ApiProperty({
    example: 'Nike Air Force 1',
    description: 'Product description',
    default: null,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  @ApiProperty({
    example: 'nike-air-force-1',
    description: 'Product slug',
    uniqueItems: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  @ApiProperty({
    example: ['M', 'L', 'XL'],
    description: 'Product sizes',
  })
  sizes: string[];

  @Column('text')
  @ApiProperty({
    example: 'M',
    description: 'Product gender',
  })
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
