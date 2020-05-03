import { createStore } from "redux"
import userReducer from "./Reducers/userReducer"

const Store = createStore(userReducer)

export default Store