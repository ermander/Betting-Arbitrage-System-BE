import { Schema, model } from 'mongoose';
import Sisal from '@/resources/sisal/sisal.interface';

const PostSchema = new Schema(
    {
        key: {
            type: String,
            required: false,
        },
        data: {
            type: String,
            required: false,
        },
        descrizione: {
            type: String,
            required: false,
        },
        casa: {
            type: String,
            required: false,
        },
        ospite: {
            type: String,
            required: false,
        },
        odds: {
            type: Object,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

export default model<Sisal>('Sisal', PostSchema);
