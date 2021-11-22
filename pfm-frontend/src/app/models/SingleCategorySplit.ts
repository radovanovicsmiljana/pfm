import { Category } from "./Category";

export class SingleCategorySplit {
    catcode: string;
    subcode: string;
    amount: number;
    id: number;
    disabled_sub: boolean;
    subs: Category[];
    catname: string;
}