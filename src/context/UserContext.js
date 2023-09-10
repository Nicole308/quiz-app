import React, { useState } from "react";
// import { createContext } from "react";

const UserContext = React.createContext([{}, () => {}])

let initialState = {}

const UserProvider = (props) => {
    const [state, setState] = useState(initialState)

    return React.createElement(UserContext.Provider, {value: [state, setState]}, props.children)
    // return (
    //     <UserContext.Provider value={[state, setState]}>
    //         {props.children}
    //     </UserContext.Provider>
    // )
}

export { UserContext, UserProvider }