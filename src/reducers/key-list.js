import { useReducer } from "react";
import { remove, update, insert, move } from 'ramda';


export function keyListReducer(state, action){
    switch(action.type){

    case "RESET":
        return buildInitialState(action.itemCount);

    case "APPEND":
        return {
            keys: state.keys.concat(state.nextKey),
            nextKey: state.nextKey + 1,
        };

    case "INSERT":
        return {
            keys: insert(action.index, state.nextKey, state.keys)
        };

    case "REMOVE":
        return {
            keys: remove(action.index, 1, state.keys),
            nextKey: state.nextKey
        };

    case "MOVE_BACK":

        // Skip if the item is already first
        if(action.index === 0) return state;

        return {
            nextKey: state.nextKey,
            keys: move(action.index, action.index-1, state.keys),
        };

    case "MOVE_FORWARD":

        // Skip if the item is already last
        if(action.index >= state.keys.length-1) return state;

        return {
            nextKey: state.nextKey,
            keys: move(action.index, action.index+1, state.keys),
        };

    default: return state;

    }
}

export function buildInitialState(initialKeyCount = 0) {
    const initialKeys = [];

    for(let i = 0; i < initialKeyCount; i++) {
        initialKeys.push(i);
    }

    return {
        nextKey: initialKeyCount,
        keys: initialKeys
    };
}

export function useKeyList(initialKeyCount){
    return useReducer(
        keyListReducer,
        buildInitialState(initialKeyCount)
    );
}
