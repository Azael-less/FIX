import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
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
  @JoinTable()
  products?: Product[];

  @Field(() => String, {nullable: true})
  @Column({ type: 'varchar' }) // Almacenar como texto
  price?: string;

  @Field()
  @Column()
  buyerName: string; // Correo del comprador

  @Field()
  @Column()
  buyerEmail: string; // Correo del comprador

  @Field()
  @Column()
  buyerId: string; // Cédula del comprador

  @Field(() => Date)
  @CreateDateColumn()
  soldAt: Date; // Fecha y hora de la venta
}
