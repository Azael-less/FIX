import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CreateProductDto } from '../products/dto/create-product.input';
import { Brand } from '../brand/entities/brand.entity';
import { Model } from '../model/entities/model.entity';
import { Color } from '../color/entities/color.entity';
import { In } from 'typeorm';

@Injectable()
export class ProductService {
  productService: any;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,

    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  private generateUniqueId(existingIds: Set<number>): number {
    for (let i = 10000; i < 99999; i++) {
      if (!existingIds.has(i)) {
        return i;
      }
    }
    throw new Error('No hay IDs disponibles en el rango');
  }

  async create(products: CreateProductDto[]): Promise<Product[]> {
    const savedProducts: Product[] = [];

    // Extraer nombres únicos de brand, model y color
    const uniqueBrands = [...new Set(products.map((p) => p.brand))];
    const uniqueModels = [...new Set(products.map((p) => p.model))];
    const uniqueColors = [...new Set(products.map((p) => p.color))];

    // Obtener todas las entidades en una sola consulta
    const [brands, models, colors] = await Promise.all([
      this.brandRepository.find({ where: { name: In(uniqueBrands) } }),
      this.modelRepository.find({ where: { name: In(uniqueModels) } }),
      this.colorRepository.find({ where: { name: In(uniqueColors) } }),
    ]);

    // Crear mapas para acceso rápido
    const brandMap = new Map(brands.map((b) => [b.name, b]));
    const modelMap = new Map(models.map((m) => [m.name, m]));
    const colorMap = new Map(colors.map((c) => [c.name, c]));

    // Obtener IDs existentes para evitar duplicados
    const existingIds = new Set(
      (await this.productRepository.find({ select: ['id'] })).map((p) => p.id),
    );

    const productEntities = [];

    for (const productData of products) {
      const brand = brandMap.get(productData.brand);
      if (!brand)
        throw new NotFoundException(`Brand "${productData.brand}" not found`);

      const model = modelMap.get(productData.model);
      if (!model)
        throw new NotFoundException(`Model "${productData.model}" not found`);

      const color = colorMap.get(productData.color);
      if (!color)
        throw new NotFoundException(`Color "${productData.color}" not found`);

      for (let i = 0; i < productData.pares; i++) {
        const newProduct = this.productRepository.create({
          id: this.generateUniqueId(existingIds),
          brand,
          model,
          color,
          size: productData.size,
        });

        existingIds.add(newProduct.id); // Registrar ID como usado
        productEntities.push(newProduct);
      }
    }

    // Guardar todos los productos en un solo batch (bulk insert)
    const savedBatch = await this.productRepository.save(productEntities);
    savedProducts.push(...savedBatch);

    return savedProducts;
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['brand', 'model', 'color'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'model', 'color'],
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async updateProductsLocation(
    productIds: string[],
    location: 'store' | 'bodega',
  ): Promise<Product[]> {
    // Convertir cada ID de string a number y validar que sean números válidos
    const parsedIds = productIds.map((id) => {
      const num = parseInt(id, 10);
      if (isNaN(num)) {
        throw new BadRequestException(`El id '${id}' no es un número válido.`);
      }
      return num;
    });

    const products = await this.productRepository.find({
      where: { id: In(parsedIds) },
    });

    if (products.length === 0) {
      throw new NotFoundException(
        `No se encontraron productos para los IDs proporcionados.`,
      );
    }

    // Actualizar la ubicación de cada producto
    products.forEach((product) => {
      product.location = location;
    });

    return this.productRepository.save(products);
  }

  async findShoesInStore(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { location: 'store', isSold: false },
    });
  }

  async findShoesSold(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { isSold: true },
    });
  }

  async findShoesInWarehouse(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { location: 'bodega', isSold: false },
    });
  }
}
