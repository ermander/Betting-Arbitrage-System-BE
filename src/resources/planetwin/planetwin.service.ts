import planetwin365Model from '@/models/planetwin365.model';

class Planetwin365Service {
    private planetwin365 = planetwin365Model;

    public async createOrUpdatePlanetwin365(data: any): Promise<any> {
        try {
            const doc = await this.planetwin365.findOne({ key: data.key });
            if (doc) {
                doc.odds = data.odds;
                await doc.save();
            } else {
                await this.planetwin365.create(data);
            }
        } catch (error: any) {
            throw new Error('Unable to create or update planetwin365');
        }
    }
}

export default Planetwin365Service;
