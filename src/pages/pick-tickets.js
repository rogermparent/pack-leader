import React from "react";
import useForm from 'react-hook-form';
import {useMachine} from "@xstate/react";

import Layout from "../components/layout";
import {styled} from "linaria/react";
import {useKeyList} from "../reducers/key-list";
import {orderMachine} from "../reducers/order-manager";

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
            <span>{label}: </span>
            <input
              type={type}
              name={name}
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

function LineItemForm({index, register, errors, onRemove, onMoveUp, onMoveDown}) {
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
            <button onClick={onMoveUp}>up</button>
            <button onClick={onRemove}>remove</button>
            <button onClick={onMoveDown}>down</button>
          </div>
        </li>
    );
}

const IndexPage = () => {
    const { register, handleSubmit, errors } = useForm({
        reValidateMode: "onSubmit"
    });
    const [ lineItemState, lineItemDispatch ] = useKeyList(1);
    const [ current, send ] = useMachine(orderMachine);

    const onSubmit = (data, e) => {
        send({
            type: "ADD",
            ticket: data
        });
        e.target.reset();
        e.target[0].focus();
    };

    return(
        <Layout>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <select defaultValue="ups">
              <option value="ups">UPS</option>
              <option value="fedex-ground">FedEx Ground</option>
              <option value="fedex-express">FedEx Express</option>
              <option value="dhl">DHL</option>
              <option value="other">Other</option>
            </select>
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
            <button onClick={()=>lineItemDispatch({
                type: "APPEND"
            })}>Add Item</button>
            <div>
              <button type="submit">Submit</button>
              <button type="button">Other</button>
            </div>
            <TicketList tickets={current.context.columns[0].items}/>
          </form>
        </Layout>
    );
};

const TicketList = ({tickets}) => (
    <ul>
      {tickets.map(ticket=>(
          <li>
            <h1>{ticket.ticketID}</h1>
            <ul>
              <li><b>PO: </b><span>{ticket.PO}</span></li>
            </ul>
            <h2>Items</h2>
            <ul>
              {ticket.lineItems.map(lineItem=>(
                  <li>
                    <span>{lineItem.quantity}</span>
                    {'x '}
                    <span>{lineItem.item}</span>
                    {' @ '}
                    <span>${lineItem.price}</span>
                    {' = '}
                    <span>${(lineItem.quantity * lineItem.price).toFixed(2)}</span>

                  </li>
              ))}
            </ul>
            <div>
              <b>Total: </b>
              <span>
                ${ticket.lineItems.reduce(
                    (acc, current)=>(
                        acc + (current.price * current.quantity)
                    ), 0
                ).toFixed(2)}
              </span>
            </div>
          </li>
      ))}
    </ul>
);

export default IndexPage;
