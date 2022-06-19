import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import EquipmentLevelService from 'src/models/equipmentLevel/equipmentLevel.service';
import EquipmentNatureService from 'src/models/equipmentNature/equipmentNature.service';
import EquipmentTypeService from 'src/models/equipmentType/equipmentType.service';
import OwnerService from 'src/models/owner/owner.service';
import SoilTypeService from 'src/models/soilType/soilType.service';
import SportService from 'src/models/sport/sport.service';
import { FirstLoadData } from 'src/_main/dto/firstLoadData';

@ApiTags('Main')
@Controller('_main')
export class MainController {
  constructor(
    private readonly enService: EquipmentNatureService,
    private readonly elService: EquipmentLevelService,
    private readonly etService: EquipmentTypeService,
    private readonly ownerService: OwnerService,
    private readonly stService: SoilTypeService,
    private readonly sportService: SportService
  ) {}

  @Public()
  @ApiOkResponse({ type: FirstLoadData })
  @Get()
  async getFirstLoadData(): Promise<FirstLoadData> {
    const data: FirstLoadData = {
      equipmentLevels: await this.elService.findAll(),
      equipmentNatures: await this.enService.findAll(),
      equipmentTypes: await this.etService.findAll(),
      owners: await this.ownerService.findAll(),
      soilTypes: await this.stService.findAll(),
      sports: await this.sportService.findAll()
    };
    return data;
  }
}
