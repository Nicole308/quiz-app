import React, { useState } from "react";

const UserContext = React.createContext([{}, () => {}])

let initialState = {}

const UserProvider = (props) => {
    const [state, setState] = useState(initialState)

    return React.createElement(UserContext.Provider, {value: [state, setState]}, props.children)
}

export { UserContext, UserProvider }