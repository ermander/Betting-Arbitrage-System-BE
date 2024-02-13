import { Schema, model } from 'mongoose';
import Planetwin from '@/resources/planetwin/planetwin.interface';

const PlanetwinSchema = new Schema(
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

export default model<Planetwin>('Planetwin', PlanetwinSchema);
