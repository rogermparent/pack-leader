import React from 'react';
import useForm from 'react-hook-form';
import {usePackageForm} from "../../reducers/package-form";

import {
    CalculatorForm,
    ControlButton,
    PackageSettingsList,
    PackageSettingListItem,
    TotalPartInput,
    CalculatorResults,
    ErrorList
} from "./styles";

const PackageSettingControls = (({setting, dispatch, index, register}) => {
    return(
        <PackageSettingListItem>
          <input
            name={`nestSettings[${index}].name`}
            type="text"
            placeholder="Package Name"
            ref={register({required: true})}
          />
          <input
            name={`nestSettings[${index}].amount`}
            type="number"
            placeholder="Amount nested"
            ref={register({required: true})}
            min={1}
          />
          <button
            onClick={e=>{
                e.preventDefault();
                dispatch({
                    type: "MOVE_SETTING_UP",
                    index
                });
            }}
          >&uarr;</button>
          <button
            onClick={e=>{
                e.preventDefault();
                dispatch({
                    type: "MOVE_SETTING_DOWN",
                    index
                });
            }}
          >&darr;</button>
          <button
            onClick={e=>{
                e.preventDefault();
                dispatch({
                    type: "REMOVE_SETTING",
                    index
                });
            }}
          >X</button>
        </PackageSettingListItem>
    );
});

export default function PackageCalculator(){
    const [state, dispatch] = usePackageForm(1);
    const { register, handleSubmit, watch, errors } = useForm({
        defaultValues: {
            nestSettings: [
                { name: "Bag", amount: 100 }
            ]
        }
    });
    const onSubmit = (data) => {
        dispatch({
            type: "CALCULATE",
            data: data
        });
    };

    return(
        <>
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
          <CalculatorForm onSubmit={handleSubmit(onSubmit)}>
            <input
              name="totalParts"
              type="number"
              value={state.totalParts}
              placeholder="Total Parts"
              ref={register({required: true})}
            />
            {errors["totalParts"] && errors["totalParts"].type}
            <PackageSettingsList>
              {
                  state.nestSettings.keys.map((key, index)=>(
                      <PackageSettingControls
                        register={register}
                        dispatch={dispatch}
                        index={index}
                        key={key}
                      />
                  ))
              }
            </PackageSettingsList>

            <ControlButton onClick={e=>{
                e.preventDefault();
                dispatch({
                    type: "ADD_SETTING"
                });
            }}>Add Package Type</ControlButton>

            <ControlButton type="submit">Calculate</ControlButton>

          </CalculatorForm>
        </>
    );
}
