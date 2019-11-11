import {
    evolve,
    remove,
    update,
    adjust,
    append,
    pipe,
    assoc,
    tap,
    //__,
} from 'ramda';
import {Machine, assign} from 'xstate';

const menuTransitions = {
    TICKET_MANAGER: 'ticketManager',
    KANBAN: 'kanban',
};

const initialContext = {
    columns: [{
        title: 'Tickets',
        items: []
    },{
        title: 'Slips',
        items: []
    },{
        title: 'Prepared Slips',
        items: []
    },{
        title: 'Released Slips',
        items: []
    }]
};

export const orderMachine = Machine(
    {
        id: 'orderManager',
        initial: 'ticketManager',
        context: initialContext,
        states: {
            kanban: {
                on: {
                    ...menuTransitions,
                    MOVE_RIGHT: {
                        actions: 'moveOrderRight',
                    },
                    MOVE_LEFT: {
                        actions: 'moveOrderLeft',
                    },
                    REMOVE: {
                        actions: 'removeOrder',
                    },
                    UPDATE: {
                        actions: 'updateOrderField'
                    }

                }
            },
            ticketManager: {
                on: {
                    ...menuTransitions,
                    ADD: {
                        actions: 'addTicket'
                    },
                    LOAD: {
                        actions: 'loadTicket'
                    },
                    REMOVE: {
                        actions: 'removeTicket'
                    },
                    UPDATE: {
                        actions: 'updateTicket'
                    }
                }
            }
        }
    },{
        actions: {

            addTicket: assign({
                columns: (ctx, e) => {
                    const newColumns = evolveFirstColumnItems(
                        append(e.ticket),
                        ctx.columns
                    );
                    console.log(newColumns);
                    return newColumns;
                }
            }),
            loadTicket: ()=>{},
            removeTicket: assign({
                columns: (ctx, e) => evolveFirstColumnItems(
                    remove(e.index, 1),
                    ctx.columns
                )
            }),
            updateTicket: assign({
                columns: (ctx, e) => evolveFirstColumnItems(
                    update(e.index, e.ticket),
                    ctx.columns
                )
            }),
            // TODO Badly needed overhaul
            updateOrderField: assign({
                columns: (ctx, e) => tap(
                    console.log,
                    evolveColumnItems(
                        e.column,
                        adjust(
                            e.index,
                            assoc(
                                e.field,
                                e.value
                            )
                        ),
                    )(ctx.columns),
                )
            }),

            moveOrderRight: assign({
                columns: (ctx, e) => {
                    let order = ctx.columns[e.column].items[e.index];
                    if(e.column === 0){
                        order = assoc(
                            'orderID',
                            prompt(
                                "Enter the ticket's new Order ID",
                                order.orderID
                            ),
                            order
                        );
                    }
                    return pipe(
                        evolveColumnItems(e.column+1, append(order)),
                        evolveColumnItems(e.column, remove(e.index, 1)),
                    )(ctx.columns);
                }
            }),
            moveOrderLeft: assign({
                columns: (ctx, e) => {
                    const order = ctx.columns[e.column].items[e.index];
                    return pipe(
                        evolveColumnItems(e.column-1, append(order)),
                        evolveColumnItems(e.column, remove(e.index, 1)),
                    )(ctx.columns);
                }
            }),
            removeOrder: assign({
                columns: (ctx, e) => evolveColumnItems(
                    e.column,
                    remove(e.index, 1)
                )(ctx.columns),
            }),

        }
    }
);

const evolveColumnItems = (column, fn, columns) => adjust(
    column, evolve({items: fn})
);
const evolveFirstColumnItems = (fn, columns) => evolveColumnItems(0, fn)(columns);

/*
function orderManagerReducer(state, action){
    switch(action.type){

    case "ADD":
        return {
            ...state,
            tickets: [
                ...state.tickets,
                action.ticket
            ],
        };

    case "REPLACE":
        return {
            ...state,
            tickets: [
                [action.column]: update(action.index, action.ticket, state.tickets)
            ]
        };

    case "REMOVE":
        return {
            ...state,
            tickets: remove(action.index, 1, state.tickets) 
        };

    case "MOVE_RIGHT":

        const newOrder = {
            ...state.tickets[action.index],
            orderID: action.orderID
        };

        return {
            ...state,
            tickets: remove(action.index, 1, state.tickets),
            orders: [
                ...state.orders,
                newOrder
            ]
        };

    case "MOVE_LEFT":
        return {
            ...state,
        };


    default:
        return state;

    }
}
*/
