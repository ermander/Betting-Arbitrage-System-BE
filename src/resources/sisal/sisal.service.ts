import SisalModel from '@/models/sisal.model';

class SisalService {
    private sisal = SisalModel;

    public async createOrUpdateSisal(data: any): Promise<any> {
        try {
            const doc = await this.sisal.findOne({ key: data.key });
            if (doc) {
                doc.odds = data.odds;
                await doc.save();
            } else {
                await this.sisal.create(data);
            }
        } catch (error: any) {
            throw new Error('Unable to create or update sisal');
        }
    }
}

export default SisalService;
