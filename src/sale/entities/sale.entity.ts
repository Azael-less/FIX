import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity()
export class Sale {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Product], { nullable: 'itemsAndList' })
  @OneToMany(() => Product, (product) => product.sale)
  products?: Product[];

  // Se almacena el precio total formateado, por ejemplo: "$1999.00"
  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  price?: number;

  @Field()
  @Column()
  buyerName: string;

  @Field()
  @Column()
  buyerEmail: string;

  @Field()
  @Column()
  buyerId: string;

  @Field(() => Date)
  @CreateDateColumn()
  soldAt: Date;
}
