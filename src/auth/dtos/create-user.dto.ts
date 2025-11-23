import { IsDate, IsEnum, IsString, IsUrl, Length } from 'class-validator';
import { IsValidDob } from '../validators/isValidDob';

export enum Gender {
  male = 'male',
  female = 'female',
}

export class CreateUserDto {
  // for the user service
  @IsString()
  @Length(3, 50)
  firstName: string;

  @IsString()
  @Length(3, 50)
  lastName: string;

  @IsDate()
  @IsValidDob()
  dob: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @Length(10, 15)
  phone: string;

  @IsString()
  @Length(5, 100)
  address: string;

  @IsString()
  @Length(3, 50)
  city: string;

  @IsString()
  @Length(3, 50)
  state: string;

  @IsString()
  @Length(5, 10)
  zip: string;

  @IsString()
  @Length(3, 50)
  country: string;

  @IsUrl()
  @Length(2, 200)
  avatar: string;
}
