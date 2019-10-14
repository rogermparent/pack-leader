import React, { useReducer } from "react";

import Layout from "../components/layout";
import packageFormReducer from "../reducers/package-form";

import {styled} from 'linaria/react';

const initialState = {
    nestSettings: [
        { name: "bag", amount: 100 }
    ]
};

const CalculatorForm = styled.div`
font-family: sans-serif;
font-size: 0.8em;
`;

const ControlButton = styled.button`
display: block;
margin: 0.5em auto;
`;

const NestSettingsList = styled.ul`
list-style: none;
padding: 0;
margin: 0.5em 0;
width: 100%;
`;

const NestSettingListItem = styled.li`
display: flex;
align-items: center;
justify-content: center;
height: 1.5em;
border: 1px solid gray;
border-radius: 0.25em;
margin: 0.25em 0;
overflow: hidden;
>input:first-of-type{
  flex: 1;
}
>input[type=number]{
  width: 4em;
}
input, button {
  border-radius: 0;
  border: none;
  border-right: 1px solid gray;
  padding: 0 0.25em;
  vertical-align: middle;
  line-height: 0;
  height: 100%;
}
button {
  border: none;
}
`;

const TotalPartInput = styled.input`
width: 100%;
border: 1px solid gray;
border-radius: 0.25em;
padding: 0 0.5em;
`;

const IndexPage = () => {
    const [state, dispatch] = useReducer(packageFormReducer, initialState);

    return(
        <Layout>
          <CalculatorForm>
            <TotalPartInput
              type="number"
              value={state.totalParts}
              onChange={e=>dispatch({
                  type: "UPDATE_TOTAL",
                  value: e.target.value
              })}
              placeholder="Total Parts"
            />
            <NestSettingsList>
              {
                  state.nestSettings.map((setting, index)=>(
                      <NestSettingListItem key={`${index}-${setting.name}-${setting.amount}`}>
                        <input
                          type="text"
                          placeholder="Package Name"
                          value={setting.name}
                          onChange={e=>dispatch({
                              type: "UPDATE_SETTING",
                              index,
                              field: "name",
                              value: e.target.value
                          })}
                        />
                        <input
                          type="number"
                          placeholder="Amount nested"
                          value={setting.amount}
                          onChange={e=>dispatch({
                              type: "UPDATE_SETTING",
                              index,
                              field: "amount",
                              value: e.target.value
                          })}
                        />
                        <button
                          onClick={e=>dispatch({
                              type: "REMOVE_SETTING",
                              index
                          })}
                        >X</button>
                      </NestSettingListItem>
                  ))
              }
            </NestSettingsList>

            <ControlButton onClick={e=>dispatch({
                type: "ADD_SETTING"
            })}>Add Package Type</ControlButton>

            <ControlButton onClick={e=>dispatch({
                type: "CALCULATE"
            })}>Calculate</ControlButton>

          </CalculatorForm>
          <div>
            <pre>{JSON.stringify(state.result, undefined, 2)}</pre>
          </div>
        </Layout>
    );
};

export default IndexPage;
