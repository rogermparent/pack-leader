import React from "react";
import {styled} from "linaria/react";

const ColumnContainer = styled.div`
h2{
  text-align: center;
  margin: 2px 0;
  padding: 2px;
  font-size: 18px;
}
border: 1px solid gray;
border-radius: 5px;
padding: 3px;
margin: 3px;
`;

const Column = ({
    title,
    items,
    index,
    actions,
    ItemComponent
}) => (
    <ColumnContainer>
      <h2>{title} ({items.length})</h2>
      <div>
        {items.map((item, itemIndex)=>(
            <ItemComponent
              key={itemIndex}
              item={item}
              itemIndex={itemIndex}
              columnIndex={index}
              actions={actions}
            />
        ))}
      </div>
    </ColumnContainer>
);

export default Column;
