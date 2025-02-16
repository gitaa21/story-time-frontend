import { createStore } from "vuex";
import auth from "./auth";
import book from "./book";
import bookmark from "./bookmark";

export const store = createStore({
    modules: {
        auth,
        book,
        bookmark
    },
});