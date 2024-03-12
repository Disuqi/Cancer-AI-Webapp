export class Scan
{
    public id?: number;
    public user_id?: string;
    public detector_id: number;
    public result : string;
    public rating: boolean | null;

    constructor(detector_id: number, result: string, rating: boolean | null)
    {
        this.detector_id = detector_id;
        this.result = result;
        this.rating = rating;
    }
}