import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class ProductSaleInput {
  @Field()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsNotEmpty()
  price: number;
}

@InputType()
export class RegisterSaleDto {
  @Field()
  buyerName: string;

  @Field()
  buyerEmail: string;

  @Field()
  buyerId: string;

  @Field(() => [ProductSaleInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSaleInput)
  products: ProductSaleInput[];
}
