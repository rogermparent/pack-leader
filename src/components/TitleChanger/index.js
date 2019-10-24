import React, {useReducer, useEffect} from "react";
import {styled} from "linaria/react";

function titleChangerReducer(state, action){
    if(action && typeof(action) === "string" && action.length > 0) {
        return action;
    } else {
        return state;
    }
}

export default function TitleChanger({initialTitle}){
    const [state, dispatch] = useReducer(titleChangerReducer, initialTitle);
    useEffect(()=>{document.title = state;}, [state]);
    return(<h1 onClick={e=>dispatch(window.prompt("Change the page title"))}>{state}</h1>);
}
