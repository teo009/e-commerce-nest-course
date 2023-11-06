import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';

@Injectable()
export class SeedService {

  constructor(
    private readonly productServices: ProductsService
  ){}

  async runSeed() {
    this.insertNewProducts();
    return `Seed executed successfully`;
  }
  private async insertNewProducts() {
    await this.productServices.deleteAllProducts();
    return true;
  }
}
