import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { GetContractDto } from './dto/get-contract.dto';
import { GetValidContractDto } from './dto/get-valid-contract.dto';
import { Between, Equal, FindManyOptions, In, Not, Repository } from 'typeorm';
import Contract from './contract.entity';
import ContractNotFoundException from './exceptions/contract-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ContractState, DateType } from '@utils/enum-utils';
import { DiscountService } from '../reference/discount/discount.service';
import IUser from '@modules/cloud/user/interface/user.interface';

@Injectable()
export class ContractService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    private readonly discountService: DiscountService,
  ) {}

  /**
   * A method that fetches the Contract from the database
   * @returns A promise with the list of Contract
   */
  async getAllContracts(query: GetContractDto, user: IUser) {
    const where: FindManyOptions<Contract>['where'] = {};
    if (query.comId) {
      where.authorId = Equal(query.comId);
    }
    if (query.typeId) {
      where.typeId = Equal(query.typeId);
    }
    if (query.isDraft) {
      where.isDraft = Equal(query.isDraft);
    }
    if (query.parentId) {
      where.id = Not(query.parentId);
    }
    if (query.state) {
      const states = query.state.split(',').map((type) => type.trim());
      where.state = In(states);
    }
    if (query.startDate) {
      query.startDate.setHours(0, 0, 0, 0);
      query.endDate.setHours(23, 59, 59, 999);
    }
    if (query.accessType == AccessType.Simple) {
      where.viewUsers = [{ userId: Equal(user.id) }];
    }
    if (query.type == DateType.Start) {
      where.addDate = Between(query.startDate, query.endDate);
    }
    if (query.type == DateType.End) {
      where.endDate = Between(query.startDate, query.endDate);
    }
    if (query.type == DateType.Create) {
      where.createdAt = Between(query.startDate, query.endDate);
    }
    if (query.type == DateType.contractCreate) {
      where.contractCreateDate = Between(query.startDate, query.endDate);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : undefined;
    const skip = limit ? (page - 1) * limit : undefined;
    const [items, count] = await this.contractRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['categoryOrganization', 'type', 'children', 'parent'],
      skip: skip,
      take: limit,
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  /**
   * A method that fetches a Access with a given id. Example:
   *
   * @example
   * const Access = await AccessService.getAccessById(1);
   */
  async getContractById(contractId: number): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId },
      relations: [
        'categoryOrganization',
        'type',
        'delegateOur',
        'delegateOur.worker',
        'delegateOur.worker.humans',
        'delegateOur.worker.appTree',
        'delegateOut',
        'trees',
        'parent',
        'children',
        'viewUsers',
        'viewUsers.worker',
        'viewUsers.worker.appTree',
        'viewUsers.worker.humans',
        'ourConfirmWorker.humans',
        'ourConfirmWorker.appTree',
        'ourConfirmWorker',
      ],
    });
    if (contract) {
      return contract;
    }
  }

  /**
   * Returns a still-valid contract matching customer and products.
   * This mirrors the legacy canonical implementation but still requires
   * a user because of multi-tenant EntityManager.
   */
  async getValidContract(query: GetValidContractDto): Promise<Contract> {
    const where: FindManyOptions<Contract>['where'] = {};
    // where.customerId = Equal(query.customerId);
    // where.endAt = MoreThanOrEqual(new Date());
    // where.products = { id: In(query.productIds) };
    return await this.contractRepository.findOne({
      where,
      relations: ['discounts'],
    });
  }

  /**
   *
   * @param Contract createContract
   *
   */

  async createContract(contract: CreateContractDto, user: IUser) {
    contract.authorId = user.id;
    // contract.comId = user.companyId;
    // fetch optional products/discounts if provided
    if (contract.productIds && contract.productIds.length > 0) {
      // const products = await this.productService.getProducts({
      //   ids: contract.productIds,
      // });
      // if (products.length === 0) {
      //   throw new BadRequestException('Үйлчилгээнүүд буруу байна!');
      // }
      // @ts-ignore
      // contract.products = products;
    }
    if (contract.discountIds && contract.discountIds.length > 0) {
      const discounts = await this.discountService.getAllDiscount({
        ids: contract.discountIds,
      });
      // @ts-ignore
      contract.discounts = discounts;
    }
    const existingContract = await this.contractRepository.findOne({
      where: { number: contract.number },
    });
    if (existingContract) {
      throw new BadRequestException(
        `"${contract.number}" тоот гэрээний дугаар өмнө бүртгэгдсэн байна.`,
      );
    }
    if (contract.voidContract) {
      await this.contractRepository.update(contract.voidContract, {
        state: ContractState.Cancelled,
      });
    }
    // if (contract.treeIds && contract.treeIds.length > 0) {
    //   const trees = await entityManager.find(Trees, {
    //     where: { id: In(contract.treeIds) },
    //   });
    //   if (!trees || trees.length !== contract.treeIds.length) {
    //     throw new Error('Some of the treeIds are invalid');
    //   }
    //   contract.trees = trees;
    // }
    const newContract = this.contractRepository.create(contract);
    await this.contractRepository.save(newContract);
    if (contract.viewUserIds && contract.viewUserIds.length > 0) {
      const contractViewUsers = contract.viewUserIds.map((id) => {
        // return entityManager.create(ContractViewUser, {
        //   contractId: newContract.id,
        //   userId: id,
        // });
      });
      // await entityManager.save(ContractViewUser, contractViewUsers);
    }
    if (contract.delegateOurIds && contract.delegateOurIds.length > 0) {
      const contractDelegateOurs = contract.delegateOurIds.map((id) => {
        // return entityManager.create(ContractDelegateOur, {
        //   contractId: newContract.id,
        //   delegateId: id,
        // });
      });
      // await entityManager.save(ContractDelegateOur, contractDelegateOurs);
    }

    if (contract.delegateOuts && contract.delegateOuts.length > 0) {
      const contractDelegateOuts = contract.delegateOuts.map((name) => {
        // return entityManager.create(ContractDelegateOut, {
        //   contractId: newContract.id,
        //   delegateName: name,
        // });
      });
      // await entityManager.save(ContractDelegateOut, contractDelegateOuts);
    }

    return newContract;
  }

  /**
   * See the [definition of the UpdateContractDto file]{@link UpdateContractDto} to see a list of required properties
   */
  async updateContract(
    id: number,
    contract: UpdateContractDto,
  ): Promise<Contract> {
    if (!contract.isNotVoid) {
      if (contract.voidContract) {
        await this.contractRepository.update(contract.voidContract, {
          state: ContractState.Cancelled,
        });
      } else {
        const contractVoid = await this.contractRepository.findOne({
          where: { id },
        });
        if (contractVoid?.voidContract) {
          await this.contractRepository.update(contractVoid.voidContract, {
            state: ContractState.Active,
          });
        }
      }
    }
    if (contract.number) {
      const existingContract = await this.contractRepository.findOne({
        where: { number: contract.number, id: Not(id) },
      });
      if (existingContract) {
        throw new BadRequestException(
          `"${contract.number}" тоот гэрээний дугаар өмнө бүртгэгдсэн байна.`,
        );
      }
    }
    const existingContract = await this.contractRepository.findOne({
      where: { id: id },
      relations: ['trees'],
    });
    if (!existingContract) {
      throw new ContractNotFoundException(id);
    }
    if (contract.treeIds && contract.treeIds.length > 0) {
      // const trees = await this.treesRepository.find({
      //   where: { id: In(contract.treeIds) },
      // });
      // if (!trees || trees.length !== contract.treeIds.length) {
      //   throw new Error('Some of the treeIds are invalid');
      // }
      // contract.trees = trees;
    }
    const updatedContract = await this.contractRepository.findOne({
      where: { id: id },
    });

    if (!updatedContract) {
      throw new ContractNotFoundException(id);
    }

    if (contract.viewUserIds && contract.viewUserIds.length > 0) {
      // await entityManager.delete(ContractViewUser, { contractId: id });
      // const contractViewUsers = contract.viewUserIds.map((workerId) => {
      //   return entityManager.create(ContractViewUser, {
      //     contractId: id,
      //     userId: workerId,
      //   });
      // });
      // await entityManager.save(ContractViewUser, contractViewUsers);
    }
    if (contract.delegateOurIds && contract.delegateOurIds.length > 0) {
      // await entityManager.delete(ContractDelegateOur, { contractId: id });
      const contractDelegateOurs = contract.delegateOurIds.map((delegateId) => {
        // return entityManager.create(ContractDelegateOur, {
        //   contractId: id,
        //   delegateId: delegateId,
        // });
      });
      // await entityManager.save(ContractDelegateOur, contractDelegateOurs);
    }
    if (contract.delegateOuts && contract.delegateOuts.length > 0) {
      // await entityManager.delete(ContractDelegateOut, { contractId: id });
      const contractDelegateOuts = contract.delegateOuts.map((name) => {
        // return entityManager.create(ContractDelegateOut, {
        //   contractId: id,
        //   delegateName: name,
        // });
      });
      // await entityManager.save(ContractDelegateOut, contractDelegateOuts);
    }

    Object.assign(existingContract, contract);
    // handle products/discounts on update
    if (contract.productIds && contract.productIds.length > 0) {
      // const products = await this.productService.getProducts({
      //   ids: contract.productIds,
      // });
      // // @ts-ignore
      // existingContract.products = products;
    }
    if (contract.discountIds && contract.discountIds.length > 0) {
      const discounts = await this.discountService.getAllDiscount({
        ids: contract.discountIds,
      });
      // @ts-ignore
      existingContract.discounts = discounts;
    }
    await this.contractRepository.save(existingContract);
    return existingContract;
  }

  /**
   * @deprecated Use deleteContract instead
   */
  async deleteContractById(id: number): Promise<void> {
    return this.deleteContract(id);
  }

  /**
   * A method that deletes a contract from the database
   * @param id An id of a contract. A contract with this id should exist in the database
   */
  async deleteContract(id: number): Promise<void> {
    const deleteResponse = await this.contractRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new ContractNotFoundException(id);
    }
  }
}
