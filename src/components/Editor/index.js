import React, {useEffect, useRef, useState, useReducer} from "react";
import useForm from 'react-hook-form';
import {styled} from "linaria/react";

import {useKeyList} from "../../reducers/key-list";
import OrderCard from "../../components/OrderCard";

const TicketUnstyledList = styled.ul`
list-style: none;
padding: 0;
margin: 0;
`;

const TicketListItem = styled.li`
margin: 3px;
padding: 3px;
`;

const shippingMethods = [
    'FedEx Ground',
    'DHL',
    'UPS',
    'FedEx Express',
];

const EditorContainer = styled.div`
display: flex;
flex-flow: row wrap;
justify-content: center;
>form{
  flex: 0 0 300px;
}
>ul{
  flex: 1 0;
  max-width: 400px;
  >li{
    min-width: 100%;
  }
}
`;

const indexReducer = (current, action) => {
    switch(action){
    case 'next':
        return current+1;
    case 'prev':
        return current-1;
    default:
        if (typeof(action) === 'number') return action;
        return current;
    }
};

const setAllValues = (values, setValue, currentName) => {
    if(Array.isArray(values)) {
        for(const index in values) {
            setAllValues(
                values[index],
                setValue,
                `${currentName}[${index}]`
            );
        }
    } else if(typeof(values) === "object"){
        for(const key in values) {
            setAllValues(
                values[key],
                setValue,
                currentName ? currentName+'.'+key : key
            );
        }
    } else {
        setValue(currentName, values);
    }
};

const SelectWithOther = ({children, register, name}) => {
    const [selectValue, setContents] = useState();
    const isOther = selectValue === 'other';
    return(
        <>
          <select
            name={isOther ? null : name}
            ref={register}
            value={selectValue}
            onChange={e=>setContents(e.target.value)}
          >
            {children}
          </select>
          {isOther &&
           <input
             type="text"
             name={name}
             ref={register}
           />}
        </>
    );
}

const makeDispatchButton = (dispatch) => {
    return ({event = {}, children, onClick = (()=>dispatch(event))}) => {
        return(
            <button
              type="button"
              onClick={onClick}
            >
              {children}
            </button>
        );
    };
};

export default ({columns, send}) => {
    const [ lineItemState, lineItemDispatch ] = useKeyList(1);
    const formRef = useRef();
    const { register, handleSubmit, errors, setValue, getValues, reset } = useForm({
        reValidateMode: "onSubmit"
    });

    const [ selectedColumnIndex, selectColumn ] = useReducer(
        indexReducer, 0
    );

    const [ selectedItemIndex, selectItem ] = useReducer(
        indexReducer, 0
    );

    const tickets = columns[selectedColumnIndex].items;

    const DispatchButton = makeDispatchButton(send);

    const setFormToTicket = (index) => {
        const ticket = tickets[index];
        selectItem(index);
        lineItemDispatch({
            type: "RESET",
            itemCount: ticket.lineItems.length
        });
        setAllValues(ticket, setValue);
        formRef.current[0].focus();
    };

    useEffect(()=>{
        formRef.current[0].focus();

        /*
        send({
            type: "ADD",
            ticket: {
                "ticketID": "100034",
                "PO": "244553 Rev 4",
                "comment": "asdadsasda\n\nsss\n\nmultiline",
                "lineItems": [
                    {
                        "item": "weebo",
                        "quantity": "4",
                        "price": "2.23",
                        "lot": "25565"
                    }
                ]
            }
        });
        */
    }, []);

    return(
        <EditorContainer>
          <form ref={formRef}>
            <Field
              label="ID"
              name="ticketID"
              register={register}
              errors={errors}
              config={{
                  required: true
              }}
            />
            <Field
              label="PO"
              name="PO"
              register={register}
              errors={errors}
              config={{
                  required: true
              }}
            />
            <SelectWithOther
              name="shipVia"
              register={register}
            >
              {
                  shippingMethods.map((method)=>(
                      <option key={method}>{method}</option>
                  ))
              }
              <option value="other">Other</option>
            </SelectWithOther>
            <TextAreaField
              label="Comment"
              name="comment"
              register={register}
              errors={errors}
            />
            <LineItemFormList>
              {
                  lineItemState.keys.map((key, index)=>(
                      <LineItemForm
                        index={index}
                        register={register}
                        errors={errors}
                        key={key}
                        lineItemCount = {lineItemState.keys.length}
                        onMoveUp={
                            ()=>lineItemDispatch({
                                type: "MOVE_BACK",
                                index
                            })
                        }
                        onMoveDown={
                            ()=>lineItemDispatch({
                                type: "MOVE_FORWARD",
                                index
                            })
                        }
                        onRemove={
                            ()=>lineItemDispatch({
                                type: "REMOVE",
                                index
                            })
                        }
                      />
                  ))
              }
            </LineItemFormList>
            <div>
              <button
                type="button"
                onClick={e=>{
                    lineItemDispatch({
                        type: "APPEND"
                    });
                }}>Add Line Item</button>
            </div>
            <div>
            <button
              type="button"
              onClick={(e)=>{
                  console.log(getValues({nest: true}));
                  send({
                      type: "ADD",
                      column: selectedColumnIndex,
                      ticket: getValues({nest: true})
                  });
              }}
            >
              Append
            </button>
            <button
              type="button"
              onClick={(e)=>{
                  console.log(getValues({nest: true}));
                  send({
                      type: "UPDATE",
                      column: selectedColumnIndex,
                      index: selectedItemIndex,
                      ticket: getValues({nest: true})
                  });
              }}
            >
              Update
        </button>
        </div>
            <p>
              <button type="button" onClick={()=>selectColumn('prev')}>&larr;</button>
              {selectedColumnIndex}, {selectedItemIndex}
              <button type="button" onClick={()=>selectColumn('next')}>&rarr;</button>
            </p>
          </form>
          {
              (tickets && tickets.length > 0) && (
                  <>
                    <TicketList
                      tickets={tickets}
                      handleLoad={setFormToTicket}
                    />
                  </>
              )
          }
        </EditorContainer>
    );
};

