import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { ProductService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.input';
import { ParseArrayPipe } from '@nestjs/common';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => [Product], { name: 'createProducts' })
  async createProducts(
    @Args('products', { type: () => [CreateProductDto] }, new ParseArrayPipe({ items: CreateProductDto }))
    products: CreateProductDto[],
  ) {
    return this.productService.create(products);
  }

  @Query(() => [Product], { name: 'getAllProducts' })
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query(() => Product, { name: 'getProductById' })
  async findOne(@Args('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Mutation(() => [Product]) // Devuelve una lista de productos
async updateProductsLocation(
  @Args('location') location: string,
  @Args({ name: 'productIds', type: () => [String] }) productIds: string[],
): Promise<Product[]> {
  return this.productService.updateProductsLocation(productIds, location as "store" | "bodega");
}

  

@Query(() => [Product])
async shoesInStore(): Promise<Product[]> {
  return this.productService.findShoesInStore();
}

@Query(() => [Product])
async soldShoes(): Promise<Product[]> {
  return this.productService.findShoesSold();
}

@Query(() => [Product])
async shoesInWarehouse(): Promise<Product[]> {
  return this.productService.findShoesInWarehouse();
}

}
