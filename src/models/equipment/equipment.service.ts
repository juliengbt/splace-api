/* eslint-disable max-len */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EquipmentSearch from 'src/models/equipment/dto/equipment.search';
import Equipment from 'src/models/equipment/entities/equipment.entity';
import {
  And,
  DeepPartial,
  FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import SportingComplex from '../sporting-complex/sporting-complex.entity';
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

  async findUsingDTO(equipmentDTO: EquipmentSearch): Promise<Equipment[]> {
    const equipmentFindOptions: FindOptionsWhere<Equipment> = {};
    const sportingComplexFindOptions: FindOptionsWhere<SportingComplex> = {};

    // Sports
    if (equipmentDTO.sports && equipmentDTO.sports.length > 0) {
      equipmentFindOptions.sports = { code: In(equipmentDTO.sports) };
    }

    // Position
    if (equipmentDTO.gpsArea) {
      equipmentFindOptions.latitude = And(
        LessThanOrEqual(equipmentDTO.gpsArea.maxLatitude),
        MoreThanOrEqual(equipmentDTO.gpsArea.minLatitude)
      );
      equipmentFindOptions.longitude = And(
        LessThanOrEqual(equipmentDTO.gpsArea.maxLongitude),
        MoreThanOrEqual(equipmentDTO.gpsArea.minLongitude)
      );
    } else if (equipmentDTO.sportingComplex?.address?.city?.ids) {
      sportingComplexFindOptions.address = {
        zipcode: {
          city: {
            id: In(
              equipmentDTO.sportingComplex.address.city.ids.map((id) =>
                Buffer.from(id, 'base64url')
              )
            )
          }
        }
      };
    }

    // Distance
    /*   if (equipmentDTO.latitude && equipmentDTO.longitude) {
      query
        .addSelect(
          'get_distance(:lat,:lon,Equipment.latitude, Equipment.longitude)',
          'Equipment_distance'
        )
        .andWhere('Equipment.latitude is not null')
        .andWhere('Equipment.longitude is not null')
        .setParameters({
          lat: (equipmentDTO.latitude * Math.PI) / 180,
          lon: (equipmentDTO.longitude * Math.PI) / 180
        })
        .addOrderBy('Equipment_distance', 'ASC');
    }*/

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
    if (equipmentDTO.surface && equipmentDTO.surface.length > 0) {
      equipmentFindOptions.surface = { code: In(equipmentDTO.surface) };
    }
    if (equipmentDTO.owner && equipmentDTO.owner.length > 0) {
      equipmentFindOptions.owner = { code: In(equipmentDTO.owner) };
    }
    if (equipmentDTO.level && equipmentDTO.level.length > 0) {
      equipmentFindOptions.level = { code: In(equipmentDTO.level) };
    }
    if (equipmentDTO.nature && equipmentDTO.nature.length > 0) {
      equipmentFindOptions.surface = { code: In(equipmentDTO.nature) };
    }
    if (equipmentDTO.type && equipmentDTO.type.length > 0) {
      equipmentFindOptions.type = { code: In(equipmentDTO.type) };
    }

    /* // Keyword research
    if (equipmentDTO.name || equipmentDTO.sportingComplex?.name) {
      query.andWhere(
        new Brackets(() => {
          const equipmentClause = 'MATCH(Equipment.name) AGAINST (:e_name IN BOOLEAN MODE)';
          const sportingComplexClause =
            'MATCH(sportingComplex.name) AGAINST (:i_name IN BOOLEAN MODE)';

          const useClauses = [];

          if (equipmentDTO.name) {
            query.setParameter('e_name', '*' + equipmentDTO.name.join('*') + '*');
            useClauses.push(equipmentClause);
          }
          if (equipmentDTO.sportingComplex?.name) {
            query.setParameter('i_name', '*' + equipmentDTO.sportingComplex.name.join('*') + '*');

            useClauses.push(sportingComplexClause);
          }
          query
            .addSelect(`(${useClauses.join(' + ')})`, 'keyword_rank')
            .having('keyword_rank > 0')
            .addOrderBy('keyword_rank', 'DESC');
        })
      );
    }*/

    equipmentFindOptions.sportingComplex = sportingComplexFindOptions;
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
