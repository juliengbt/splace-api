import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import CityService from '../models/city/city.service';

@ValidatorConstraint({ name: 'CityExists', async: true })
@Injectable()
export class CitiesExistRule implements ValidatorConstraintInterface {
  constructor(private cityService: CityService) {}

  async validate(array: string[]) {
    try {
      for (const s of array) {
        const city = await this.cityService.findById(Buffer.from(s, 'base64url'));
        if (city == null) return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return "One of the city doesn't exists in database";
  }
}

export default function CitiesExist() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'SportExists',
      target: object.constructor,
      propertyName: propertyName,
      options: undefined,
      validator: CitiesExistRule
    });
  };
}
