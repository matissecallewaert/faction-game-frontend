import ApiInstance from "./ApiInstance";

class GameApi {
    async getCurrentGame() {
        const response = await ApiInstance.getApi().get("/game/currentGame");
        return response.data.data;
    }

    async getGame(gameId) {
        const response = await ApiInstance.getApi().get("/game/" + gameId);
        return response.data.data;
    }
}

export default new GameApi();
