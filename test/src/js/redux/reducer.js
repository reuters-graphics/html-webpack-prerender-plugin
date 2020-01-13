const initialState = { list: [] };

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        list: [
          ...state.list,
          { name: action.item, bought: false },
        ],
      };
    case 'BUY_ITEM':
      return {
        list: state.list.map((item) => {
          if (item.name === action.item) {
            return { name: item.name, bought: true };
          }
          return item;
        }),
      };
    default:
      return state;
  }
}

export default reducer;

export const addItem = (item) => ({
  type: 'ADD_ITEM',
  item,
});

export const buyItem = (item) => ({
  type: 'BUY_ITEM',
  item,
});
