import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType() 
@Entity()
export class Brand {
  @Field(() => Int) 
  @PrimaryGeneratedColumn()
  id: number;

  @Field() 
  @Column({ unique: true })
  name: string;

  @Field(() => [Product], { nullable: true }) 
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
