import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

@InputType()
export class RegisterSaleDto {
  @Field()
  buyerName: string;

  @Field()
  buyerEmail: string;

  @Field()
  buyerId: string;

  @Field(() => [Number]) // Se recibe un array de IDs de productos
  productIds: number[];

  @Field()
  @IsNotEmpty()
  @IsString() 
  price: string;
}
