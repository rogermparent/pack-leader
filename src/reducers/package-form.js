import calculatePackages from "../lib/calculate-packages";
import { keyListReducer, buildInitialState } from "./key-list";
import { useReducer } from "react";

export function packageFormReducer(state, action){

    switch(action.type){

    case "MOVE_SETTING_UP": {
        const { index } = action;

        // Skip if the item is already first
        if(index === 0) return state;

        return {
            ...state,
            nestSettings: keyListReducer(
                state.nestSettings,
                {
                    type: "MOVE_BACK",
                    index
                }
            )
        };
    }

    case "MOVE_SETTING_DOWN": {
        const { index } = action;

        // Skip if the item is already last
        if(index >= state.nestSettings.length-1) return state;

        return {
            ...state,
            nestSettings: keyListReducer(
                state.nestSettings,
                {
                    type: "MOVE_FORWARD",
                    index
                }
            )
        };
    }

    case "ADD_SETTING": {
        return {
            ...state,
            nestSettings: keyListReducer(
                state.nestSettings,
                {
                    type: "APPEND"
                }
            )
        };
    }

    case "REMOVE_SETTING": {
        const {index} = action;
        return {
            ...state,
            nestSettings: keyListReducer(
                state.nestSettings,
                {
                    type: "REMOVE",
                    index
                }
            )
        };
    }

    case "CALCULATE": {

        return {
            ...state,
            result: calculatePackages(
                action.data.totalParts,
                action.data.nestSettings
            )
        };
    }

    default:
        return state;

    }
}

export function usePackageForm(initialSettings){
    return useReducer(packageFormReducer, {
        nestSettings: buildInitialState(initialSettings)
    });
}
