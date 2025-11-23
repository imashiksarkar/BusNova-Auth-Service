import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import * as NodeCache from 'node-cache';
import { DbService } from '../db/db.service';
import { KafkaService } from '../kafka/kafka.service';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';

interface Role {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly cache: NodeCache;

  private readonly roles = ['user', 'admin', 'guide'];
  private readonly defaultRoleName = 'user';
  private readonly adminRoleName = 'admin';

  constructor(
    private readonly db: DbService,
    private readonly kafka: KafkaService,
  ) {
    this.cache = new NodeCache();
  }

  async onModuleInit() {
    try {
      await this.seedRoles();
    } catch (error) {
      console.error('Error initializing roles:', error);
    }
  }

  private async seedRoles() {
    const existingRoles = await this.db.role
      .findMany({
        where: { name: { in: this.roles } },
      })
      .then((roles) => roles.map((role) => role.name));

    const newRoles = this.roles.filter((role) => !existingRoles.includes(role));

    if (newRoles.length < 1) return;

    await this.db.role.createMany({
      data: newRoles.map((role) => ({ name: role })),
    });

    console.log('Roles initialized:', newRoles);
  }

  private async getDefaultRole() {
    const cacheName = 'defaultRole';
    const cachedRole = this.cache.get<Role | null>(cacheName);
    if (cachedRole) return cachedRole;

    const role = await this.db.role.findUnique({
      where: { name: this.defaultRoleName },
    });

    this.cache.set(cacheName, role, 60 * 10); // Cache for 10 minutes

    return role;
  }

  private async createAdminIfNotExists(email: string, password: string) {
    await this.db.$transaction(async (tx) => {
      const existingAdmin = await tx.auth.findUnique({
        where: { email },
      });

      if (existingAdmin) return;

      const newAdmin = await tx.auth.create({
        data: {
          email,
          password,
        },
      });

      const adminRole = await tx.role.findUnique({
        where: { name: this.adminRoleName },
      });

      if (!adminRole)
        throw new BadRequestException('Admin role does not exist');

      await tx.authRole.create({
        data: {
          authId: newAdmin.id,
          roleId: adminRole.id,
        },
      });

      console.log('Admin user created with email:', email);
    });
  }

  async signin(payload: SigninDto) {
    const user = await this.db.auth.findUnique({
      where: { email: payload.email },
    });

    if (!user) throw new BadRequestException('Invalid credentials');

    if (user.password !== payload.password)
      throw new BadRequestException('Invalid credentials');

    return user;
  }

  async signup(payload: SignupDto) {
    await this.db.$transaction(async (tx) => {
      const existingUser = await tx.auth.findUnique({
        where: { email: payload.email },
      });

      if (existingUser) throw new BadRequestException('User already exists');

      const newUser = await tx.auth.create({
        data: {
          email: payload.email,
          password: payload.password,
        },
      });

      const role = await this.getDefaultRole();

      if (!role) throw new BadRequestException('Default role not found');

      await tx.authRole.create({
        data: {
          authId: newUser.id,
          roleId: role.id,
        },
      });

      await this.kafka.PUBLISH_AUTH_CREATED(payload);

      return newUser;
    });
  }
}