const TicketList = ({tickets, handleLoad}) => (
    <TicketUnstyledList>
      {tickets.map((ticket, index)=>(
          <TicketListItem key={index}>
            <OrderCard
              item={ticket}
              columnIndex={0}
            />
            <button type="button" onClick={()=>handleLoad(index)}>Load</button>
          </TicketListItem>
      ))}
    </TicketUnstyledList>
);

const LabelContainer = styled.label`
margin: 0.5em 0;
display: block;
`;

const FieldInputContainer = styled.div`
display: flex;
flex-flow: row nowrap;
>span{
padding: 0 0.25em;
}
>input{
flex: 1;
}
`;

const FieldErrorMessage = styled.div`
text-align: center;
font-size: 0.8em;
`;

const TextAreaContainer = styled(LabelContainer)`
textarea, div {
  display: block;
  box-sizing: border-box;
}
textarea {
  width: 100%;
  border-top-left-radius: 0;
}
>div>span {
  border: 1px solid gray;
  border-bottom: none;
  padding: 0.1em 0.25em;
  box-sizing: border-box;
  border-radius: 3px 3px 0 0;
}
`;

function Field({label, name, register, errors, type="text", config={}, inputSettings={}}){
    const error = errors[name];
    return(
        <LabelContainer style={{
            display: "block",
            backgroundColor: error && "#FEE"
        }}>
          <FieldInputContainer>
            <input
              type={type}
              name={name}
              placeholder={label}
              ref={register(config)}
              {...inputSettings}
            />
          </FieldInputContainer>
          <FieldErrorMessage>{error && (error.message || error.type)}</FieldErrorMessage>
        </LabelContainer>
    );
}

function TextAreaField({label, name, register, config={}}){
    return(
        <TextAreaContainer>
          <div><span>{label}</span></div>
          <textarea name={name} ref={register(config)} />
        </TextAreaContainer>
    );
}

const LineItemFormList = styled.ul`
list-style: none;
padding: 0;
`;

function lineItemName(index, key){
    return `lineItems[${index}].${key}`;
}

function LineItemForm({index, lineItemCount, register, errors, onRemove, onMoveUp, onMoveDown}) {
    return(
        <li>
          <div>Item {index+1}</div>
          <Field
            label="Item"
            name={lineItemName(index, "item")}
            register={register}
            errors={errors}
            config={{
                required: true
            }}
          />
          <Field
            label="Qty"
            name={lineItemName(index, "quantity")}
            register={register}
            errors={errors}
            type="number"
            config={{
                required: true
            }}
          />
          <Field
            label="Price"
            name={lineItemName(index, "price")}
            register={register}
            errors={errors}
            type="number"
            inputSettings={{step: 0.01}}
            config={{}}
          />
          <Field
            label="Lot"
            name={lineItemName(index, "lot")}
            register={register}
            errors={errors}
            config={{}}
          />
          <div>
            <button
              onClick={onMoveUp}
              disabled={index <= 0}
              tabIndex="-1"
            >up</button>
            <button
              onClick={onRemove}
              tabIndex="-1"
            >remove</button>
            <button
              onClick={onMoveDown}
              disabled={index >= lineItemCount-1}
              tabIndex="-1"
            >down</button>
          </div>
        </li>
    );
}
