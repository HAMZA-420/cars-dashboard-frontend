import types from '../types'

const inital = {
  user: null,
  loading: false,
  errors: null,
  loginErrors: null,
  registerErrors: null,
  passChangeSuccess: false,
}

const authReducer = (state = inital, action) => {
  switch (action.type) {
    default:
      return state
    case types.SET_USER_DATA:
      return {
        ...state,
        user: action.payload,
        loading: false,
        errors: null,
      }
    case types.USER_LOGOUT:
      return inital
    case types.SET_AUTH_LOADING:
      return {
        ...state,
        loading: action.payload,
        errors: null,
      }
    case types.SET_AUTH_ERRORS:
      return {
        ...state,
        errors: action.payload,
        loading: false,

        registerErrors: null,
        loginErrors: null,
      }

    case types.SET_REGISTER_ERRORS:
      return {
        ...state,
        registerErrors: action.payload,
        loading: false,
        loginErrors: null,
        errors: null,
      }
    case types.SET_LOGIN_ERRORS:
      return {
        ...state,
        loginErrors: action.payload,
        loading: false,
        registerErrors: null,
        errors: null,
      }
    case types.SET_PROFILE_EXISTS:
      return {
        ...state,
        user: { ...state.user, profileExists: action.payload },
      }
    case types.SET_PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        passChangeSuccess: action.payload,
        loading: false,
        errors: null,
      }
  }
}

export default authReducer



// const initialState ={
//   user:[]
// }
// export default  function UserReducer(state=initialState,action){
// switch(action.type){
//   case "LOGIN_SUCCESS":
//   return {
//     success : true,
//     user:action.payload
//   }
//   default:
//     return state
  
// }
// }
