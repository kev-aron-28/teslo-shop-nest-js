import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data.seed';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService
  ) {}
  async runSeed() {
    await this.insertNewProducts();
    return "SEED";
  }

  private async insertNewProducts() {
    this.productService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];

    products.forEach(p => {
        insertPromises.push(this.productService.create(p));
    });

    await Promise.all(insertPromises);
    return true;
  }


}
