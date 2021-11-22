import { SingleCategorySplit } from "./SingleCategorySplit";

export class Transaction  {
    id: number;
    beneficiary_name: string;
    date: string;
    direction: string;
    amount: string;
    description: string;
    currency: string;
    mcc: number;
    kind: string;
    catcode: string;
    splits: SingleCategorySplit[] = [];
    selected: boolean;
    catname: string;
}