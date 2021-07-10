import { Transform } from 'class-transformer';

export default function Default(defaultValue: any) {
  return Transform((value: any) => (value !== null && value !== undefined ? value : defaultValue));
}
