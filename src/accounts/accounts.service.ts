import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}
  create(createAccountDto: CreateAccountDto) {
    console.log(createAccountDto);
    return this.prisma.account.create({ data: createAccountDto });
  }

  findAll() {
    return `This action returns all accounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
  async transfer(from: number, to: number, amount: number) {
    return await this.prisma.$transaction(async (tx) => {
      const fromAccount = await tx.account.findUnique({ where: { id: from } });
      if (fromAccount.balance < amount) {
        throw new Error('Insufficient balance');
      }
      await tx.account.update({
        where: { id: from },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
      await tx.account.update({
        where: { id: to },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    });
  }
}
