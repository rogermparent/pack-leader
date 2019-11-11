import React from "react";
import useForm from 'react-hook-form';

import Layout from "../components/layout";
import { useMachine } from '@xstate/react';
import { orderMachine } from '../reducers/order-manager';

const IndexPage = () => {
    const [current, send] = useMachine(orderMachine);
    const {handleSubmit, register} = useForm();

    return(
        <Layout>
          <form
            onSubmit={handleSubmit((data, e)=>{
                console.log(data);
                try{
                    const parsedEvent = JSON.parse(data.event);
                    console.log(parsedEvent);
                    send(parsedEvent);
                }
                catch(err){
                    console.log(err);
                    send(data.event);
                }
            })}
          >
            <textarea
              name="event"
              ref={register}
            />
            <input type="submit" value="send" />
          </form>
          <pre>{JSON.stringify(current, undefined, 2)}</pre>
        </Layout>
    );
};

export default IndexPage;
