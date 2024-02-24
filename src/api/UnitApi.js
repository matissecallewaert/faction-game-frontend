import ApiInstance from "./ApiInstance";

class UnitApi {
    async getUnit(gameId, factionId, id) {
        const response = await ApiInstance.getApi().get("/unit/" + gameId + "/" + factionId + "/" + id);
        return response.data.data;
    }

    async getUnits(gameId, factionId) {
        const response = await ApiInstance.getApi().get("/unit/" + gameId + "/" + factionId);
        return response.data.data;
    }
}

export default new UnitApi();
