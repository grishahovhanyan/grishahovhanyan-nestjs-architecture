import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { randomUUID } from 'crypto'

import {
  ERROR_MESSAGES,
  HashService,
  RESET_PASSWORD_REQUEST_TIME_LIMIT,
  RESET_PASSWORD_TOKEN_EXPIRE_TIME,
  SUCCESS_RESPONSE
} from '@app/common'
import { UserEntity } from '@modules/users/entities/user.entity'
import { UsersService } from '@modules/users/users.service'
import { NotificationQueueService } from '@infra/queues'
import { MailQueueService } from '@infra/queues/mail'

import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailQueueService: MailQueueService,
    private readonly notificationQueueService: NotificationQueueService,
    private readonly usersService: UsersService
  ) {}

  // ******* Controller Handlers *******
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.getByEmail(registerDto.email)

    if (user) {
      throw new BadRequestException(ERROR_MESSAGES.userAlreadyExists)
    }

    const createdUser = await this.usersService.create(registerDto)

    await this.notificationQueueService.registrationSuccess({
      fullName: createdUser.fullName,
      email: createdUser.email
    })

    return createdUser
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)

    return {
      accessToken: this.jwtService.sign({ userId: user.id })
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.getByEmail(forgotPasswordDto.email)

    if (!user) {
      throw new NotFoundException()
    }

    // Check if the user has requested a password reset within the last minute
    const timeDifference = new Date().getTime() - new Date(user.tokenExpireDate).getTime()

    if (user.tokenExpireDate && timeDifference < RESET_PASSWORD_REQUEST_TIME_LIMIT) {
      throw new BadRequestException(ERROR_MESSAGES.passwordResetRequestTooFrequent)
    }

    const token = randomUUID()
    const tokenExpireDate = new Date(new Date().getTime() + RESET_PASSWORD_TOKEN_EXPIRE_TIME)

    await this.mailQueueService.sendResetPasswordMail({ email: user.email, token })

    await this.usersService.updateById(user.id, { token, tokenExpireDate })

    return SUCCESS_RESPONSE
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.getByToken(resetPasswordDto.token)

    if (!user) {
      throw new NotFoundException()
    }

    if (new Date() > user.tokenExpireDate) {
      throw new BadRequestException(ERROR_MESSAGES.passwordResetTokenExpired)
    }

    await this.usersService.updateById(user.id, {
      password: resetPasswordDto.password,
      token: null,
      tokenExpireDate: null
    })

    return SUCCESS_RESPONSE
  }

  // ******* ******* ******* *******

  async validateUser(email: string, pass: string): Promise<UserEntity> {
    const user = await this.usersService.getByEmail(email)
    if (!user || !HashService.compare(pass, user.password)) {
      throw new BadRequestException(ERROR_MESSAGES.invalidEmailPassword)
    }

    return user
  }
}
