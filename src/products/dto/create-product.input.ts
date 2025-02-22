import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  @Field()
  model: string;

  @Field()
  brand: string;

  @Field()
  color: string;

  @Field()
  size: string;

  @Field(() => String, { nullable: true }) // Hace que el campo no sea obligatorio
  qrCode?: string;

  @Field(() => Int)
  pares: number; // Se usa Int porque GraphQL no tiene "number"
}
