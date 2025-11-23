import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDobConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, _args: ValidationArguments) {
    if (!value) return false;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;

    const min = new Date('1900-01-01');
    const max = new Date();

    return date >= min && date <= max;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'dob must be between 1900-01-01 and today';
  }
}

export function IsValidDob(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDobConstraint,
    });
  };
}
