import React from "react";
import {useMachine} from "@xstate/react";
import {styled} from "linaria/react";

import Layout from "../components/layout";
import {orderMachine} from "../reducers/order-manager";
import Editor from "../components/Editor";

import KanbanBoard from "../components/Kanban";
import OrderCard from "../components/OrderCard";
import KanbanColumn from "../components/Kanban/Column";

const modeSwitcher = (current, send) => {
    if(current.matches('editor')) {
        return (
            <Editor
              columns={current.context.columns}
              send={send}
            />
        );
    } else {
        return (
            <KanbanBoard
              columns={current.context.columns}
              send={send}
              ColumnComponent={KanbanColumn}
              ItemComponent={OrderCard}
              actions={{
                  moveColumnRight: (colIndex)=>{},
                  moveColumnLeft: (colIndex)=>{},
                  removeColumn: (colIndex)=>{},
                  retitleColumn: (colIndex, newTitle)=>{},

                  moveItemRight: (colIndex, itemIndex)=>{
                      send({
                          type: "MOVE_RIGHT",
                          column: colIndex,
                          index: itemIndex,
                      });
                  },
                  moveItemLeft: (colIndex, itemIndex)=>{
                      send({
                          type: "MOVE_LEFT",
                          column: colIndex,
                          index: itemIndex,
                      });
                  },
                  moveItemUp: (colIndex, itemIndex)=>{
                      send({
                          type: "MOVE_UP",
                          column: colIndex,
                          index: itemIndex,
                      });
                  },
                  moveItemDown: (colIndex, itemIndex)=>{
                      send({
                          type: "MOVE_DOWN",
                          column: colIndex,
                          index: itemIndex,
                      });
                      console.log(colIndex, itemIndex)
                  },
                  removeItem: (colIndex, itemIndex)=>{
                      send({
                          type: "REMOVE",
                          column: colIndex,
                          index: itemIndex,
                      });
                  },
                  editComment: (colIndex, itemIndex, value)=>{
                      send({
                          type: "UPDATE",
                          field: "comment",
                          column: colIndex,
                          index: itemIndex,
                          value: value
                      });
                  }
              }}
            />
        );
    }
};

const FullheightPageContainer = styled.div`
min-height: 100%;
display: flex;
flex-flow: column nowrap;
`;

const IndexPage = () => {

    const savedState = (typeof(window) !== 'undefined') && JSON.parse(window.localStorage.getItem('orderManagerState'));
    const loadedOrderMachine = savedState ?
          orderMachine.withContext(savedState) :
          orderMachine;

    const [ current, send ] = useMachine(
        loadedOrderMachine
    );
    return(
        <Layout>
          <FullheightPageContainer>
            <nav>
              <button
                type="button"
                onClick={e => send("TICKET_MANAGER")}
              >Ticket Manager</button>
              <button
                type="button"
                onClick={e => send("KANBAN")}
              >Kanban</button>
            </nav>
            {modeSwitcher(current, send)}
          </FullheightPageContainer>
        </Layout>
    );
};

export default IndexPage;
