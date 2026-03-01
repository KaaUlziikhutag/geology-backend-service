import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { ILike, In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import Users from './user.entity';
import UserNotFoundException from './exceptions/user-not-found.exception';

@Injectable()
export class UserService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private moduleRef: ModuleRef,
  ) {}

  /**
   * A method that fetches the user from the database
   * @returns A promise with the list of users
   */
  getAllUsers(): Promise<Users[]> {
    return this.userRepository.find();
  }

  /**
   * A method that fetches a user with a given id. Example:
   *
   * @example
   * const user = await userService.getUserById(1);
   */
  async getUserById(userId: number): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['company'],
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserByWorkerId(workerId: number): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        workerId: workerId,
      },
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: ILike(email) },
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'Энэ имэйл хаягтай хэрэглэгч байхгүй байна.',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByEmailCheck(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
  }

  /**
   *
   * @param user createUser
   *
   */

  async createUser(user: CreateUserDto) {
    const newUser = await this.userRepository.save(user);
    return newUser;
  }

  /**
   * See the [definition of the UpdateUserDto file]{@link updateUser} to see a list of required properties
   */
  async updateUser(id: number, user: UpdateUserDto): Promise<Users> {
    await this.userRepository.update(id, user);
    const updatedUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (updatedUser) {
      return updatedUser;
    }
    throw new UserNotFoundException(id);
  }

  /**
   * @deprecated Use deleteUser instead
   */
  async deleteUserById(id: number): Promise<void> {
    return this.deleteUser(id);
  }

  /**
   * A method that deletes a user from the database
   * @param id An id of a user. A user with this id should exist in the database
   */
  async deleteUser(id: number): Promise<void> {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFoundException(id);
    }
  }

  async changePassword(userId: number, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async getByIds(ids: number[]) {
    return this.userRepository.find({
      where: { id: In(ids) },
    });
  }
}
