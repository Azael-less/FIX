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
      // Extraer los IDs (se reciben como string) y convertirlos a número
      const productIds = input.products.map(p => parseInt(p.id, 10));
  
      // Buscar productos en la BD, cargando la relación "model"
      const products = await this.productRepository.find({
        where: { id: In(productIds) },
        relations: ['model'],
      });
  
      if (products.length !== productIds.length) {
        console.error('Uno o más productos no existen');
        return null;
      }
  
      if (products.some(product => product.isSold)) {
        console.error('Uno o más productos ya han sido vendidos');
        return null;
      }
  
      // Calcular el precio total y asignar el precio individual a cada producto
      let totalPrice = 0;
      const productPriceMap = new Map<number, number>();
      for (const inputProduct of input.products) {
        const id = parseInt(inputProduct.id, 10);
        // Se asume que inputProduct.price es un entero, por ejemplo: 50
        const priceNumber = inputProduct.price;
        totalPrice += priceNumber;
        productPriceMap.set(id, priceNumber);
      }
  
      // Asignar a cada producto su precio de venta (entero)
      for (const product of products) {
        product.priceAtSale = productPriceMap.get(product.id) || null;
      }
  
      // Crear la venta usando el precio total como entero
      const sale = this.saleRepository.create({
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        buyerId: input.buyerId,
        products,
        price: totalPrice, // Precio total como entero
      });
  
      await this.saleRepository.save(sale);
  
      // Marcar los productos como vendidos, asignar la venta y cambiar la ubicación a "vendido"
      for (const product of products) {
        product.isSold = true;
        product.sale = sale;
        product.location = "vendido"; // Se actualiza a "vendido" al vender
      }
      await this.productRepository.save(products);
  
      return sale;
    } catch (error) {
      console.error('Error en registerSale Service:', error.message);
      return null;
    }
  }
  


  async returnProducts(productIds: string[]): Promise<Sale> {
  try {
    // Validar que se envíen IDs
    if (!productIds || productIds.length === 0) {
      throw new BadRequestException('Debe proporcionar al menos un ID de producto.');
    }

    // Convertir cada id (string) a número
    const parsedIds = productIds.map((id) => {
      const num = parseInt(id, 10);
      if (isNaN(num)) {
        throw new BadRequestException(`El id '${id}' no es un número válido.`);
      }
      return num;
    });

    // Buscar los productos con sus ventas y demás relaciones necesarias
    const products = await this.productRepository.find({
      where: { id: In(parsedIds) },
      relations: ['sale', 'brand', 'model', 'color'],
    });

    if (products.length === 0) {
      throw new NotFoundException('No se encontraron productos con los IDs proporcionados.');
    }

    // Verificar que todos los productos tengan una venta asociada
    if (products.some((product) => !product.sale)) {
      throw new BadRequestException('Uno o más productos seleccionados no están vendidos.');
    }

    // Se asume que todos los productos pertenecen a la misma venta
    const sale = products[0].sale;
    const saleId = sale.id;

    if (products.some((product) => product.sale.id !== saleId)) {
      throw new BadRequestException('No todos los productos pertenecen a la misma venta.');
    }

    console.log(`Procesando devolución de productos de la venta con ID: ${saleId}`);

    // Obtener todos los productos asociados a la venta para determinar si se devuelven todos
    const allProductsInSale = await this.productRepository.find({
      where: { sale: { id: saleId } },
    });

    // Calcular el monto a reembolsar sumando los precios individuales (ya numéricos)
    let refundAmount = 0;
    for (const product of products) {
      if (product.priceAtSale !== null && product.priceAtSale !== undefined) {
        refundAmount += product.priceAtSale;
      }
    }

    // Actualizar directamente en la BD: desligar los productos de la venta,
    // marcarlos como no vendidos y cambiar su ubicación a "bodega"
    const returnedProductIds = products.map((product) => product.id);
    await this.productRepository.update(
      { id: In(returnedProductIds) },
      { isSold: false, location: "bodega" }
    );

    // Si se devuelven todos los productos de la venta, se elimina la venta
   // if (allProductsInSale.length === products.length) {
   //   await this.saleRepository.remove(sale);
   // }

    // Construir el objeto de respuesta similar a una factura
    return {
      id: saleId,
      buyerName: sale.buyerName,
      buyerEmail: sale.buyerEmail,
      buyerId: sale.buyerId,
      soldAt: sale.soldAt,
      price: sale.price, // Precio total de la venta original (número)
      products,
    };
  } catch (error) {
    console.error('Error en returnProducts:', error);
    throw error instanceof HttpException
      ? error
      : new InternalServerErrorException('Ocurrió un error al procesar la devolución.');
  }
}

  
}
