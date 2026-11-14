
package com.energystart.prod.dto.buildinguse;

import com.energystart.prod.dto.buildinguse.types.DataCenterBuildingUseDTO;
import com.energystart.prod.dto.buildinguse.types.WholesaleClubBuildingUseDTO;
import com.energystart.prod.dto.buildinguse.types.WorshipFacilityBuildingUseDTO;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BuildingUseDTOJsonTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldDeserializeDataCenterDTO() throws Exception {

        String json = """
                {
                    "buildingUseType": "DATA_CENTER",
                    "propertyId": "property-001",
                    "grossFloorArea": 75000,
                    "parkingSize": 5000,
                    "yearOfConstruction": 2018,
                    "annualITEnergy": 2500000
                }
                """;

        BuildingUseDTO dto =
                objectMapper.readValue(json, BuildingUseDTO.class);

        assertInstanceOf(DataCenterBuildingUseDTO.class, dto);

        DataCenterBuildingUseDTO dataCenter =
                (DataCenterBuildingUseDTO) dto;

        assertEquals(BuildingUseType.DATA_CENTER, dataCenter.buildingUseType());
        assertEquals("property-001", dataCenter.propertyId());
        assertEquals(2500000.0, dataCenter.annualITEnergy());
    }

    @Test
    void shouldDeserializeWholesaleClubDTO() throws Exception {

        String json = """
                {
                    "buildingUseType": "WHOLESALE_CLUB",
                    "propertyId": "property-002",
                    "grossFloorArea": 120000,
                    "parkingSize": 10000,
                    "yearOfConstruction": 2012,
                    "hasExteriorEntrance": true,
                    "isSingleStore": false,
                    "numOfFreezers": 12,
                    "numOfWorkersMainShift": 65,
                    "percentCooled": 80,
                    "percentHeated": 40,
                    "weeklyOperatingHours": 90
                }
                """;

        BuildingUseDTO dto =
                objectMapper.readValue(json, BuildingUseDTO.class);

        assertInstanceOf(WholesaleClubBuildingUseDTO.class, dto);

        WholesaleClubBuildingUseDTO wholesaleClub =
                (WholesaleClubBuildingUseDTO) dto;

        assertEquals(BuildingUseType.WHOLESALE_CLUB, wholesaleClub.buildingUseType());
        assertEquals(12, wholesaleClub.numOfFreezers());
        assertEquals(65, wholesaleClub.numOfWorkersMainShift());
    }

    @Test
    void shouldDeserializeWorshipFacilityDTO() throws Exception {

        String json = """
                {
                    "buildingUseType": "WORSHIP_FACILITY",
                    "propertyId": "property-003",
                    "grossFloorArea": 25000,
                    "parkingSize": 3000,
                    "yearOfConstruction": 2005,
                    "grossFloorAreaForFoodPrep": 1500,
                    "percentCooled": 75,
                    "percentHeated": 60,
                    "seatingCapacity": 450,
                    "weeklyOperatingHours": 45
                }
                """;

        BuildingUseDTO dto =
                objectMapper.readValue(json, BuildingUseDTO.class);

        assertInstanceOf(WorshipFacilityBuildingUseDTO.class, dto);

        WorshipFacilityBuildingUseDTO worshipFacility =
                (WorshipFacilityBuildingUseDTO) dto;

        assertEquals(BuildingUseType.WORSHIP_FACILITY, worshipFacility.buildingUseType());
        assertEquals(450, worshipFacility.seatingCapacity());
        assertEquals(45.0, worshipFacility.weeklyOperatingHours());
    }

    @Test
    void shouldRejectUnsupportedBuildingUseType() {

        String json = """
                {
                    "buildingUseType": "UNKNOWN_BUILDING"
                }
                """;

        assertThrows(
                tools.jackson.core.JacksonException.class,
                () -> objectMapper.readValue(json, BuildingUseDTO.class)
        );
    }
}
