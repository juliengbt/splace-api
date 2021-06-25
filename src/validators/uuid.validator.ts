/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { isUUID } from 'src/pipes/parse-uuid.pipe';

@ValidatorConstraint({ name: 'isCustomUUID', async: false })
export class CustomUUIDConstraint implements ValidatorConstraintInterface {
  public validate(value: string | Buffer, _args: ValidationArguments) {
    if (value instanceof Buffer) {
      return isUUID(value.toString('hex'));
    }
    return typeof value === 'string' && isUUID(value);
  }

  public defaultMessage(_args: ValidationArguments) { // Set the default error message here
    return '$property must be a uuid';
  }
}

export default function IsCustomUUID(options?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (o: object, propertyName: string) => {
    registerDecorator({
      target: o.constructor,
      name: 'isCustomUUID',
      propertyName,
      options,
      validator: CustomUUIDConstraint
    });
  };
}
