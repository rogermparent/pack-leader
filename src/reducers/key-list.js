import { useReducer } from "react";

export function keyListReducer(state, action){
    switch(action.type){

    case "APPEND":
        return {
            keys: state.keys.concat(state.nextKey),
            nextKey: state.nextKey + 1,
        };

    case "INSERT":
        return {
            keys: [
                ...state.keys.slice(0, state.nextKey),
                state.nextKey,
                ...state.keys.slice(state.nextKey+1)
            ]
        };

    case "REMOVE":
        return {
            keys: [
                ...state.keys.slice(0, action.index),
                ...state.keys.slice(action.index+1)
            ],
            nextKey: state.nextKey
        };

    case "MOVE_BACK":

        // Skip if the item is already first
        if(action.index === 0) return state;

        return {
            nextKey: state.nextKey,
            keys: [
                ...state.keys.slice(0,action.index-1),
                state.keys[action.index],
                state.keys[action.index-1],
                ...state.keys.slice(action.index+1)
            ]
        };

    case "MOVE_FORWARD":

        // Skip if the item is already last
        if(action.index >= state.keys.length-1) return state;

        return {
            nextKey: state.nextKey,
            keys: [
                ...state.keys.slice(0,action.index),
                state.keys[action.index+1],
                state.keys[action.index],
                ...state.keys.slice(action.index+2)
            ]
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
