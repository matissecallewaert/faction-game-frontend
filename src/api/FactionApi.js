import ApiInstance from "./ApiInstance";

class FactionApi {
    async getFaction(gameId, id) {
        const response = await ApiInstance.getApi().get("/faction/" + gameId + "/" + id);
        return response.data.data;
    }

    async getFactions(gameId) {
        const response = await ApiInstance.getApi().get("/faction/" + gameId);
        return response.data.data;
    }
}

export default new FactionApi();
