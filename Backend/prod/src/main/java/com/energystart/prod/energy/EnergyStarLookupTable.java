package com.energystart.prod.energy;

import com.energystart.prod.energy.report_types.BankBranchReport;
import com.energystart.prod.energy.report_types.CourtHouseReport;
import com.energystart.prod.energy.report_types.FinancialOfficeReport;
import com.energystart.prod.energy.report_types.OfficeReport;

import java.util.List;
//All Scores derrived from here:
// https://www.energystar.gov/buildings/benchmark/understand-metrics/score-details
public class EnergyStarLookupTable {

    private static class Range {
        float min;
        float max;
        float score;
        Range (float min, float max, float score) {
            this.min = min;
            this.max = max;
            this.score = score;
        }
    }

    /**
     * Contains score values for:
     * Offices, Financial offices, Bank Branches, courthouses
     */
    private static final List<Range> CategoryAScore = List.of(
            new Range(0.0000f, 0.1932f, 1.00f),
            new Range(0.1932f, 0.2384f, 0.99f),
            new Range(0.2384f, 0.2708f, 0.98f),
            new Range(0.2708f, 0.2973f, 0.97f),
            new Range(0.2973f, 0.3202f, 0.96f),
            new Range(0.3202f, 0.3407f, 0.95f),
            new Range(0.3407f, 0.3595f, 0.94f),
            new Range(0.3595f, 0.3769f, 0.93f),
            new Range(0.3769f, 0.3929f, 0.92f),
            new Range(0.3929f, 0.4087f, 0.91f),
            new Range(0.4087f, 0.4234f, 0.90f),
            new Range(0.4234f, 0.4376f, 0.89f),
            new Range(0.4376f, 0.4516f, 0.88f),
            new Range(0.4516f, 0.4646f, 0.87f),
            new Range(0.4646f, 0.4774f, 0.86f),
            new Range(0.4774f, 0.4900f, 0.85f),
            new Range(0.4900f, 0.5022f, 0.84f),
            new Range(0.5022f, 0.5142f, 0.83f),
            new Range(0.5142f, 0.5260f, 0.82f),
            new Range(0.5260f, 0.5376f, 0.81f),
            new Range(0.5376f, 0.5490f, 0.80f),
            new Range(0.5490f, 0.5603f, 0.79f),
            new Range(0.5603f, 0.5714f, 0.78f),
            new Range(0.5714f, 0.5824f, 0.77f),
            new Range(0.5824f, 0.5933f, 0.76f),
            new Range(0.5933f, 0.6041f, 0.75f),
            new Range(0.6041f, 0.6148f, 0.74f),
            new Range(0.6148f, 0.6255f, 0.73f),
            new Range(0.6255f, 0.6361f, 0.72f),
            new Range(0.6361f, 0.6466f, 0.71f),
            new Range(0.6466f, 0.6571f, 0.70f),
            new Range(0.6571f, 0.6676f, 0.69f),
            new Range(0.6676f, 0.6780f, 0.68f),
            new Range(0.6780f, 0.6884f, 0.67f),
            new Range(0.6884f, 0.6989f, 0.66f),
            new Range(0.6989f, 0.7093f, 0.65f),
            new Range(0.7093f, 0.7197f, 0.64f),
            new Range(0.7197f, 0.7301f, 0.63f),
            new Range(0.7301f, 0.7406f, 0.62f),
            new Range(0.7406f, 0.7511f, 0.61f),
            new Range(0.7511f, 0.7616f, 0.60f),
            new Range(0.7616f, 0.7721f, 0.59f),
            new Range(0.7721f, 0.7827f, 0.58f),
            new Range(0.7827f, 0.7933f, 0.57f),
            new Range(0.7933f, 0.8040f, 0.56f),
            new Range(0.8040f, 0.8148f, 0.55f),
            new Range(0.8148f, 0.8256f, 0.54f),
            new Range(0.8256f, 0.8365f, 0.53f),
            new Range(0.8365f, 0.8475f, 0.52f),
            new Range(0.8475f, 0.8586f, 0.51f),

            new Range(0.8586f, 0.8697f, 0.50f),
            new Range(0.8697f, 0.8810f, 0.49f),
            new Range(0.8810f, 0.8924f, 0.48f),
            new Range(0.8924f, 0.9039f, 0.47f),
            new Range(0.9039f, 0.9155f, 0.46f),
            new Range(0.9155f, 0.9272f, 0.45f),
            new Range(0.9272f, 0.9390f, 0.44f),
            new Range(0.9390f, 0.9510f, 0.43f),
            new Range(0.9510f, 0.9631f, 0.42f),
            new Range(0.9631f, 0.9753f, 0.41f),
            new Range(0.9753f, 0.9876f, 0.40f),
            new Range(0.9876f, 1.0001f, 0.39f),
            new Range(1.0001f, 1.0127f, 0.38f),
            new Range(1.0127f, 1.0254f, 0.37f),
            new Range(1.0254f, 1.0383f, 0.36f),
            new Range(1.0383f, 1.0514f, 0.35f),
            new Range(1.0514f, 1.0647f, 0.34f),
            new Range(1.0647f, 1.0783f, 0.33f),
            new Range(1.0783f, 1.0920f, 0.32f),
            new Range(1.0920f, 1.1060f, 0.31f),
            new Range(1.1060f, 1.1202f, 0.30f),
            new Range(1.1282f, 1.1440f, 0.29f),
            new Range(1.1440f, 1.1601f, 0.28f),
            new Range(1.1601f, 1.1767f, 0.27f),
            new Range(1.1767f, 1.1939f, 0.26f),
            new Range(1.1939f, 1.2115f, 0.25f),
            new Range(1.2115f, 1.2297f, 0.24f),
            new Range(1.2297f, 1.2486f, 0.23f),
            new Range(1.2486f, 1.2681f, 0.22f),
            new Range(1.2681f, 1.2884f, 0.21f),
            new Range(1.2884f, 1.3096f, 0.20f),
            new Range(1.3096f, 1.3317f, 0.19f),
            new Range(1.3317f, 1.3548f, 0.18f),
            new Range(1.3548f, 1.3791f, 0.17f),
            new Range(1.3791f, 1.4047f, 0.16f),
            new Range(1.4047f, 1.4318f, 0.15f),
            new Range(1.4318f, 1.4606f, 0.14f),
            new Range(1.4606f, 1.4913f, 0.13f),
            new Range(1.4913f, 1.5241f, 0.12f),
            new Range(1.5241f, 1.5592f, 0.11f),
            new Range(1.5592f, 1.5994f, 0.10f),
            new Range(1.5994f, 1.6426f, 0.09f),
            new Range(1.6426f, 1.6910f, 0.08f),
            new Range(1.6910f, 1.7461f, 0.07f),
            new Range(1.7461f, 1.8104f, 0.06f),
            new Range(1.8104f, 1.8877f, 0.05f),
            new Range(1.8877f, 1.9855f, 0.04f),
            new Range(1.9855f, 2.1204f, 0.03f),
            new Range(2.1205f, 2.3444f, 0.02f),
            new Range(2.3444f, Float.MAX_VALUE, 0.01f)
    );


    /**
     *
     * @param EER The Energy Efficiency Ratio
     * @param report A type of energy report or child of
     * @return energy star score as a float
     */
    public static float getScore(float EER, EnergyReport report){
        float result = -1f;

        //CategoryA Test
        if(report instanceof BankBranchReport
                || report instanceof FinancialOfficeReport
                || report instanceof OfficeReport
                || report instanceof CourtHouseReport){
            for (Range r : CategoryAScore){
                if(EER >= r.min && EER < r.max){
                    result = r.score;
                }
            }
        }


        return result;
    }
}
