package com.energystart.prod.energy;

import com.energystart.prod.energy.report_types.*;

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
            new Range(0.3769f, 0.3932f, 0.92f),
            new Range(0.3932f, 0.4087f, 0.91f),
            new Range(0.4087f, 0.4234f, 0.90f),
            new Range(0.4234f, 0.4376f, 0.89f),
            new Range(0.4376f, 0.4513f, 0.88f),
            new Range(0.4513f, 0.4646f, 0.87f),
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
            new Range(0.9155f, 0.9273f, 0.45f),
            new Range(0.9273f, 0.9392f, 0.44f),
            new Range(0.9392f, 0.9513f, 0.43f),
            new Range(0.9513f, 0.9636f, 0.42f),
            new Range(0.9636f, 0.9760f, 0.41f),
            new Range(0.9760f, 0.9886f, 0.40f),
            new Range(0.9886f, 1.0014f, 0.39f),
            new Range(1.0014f, 1.0144f, 0.38f),
            new Range(1.0144f, 1.0277f, 0.37f),
            new Range(1.0277f, 1.0411f, 0.36f),
            new Range(1.0411f, 1.0549f, 0.35f),
            new Range(1.0549f, 1.0689f, 0.34f),
            new Range(1.0689f, 1.0833f, 0.33f),
            new Range(1.0833f, 1.0979f, 0.32f),
            new Range(1.0979f, 1.1129f, 0.31f),
            new Range(1.1129f, 1.1282f, 0.30f),
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
            new Range(1.4913f, 1.5244f, 0.12f),
            new Range(1.5244f, 1.5602f, 0.11f),
            new Range(1.5602f, 1.5994f, 0.10f),
            new Range(1.5994f, 1.6426f, 0.09f),
            new Range(1.6426f, 1.6910f, 0.08f),
            new Range(1.6910f, 1.7461f, 0.07f),
            new Range(1.7461f, 1.8104f, 0.06f),
            new Range(1.8104f, 1.8877f, 0.05f),
            new Range(1.8877f, 1.9855f, 0.04f),
            new Range(1.9855f, 2.1205f, 0.03f),
            new Range(2.1205f, 2.3444f, 0.02f),
            new Range(2.3444f, Float.MAX_VALUE, 0.01f)

    );

    /**
     * Category B Contains:
     * Convenience Store
     */
    private static final List<Range> CategoryBScore = List.of(
            new Range(0.0000f, 0.6225f, 1.00f),
            new Range(0.6225f, 0.6588f, 0.99f),
            new Range(0.6588f, 0.6826f, 0.98f),
            new Range(0.6826f, 0.7008f, 0.97f),
            new Range(0.7008f, 0.7159f, 0.96f),
            new Range(0.7159f, 0.7289f, 0.95f),
            new Range(0.7289f, 0.7405f, 0.94f),
            new Range(0.7405f, 0.7509f, 0.93f),
            new Range(0.7509f, 0.7605f, 0.92f),
            new Range(0.7605f, 0.7694f, 0.91f),
            new Range(0.7694f, 0.7778f, 0.90f),
            new Range(0.7778f, 0.7856f, 0.89f),
            new Range(0.7856f, 0.7931f, 0.88f),
            new Range(0.7931f, 0.8002f, 0.87f),
            new Range(0.8002f, 0.8070f, 0.86f),
            new Range(0.8070f, 0.8136f, 0.85f),
            new Range(0.8136f, 0.8199f, 0.84f),
            new Range(0.8199f, 0.8260f, 0.83f),
            new Range(0.8260f, 0.8320f, 0.82f),
            new Range(0.8320f, 0.8378f, 0.81f),
            new Range(0.8378f, 0.8434f, 0.80f),
            new Range(0.8434f, 0.8489f, 0.79f),
            new Range(0.8489f, 0.8543f, 0.78f),
            new Range(0.8543f, 0.8596f, 0.77f),
            new Range(0.8596f, 0.8648f, 0.76f),
            new Range(0.8648f, 0.8699f, 0.75f),
            new Range(0.8699f, 0.8749f, 0.74f),
            new Range(0.8749f, 0.8798f, 0.73f),
            new Range(0.8798f, 0.8847f, 0.72f),
            new Range(0.8847f, 0.8895f, 0.71f),
            new Range(0.8895f, 0.8943f, 0.70f),
            new Range(0.8943f, 0.8990f, 0.69f),
            new Range(0.8990f, 0.9037f, 0.68f),
            new Range(0.9037f, 0.9083f, 0.67f),
            new Range(0.9083f, 0.9129f, 0.66f),
            new Range(0.9129f, 0.9174f, 0.65f),
            new Range(0.9174f, 0.9220f, 0.64f),
            new Range(0.9220f, 0.9265f, 0.63f),
            new Range(0.9265f, 0.9310f, 0.62f),
            new Range(0.9310f, 0.9354f, 0.61f),
            new Range(0.9354f, 0.9399f, 0.60f),
            new Range(0.9399f, 0.9443f, 0.59f),
            new Range(0.9443f, 0.9487f, 0.58f),
            new Range(0.9487f, 0.9532f, 0.57f),
            new Range(0.9532f, 0.9576f, 0.56f),
            new Range(0.9576f, 0.9620f, 0.55f),
            new Range(0.9620f, 0.9664f, 0.54f),
            new Range(0.9664f, 0.9709f, 0.53f),
            new Range(0.9709f, 0.9753f, 0.52f),
            new Range(0.9753f, 0.9797f, 0.51f),

            new Range(0.9797f, 0.9842f, 0.50f),
            new Range(0.9842f, 0.9887f, 0.49f),
            new Range(0.9887f, 0.9932f, 0.48f),
            new Range(0.9932f, 0.9977f, 0.47f),
            new Range(0.9977f, 1.0022f, 0.46f),
            new Range(1.0022f, 1.0068f, 0.45f),
            new Range(1.0068f, 1.0114f, 0.44f),
            new Range(1.0114f, 1.0160f, 0.43f),
            new Range(1.0160f, 1.0207f, 0.42f),
            new Range(1.0207f, 1.0254f, 0.41f),
            new Range(1.0254f, 1.0302f, 0.40f),
            new Range(1.0302f, 1.0350f, 0.39f),
            new Range(1.0350f, 1.0399f, 0.38f),
            new Range(1.0399f, 1.0448f, 0.37f),
            new Range(1.0448f, 1.0498f, 0.36f),
            new Range(1.0498f, 1.0548f, 0.35f),
            new Range(1.0548f, 1.0600f, 0.34f),
            new Range(1.0600f, 1.0652f, 0.33f),
            new Range(1.0652f, 1.0705f, 0.32f),
            new Range(1.0705f, 1.0758f, 0.31f),
            new Range(1.0758f, 1.0813f, 0.30f),
            new Range(1.0813f, 1.0869f, 0.29f),
            new Range(1.0869f, 1.0926f, 0.28f),
            new Range(1.0926f, 1.0985f, 0.27f),
            new Range(1.0985f, 1.1045f, 0.26f),
            new Range(1.1045f, 1.1106f, 0.25f),
            new Range(1.1106f, 1.1169f, 0.24f),
            new Range(1.1169f, 1.1233f, 0.23f),
            new Range(1.1233f, 1.1300f, 0.22f),
            new Range(1.1300f, 1.1369f, 0.21f),
            new Range(1.1369f, 1.1440f, 0.20f),
            new Range(1.1440f, 1.1514f, 0.19f),
            new Range(1.1514f, 1.1591f, 0.18f),
            new Range(1.1591f, 1.1671f, 0.17f),
            new Range(1.1671f, 1.1755f, 0.16f),
            new Range(1.1755f, 1.1843f, 0.15f),
            new Range(1.1843f, 1.1936f, 0.14f),
            new Range(1.1936f, 1.2035f, 0.13f),
            new Range(1.2035f, 1.2140f, 0.12f),
            new Range(1.2140f, 1.2253f, 0.11f),
            new Range(1.2253f, 1.2375f, 0.10f),
            new Range(1.2375f, 1.2509f, 0.09f),
            new Range(1.2509f, 1.2657f, 0.08f),
            new Range(1.2657f, 1.2824f, 0.07f),
            new Range(1.2824f, 1.3016f, 0.06f),
            new Range(1.3016f, 1.3244f, 0.05f),
            new Range(1.3244f, 1.3528f, 0.04f),
            new Range(1.3528f, 1.3911f, 0.03f),
            new Range(1.3911f, 1.4529f, 0.02f),
            new Range(1.4529f, Float.MAX_VALUE, 0.01f)

    );

    /**
     * Holds the score of Category C, including:
     * Data Centers
     */
    private static final List<Range> CategoryCScore = List.of(
            new Range(0.0000f, 0.6569f, 1.00f),
            new Range(0.6569f, 0.6879f, 0.99f),
            new Range(0.6879f, 0.7082f, 0.98f),
            new Range(0.7082f, 0.7236f, 0.97f),
            new Range(0.7236f, 0.7364f, 0.96f),
            new Range(0.7364f, 0.7474f, 0.95f),
            new Range(0.7474f, 0.7571f, 0.94f),
            new Range(0.7571f, 0.7659f, 0.93f),
            new Range(0.7659f, 0.7739f, 0.92f),
            new Range(0.7739f, 0.7814f, 0.91f),
            new Range(0.7814f, 0.7883f, 0.90f),
            new Range(0.7883f, 0.7949f, 0.89f),
            new Range(0.7949f, 0.8011f, 0.88f),
            new Range(0.8011f, 0.8071f, 0.87f),
            new Range(0.8071f, 0.8127f, 0.86f),
            new Range(0.8127f, 0.8182f, 0.85f),
            new Range(0.8182f, 0.8235f, 0.84f),
            new Range(0.8235f, 0.8285f, 0.83f),
            new Range(0.8285f, 0.8335f, 0.82f),
            new Range(0.8335f, 0.8383f, 0.81f),
            new Range(0.8383f, 0.8429f, 0.80f),
            new Range(0.8429f, 0.8475f, 0.79f),
            new Range(0.8475f, 0.8520f, 0.78f),
            new Range(0.8520f, 0.8563f, 0.77f),
            new Range(0.8563f, 0.8606f, 0.76f),
            new Range(0.8606f, 0.8648f, 0.75f),
            new Range(0.8648f, 0.8689f, 0.74f),
            new Range(0.8689f, 0.8730f, 0.73f),
            new Range(0.8730f, 0.8770f, 0.72f),
            new Range(0.8770f, 0.8810f, 0.71f),
            new Range(0.8810f, 0.8849f, 0.70f),
            new Range(0.8849f, 0.8888f, 0.69f),
            new Range(0.8888f, 0.8926f, 0.68f),
            new Range(0.8926f, 0.8964f, 0.67f),
            new Range(0.8964f, 0.9002f, 0.66f),
            new Range(0.9002f, 0.9039f, 0.65f),
            new Range(0.9039f, 0.9076f, 0.64f),
            new Range(0.9076f, 0.9113f, 0.63f),
            new Range(0.9113f, 0.9150f, 0.62f),
            new Range(0.9150f, 0.9186f, 0.61f),
            new Range(0.9186f, 0.9223f, 0.60f),
            new Range(0.9223f, 0.9259f, 0.59f),
            new Range(0.9259f, 0.9295f, 0.58f),
            new Range(0.9295f, 0.9331f, 0.57f),
            new Range(0.9331f, 0.9367f, 0.56f),
            new Range(0.9367f, 0.9403f, 0.55f),
            new Range(0.9403f, 0.9439f, 0.54f),
            new Range(0.9439f, 0.9475f, 0.53f),
            new Range(0.9475f, 0.9512f, 0.52f),
            new Range(0.9512f, 0.9548f, 0.51f),

            new Range(0.9548f, 0.9584f, 0.50f),
            new Range(0.9584f, 0.9620f, 0.49f),
            new Range(0.9620f, 0.9657f, 0.48f),
            new Range(0.9657f, 0.9694f, 0.47f),
            new Range(0.9694f, 0.9731f, 0.46f),
            new Range(0.9731f, 0.9768f, 0.45f),
            new Range(0.9768f, 0.9805f, 0.44f),
            new Range(0.9805f, 0.9843f, 0.43f),
            new Range(0.9843f, 0.9880f, 0.42f),
            new Range(0.9880f, 0.9919f, 0.41f),
            new Range(0.9919f, 0.9957f, 0.40f),
            new Range(0.9957f, 0.9996f, 0.39f),
            new Range(0.9996f, 1.0035f, 0.38f),
            new Range(1.0035f, 1.0075f, 0.37f),
            new Range(1.0075f, 1.0115f, 0.36f),
            new Range(1.0115f, 1.0156f, 0.35f),
            new Range(1.0156f, 1.0198f, 0.34f),
            new Range(1.0198f, 1.0240f, 0.33f),
            new Range(1.0240f, 1.0282f, 0.32f),
            new Range(1.0282f, 1.0326f, 0.31f),
            new Range(1.0326f, 1.0370f, 0.30f),
            new Range(1.0370f, 1.0415f, 0.29f),
            new Range(1.0415f, 1.0461f, 0.28f),
            new Range(1.0461f, 1.0508f, 0.27f),
            new Range(1.0508f, 1.0556f, 0.26f),
            new Range(1.0556f, 1.0605f, 0.25f),
            new Range(1.0605f, 1.0656f, 0.24f),
            new Range(1.0656f, 1.0708f, 0.23f),
            new Range(1.0708f, 1.0761f, 0.22f),
            new Range(1.0761f, 1.0816f, 0.21f),
            new Range(1.0816f, 1.0873f, 0.20f),
            new Range(1.0873f, 1.0932f, 0.19f),
            new Range(1.0932f, 1.0994f, 0.18f),
            new Range(1.0994f, 1.1058f, 0.17f),
            new Range(1.1058f, 1.1125f, 0.16f),
            new Range(1.1125f, 1.1195f, 0.15f),
            new Range(1.1195f, 1.1269f, 0.14f),
            new Range(1.1269f, 1.1348f, 0.13f),
            new Range(1.1348f, 1.1432f, 0.12f),
            new Range(1.1432f, 1.1521f, 0.11f),
            new Range(1.1521f, 1.1619f, 0.10f),
            new Range(1.1619f, 1.1725f, 0.09f),
            new Range(1.1725f, 1.1842f, 0.08f),
            new Range(1.1842f, 1.1974f, 0.07f),
            new Range(1.1974f, 1.2126f, 0.06f),
            new Range(1.2126f, 1.2306f, 0.05f),
            new Range(1.2306f, 1.2530f, 0.04f),
            new Range(1.2530f, 1.2831f, 0.03f),
            new Range(1.2831f, 1.3315f, 0.02f),
            new Range(1.3315f, Float.MAX_VALUE, 0.01f)
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
        //CategoryB Test
        else if(report instanceof ConvenienceStoreReport){
            for (Range r : CategoryBScore){
                if(EER >= r.min && EER < r.max){
                    result = r.score;
                }
            }
        }
        //CategoryC Test
        else if(report instanceof DataCenterReport){
            for (Range r : CategoryCScore){
                if(EER >= r.min && EER < r.max){
                    result = r.score;
                }
            }
        }


        return result;
    }
}
