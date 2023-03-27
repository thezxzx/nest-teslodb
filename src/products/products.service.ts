import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';
@Injectable()
export class ProductsService {
  // Mostrar mensajes de logs
  private readonly logger = new Logger('ProductsService'); // Nombre de la clase

  constructor(
    // Inyectar el Product
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // Inyectar el ProductImage
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // Desestructurar las imagenes con un arreglo vacío por defecto
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        // Crear instancia de las imagenes, cada una tendrá el ID del producto con el que del que se vayan creando como referencia
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      }); // Crear instancia del producto
      await this.productRepository.save(product); // Guardar en la base de datos

      // Devolver las imagenes en el mismo formato a como se recibieron (sin el id)
      return { ...product, images: images };
    } catch (error) {
      this.handleDBExceptions(error);
      // if (error.code === '23505') throw new BadRequestException(error.detail);

      // this.logger.error(error); // Error en el servidor
      // throw new InternalServerErrorException(
      //   'Unexpected error, check server logs',
      // ); // Error para el usuario
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // Obtener las relaciones de las imagenes
      relations: {
        images: true,
      },
    });

    // Modificar el mensaje de retorno para quitar el id de las imagenes
    return products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({
        id: term,
      });
    } else {
      // prod = alias de la tabla
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        // Al utilizar la función UPPER se pierde el índice
        .where('UPPER(title) = :title or slug = :slug', {
          // :title | :slug argumentos a proporcionar
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        // relaciones con la imagen del producto | otro alias
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Product with term ${term} not found`);

    return product;
  }

  // Nuevo método para buscar por término porque el otro no puede devolver un objeto plano porque lo utiliza el delete
  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id, // Obtener producto por id
      ...updateProductDto, // Colocar las propiedades del dto
      images: [], // TODO: Arreglar
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
