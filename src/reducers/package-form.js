import calculatePackages from "../lib/calculate-packages";

export default function packageFormReducer(state, action){
    switch(action.type){

    case "UPDATE_SETTING": {
        const { index, field, value } = action;
        return {
            ...state,
            nestSettings: [
                ...state.nestSettings.slice(0,index),
                {
                    ...state.nestSettings[index],
                    [field]: value
                },
                ...state.nestSettings.slice(index+1)
            ]
        };
    }

    case "UPDATE_TOTAL": {
        const {value} = action;
        return {
            ...state,
            totalParts: value
        };
    }

    case "ADD_SETTING": {
        return {
            ...state,
            nestSettings: [
                ...state.nestSettings,
                { name: "", amount: 0 }
            ]
        };
    }

    case "REMOVE_SETTING": {
        const {index} = action;
        return {
            ...state,
            nestSettings: [
                ...state.nestSettings.slice(0, index),
                ...state.nestSettings.slice(index+1)
            ]
        };
    }

    case "CALCULATE": {
        return {
            ...state,
            result: calculatePackages(
                state.totalParts,
                state.nestSettings
            )
        };
    }

    default:
        return state;

    }
}

