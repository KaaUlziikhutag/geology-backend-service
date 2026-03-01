import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions, ILike, Equal } from 'typeorm';
import Users from './users.entity';
import RegisterDto from '../authentication/dto/register.dto';
import GetUsers from './dto/get-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import bcrypt from 'bcryptjs';
import UserNotFoundException from './exceptions/user-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  /**
   * A method that fetches the news from the database
   * @returns A promise with the list of news
   */
  async getAllUsers(query: GetUsers) {
    const where: FindManyOptions<Users>['where'] = {};
    if (query.role) {
      where.role = Equal(query.role);
    }
    return await this.userRepository.find({
      where,
      order: {
        id: 'DESC',
      },
    });
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: ILike(email), isActive: true },
    });
    if (user) {
      return user;
    }
    throw new BadRequestException('User with this email does not exist');
  }
  async getByPhone(phone: string) {
    const user = await this.userRepository.findOne({
      where: { phone: ILike(phone), isActive: true },
    });
    if (user) {
      return user;
    }
    throw new BadRequestException('User with this phone does not exist');
  }

  async getByEmailNoIsActive(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (user) {
      return user;
    }
    throw new BadRequestException('User with this email does not exist');
  }

  async getByIds(ids: number[]) {
    return this.userRepository.find({
      where: { id: In(ids) },
    });
  }

  async getById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      // relations: ['avatar', 'saveAdvertisements.images'],
    });
    if (user) {
      return user;
    }
    throw new BadRequestException('User with this id does not exist');
  }

  async create(userData: RegisterDto) {
    const newUser = this.userRepository.create({
      ...userData,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  /**
   * See the [definition of the UpdateUserDto file]{@link UpdateUserDto} to see a list of required properties
   */
  async updateUser(id: number, user: UpdateUsersDto): Promise<Users> {
    await this.userRepository.update(id, user);
    const updatedUser = await this.userRepository.findOne({
      where: { id },
    });
    if (updatedUser) {
      return updatedUser;
    }
    throw new UserNotFoundException(id);
  }

  async changePassword(userId: number, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }

  /**
   * A method that deletes a directory from the database
   * @param id An id of a directory. A directory with this id should exist in the database
   */
  async deleteUser(id: number): Promise<void> {
    const deleteResponse = await this.userRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new UserNotFoundException(id);
    }
  }

  async setUserActive(userId: number) {
    await this.userRepository.update(userId, {
      isActive: true,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

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
}
