export class Scan
{
    public id?: number;
    public user_id?: string;
    public detector_id: number;
    public result : string;
    public rating: boolean | null;
    public date: string;

    constructor(detector_id: number, result: string, rating: boolean | null, date: string)
    {
        this.detector_id = detector_id;
        this.result = result;
        this.rating = rating;
        this.date = date;
    }
}