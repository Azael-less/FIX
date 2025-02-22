import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateBrandInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;
}
