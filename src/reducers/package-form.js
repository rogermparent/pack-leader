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

    case "MOVE_SETTING_UP": {
        const { index } = action;

        // Skip if the item is already first
        if(index === 0) return state;

        return {
            ...state,
            nestSettings: [
                ...state.nestSettings.slice(0,index-1),
                state.nestSettings[index],
                state.nestSettings[index-1],
                ...state.nestSettings.slice(index+1)
            ]
        };
    }

    case "MOVE_SETTING_DOWN": {
        const { index } = action;

        // Skip if the item is already last
        if(index >= state.nestSettings.length-1) return state;

        return {
            ...state,
            nestSettings: [
                ...state.nestSettings.slice(0,index),
                state.nestSettings[index+1],
                state.nestSettings[index],
                ...state.nestSettings.slice(index+2)
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
                { name: "", amount: 1, id: state.nextID }
            ],
            nextID: state.nextID + 1
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
        const errors = [];

        if(!state.totalParts || state.totalParts <= 0) {
            errors.push("Total Parts must be a number over 0!");
        }

        for(const index in state.nestSettings) {
            const setting = state.nestSettings[index];
            if(setting.amount < 1) {
                errors.push(`Setting ${Number(index)+1}'s amount must be a number over 0!`);
            }
        }

        if(errors.length > 0) {
            return {
                ...state,
                errors
            };
        }

        return {
            ...state,
            result: calculatePackages(
                state.totalParts,
                state.nestSettings
            ),
            errors: []
        };
    }

    default:
        return state;

    }
}

