export class Detector
{
    public readonly id: number;
    public readonly title: string;
    public readonly description: string;
    public readonly page_href: string;
    public uses: number;

    constructor(id: number, title: string, description: string, page_href: string, uses: number)
    {
        this.id = id;
        this.title = title;
        this.description = description;
        this.page_href = page_href;
        this.uses = uses;
    }
}