import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ColorService } from './color.service';
import { Color } from './entities/color.entity';
import { CreateColorInput } from './dto/create-color.input';

@Resolver(() => Color)
export class ColorResolver {
  constructor(private readonly colorService: ColorService) {}

  @Mutation(() => Color)
  createColor(@Args('createColorInput') createColorInput: CreateColorInput) {
    return this.colorService.create(createColorInput);
  }

  @Query(() => Color, { nullable: true })
  findColor(@Args('id') id: number) {
    return this.colorService.findOne(id);
  }

  @Query(() => [Color])
  async findAllColors(): Promise<Color[]> {
    return await this.colorService.findAll();
  }
}
