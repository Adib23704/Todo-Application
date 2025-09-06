import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Register a new user
  async register(
    registerDto: RegisterDto,
  ): Promise<{ token: string; user: User }> {
    const { username, email, password } = registerDto;

    console.log('User registration attempt');

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existingUser) {
      console.log('Registration failed: User already exists');
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    console.log('User registered successfully');

    const payload = { sub: savedUser.id, email: savedUser.email };
    const token = await this.jwtService.signAsync(payload);

    return { token, user };
  }

  // Login an existing user
  async login(loginDto: LoginDto): Promise<{ token: string; user: User }> {
    const { email, password } = loginDto;

    console.log('User login attempt');

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      console.log('Login failed: User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('User login successful');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { token, user };
  }

  // Validate user by ID
  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      console.log('User validation failed: User not found');
      throw new UnauthorizedException('User not found');
    }

    console.log('User validation successful');

    return user;
  }
}
