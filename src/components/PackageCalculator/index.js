import React, {useReducer} from 'react';

import packageFormReducer from "../../reducers/package-form";

import {
    CalculatorForm,
    ControlButton,
    PackageSettingsList,
    PackageSettingListItem,
    TotalPartInput,
    CalculatorResults,
    ErrorList
} from "./styles";

const initialState = {
    errors: [],
    nextID: 1,
    nestSettings: [
        { name: "Bag", amount: 100, id: 0 }
    ]
};

const PackageSettingControls = (({setting, dispatch, index}) => {
    return(
        <PackageSettingListItem>
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
                value: e.target.value,
            })}
            min={1}
          />
          <button
            onClick={e=>dispatch({
                type: "MOVE_SETTING_UP",
                index
            })}
          >&uarr;</button>
          <button
            onClick={e=>dispatch({
                type: "MOVE_SETTING_DOWN",
                index
            })}
          >&darr;</button>
          <button
            onClick={e=>dispatch({
                type: "REMOVE_SETTING",
                index
            })}
          >X</button>
        </PackageSettingListItem>
    );
});

export default function PackageCalculator(){
    const [state, dispatch] = useReducer(packageFormReducer, initialState);

    return(
        <>
          {state.errors.length > 0 && (
              <ErrorList>
                {state.errors.map((err, i)=>(
                    <li>
                      {err}
                    </li>
                ))}
              </ErrorList>
          )}
          <CalculatorResults>
            {
                state.result && state.result.map((packageResult, index)=>(
                    <li key={index}>
                      <b>{packageResult.name}</b>
                      {packageResult.variants.map((variant, i)=>(
                          <div key={i}>
                            <span>{variant.amount}</span>
                            <span> @ </span>
                            <span>{variant.partCount}</span>
                          </div>
                      ))}
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
            <PackageSettingsList>
              {
                  state.nestSettings.map((setting, index)=>(
                      <PackageSettingControls
                        setting={setting}
                        dispatch={dispatch}
                        index={index}
                        key={setting.id}
                      />
                  ))
              }
            </PackageSettingsList>

            <ControlButton onClick={e=>dispatch({
                type: "ADD_SETTING"
            })}>Add Package Type</ControlButton>

            <ControlButton onClick={e=>dispatch({
                type: "CALCULATE"
            })}>Calculate</ControlButton>

          </CalculatorForm>
        </>
    );
}
