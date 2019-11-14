import {
    __,
    evolve,
    remove,
    update,
    adjust,
    append,
    pipe,
    assoc,
    tap,
    move,
} from 'ramda';
import {Machine, assign} from 'xstate';

const menuTransitions = {
    TICKET_MANAGER: 'editor',
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
        initial: 'editor',
        context: initialContext,
        states: {
            kanban: {
                on: {
                    ...menuTransitions,
                    MOVE_RIGHT: {
                        actions: ['moveOrderRight', 'persist'],
                    },
                    MOVE_LEFT: {
                        actions: ['moveOrderLeft', 'persist'],
                    },
                    MOVE_UP: {
                        actions: ['moveOrderUp', 'persist'],
                    },
                    MOVE_DOWN: {
                        actions: ['moveOrderDown', 'persist'],
                    },
                    REMOVE: {
                        actions: ['removeOrder', 'persist'],
                    },
                    UPDATE: {
                        actions: ['updateOrderField', 'persist']
                    }
                }
            },
            editor: {
                on: {
                    ...menuTransitions,
                    ADD: {
                        actions: ['appendTicket', 'persist']
                    },
                    LOAD: {
                        actions: ['loadTicket']
                    },
                    REMOVE: {
                        actions: ['removeTicket', 'persist']
                    },
                    UPDATE: {
                        actions: ['updateTicket', 'persist']
                    }
                }
            }
        }
    },{
        actions: {

            appendTicket: assign({
                columns: (ctx, e) => {
                    const newColumns = evolveColumnItems(
                        0,
                        append(e.ticket),
                        ctx.columns
                    );
                    console.log(e, newColumns);
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
                columns: (ctx, e) => {
                    const newColumns = evolveColumnItems(
                        e.column,
                        update(e.index, e.ticket),
                        ctx.columns
                    );
                    console.log(newColumns);
                    return newColumns;
                }
            }),
            updateOrderField: assign({
                columns: (ctx, e) => evolveColumnItems(
                    e.column,
                    adjust(
                        e.index,
                        assoc(
                            e.field,
                            e.value
                        )
                    ),
                    ctx.columns,
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
                    return evolveColumnItems(
                        e.column-1, append(order),
                        evolveColumnItems(
                            e.column, remove(e.index, 1),
                            ctx.columns
                        )
                    );
                    return pipe(
                        evolveColumnItems(e.column-1, append(order)),
                        evolveColumnItems(e.column, remove(e.index, 1)),
                    )(ctx.columns);
                }
            }),
            moveOrderUp: assign({
                columns: (ctx, e) => evolveColumnItems(
                    e.column,
                    move(e.index, e.index-1),
                    ctx.columns
                )
            }),
            moveOrderDown: assign({
                columns: (ctx, e) => evolveColumnItems(
                    e.column,
                    move(e.index, e.index+1),
                    ctx.columns
                )
            }),
            removeOrder: assign({
                columns: (ctx, e) => evolveColumnItems(
                    e.column,
                    remove(e.index, 1),
                    ctx.columns,
                ),
            }),

            persist: (ctx, e) => {
                window.localStorage.setItem("orderManagerState", JSON.stringify(ctx));
            }
        }
    }
);

const evolveColumnItems = (column, fn) => adjust(
    column, evolve({items: fn}), __
);
const evolveFirstColumnItems = (fn, columns) => evolveColumnItems(0, fn, columns);
