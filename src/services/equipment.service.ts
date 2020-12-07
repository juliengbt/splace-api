/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EquipmentDTO from 'src/dto/equipment.dto';
import Equipment from 'src/entities/equipment.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export default class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private repo: Repository<Equipment>
  ) {}

  async findUsingDTO(equipmentDTO: EquipmentDTO): Promise<Equipment[]> {
    const query = this.getFullObjectQuery();
    // Sports
    if (equipmentDTO.sports && equipmentDTO.sports.length > 0) {
      query.where('Equipment_sports.code_sport IN (:...sports_code)')
        .setParameters({ sports_code: equipmentDTO.sports.map((s) => s.code).filter((s) => s) });
    }
    // Position

    if (equipmentDTO.gps_area) {
      query.andWhere('Equipment.latitude is not null')
        .andWhere('Equipment.longitude is not null');

      query.andWhere('Equipment.latitude <= :max_lat', { max_lat: equipmentDTO.gps_area.max_lat })
        .andWhere('Equipment.latitude >= :min_lat', { min_lat: equipmentDTO.gps_area.min_lat })
        .andWhere('Equipment.longitude <= :max_lon', { max_lon: equipmentDTO.gps_area.max_lon })
        .andWhere('Equipment.longitude >= :min_lon', { min_lon: equipmentDTO.gps_area.min_lon });
      query.andWhere(new Brackets(() => { }));

      if (equipmentDTO.gps_area.previous_area) {
        query.andWhere(new Brackets((qb) => {
          qb.where('Equipment.latitude > :prev_max_lat', { max_lat: equipmentDTO.gps_area?.previous_area?.max_lat })
            .andWhere('Equipment.latitude < :prev_min_lat', { min_lat: equipmentDTO.gps_area?.previous_area?.min_lat })
            .andWhere('Equipment.longitude > :prev_max_lon', { max_lon: equipmentDTO.gps_area?.previous_area?.max_lon })
            .andWhere('Equipment.longitude < :prev_min_lon', { min_lon: equipmentDTO.gps_area?.previous_area?.min_lon });
        }));
      }
    } else if (equipmentDTO.installation?.city?.id) query.andWhere('installation.city.id is :id_city', { id_city: equipmentDTO.installation?.city?.id });

    if (equipmentDTO.open_access) query.andWhere('Equipment.open_access is :open_acess', { open_access: equipmentDTO.open_access });
    if (equipmentDTO.lighting) query.andWhere('Equipment.lighting is :lighting', { lighting: equipmentDTO.lighting });
    if (equipmentDTO.locker) query.andWhere('Equipment.locker is :locker', { locker: equipmentDTO.locker });
    if (equipmentDTO.shower) query.andWhere('Equipment.shower is :shower', { shower: equipmentDTO.shower });
    if (equipmentDTO.installation?.car_park) query.andWhere('installation.car_park is :car_park', { car_park: equipmentDTO.installation.car_park });
    if (equipmentDTO.installation?.disabled_access) query.andWhere('installation.disabled_access is :disabled_access', { disabled_access: equipmentDTO.installation.disabled_access });

    if (equipmentDTO.soil_type && equipmentDTO.soil_type.length > 0) {
      query.andWhere('soil_type.code in (:...soil_types)',
        { soil_types: equipmentDTO.soil_type.filter((s) => s.code !== undefined).map((s) => s.code) });
    }
    if (equipmentDTO.owner && equipmentDTO.owner.length > 0) {
      query.andWhere('owner.code in (:...owners)',
        { owners: equipmentDTO.owner.filter((s) => s.code !== undefined).map((s) => s.code) });
    }
    if (equipmentDTO.equipment_level && equipmentDTO.equipment_level.length > 0) {
      query.andWhere('equipment_level.code in (:...equipment_levels)',
        { equipment_levels: equipmentDTO.equipment_level.filter((s) => s.code !== undefined).map((s) => s.code) });
    }
    if (equipmentDTO.equipment_nature && equipmentDTO.equipment_nature.length > 0) {
      query.andWhere('equipment_nature.code in (:...equipment_natures)',
        { equipment_natures: equipmentDTO.equipment_nature.filter((s) => s.code !== undefined).map((s) => s.code) });
    }
    if (equipmentDTO.equipment_type && equipmentDTO.equipment_type.length > 0) {
      query.andWhere('equipment_type.code in (:...equipment_types)',
        { equipment_types: equipmentDTO.equipment_type.filter((s) => s.code !== undefined).map((s) => s.code) });
    }

    if (equipmentDTO.name || equipmentDTO.installation?.name) {
      if (equipmentDTO.name && equipmentDTO.installation?.name) {
        query.andWhere(new Brackets((builder) => {
          builder.where('lower(installation.name) like :i_name', { i_name: `%${equipmentDTO.installation?.name?.toLowerCase()}%` })
            .orWhere('lower(Equipment.name) like :e_name', { e_name: `%${equipmentDTO.name?.toLowerCase()}%` });
        }));
      } else if (equipmentDTO.name) {
        query.andWhere('lower(Equipment.name) like :e_name', { e_name: `%${equipmentDTO.name?.toLowerCase()}%` });
      } else {
        query.andWhere('lower(installation.name) like :i_name', { i_name: `%${equipmentDTO.installation?.name?.toLowerCase()}%` });
      }
    }

    return query.getMany();
  }

  async findById(id: string): Promise<Equipment | undefined> {
    return this.getFullObjectQuery()
      .where('Equipment.id = UUID_TO_BIN(:id_equipment)')
      .setParameters({ id_equipment: id })
      .getOne();
  }

  private getFullObjectQuery(): SelectQueryBuilder<Equipment> {
    return this.repo.createQueryBuilder('Equipment')
      .leftJoinAndSelect('Equipment.installation', 'installation')
      .leftJoinAndSelect('installation.address', 'address')
      .leftJoinAndSelect('installation.city', 'city')
      .leftJoinAndSelect('city.department', 'department')
      .leftJoinAndSelect('Equipment.owner', 'owner')
      .leftJoinAndSelect('Equipment.soil_type', 'soil_type')
      .leftJoinAndSelect('Equipment.equipment_nature', 'equipment_nature')
      .leftJoinAndSelect('Equipment.equipment_type', 'equipment_type')
      .leftJoinAndSelect('Equipment.equipment_level', 'equipment_level')
      .leftJoinAndSelect('Equipment.sports', 'sports')
      .leftJoinAndSelect('sports.category', 'category')
      .leftJoinAndSelect('Equipment.pictures', 'pictures');
  }
}
