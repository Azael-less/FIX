import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { RegisterSaleDto } from './dto/create-sale.input';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async registerSale(input: RegisterSaleDto): Promise<Sale | null> {
    try {
      const products = await this.productRepository.find({
        where: { id: In(input.productIds) },
        relations: ['model'],
      });
  
      // Validar que todos los productos existen
      if (products.length !== input.productIds.length) {
        console.error('Uno o más productos no existen');
        return null;
      }
  
      // Verificar si alguno ya está vendido
      if (products.some((product) => product.isSold)) {
        console.error('Uno o más productos ya han sido vendidos');
        return null;
      }
  
      // Crear la venta
      const sale = this.saleRepository.create({
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        buyerId: input.buyerId,
        products,
        price: input.price,
      });
  
      await this.saleRepository.save(sale);
  
      // Marcar los productos como vendidos
      for (const product of products) {
        product.isSold = true;
        product.sale = sale;
      }
  
      await this.productRepository.save(products);
  
      return sale;
    } catch (error) {
      console.error('Error en registerSale Service:', error.message);
      return null;
    }
  }
  
  async returnProducts(productIds: number[]): Promise<Sale> {
    try {
      // Validar que se envíen IDs
      if (!productIds || productIds.length === 0) {
        throw new BadRequestException('Debe proporcionar al menos un ID de producto.');
      }
  
      // Buscar los productos con sus ventas asociadas
      const products = await this.productRepository.find({
        where: { id: In(productIds) },
        relations: ['sale'],
      });
  
      // Validación: verificar si se encontraron productos
      if (products.length === 0) {
        throw new NotFoundException(`No se encontraron productos con los IDs proporcionados.`);
      }
  
      // Validación: verificar que los productos tengan una venta asociada
      if (products.some((product) => !product.sale)) {
        throw new BadRequestException(`Uno o más productos seleccionados no están vendidos.`);
      }
  
      // Obtener el ID de la venta de referencia
      const sale = products[0].sale;
      const saleId = sale.id;
  
      // Validación: asegurar que todos los productos pertenezcan a la misma venta
      if (products.some((product) => product.sale.id !== saleId)) {
        throw new BadRequestException(`No todos los productos pertenecen a la misma venta.`);
      }
  
      console.log(`Devolviendo productos de la venta con ID: ${saleId}`);
  
      // Obtener todos los productos de esta venta
      const allProductsInSale = await this.productRepository.find({
        where: { sale: { id: saleId } },
      });
  
      // Si todas las validaciones pasaron, proceder con la lógica
      for (const product of products) {
        product.sale = null;
        product.isSold = false;
      }
  
      await this.productRepository.save(products);
  
      // Si no quedan productos en la venta, eliminar la venta
      if (allProductsInSale.length === products.length) {
        await this.saleRepository.remove(sale);
      }
  
      // Retornar los datos de la venta antes de su eliminación
      return {
        id: saleId,
        buyerName: sale.buyerName,
        buyerEmail: sale.buyerEmail,
        buyerId: sale.buyerId,
        soldAt: sale.soldAt,
        price: sale.price,
        products,
      };
    } catch (error) {
      console.error('Error en returnProducts:', error);
      throw error instanceof HttpException
        ? error // Si es una excepción controlada, la relanzamos
        : new InternalServerErrorException('Ocurrió un error al procesar la devolución.');
    }
  }
  
}
