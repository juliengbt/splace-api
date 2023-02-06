/* eslint-disable max-len */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNotEmptyObject } from 'class-validator';
import EquipmentSearch from 'src/models/equipment/dto/equipment.search';
import Equipment from 'src/models/equipment/entities/equipment.entity';
import { isNotEmptyArray } from 'src/utils/functions';
import {
  And,
  DeepPartial,
  FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Raw,
  Repository
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import SportingComplex from '../sporting-complex/sporting-complex.entity';
import GPSAreaSearch from './dto/gpsArea.search';
import EquipmentLevel from './entities/level.entity';
import EquipmentNature from './entities/nature.entity';
import EquipmentOwner from './entities/owner.entity';
import EquipmentSurface from './entities/surface.entity';
import EquipmentType from './entities/type.entity';

const BooleanOrNull = (b: boolean | undefined | null) => (b === null ? IsNull() : b);

@Injectable()
export default class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private repo: Repository<Equipment>,
    @InjectRepository(EquipmentOwner)
    private ownerRepo: Repository<EquipmentOwner>,
    @InjectRepository(EquipmentType)
    private typeRepo: Repository<EquipmentType>,
    @InjectRepository(EquipmentLevel)
    private levelRepo: Repository<EquipmentLevel>,
    @InjectRepository(EquipmentSurface)
    private surfaceRepo: Repository<EquipmentSurface>,
    @InjectRepository(EquipmentNature)
    private natureRepo: Repository<EquipmentNature>
  ) {}

  async findUsingDTO(equipmentDTO: EquipmentSearch, gpsArea?: GPSAreaSearch): Promise<Equipment[]> {
    const equipmentFindOptions: FindOptionsWhere<Equipment> = {};
    const sportingComplexFindOptions: FindOptionsWhere<SportingComplex> = {};
    let orSportingComplexFindOptions: FindOptionsWhere<SportingComplex> | undefined;

    // Sports
    if (isNotEmptyArray(equipmentDTO.sports)) {
      equipmentFindOptions.sports = { code: In(equipmentDTO.sports) };
    }

    // Position
    if (gpsArea) {
      equipmentFindOptions.latitude = And(
        LessThanOrEqual(gpsArea.maxLatitude),
        MoreThanOrEqual(gpsArea.minLatitude)
      );
      equipmentFindOptions.longitude = And(
        LessThanOrEqual(gpsArea.maxLongitude),
        MoreThanOrEqual(gpsArea.minLongitude)
      );
    } else if (equipmentDTO.sportingComplex?.address?.city?.ids) {
      sportingComplexFindOptions.address = {
        zipcode: {
          city: {
            id: In(equipmentDTO.sportingComplex.address.city.ids)
          }
        }
      };
    }

    // Boolean parameters
    equipmentFindOptions.openAccess = BooleanOrNull(equipmentDTO.openAccess);
    equipmentFindOptions.lighting = BooleanOrNull(equipmentDTO.lighting);
    equipmentFindOptions.locker = BooleanOrNull(equipmentDTO.locker);
    equipmentFindOptions.shower = BooleanOrNull(equipmentDTO.shower);
    sportingComplexFindOptions.carPark = BooleanOrNull(equipmentDTO.sportingComplex?.carPark);
    sportingComplexFindOptions.disabledAccess = BooleanOrNull(
      equipmentDTO.sportingComplex?.disabledAccess
    );

    // List parameters
    if (isNotEmptyArray(equipmentDTO.surface)) {
      equipmentFindOptions.surface = { code: In(equipmentDTO.surface) };
    }
    if (isNotEmptyArray(equipmentDTO.owner)) {
      equipmentFindOptions.owner = { code: In(equipmentDTO.owner) };
    }
    if (isNotEmptyArray(equipmentDTO.level)) {
      equipmentFindOptions.level = { code: In(equipmentDTO.level) };
    }
    if (isNotEmptyArray(equipmentDTO.nature)) {
      equipmentFindOptions.surface = { code: In(equipmentDTO.nature) };
    }
    if (isNotEmptyArray(equipmentDTO.type)) {
      equipmentFindOptions.type = { code: In(equipmentDTO.type) };
    }

    // Keyword research
    if (isNotEmptyArray(equipmentDTO.name)) {
      orSportingComplexFindOptions = sportingComplexFindOptions;

      orSportingComplexFindOptions.name = Raw(
        (alias) => `(MATCH(${alias}) AGAINST (:i_name IN BOOLEAN MODE))`,
        { i_name: equipmentDTO.name.join('*') + '*' }
      );
      equipmentFindOptions.name = Raw(
        (alias) => `(MATCH(${alias}) AGAINST (:e_name IN BOOLEAN MODE))`,
        { e_name: equipmentDTO.name.join('*') + '*' }
      );
      // TODO: Add order by match
    }

    if (isNotEmptyObject(sportingComplexFindOptions) && orSportingComplexFindOptions)
      equipmentFindOptions.sportingComplex = [
        sportingComplexFindOptions,
        orSportingComplexFindOptions
      ];
    else if (isNotEmptyObject(sportingComplexFindOptions))
      equipmentFindOptions.sportingComplex = sportingComplexFindOptions;
    else {
      equipmentFindOptions.sportingComplex = orSportingComplexFindOptions;
    }

    console.log(equipmentFindOptions);
    return this.repo.find({ where: equipmentFindOptions, take: 50 });
  }

  async findById(id: string): Promise<Equipment> {
    const equipment = await this.repo.findOneBy({ id: id });
    if (!equipment) throw new NotFoundException();
    return equipment;
  }

  async loadById(id: string): Promise<Equipment> {
    const equipment = await this.repo.findOne({
      where: { id: id },
      relations: {
        sportingComplex: {
          address: {
            zipcode: {
              city: {
                department: true
              }
            }
          }
        },
        sports: true,
        pictures: true
      }
    });
    if (!equipment) throw new NotFoundException();
    return equipment;
  }

  async loadSavedEquipments(userId: string): Promise<Equipment[]> {
    return this.repo.find({
      where: {
        savedByUsers: { id: userId }
      },
      relations: {
        sportingComplex: {
          address: {
            zipcode: {
              city: {
                department: true
              }
            }
          }
        },
        sports: true,
        pictures: true
      }
    });
  }

  async getOwners() {
    return this.ownerRepo.find();
  }

  async getSurfaces() {
    return this.surfaceRepo.find();
  }

  async getTypes() {
    return this.typeRepo.find();
  }

  async getNatures() {
    return this.natureRepo.find();
  }

  async getLevels() {
    return this.levelRepo.find();
  }

  async insert(equipment: Equipment): Promise<Partial<Equipment>> {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into(Equipment)
      .values(equipment as QueryDeepPartialEntity<Equipment>)
      .execute()
      .then((res) => res.identifiers[0]);
  }

  async update(equipment: DeepPartial<Equipment>): Promise<Equipment> {
    const res = await this.repo.save(equipment);
    return this.findById(res.id).then((e) => {
      if (!e) throw new InternalServerErrorException();
      return e;
    });
  }
  /*
  private getFullObjectQuery(): SelectQueryBuilder<Equipment> {
    return this.repo
      .createQueryBuilder('Equipment')
      .leftJoinAndMapOne(
        'Equipment.sportingComplex',
        'Equipment.sportingComplex',
        'sportingComplex'
      )
      .leftJoinAndMapOne('sportingComplex.address', 'sportingComplex.address', 'address')
      .leftJoinAndMapOne('address.zipcode', 'address.zipcode', 'zipcode')
      .leftJoinAndMapOne('zipcode.city', 'zipcode.city', 'city')
      .leftJoinAndMapOne('city.department', 'city.department', 'department')
      .leftJoinAndMapOne('Equipment.owner', 'Equipment.owner', 'owner')
      .leftJoinAndMapOne('Equipment.soil_type', 'Equipment.soil_type', 'soil_type')
      .leftJoinAndMapOne(
        'Equipment.equipment_nature',
        'Equipment.equipment_nature',
        'equipment_nature'
      )
      .leftJoinAndMapOne('Equipment.equipment_type', 'Equipment.equipment_type', 'equipment_type')
      .leftJoinAndMapOne(
        'Equipment.equipment_level',
        'Equipment.equipment_level',
        'equipment_level'
      )
      .leftJoinAndMapMany('Equipment.sports', 'Equipment.sports', 'sports')
      .leftJoinAndMapOne('sports.category', 'sports.category', 'category')
      .leftJoinAndMapMany('Equipment.pictures', 'Equipment.pictures', 'pictures');
  }*/
}
