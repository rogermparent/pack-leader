import {
    evolve,
    remove,
    update,
    adjust,
    append,
    pipe,
    assoc,
    tap,
    __,
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
                        actions: ['addTicket', 'persist']
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
                        ctx.columns,
                    ),
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
                        ctx.columns,
                    );
                }
            }),
            moveOrderLeft: assign({
                columns: (ctx, e) => {
                    const order = ctx.columns[e.column].items[e.index];
                    return pipe(
                        evolveColumnItems(e.column-1, append(order)),
                        evolveColumnItems(e.column, remove(e.index, 1)),
                        ctx.columns,
                    );
                }
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

const evolveColumnItems = (column, fn, columns) => adjust(
    column, evolve({items: fn})
);
const evolveFirstColumnItems = (fn, columns) => evolveColumnItems(0, fn, columns);
