import React, { useReducer } from "react";

import Layout from "../components/layout";
import packageFormReducer from "../reducers/package-form";

import {styled} from 'linaria/react';
import { useUID, useUIDSeed } from 'react-uid';

const initialState = {
    nestSettings: [
        { name: "Bag", amount: 100 }
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

const NestSettingListItemStyle = styled.li`
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

const PackageCalculator = styled.div`
`;

const CalculatorResults = styled.ul`
list-style: none;
margin: 0.5em;
padding: 0.5em;
text-align: center;
display: flex;
flex-flow: row wrap;
li {
  >b {
    display: block;
  }
  margin: 0.25em;
  padding: 0.25em;
  min-width: 5em;
  border: 1px solid gray;
  border-radius: 0.25em;
}
`;

const NestSettingListItem = (({setting, dispatch, index}) => {
    const uid = index; // TODO figure out a way to make a real stable key
    return(
    <NestSettingListItemStyle
      key={uid}>
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
    </NestSettingListItemStyle>
    );
});

const IndexPage = () => {
    const [state, dispatch] = useReducer(packageFormReducer, initialState);
    const uid = useUIDSeed();

    return(
        <Layout>
          <PackageCalculator>
            <CalculatorResults>
              {
                  state.result && state.result.map((packageResult, index)=>(
                      <li key={uid(packageResult, index)}>
                        <b>{packageResult.name}</b>
                        <div>
                          <span>{packageResult.amount}</span>
                          <span> @ </span>
                          <span>{packageResult.partCount}</span>
                        </div>
                      </li>
                  ))
              }
            </CalculatorResults>
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
                        <NestSettingListItem
                          setting={setting}
                          dispatch={dispatch}
                          index={index}
                        />
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
          </PackageCalculator>
        </Layout>
    );
};

export default IndexPage;
