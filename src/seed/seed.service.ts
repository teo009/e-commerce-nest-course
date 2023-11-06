import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

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

    const seedProducts = initialData.products;
    const insertPromises = [];
    seedProducts.forEach(product => {
      insertPromises.push(this.productServices.create(product));
    })
    await Promise.all(insertPromises);

    return true;
  }
}
