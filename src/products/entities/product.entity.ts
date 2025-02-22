import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryColumn, Column, ManyToOne, BeforeInsert, ManyToMany, JoinColumn   } from 'typeorm';
import { Brand } from 'src/brand/entities/brand.entity';
import { Model } from 'src/model/entities/model.entity';
import { Color } from 'src/color/entities/color.entity';
import { Sale } from '../../sale/entities/sale.entity';

@Entity()
@ObjectType()
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
  @Column({ type: 'enum', enum: ['store', 'warehouse'], default: 'warehouse' })
  location: 'store' | 'warehouse'; // Ubicación (Tienda o Bodega)
  

  @Field(() => Boolean)
  @Column({ default: false })
  isSold: boolean; // Si ha sido vendido o no

  @Field(() => Sale, { nullable: true })
  @ManyToOne(() => Sale, (sale) => sale.products)
  @JoinColumn()
  sale?: Sale;

  @BeforeInsert()
  generateId() {
    this.id = Math.floor(10000 + Math.random() * 90000); // Números entre 10000 y 99999
  }
}
