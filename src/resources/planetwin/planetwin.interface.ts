import { Document } from 'mongoose';

export default interface Planetwin extends Document {
    key: string;
    data: string;
    descrizione: string;
    casa: string;
    ospite: string;
    odds: {
        [key: string]: object[];
    };
}
