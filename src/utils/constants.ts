import Address from 'src/models/address/address.entity';
import Category from 'src/models/category/category.entity';
import City from 'src/models/city/city.entity';
import Department from 'src/models/department/department.entity';
import Equipment from 'src/models/equipment/entities/equipment.entity';
import EquipmentLevel from 'src/models/equipment/entities/level.entity';
import EquipmentNature from 'src/models/equipment/entities/nature.entity';
import EquipmentOwner from 'src/models/equipment/entities/owner.entity';
import EquipmentSurface from 'src/models/equipment/entities/surface.entity';
import EquipmentType from 'src/models/equipment/entities/type.entity';
import Picture from 'src/models/picture/picture.entity';
import Sport from 'src/models/sport/sport.entity';
import SportingComplex from 'src/models/sporting-complex/sporting-complex.entity';
import Token from 'src/models/token/token.entity';
import User from 'src/models/user/entities/user.entity';
import Zipcode from 'src/models/zipcode/zipcode.entity';

export const APP_ENTITIES = [
  Address,
  Category,
  City,
  Department,
  Equipment,
  EquipmentLevel,
  EquipmentNature,
  EquipmentType,
  SportingComplex,
  EquipmentOwner,
  Picture,
  EquipmentSurface,
  Sport,
  Token,
  User,
  Zipcode
];
