import axiosClient from "./axiosClient";

const createCard = ({ title, columnId }) => {
    return axiosClient.post("cards/create", {
        title,
        columnId,
    });
};

const updateCard = (cardId, cardToUpdate) => {
    return axiosClient.put(`cards/${cardId}`, {
        ...cardToUpdate,
    });
};

const cardApi = {
    createCard,
    updateCard,
};

export default cardApi;
