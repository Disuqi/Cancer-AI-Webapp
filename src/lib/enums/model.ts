export enum Model
{
    LungAndColonCancer = "DunnBC22/vit-base-patch16-224-in21k_lung_and_colon_cancer",
    SkinCancer = "Anwarkh1/Skin_Cancer-Image_Classification"
}

export const ModelLabels : Map<Model, {}> = new Map(
    [
        [
            Model.LungAndColonCancer ,
            {
                "lung_aca": "Lung Adenocarcinoma",
                "lung_scc": "Lung Squamous Cell Carcinoma",
                "lung_n": "Lung Neuroendocrine Tumor",
                "colon_n": "Colon Neuroendocrine Tumor",
                "colon_aca": "Colon Adenocarcinoma"
            }
        ],
        [
            Model.SkinCancer,
            {
                "basal_cell_carcinoma": "Basal Cell Carcinoma",
                "vascular_lesions": "Vascular Lesions",
                "benign_keratosis-like_lesions": "Benign Keratosis-like Lesions",
                "melanocytic_Nevi": "Melanocytic Nevi",
                "actinic_keratoses": "Actinic Keratoses"
            }
        ]
    ]);