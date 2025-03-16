import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './products/products.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { BrandModule } from './brand/brand.module';
import { ModelModule } from './model/model.module';
import { ColorModule } from './color/color.module';
import { Product } from './products/entities/product.entity';
import { Brand } from './brand/entities/brand.entity';
import { Model } from './model/entities/model.entity';
import  { Color } from './color/entities/color.entity';
import { SaleModule } from './sale/sale.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, 
      path: '/api/v1/graphql',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      csrfPrevention: false,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, 
      autoLoadEntities: true,
      synchronize: true, 
      // dropSchema: true,
      entities: [Product, Brand, Model, Color, SaleModule],
    }), ProductModule, BrandModule, ModelModule, ColorModule, SaleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
