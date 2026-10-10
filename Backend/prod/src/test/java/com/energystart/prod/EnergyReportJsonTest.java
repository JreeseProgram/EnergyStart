
package com.energystart.prod;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.report_types.OfficeReport;
import com.energystart.prod.energy.report_types.HotelReport;

import tools.jackson.databind.ObjectMapper;


import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EnergyReportJsonTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void testOfficeReportDeserialization() throws Exception {

        String json = """
            {
                "reportType": "OFFICE",
                "relatedPropertyID": "1",
                "grossFloorArea": 25000,
                "parkingSize": 5000,
                "yearOfConstruction": 2010,
                "numOfComputers": 150,
                "numOfWorkersMainShift": 75,
                "percentCooled": 90,
                "weeklyOperatingHours": 40
            }
            """;

        EnergyReport report =
                mapper.readValue(json, EnergyReport.class);

        assertInstanceOf(OfficeReport.class, report);

        OfficeReport office = (OfficeReport) report;

        assertEquals(25000, office.getGrossFloorArea());
        assertEquals(150, office.getNumOfComputers());
        assertEquals("1", office.getRelatedPropertyID());

        System.out.println("OfficeReport JSON test passed!");
    }


    @Test
    void testHotelReportDeserialization() throws Exception {

        String json = """
        {
            "reportType": "HOTEL",
            "relatedPropertyID": "2",
            "grossFloorArea": 50000,
            "parkingSize": 10000,
            "yearOfConstruction": 2015,
            "hasCookingFacilities": false,
            "numCommercialFreezer": 2,
            "numOfRooms": 100,
            "numOfWorkersMainShift": 25,
            "percentCooled": 90,
            "percentHeated": 80
        }
        """;

        EnergyReport report =
                mapper.readValue(json, EnergyReport.class);

        assertInstanceOf(HotelReport.class, report);

        HotelReport hotel = (HotelReport) report;

        assertEquals(50000, hotel.getGrossFloorArea());
        assertEquals("2", hotel.getRelatedPropertyID());
        assertFalse(hotel.isHasCookingFacilities());
        assertEquals(100, hotel.getNumOfRooms());

        System.out.println("HotelReport JSON test passed!");
    }


    @Test
    void testOfficeReportSerialization() throws Exception {

        OfficeReport office = new OfficeReport();

        office.setRelatedPropertyID("1");
        office.setGrossFloorArea(25000);
        office.setNumOfComputers(150);

        String json = mapper.writeValueAsString(office);

        assertTrue(json.contains("\"reportType\":\"OFFICE\""));
        assertTrue(json.contains("\"numOfComputers\":150"));

        System.out.println("OfficeReport serialization passed!");
    }
}
