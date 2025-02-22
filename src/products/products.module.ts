import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './products.service';
import { ProductResolver } from './products.resolver';
import { Brand } from '../brand/entities/brand.entity';
import { Model } from '../model/entities/model.entity';
import { Color } from '../color/entities/color.entity';
import { ModelModule } from 'src/model/model.module';
import { BrandModule } from 'src/brand/brand.module';
import { ColorModule } from 'src/color/color.module';


@Module({
  imports: [TypeOrmModule.forFeature([Product, Brand, Model, Color]), ModelModule, BrandModule, ColorModule],
  providers: [ProductService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
