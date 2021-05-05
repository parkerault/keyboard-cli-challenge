const { Text } = require("ink");
const React = require("react");
const { KeyboardDefaultState, KeyboardReducer } = require("./Entities/Keyboard");

/**
 * @typedef {(dispatch: DispatchFn, state: ApplicationState, fetchFn?: typeof window.fetch) => void} Thunk
 * @typedef {import("./Entities/Keyboard").KeyboardAction} RootAction
 * @typedef {import("react").Dispatch<RootAction>} DispatchFn
 * @typedef {object} ApplicationState
 * @property {import("./Entities/Keyboard").KeyboardState} keyboard
 */

/**
 * @type ApplicationState
 */
const defaultState = {
  keyboard: KeyboardDefaultState
};

/**
 * state and dispatch is overwritten in the `StoreProvider` function, but the
 * type checker complains if `createContext` is called without an argument.
 */
// const StoreContext = React.createContext({
//   state: defaultState,
//   dispatch: (action) => {},
// });

/**
 * @param {ApplicationState} state
 * @param {RootAction} action
 * @returns {ApplicationState}
 */
function storeReducer(state, action) {
  const nextState = {
    keyboard: KeyboardReducer(state.keyboard, action),
  };
  const eq = Object.entries(nextState).map(([key, val]) => val === state[key]);
  return eq.includes(false) ? nextState : state;
}

/**
 * @type {React.FC}
 */
function StoreProvider({ context: Context, children }) {
  const [state, _dispatch] = React.useReducer(storeReducer, defaultState);

  /**
   * @param {RootAction} action
   */
  const dispatch = (action) => {
    console.log(action);
    if (process.env.NODE_ENV === "development")
      console.debug(action.type, action, state);
    _dispatch(action);
    return action;
  };

  return (
    <Context.Provider value={{ state, dispatch }}>
      <>
        {children}
      </>
    </Context.Provider>
  );
}

/**
 * @returns {{ state: ApplicationState, dispatch: DispatchFn}}
 */
function useStore(Context) {
  const store = React.useContext(Context);
  console.log(store);
  if (store === undefined) {
    throw new TypeError(
      "StoreProvider must be present at the root of your component tree.",
    );
  }
  return store;
}

module.exports = {
  defaultState,
  // StoreProvider,
  storeReducer,
  // useStore,
}
