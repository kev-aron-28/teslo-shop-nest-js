import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) {
    
  }
  async create(createAuthDto: CreateUserDto) {
    try {

        const { password, ...userData } = createAuthDto;

        const user = this.userRepository.create({
            ...userData,
            password: bcrypt.hashSync(password, 10)
        });
        await this.userRepository.save(user);
        delete user.password;
        return {
            user,
            token: this.getJwtToken({
                id: user.id
            })
        }

    } catch (error) {
        this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true }
    });

    if(!user) {
        throw new UnauthorizedException('Not valid credentials')
    }

    if(!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Not valid credentials');
    } 

    return {
        user,
        token: this.getJwtToken({
            id: user.id
        })
    }
    
  }

  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDbErrors( error: any ) {
    if(error.code === '23505') {
        throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException('Something went wrong');
  }

}
