import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { Sale } from './entities/sale.entity';
import { SaleService } from './sale.service';
import { RegisterSaleDto } from './dto/create-sale.input';
import { InternalServerErrorException } from '@nestjs/common';

@Resolver(() => Sale)
export class SaleResolver {
  constructor(private readonly saleService: SaleService) {}

  @Mutation(() => Sale, { nullable: true })
async registerSale(@Args('input') input: RegisterSaleDto): Promise<Sale | null> {
  try {
    return await this.saleService.registerSale(input);
  } catch (error) {
    console.error('Error en registerSale Resolver:', error.message);

    // Lanzar un error con un mensaje claro
    throw new Error('Ocurrió un error al registrar la venta. Intente nuevamente.');
  }
}

  

  @Mutation(() => Sale)
  async returnProduct(
    @Args('productIds', { type: () => [String] }) productIds: string[]
  ) {
    try {
      return await this.saleService.returnProducts(productIds);
    } catch (error) {
      console.error('Error en returnProduct:', error);
      throw new InternalServerErrorException('Ocurrió un error al devolver los productos.');
    }
  }
  
  

}
