import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly productServices: ProductsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    this.insertNewProducts(adminUser);
    return `Seed executed successfully`;
  }

  //Eliminar en orden antes los productos y hasta después los usuarios por la relación
  private async deleteTables() {
    await this.productServices.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach(user => {
      user.password = bcrypt.hashSync(user.password, 10)
      users.push(this.userRepository.create(user));
    })

    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    await this.productServices.deleteAllProducts();

    const seedProducts = initialData.products;
    const insertPromises = [];
    seedProducts.forEach(product => {
      insertPromises.push(this.productServices.create(product, user));
    })
    await Promise.all(insertPromises);

    return true;
  }
}
