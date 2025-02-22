import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CreateProductDto } from '../products/dto/create-product.input';
import { Brand } from '../brand/entities/brand.entity';
import { Model } from '../model/entities/model.entity';
import { Color } from '../color/entities/color.entity';
import { In } from "typeorm";

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

  async create(products: CreateProductDto[]): Promise<Product[]> {
    const savedProducts: Product[] = [];

    // Extraer nombres únicos de brand, model y color
    const uniqueBrands = [...new Set(products.map(p => p.brand))];
    const uniqueModels = [...new Set(products.map(p => p.model))];
    const uniqueColors = [...new Set(products.map(p => p.color))];

    // Obtener todas las entidades en una sola consulta
    const [brands, models, colors] = await Promise.all([
      this.brandRepository.find({ where: { name: In(uniqueBrands) } }),
      this.modelRepository.find({ where: { name: In(uniqueModels) } }),
      this.colorRepository.find({ where: { name: In(uniqueColors) } }),
    ]);

    // Crear mapas para acceso rápido
    const brandMap = new Map(brands.map(b => [b.name, b]));
    const modelMap = new Map(models.map(m => [m.name, m]));
    const colorMap = new Map(colors.map(c => [c.name, c]));

    // Construir todos los productos en memoria
    const productEntities = [];

    for (const productData of products) {
      const brand = brandMap.get(productData.brand);
      if (!brand) throw new NotFoundException(`Brand "${productData.brand}" not found`);

      const model = modelMap.get(productData.model);
      if (!model) throw new NotFoundException(`Model "${productData.model}" not found`);

      const color = colorMap.get(productData.color);
      if (!color) throw new NotFoundException(`Color "${productData.color}" not found`);

      for (let i = 0; i < productData.pares; i++) {
        productEntities.push(
          this.productRepository.create({
            brand,
            model,
            color,
            size: productData.size,
          }),
        );
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
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async updateProductsLocation(productIds: number[], location: "store" | "warehouse"): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });
  
    if (products.length === 0) {
      throw new NotFoundException(`No products found for the provided IDs.`);
    }
  
    // Actualizar la ubicación de todos los productos
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
      where: { location: 'warehouse', isSold: false },
    });
  
  
}
}
  

 
 



