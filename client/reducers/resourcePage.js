export default function resourcePages (state = [], action) {

    let newState = [...state]

    switch (action.type) {
        case 'RECEIVE_PAGE':
        console.log('got page', action.page)
            return [...action.page]

        case 'EDIT_PAGE':
            let idx = newState.findIndex(page => page.id == action.id)
            newState[idx] = action.page
            return newState

        default:
            return state
    }
}