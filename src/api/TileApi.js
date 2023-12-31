import ApiInstance from "./ApiInstance";

class TileApi {
    async getTile(gameId, id) {
        const response = await ApiInstance.getApi().get("/tile/" + gameId + "/" + id);
        return response.data.data;
    }

    async getTiles(gameId) {
        const response = await ApiInstance.getApi().get("/tile/" + gameId);
        return response.data.data;
    }
}

export default new TileApi();
