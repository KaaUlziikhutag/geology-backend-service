import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { GetProgramDto } from './dto/get-program.dto';
import { Equal, FindManyOptions, Repository } from 'typeorm';
import Programs from './program.entity';
import ProgramNotFoundException from './exceptions/program-not-found.exception';
import PageDto from '@utils/dto/page.dto';
import PageMetaDto from '@utils/dto/page-meta.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProgramService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Programs)
    private programsRepository: Repository<Programs>,
  ) {}

  /**
   * A method that fetches the Program from the database
   * @returns A promise with the list of Programs
   */
  async getAllPrograms(query: GetProgramDto) {
    const where: FindManyOptions<Programs>['where'] = {};
    if (query.pos) {
      where.pos = Equal(query.pos);
    }
    const page =
      query.page && !isNaN(query.page) && query.page > 0
        ? Number(query.page)
        : 1;
    const limit =
      query.limit && !isNaN(query.limit) && query.limit > 0
        ? Number(query.limit)
        : 10;
    const skip = (page - 1) * limit;
    const [items, count] = await this.programsRepository.findAndCount({
      where,
      order: {
        pos: 'ASC',
      },
      skip: skip,
      take: limit,
      relations: ['modules'],
    });
    const itemCount = count;
    const pageMetaDto = new PageMetaDto({ page, limit, itemCount });
    return new PageDto(items, pageMetaDto);
  }

  async getAllProgram() {
    const programs = await this.programsRepository.find();
    return programs;
  }

  /**
   * A method that fetches a Program with a given id. Example:
   *
   * @example
   * const Program = await ProgramService.getProgramById(1);
   */
  async getProgramById(programId: number): Promise<Programs> {
    const program = await this.programsRepository.findOne({
      where: { id: programId },
      relations: ['modules'],
    });
    if (program) {
      return program;
    }
    throw new ProgramNotFoundException(programId);
  }

  /**
   *
   * @param Program createProgram
   *
   */
  async createProgram(program: CreateProgramDto) {
    const newProgram = this.programsRepository.create(program);
    await this.programsRepository.save(newProgram);
    return newProgram;
  }

  /**
   * See the [definition of the UpdateProgramDto file]{@link UpdateProgramDto} to see a list of required properties
   */
  async updateProgram(
    id: number,
    program: UpdateProgramDto,
  ): Promise<Programs> {
    await this.programsRepository.update(id, program);
    const updatedProgram = await this.programsRepository.findOne({
      where: { id: id },
    });
    if (updatedProgram) {
      return updatedProgram;
    }
    throw new ProgramNotFoundException(id);
  }

  /**
   * @deprecated Use deleteProgram instead
   */
  async deleteProgramById(id: number): Promise<void> {
    return this.deleteProgram(id);
  }

  /**
   * A method that deletes a department from the database
   * @param id An id of a department. A department with this id should exist in the database
   */
  async deleteProgram(id: number): Promise<void> {
    const deleteResponse = await this.programsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new ProgramNotFoundException(id);
    }
  }
}
