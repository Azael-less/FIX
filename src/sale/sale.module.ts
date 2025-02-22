import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { SaleResolver } from './sale.resolver';
import { SaleService } from './sale.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Product])],
  providers: [SaleResolver, SaleService], // Agregar SaleService aquí
  exports: [SaleService], // Exportar para usar en otros módulos si es necesario
})
export class SaleModule {}
