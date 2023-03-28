import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(
    () => Product, // Relacionar con la tabla Product
    (product) => product.images, // Campo con el que se va a relacionar
    {
      onDelete: 'CASCADE', // Eliminar en cascada
    },
  )
  product: Product;
}
