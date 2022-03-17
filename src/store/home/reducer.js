const initialState = { home: null };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "home/getHomeData": {
      return {
        ...state,
        home: [action.payload],
      };
    }

    default:
      return state;
  }
}
