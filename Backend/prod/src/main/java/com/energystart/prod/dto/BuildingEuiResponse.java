package com.energystart.prod.dto;

// Units for totals: kBtu. Units for EUI: kBtu per square foot per year.
public record BuildingEuiResponse(String buildingId, int year, double totalSiteKbtu,
                                  double siteEui, double totalSourceKbtu, double sourceEui,
                                  int readingsIncluded, int monthsCovered, String status) {}
