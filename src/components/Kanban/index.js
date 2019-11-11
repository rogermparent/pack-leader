import React from "react";
import {styled} from "linaria/react";

const ColumnsContainer = styled.div`
display: flex;
flex: 1;
flex-flow: row nowrap;
overflow-x: auto;
>*{
  flex: 1 0 220px;
}
`;

const BoardContainer = styled.div`
flex: 1;
display: flex;
flex-flow: column nowrap;
`;

const KanbanBoard = ({
    columns = [],
    actions,
    ItemComponent,
    ColumnComponent
}) => {
    return(
        <BoardContainer>
          <h1>Kanban Board</h1>
          <ColumnsContainer>
            {columns.map((column, columnIndex) => (
                <ColumnComponent
                  key={columnIndex}
                  title={column.title}
                  index={columnIndex}
                  actions={actions}
                  items={column.items}
                  ItemComponent={ItemComponent}
                />
            ))}
          </ColumnsContainer>
        </BoardContainer>
    );
};

export const DebugItem = ({
    item,
    itemIndex,
    columnIndex,
    actions
}) => (
    <div>
      <p><b>col {columnIndex}, item {itemIndex}</b></p>
      <pre>{JSON.stringify(item, undefined, 2)}</pre>
    </div>
);

export default KanbanBoard;
