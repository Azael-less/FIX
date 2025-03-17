import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryColumn, Column, ManyToOne, BeforeInsert, JoinColumn } from 'typeorm';
import { Brand } from 'src/brand/entities/brand.entity';
import { Model } from 'src/model/entities/model.entity';
import { Color } from 'src/color/entities/color.entity';
import { Sale } from '../../sale/entities/sale.entity';

@ObjectType()
@Entity()
export class Product {
  @Field()
  @PrimaryColumn() 
  id: number;

  @Field(() => Brand)
  @ManyToOne(() => Brand, (brand) => brand.products, { eager: true })
  brand: Brand;

  @Field(() => Model)
  @ManyToOne(() => Model, (model) => model.products, { eager: true })
  model: Model;

  @Field(() => Color)
  @ManyToOne(() => Color, (color) => color.products, { eager: true })
  color: Color;

  @Field()
  @Column()
  size: string;

  @Field()
  @Column({ type: 'enum', enum: ['store', 'bodega','vendido'], default: 'bodega' })
  location: 'store' | 'bodega' | 'vendido';

  @Field(() => Boolean)
  @Column({ default: false })
  isSold: boolean;

  @Field(() => Sale, { nullable: true })
  @ManyToOne(() => Sale, (sale) => sale.products)
  @JoinColumn()
  sale?: Sale;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  priceAtSale?: number; // Se almacena el precio individual (por ejemplo "$50.99")

  @BeforeInsert()
  generateId() {
    this.id = Math.floor(10000 + Math.random() * 90000);
  }
}
