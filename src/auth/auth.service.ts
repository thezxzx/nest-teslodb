import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10) /* encriptar contraseña */,
      });
      await this.userRepository.save(user);

      delete user.password;

      return user;

      // TODO: Retornar el JWT de acceso
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    // Obtener el correo y la contraseña
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email }, // Buscar por correo
      select: { email: true, password: true }, // Obtener solo los campos que necesitamos
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    // Verificar la contraseña
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    return user;

    // TODO: Retornar el JWT
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
