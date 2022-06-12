import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import SportService from 'src/models/sport/sport.service';

@ValidatorConstraint({ name: 'SportExists', async: true })
@Injectable()
export class SportsExistRule implements ValidatorConstraintInterface {
  constructor(private sportService: SportService) {}

  async validate(array: string[]) {
    try {
      const sports = (await this.sportService.findAll()).map((s) => s.code);
      return array.every((v) => sports.includes(v));
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return "One of the sport doesn't exists in database";
  }
}

export default function SportsExist() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'SportExists',
      target: object.constructor,
      propertyName: propertyName,
      options: undefined,
      validator: SportsExistRule
    });
  };
}
