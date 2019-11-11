import React from "react";
import {styled} from "linaria/react";

const ControlButtons = styled.div`
display: flex;
flex-flow: row nowrap;
>button{
  flex: 1;
  border-radius: 0;
  border-style: hidden solid hidden hidden;
  padding: 2px 5px;
  &:last-child{border-style: hidden;}
}
`;

const CardContainer = styled.div`
border: 1px solid gray;
border-radius: 5px;
overflow: hidden;
td, th {
  border: 1px solid gray;
  padding: 1px 2px;
}
table{
  border-collapse: collapse;
  width: 100%;
}
>*{
  border-bottom: 1px solid gray;
  border-style: hidden hidden solid hidden;
  &:last-child{
    border-bottom-style: hidden;
  }
}
`;

const CardTitle = styled.div`
text-align: center;
font-weight: bold;
`;

const FlexCell = styled.td`
  width: 100%;
`;

const Comment = styled.pre`
font-size: 0.75em;
padding: 0.5em;
margin: 0;
`;

const OrderControls = ({actions, columnIndex, itemIndex}) => {
    const {
        moveItemRight,
        moveItemLeft,
        moveItemDown,
        moveItemUp,
        removeItem
    } = actions;

    return(
        <ControlButtons>
          <button
            type="button"
            onClick={e=>moveItemLeft(columnIndex,itemIndex)}
          >&larr;</button>
          <button
            type="button"
            onClick={e=>moveItemUp(columnIndex,itemIndex)}
          >&uarr;</button>
          <button
            type="button"
            onClick={e=>removeItem(columnIndex,itemIndex)}
          >X</button>
          <button
            type="button"
            onClick={e=>moveItemDown(columnIndex,itemIndex)}
          >&darr;</button>
          <button
            type="button"
            onClick={e=>moveItemRight(columnIndex,itemIndex)}
          >&rarr;</button>
        </ControlButtons>
    );
};

const OrderCard = ({
    item,
    itemIndex,
    columnIndex,
    actions
}) => {
    return (
        <CardContainer>
          <OrderView
            order={item}
            columnIndex={columnIndex}
            itemIndex={itemIndex}
            actions={actions}
          />
          {
              actions && (
                  <OrderControls
                    actions={actions}
                    columnIndex={columnIndex}
                    itemIndex={itemIndex}
                  />
              )
          }
        </CardContainer>
    );
};

const PropertyTable = ({properties}) => (
    <table>
      <tbody>
        {properties.map(([label, value], i)=>(
        <PropertyLine
          label={label}
          value={value}
          key={i}
        />
        ))}
       </tbody>
    </table>
);

export const OrderView = ({order, columnIndex, itemIndex, actions}) => {
    const {
        PO,
        shipVia,
        comment,
        lineItems
    } = order;

    const [totalPrice, totalItems] = lineItems.reduce((acc, current)=>([
        acc[0] + (current.price * current.quantity),
        acc[1] + current.quantity
    ]), [0,0]);

    return(
        <>
          <CardTitle>
            {
              columnIndex === 0 ?
                  order.ticketID :
                  order.orderID
            }
          </CardTitle>
          <PropertyTable
            properties={[
                ["PO", order.PO],
                ["Pickup", order.shipVia],
            ]}
          />
          <div>
            <Comment
              onClick={
                  actions &&
                      (
                          e => actions.editComment(
                              columnIndex,
                              itemIndex,
                              decodeURI(prompt(
                                  `Edit Comment`,
                                  encodeURI(comment)
                              ))
                          )
                      )
              }
            >{comment}</Comment>
          </div>
          <table>
            <tbody>
              {lineItems.map((lineItem, lineIndex)=>(
                  <LineItem
                    lineItem={lineItem}
                    index={lineIndex}
                    key={lineIndex}
                  />
              ))}
            </tbody>
          </table>
          <PropertyTable
            properties={[
                ["Value", `$${totalPrice.toFixed(2)}`],
                ["Items", totalItems],
            ]}
          />
        </>
    );
};

const PropertyLine = ({
    label,
    value
}) => (
    <tr>
      <th>{label}</th>
      <FlexCell>{value}</FlexCell>
    </tr>
);

const LineItem = ({
    lineItem: {item, quantity, price},
    index
}) => (
    <tr>
      <FlexCell>{item}</FlexCell>
      <td>{quantity}</td>
      <td>${price}</td>
      <td>${(quantity * price).toFixed(2)}</td>
    </tr>
);

export default OrderCard;
